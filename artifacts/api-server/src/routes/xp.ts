import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { userXpTable, xpLogsTable, userBadgesTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";

const router: IRouter = Router();

const XP_REWARDS = {
  daily_login: 10,
  read_article: 20,
  complete_quiz: 50,
  quiz_perfect: 100,
  share_article: 30,
  comment: 15,
  bookmark: 5,
  streak_7: 200,
  streak_30: 1000,
  complete_lesson: 100,
  invite_friend: 100,
} as const;

type XpAction = keyof typeof XP_REWARDS;

const LEVELS = [
  { level: 1, name: "Yeni Baslayan", minXP: 0, icon: "🌱" },
  { level: 2, name: "Merakli", minXP: 500, icon: "🌿" },
  { level: 3, name: "Ogrenci", minXP: 1500, icon: "📚" },
  { level: 4, name: "Arastirmaci", minXP: 3000, icon: "🔍" },
  { level: 5, name: "Analist", minXP: 6000, icon: "📊" },
  { level: 6, name: "Uzman", minXP: 12000, icon: "🎯" },
  { level: 7, name: "Yatirim Ustasi", minXP: 25000, icon: "👑" },
  { level: 8, name: "Piyasa Lideri", minXP: 50000, icon: "🏆" },
  { level: 9, name: "Finans Dehasi", minXP: 100000, icon: "💎" },
  { level: 10, name: "Steve Efsanesi", minXP: 200000, icon: "🚀" },
];

function getLevelFromXP(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) ?? LEVELS[0];
}

function getXPProgress(xp: number) {
  const current = getLevelFromXP(xp);
  const next = LEVELS.find(l => l.level === current.level + 1) ?? null;
  if (!next) return { current, next: null, progress: 100, xpNeeded: 0 };
  return {
    current, next,
    progress: Math.floor(((xp - current.minXP) / (next.minXP - current.minXP)) * 100),
    xpNeeded: next.minXP - xp
  };
}

async function awardXP(userId: number, action: XpAction) {
  const xpAmount = XP_REWARDS[action];
  await db.insert(xpLogsTable).values({ userId, action, xpAmount, metadata: {} });
  const existing = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);
  let totalXp = xpAmount;
  if (existing.length > 0) {
    totalXp = existing[0].totalXp + xpAmount;
    await db.update(userXpTable)
      .set({ totalXp, level: getLevelFromXP(totalXp).level, updatedAt: new Date() })
      .where(eq(userXpTable.userId, userId));
  } else {
    await db.insert(userXpTable).values({ userId, totalXp, level: getLevelFromXP(totalXp).level });
  }
  return { xpAmount, totalXp };
}

async function awardBadge(userId: number, badgeId: string) {
  try {
    await db.insert(userBadgesTable).values({ userId, badgeId }).onConflictDoNothing();
  } catch {}
}

router.get("/xp/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const xpData = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);
    const badges = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
    if (!xpData.length) {
      return res.json({ totalXp: 0, level: 1, streakDays: 0, progress: getXPProgress(0), badges: [] });
    }
    res.json({ ...xpData[0], progress: getXPProgress(xpData[0].totalXp), badges: badges.map(b => b.badgeId) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/xp/action", async (req: Request, res: Response) => {
  try {
    const { userId, action } = req.body as { userId: number; action: XpAction };
    if (!userId || !action || !(action in XP_REWARDS)) {
      return res.status(400).json({ error: "Gecersiz istek." });
    }

    if (action === "daily_login") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await db.select().from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "daily_login"), gte(xpLogsTable.createdAt, today)))
        .limit(1);
      if (existing.length > 0) return res.json({ message: "Bugun zaten giris yapildi.", xpAmount: 0 });

      const xpData = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);
      if (xpData.length > 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const newStreak = xpData[0].lastLoginAt && xpData[0].lastLoginAt >= yesterday
          ? xpData[0].streakDays + 1 : 1;
        await db.update(userXpTable)
          .set({ streakDays: newStreak, lastLoginAt: new Date() })
          .where(eq(userXpTable.userId, userId));
        if (newStreak >= 7) await awardBadge(userId, "haftalik");
        if (newStreak >= 30) await awardBadge(userId, "aylik");
      }
    }

    const result = await awardXP(userId, action);

    if (action === "read_article") {
      const cnt = await db.select({ count: sql`count(*)` }).from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "read_article")));
      const count = Number(cnt[0]?.count ?? 0);
      if (count === 1) await awardBadge(userId, "ilk_adim");
      if (count >= 10) await awardBadge(userId, "okur_yazar");
    }

    if (action === "complete_quiz") {
      const cnt = await db.select({ count: sql`count(*)` }).from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "complete_quiz")));
      if (Number(cnt[0]?.count ?? 0) === 1) await awardBadge(userId, "ilk_test");
    }

    res.json({ ...result, progress: getXPProgress(result.totalXp), action });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
