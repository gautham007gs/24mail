import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { z } from 'zod';

const TEMP_MAIL_API = "https://api.barid.site";

const emailSummarySchema = z.object({
  id: z.string(),
  from_address: z.string(),
  to_address: z.string(),
  subject: z.string().nullable(),
  received_at: z.number(),
  has_attachments: z.boolean().default(false),
  attachment_count: z.number().default(0),
});

const attachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  content_type: z.string(),
  size: z.number(),
});

const emailSchema = z.object({
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

const domainSchema = z.string();

const emailParamSchema = z.string().email();
const emailIdParamSchema = z.string().min(1);

const responseCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
const suspiciousActivity = new Map<string, { strikes: number; blockedUntil: number }>();
const apiLimits = new Map<string, { count: number; resetTime: number }>();

interface Referral {
  id: string;
  referralCode: string;
  createdAt: number;
  referrals: number;
  bonusEmails: number;
}

const referrals = new Map<string, Referral>();

function generateReferralCode(): string {
  return "REF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T;
  }
  responseCache.delete(key);
  return null;
}

function setCachedResponse<T>(key: string, data: T, ttlMs: number): void {
  responseCache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

const funnyMessages = [
  "Bete tera se na hopayega! This server is protected by TEMPMAIL SHIELD",
  "teri himmat! Rate limited harder than your WiFi password",
  "Hacker detected! But only amateurs try this. You're banned from cool club",
  "SQL injection? More like SQL rejection!",
  "Brute force attack? Brute force REJECTED! Go touch grass",
  "DDoS? More like DoNotAttack-oS!",
  "Your IP: flagged, logged, and laughed at",
  "Keep trying... we're watching! (jk, we're not, but IP is blocked)",
  "UNAUTHORIZED ACCESS DETECTED - Sending thoughts and prayers to your keyboard",
];

function getRandomFunnyMessage(): string {
  return funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
}

function checkRateLimit(ip: string): { blocked: boolean; message?: string } {
  const now = Date.now();

  const blocked = suspiciousActivity.get(ip);
  if (blocked && now < blocked.blockedUntil) {
    return {
      blocked: true,
      message: JSON.stringify({
        error: getRandomFunnyMessage(),
        blockedUntil: Math.ceil((blocked.blockedUntil - now) / 1000) + "s"
      })
    };
  }

  const limit = apiLimits.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > limit.resetTime) {
    apiLimits.set(ip, { count: 1, resetTime: now + 60000 });
    return { blocked: false };
  } else if (limit.count < 100) {
    limit.count++;
    apiLimits.set(ip, limit);
    return { blocked: false };
  } else {
    return { blocked: true, message: JSON.stringify({ error: getRandomFunnyMessage() }) };
  }
}

function checkForAttack(queryString: string, ip: string): boolean {
  const suspiciousPatterns = [
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /delete.*from/i,
    /\/\/|--|\*\//,
    /<script|javascript:/i,
    /eval\(|exec\(/i,
  ];

  const isAttack = suspiciousPatterns.some(pattern => pattern.test(queryString));

  if (isAttack) {
    const now = Date.now();
    let activity = suspiciousActivity.get(ip) || { strikes: 0, blockedUntil: 0 };
    activity.strikes++;

    const blockDurations = [60000, 300000, 1800000];
    const blockDuration = blockDurations[Math.min(activity.strikes - 1, blockDurations.length - 1)];
    activity.blockedUntil = now + blockDuration;

    suspiciousActivity.set(ip, activity);
    return true;
  }

  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  const url = req.url || '';
  const method = req.method || 'GET';

  const queryString = JSON.stringify([req.query, req.body]);
  if (checkForAttack(queryString, ip)) {
    return res.status(403).json({ error: getRandomFunnyMessage() });
  }

  const rateCheck = checkRateLimit(ip);
  if (rateCheck.blocked) {
    return res.status(429).send(rateCheck.message);
  }

  try {
    if (url.startsWith('/api/domains') && method === 'GET') {
      return handleDomains(req, res);
    }

    if (url.match(/^\/api\/inbox\/[^\/]+$/) && method === 'GET') {
      const email = url.split('/api/inbox/')[1];
      return handleInbox(req, res, decodeURIComponent(email));
    }

    if (url.match(/^\/api\/inbox\/[^\/]+$/) && method === 'DELETE') {
      const email = url.split('/api/inbox/')[1];
      return handleDeleteAllEmails(req, res, decodeURIComponent(email));
    }

    if (url.match(/^\/api\/email\/[^\/]+$/) && method === 'GET') {
      const id = url.split('/api/email/')[1];
      return handleEmail(req, res, id);
    }

    if (url.match(/^\/api\/email\/[^\/]+$/) && method === 'DELETE') {
      const id = url.split('/api/email/')[1];
      return handleDeleteEmail(req, res, id);
    }

    if (url.match(/^\/api\/attachment\/[^\/]+\/[^\/]+$/)) {
      const parts = url.split('/api/attachment/')[1].split('/');
      return handleAttachment(req, res, parts[0], parts[1]);
    }

    if (url.startsWith('/api/referral/create') && method === 'GET') {
      return handleReferralCreate(req, res);
    }

    if (url.startsWith('/api/referral/stats') && method === 'GET') {
      return handleReferralStats(req, res);
    }

    if (url.match(/^\/api\/referral\/claim\/[^\/]+$/) && method === 'POST') {
      const code = url.split('/api/referral/claim/')[1];
      return handleReferralClaim(req, res, code);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDomains(req: VercelRequest, res: VercelResponse) {
  try {
    const cacheKey = "domains";
    const cached = getCachedResponse<string[]>(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const response = await axios.get(`${TEMP_MAIL_API}/domains`);

    if (response.data.success && Array.isArray(response.data.result)) {
      const domains = z.array(domainSchema).parse(response.data.result);
      setCachedResponse(cacheKey, domains, 60 * 60 * 1000);
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('X-Cache', 'MISS');
      return res.json(domains);
    } else {
      return res.status(500).json({ error: "Failed to fetch domains" });
    }
  } catch (error) {
    console.error("Error fetching domains:", error);
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ error: "Failed to fetch domains" });
    }
    return res.status(500).json({ error: "Failed to fetch domains" });
  }
}

async function handleInbox(req: VercelRequest, res: VercelResponse, email: string) {
  try {
    const validationResult = emailParamSchema.safeParse(email);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    const response = await axios.get(`${TEMP_MAIL_API}/emails/${email}`);

    if (response.data.success && Array.isArray(response.data.result)) {
      const emails = z.array(emailSummarySchema).parse(response.data.result);
      return res.json(emails);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error("Error fetching inbox:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: "Inbox not found" });
      } else if (error.response.status >= 400 && error.response.status < 500) {
        return res.status(error.response.status).json({ error: "Failed to fetch inbox" });
      } else {
        return res.status(502).json({ error: "Upstream service error" });
      }
    }
    return res.status(500).json({ error: "Failed to fetch inbox" });
  }
}

async function handleEmail(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const validationResult = emailIdParamSchema.safeParse(id);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid email ID" });
    }

    const response = await axios.get(`${TEMP_MAIL_API}/inbox/${id}`);

    if (response.data.success && response.data.result) {
      const email = emailSchema.parse(response.data.result);
      return res.json(email);
    } else {
      return res.status(404).json({ error: "Email not found" });
    }
  } catch (error) {
    console.error("Error fetching email:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: "Email not found" });
      }
      return res.status(error.response.status).json({ error: "Failed to fetch email" });
    }
    return res.status(500).json({ error: "Failed to fetch email" });
  }
}

async function handleDeleteEmail(req: VercelRequest, res: VercelResponse, id: string) {
  try {
    const validationResult = emailIdParamSchema.safeParse(id);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid email ID" });
    }

    const response = await axios.delete(`${TEMP_MAIL_API}/inbox/${id}`);

    if (response.data.success) {
      return res.json({ success: true, message: "Email deleted successfully" });
    } else {
      return res.status(500).json({ error: "Failed to delete email" });
    }
  } catch (error) {
    console.error("Error deleting email:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: "Email not found" });
      }
      return res.status(error.response.status).json({ error: "Failed to delete email" });
    }
    return res.status(500).json({ error: "Failed to delete email" });
  }
}

async function handleDeleteAllEmails(req: VercelRequest, res: VercelResponse, email: string) {
  try {
    const validationResult = emailParamSchema.safeParse(email);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    const response = await axios.delete(`${TEMP_MAIL_API}/emails/${email}`);

    if (response.data.success) {
      return res.json({
        success: true,
        message: "All emails deleted successfully",
        deleted_count: response.data.result?.deleted_count || 0
      });
    } else {
      return res.status(500).json({ error: "Failed to delete emails" });
    }
  } catch (error) {
    console.error("Error deleting all emails:", error);
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ error: "Failed to delete emails" });
    }
    return res.status(500).json({ error: "Failed to delete emails" });
  }
}

async function handleAttachment(req: VercelRequest, res: VercelResponse, emailId: string, attachmentId: string) {
  try {
    const emailValidation = emailIdParamSchema.safeParse(emailId);
    const attachmentValidation = emailIdParamSchema.safeParse(attachmentId);

    if (!emailValidation.success || !attachmentValidation.success) {
      return res.status(400).json({ error: "Invalid email or attachment ID" });
    }

    const response = await axios.get(
      `${TEMP_MAIL_API}/inbox/${emailId}/attachment/${attachmentId}`,
      { responseType: 'arraybuffer' }
    );

    res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
    res.setHeader("Content-Disposition", response.headers["content-disposition"] || `attachment; filename="attachment"`);
    return res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Error downloading attachment:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: "Attachment not found" });
      }
      return res.status(error.response.status).json({ error: "Failed to download attachment" });
    }
    return res.status(500).json({ error: "Failed to download attachment" });
  }
}

async function handleReferralCreate(req: VercelRequest, res: VercelResponse) {
  try {
    const sessionId = (req.query.sid as string) || "anonymous";
    let referral = referrals.get(sessionId);
    if (!referral) {
      referral = {
        id: sessionId,
        referralCode: generateReferralCode(),
        createdAt: Date.now(),
        referrals: 0,
        bonusEmails: 0,
      };
      referrals.set(sessionId, referral);
    }
    return res.json({
      referralCode: referral.referralCode,
      referrals: referral.referrals,
      bonusEmails: referral.bonusEmails,
    });
  } catch (error) {
    console.error("Error creating referral:", error);
    return res.status(500).json({ error: "Failed to create referral" });
  }
}

async function handleReferralStats(req: VercelRequest, res: VercelResponse) {
  try {
    const sessionId = (req.query.sid as string) || "anonymous";
    let referral = referrals.get(sessionId);
    if (!referral) {
      referral = {
        id: sessionId,
        referralCode: generateReferralCode(),
        createdAt: Date.now(),
        referrals: 0,
        bonusEmails: 0,
      };
      referrals.set(sessionId, referral);
    }
    return res.json({
      totalReferrals: referral.referrals,
      bonusEmails: referral.bonusEmails,
      referralCode: referral.referralCode,
    });
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return res.status(500).json({ error: "Failed to get referral stats" });
  }
}

async function handleReferralClaim(req: VercelRequest, res: VercelResponse, code: string) {
  try {
    let referrer: Referral | undefined;
    for (const ref of referrals.values()) {
      if (ref.referralCode === code) {
        referrer = ref;
        break;
      }
    }

    if (!referrer) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    referrer.referrals += 1;
    referrer.bonusEmails += 50;
    referrals.set(referrer.id, referrer);

    return res.json({ success: true, bonusEmails: 50 });
  } catch (error) {
    console.error("Error claiming referral:", error);
    return res.status(500).json({ error: "Failed to claim referral" });
  }
}
