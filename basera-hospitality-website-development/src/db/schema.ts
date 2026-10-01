import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Every enquiry and email-order is stored here as a safety net, so nothing is
 * lost even if SMTP is not configured yet or a mail provider has a bad day.
 */
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  /** contact | hotel | banquet | order */
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  payload: jsonb("payload").notNull(),
  /** pending | sent | not_configured | failed */
  emailStatus: text("email_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
