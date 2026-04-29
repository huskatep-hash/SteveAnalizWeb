import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── HAP HABER ─────────────────────────────────────────────
export const newsPostsTable = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  author: text("author").notNull().default("SteveAnalizAI"),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("Makro"),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("draft"),
  readTime: text("read_time").notNull().default("3 dk"),
  // Hap formatı
  hapHeadline: text("hap_headline"),
  hapContext: text("hap_context"),
  hapImpact: text("hap_impact"),
  hapQuote: text("hap_quote"),
  // Etkileşim
  likes: integer("likes").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── KULLANICI ─────────────────────────────────────────────
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  tier: text("tier").notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── XP & SEVİYE ───────────────────────────────────────────
export const userXpTable = pgTable("user_xp", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streakDays: integer("streak_days").notNull().default(0),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── XP KAYITLARI ──────────────────────────────────────────
export const xpLogsTable = pgTable("xp_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  xpAmount: integer("xp_amount").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── ROZETLER ──────────────────────────────────────────────
export const userBadgesTable = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: text("badge_id").notNull(),
  earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── GÜNLÜK GÖREVLER ───────────────────────────────────────
export const dailyQuestLogsTable = pgTable("daily_quest_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questType: text("quest_type").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  xpEarned: integer("xp_earned").notNull().default(0),
});

// ── ZOD ŞEMALAR ───────────────────────────────────────────
export const insertNewsPostSchema = createInsertSchema(newsPostsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;
export type NewsPost = typeof newsPostsTable.$inferSelect;
export type UserXp = typeof userXpTable.$inferSelect;
