import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const writersTable = pgTable("writers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWriterSchema = createInsertSchema(writersTable).omit({ id: true, createdAt: true, status: true });
export type InsertWriter = z.infer<typeof insertWriterSchema>;
export type Writer = typeof writersTable.$inferSelect;
