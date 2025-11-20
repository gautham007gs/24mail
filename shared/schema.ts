import { z } from "zod";

// Email Summary Schema (for inbox list)
export const emailSummarySchema = z.object({
  id: z.string(),
  from_address: z.string(),
  to_address: z.string(),
  subject: z.string().nullable(),
  received_at: z.number(),
  has_attachments: z.boolean().default(false),
  attachment_count: z.number().default(0),
});

// Full Email Schema (for detail view)
export const emailSchema = z.object({
  id: z.string(),
  from_address: z.string(),
  to_address: z.string(),
  subject: z.string().nullable(),
  received_at: z.number(),
  html_content: z.string().nullable(),
  text_content: z.string().nullable(),
  has_attachments: z.boolean().default(false),
  attachment_count: z.number().default(0),
});

// Domain Schema
export const domainSchema = z.string();

export type EmailSummary = z.infer<typeof emailSummarySchema>;
export type Email = z.infer<typeof emailSchema>;
export type Domain = z.infer<typeof domainSchema>;
