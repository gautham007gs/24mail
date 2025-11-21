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

// Attachment Schema
export const attachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  content_type: z.string(),
  size: z.number(),
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
  attachments: z.array(attachmentSchema).optional().default([]),
});

// Domain Schema
export const domainSchema = z.string();

// Referral Schema
export const referralSchema = z.object({
  id: z.string(),
  referralCode: z.string(),
  createdAt: z.number(),
  referrals: z.number().default(0),
  bonusEmails: z.number().default(0),
});

export const referralStatsSchema = z.object({
  totalReferrals: z.number(),
  bonusEmails: z.number(),
  referralCode: z.string(),
});

export type EmailSummary = z.infer<typeof emailSummarySchema>;
export type Email = z.infer<typeof emailSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
export type Referral = z.infer<typeof referralSchema>;
export type ReferralStats = z.infer<typeof referralStatsSchema>;
