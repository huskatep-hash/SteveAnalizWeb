import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const educationPostsTable = pgTable("education_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("education"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertEducationPostSchema = createInsertSchema(educationPostsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEducationPost = z.infer<typeof insertEducationPostSchema>;
export type EducationPost = typeof educationPostsTable.$inferSelect;
