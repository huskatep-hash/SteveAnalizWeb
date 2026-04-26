import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { userXpTable, xpLogsTable, userBadgesTable, dailyQuestLogsTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import { XP_REWARDS, getLevelFromXP, getXPProgress, BADGES, type XpAction, type BadgeId } from "@workspace/db/constants/gamification";

const router: IRouter = Router();

// XP kazanma fonksiyonu
async function awardXP(userId: number, action: XpAction, metadata: Record<string, any> = {}) {
  const xpAmount = XP_REWARDS[action];

  // XP log kaydet
  await db.insert(xpLogsTable).values({ userId, action, xpAmount, metadata });

  // Toplam XP güncelle
  const existing = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);

  let totalXp = xpAmount;
  if (existing.length > 0) {
    totalXp = existing[0].totalXp + xpAmount;
    const newLevel = getLevelFromXP(totalXp).level;
    await db.update(userXpTable)
      .set({ totalXp, level: newLevel, updatedAt: new Date() })
      .where(eq(userXpTable.userId, userId));
  } else {
    const level = getLevelFromXP(totalXp).level;
    await db.insert(userXpTable).values({ userId, totalXp, level });
  }

  return { xpAmount, totalXp };
}

// Rozet ver
async function awardBadge(userId: number, badgeId: BadgeId) {
  try {
    await db.insert(userBadgesTable).values({ userId, badgeId }).onConflictDoNothing();
    return true;
  } catch { return false; }
}

// GET /api/xp/:userId — Kullanıcı XP durumu
router.get("/xp/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const xpData = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);
    const badges = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));

    if (!xpData.length) {
      return res.json({ totalXp: 0, level: 1, streakDays: 0, progress: getXPProgress(0), badges: [] });
    }

    const progress = getXPProgress(xpData[0].totalXp);
    res.json({ ...xpData[0], progress, badges: badges.map(b => b.badgeId) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/xp/action — XP eylemi
router.post("/xp/action", async (req: Request, res: Response) => {
  try {
    const { userId, action } = req.body as { userId: number; action: XpAction };
    if (!userId || !action || !(action in XP_REWARDS)) {
      return res.status(400).json({ error: "Gecersiz istek." });
    }

    // Günlük login kontrolü
    if (action === "daily_login") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await db.select().from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "daily_login"), gte(xpLogsTable.createdAt, today)))
        .limit(1);
      if (existing.length > 0) {
        return res.json({ message: "Bugün zaten giriş yapildi.", xpAmount: 0 });
      }

      // Streak güncelle
      const xpData = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId)).limit(1);
      if (xpData.length > 0) {
        const lastLogin = xpData[0].lastLoginAt;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        let newStreak = 1;
        if (lastLogin && lastLogin >= yesterday) {
          newStreak = xpData[0].streakDays + 1;
        }

        await db.update(userXpTable)
          .set({ streakDays: newStreak, lastLoginAt: new Date() })
          .where(eq(userXpTable.userId, userId));

        // Streak rozetleri
        if (newStreak >= 7) await awardBadge(userId, "haftalik");
        if (newStreak >= 30) await awardBadge(userId, "aylik");
      }
    }

    const result = await awardXP(userId, action);

    // Okuma rozeti
    if (action === "read_article") {
      const readCount = await db.select({ count: sql<number>`count(*)` })
        .from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "read_article")));
      const count = Number(readCount[0]?.count ?? 0);
      if (count === 1) await awardBadge(userId, "ilk_adim");
      if (count >= 10) await awardBadge(userId, "okur_yazar");
    }

    // Quiz rozeti
    if (action === "complete_quiz") {
      const quizCount = await db.select({ count: sql<number>`count(*)` })
        .from(xpLogsTable)
        .where(and(eq(xpLogsTable.userId, userId), eq(xpLogsTable.action, "complete_quiz")));
      const count = Number(quizCount[0]?.count ?? 0);
      if (count === 1) await awardBadge(userId, "ilk_test");
    }

    const progress = getXPProgress(result.totalXp);
    res.json({ ...result, progress, action, badges: [] });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
