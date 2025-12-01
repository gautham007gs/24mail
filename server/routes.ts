import type { Express } from "express";
import { createServer, type Server } from "http";
import axios, { AxiosError } from "axios";
import { emailSummarySchema, emailSchema, domainSchema, referralStatsSchema } from "@shared/schema";
import { storage } from "./storage";
import { z } from "zod";

const TEMP_MAIL_API = "https://api.barid.site";

// Validation schemas for request parameters
const emailParamSchema = z.string().email();
const emailIdParamSchema = z.string().min(1);

export async function registerRoutes(app: Express): Promise<Server> {
  // Funny messages for attackers
  const funnyMessages = [
    "Bete tera se na hopayega! 🛡️ This server is protected by TEMPMAIL SHIELD",
    "teri himmat! Rate limited harder than your WiFi password 😄",
    "Hacker detected! But only amateurs try this. You're banned from cool club 🚫",
    "SQL injection? More like SQL rejection! 😂",
    "Brute force attack? Brute force REJECTED! Go touch grass 🌱",
    "DDoS? More like DoNotAttack-oS! 🤖",
    "Your IP: flagged, logged, and laughed at 😅",
    "Keep trying... we're watching! 👀 (jk, we're not, but IP is blocked)",
    "UNAUTHORIZED ACCESS DETECTED - Sending thoughts and prayers to your keyboard 💀",
  ];

  const getRandomFunnyMessage = () => funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  // Attack detection tracking
  const suspiciousActivity = new Map<string, { strikes: number; blockedUntil: number }>();
  
  // Rate limiting middleware for API calls with progressive penalties
  const apiLimits = new Map<string, { count: number; resetTime: number }>();
  app.use("/api/", (req, res, next) => {
    const ip = req.ip || "unknown";
    const now = Date.now();
    
    // Check if IP is temporarily blocked
    const blocked = suspiciousActivity.get(ip);
    if (blocked && now < blocked.blockedUntil) {
      return res.status(429).json({ 
        error: getRandomFunnyMessage(),
        blockedUntil: Math.ceil((blocked.blockedUntil - now) / 1000) + "s"
      });
    }
    
    // Attack detection: suspicious patterns
    const suspiciousPatterns = [
      /union.*select/i,
      /drop.*table/i,
      /insert.*into/i,
      /delete.*from/i,
      /\/\/|--|\*\//,
      /<script|javascript:/i,
      /eval\(|exec\(/i,
    ];
    
    const queryString = JSON.stringify([req.query, req.body, req.params]);
    const isAttack = suspiciousPatterns.some(pattern => pattern.test(queryString));
    
    if (isAttack) {
      let activity = suspiciousActivity.get(ip) || { strikes: 0, blockedUntil: 0 };
      activity.strikes++;
      
      // Progressive blocking: 1 min, then 5 min, then 30 min
      const blockDurations = [60000, 300000, 1800000];
      const blockDuration = blockDurations[Math.min(activity.strikes - 1, blockDurations.length - 1)];
      activity.blockedUntil = now + blockDuration;
      
      suspiciousActivity.set(ip, activity);
      
      console.warn(`[SECURITY] Attack detected from ${ip} (strike ${activity.strikes}): ${queryString.substring(0, 100)}`);
      return res.status(403).json({ error: getRandomFunnyMessage() });
    }
    
    // Regular rate limiting: 100 requests per minute
    const limit = apiLimits.get(ip) || { count: 0, resetTime: now + 60000 };
    
    if (now > limit.resetTime) {
      apiLimits.set(ip, { count: 1, resetTime: now + 60000 });
      next();
    } else if (limit.count < 100) {
      limit.count++;
      apiLimits.set(ip, limit);
      next();
    } else {
      return res.status(429).json({ error: getRandomFunnyMessage() });
    }
  });

  // Get available domains
  app.get("/api/domains", async (req, res) => {
    try {
      const response = await axios.get(`${TEMP_MAIL_API}/domains`);
      
      if (response.data.success && Array.isArray(response.data.result)) {
        const domains = z.array(domainSchema).parse(response.data.result);
        res.json(domains);
      } else {
        res.status(500).json({ error: "Failed to fetch domains" });
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ error: "Failed to fetch domains" });
      } else {
        res.status(500).json({ error: "Failed to fetch domains" });
      }
    }
  });

  // Get inbox for an email address
  app.get("/api/inbox/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      
      // Validate email format
      const validationResult = emailParamSchema.safeParse(email);
      if (!validationResult.success) {
        res.status(400).json({ error: "Invalid email address format" });
        return;
      }

      const response = await axios.get(`${TEMP_MAIL_API}/emails/${email}`);
      
      if (response.data.success && Array.isArray(response.data.result)) {
        const emails = z.array(emailSummarySchema).parse(response.data.result);
        res.json(emails);
      } else {
        // If the API returns success but not an array, return empty array
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching inbox:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Propagate all upstream status codes including 404
        if (error.response.status === 404) {
          res.status(404).json({ error: "Inbox not found" });
        } else if (error.response.status >= 400 && error.response.status < 500) {
          // Client errors
          res.status(error.response.status).json({ error: "Failed to fetch inbox" });
        } else {
          // Server errors
          res.status(502).json({ error: "Upstream service error" });
        }
      } else {
        // Network or other errors
        res.status(500).json({ error: "Failed to fetch inbox" });
      }
    }
  });

  // Get specific email details
  app.get("/api/email/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate email ID
      const validationResult = emailIdParamSchema.safeParse(id);
      if (!validationResult.success) {
        res.status(400).json({ error: "Invalid email ID" });
        return;
      }

      const response = await axios.get(`${TEMP_MAIL_API}/inbox/${id}`);
      
      if (response.data.success && response.data.result) {
        const email = emailSchema.parse(response.data.result);
        res.json(email);
      } else {
        res.status(404).json({ error: "Email not found" });
      }
    } catch (error) {
      console.error("Error fetching email:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          res.status(404).json({ error: "Email not found" });
        } else {
          res.status(error.response.status).json({ error: "Failed to fetch email" });
        }
      } else {
        res.status(500).json({ error: "Failed to fetch email" });
      }
    }
  });

  // Delete a specific email
  app.delete("/api/email/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate email ID
      const validationResult = emailIdParamSchema.safeParse(id);
      if (!validationResult.success) {
        res.status(400).json({ error: "Invalid email ID" });
        return;
      }

      const response = await axios.delete(`${TEMP_MAIL_API}/inbox/${id}`);
      
      if (response.data.success) {
        res.json({ success: true, message: "Email deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete email" });
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          res.status(404).json({ error: "Email not found" });
        } else {
          res.status(error.response.status).json({ error: "Failed to delete email" });
        }
      } else {
        res.status(500).json({ error: "Failed to delete email" });
      }
    }
  });

  // Delete all emails for an address
  app.delete("/api/inbox/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      
      // Validate email format
      const validationResult = emailParamSchema.safeParse(email);
      if (!validationResult.success) {
        res.status(400).json({ error: "Invalid email address format" });
        return;
      }

      const response = await axios.delete(`${TEMP_MAIL_API}/emails/${email}`);
      
      if (response.data.success) {
        res.json({ 
          success: true, 
          message: "All emails deleted successfully",
          deleted_count: response.data.result?.deleted_count || 0
        });
      } else {
        res.status(500).json({ error: "Failed to delete emails" });
      }
    } catch (error) {
      console.error("Error deleting all emails:", error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ error: "Failed to delete emails" });
      } else {
        res.status(500).json({ error: "Failed to delete emails" });
      }
    }
  });

  // Download attachment
  app.get("/api/attachment/:emailId/:attachmentId", async (req, res) => {
    try {
      const { emailId, attachmentId } = req.params;
      
      // Validate email ID and attachment ID
      const emailValidation = emailIdParamSchema.safeParse(emailId);
      const attachmentValidation = emailIdParamSchema.safeParse(attachmentId);
      
      if (!emailValidation.success || !attachmentValidation.success) {
        res.status(400).json({ error: "Invalid email or attachment ID" });
        return;
      }

      const response = await axios.get(
        `${TEMP_MAIL_API}/inbox/${emailId}/attachment/${attachmentId}`,
        { responseType: "stream" }
      );

      res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");
      res.setHeader("Content-Disposition", response.headers["content-disposition"] || `attachment; filename="attachment"`);
      response.data.pipe(res);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          res.status(404).json({ error: "Attachment not found" });
        } else {
          res.status(error.response.status).json({ error: "Failed to download attachment" });
        }
      } else {
        res.status(500).json({ error: "Failed to download attachment" });
      }
    }
  });

  // Referral endpoints
  app.get("/api/referral/create", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      let referral = await storage.getReferral(sessionId);
      if (!referral) {
        referral = await storage.createReferral(sessionId);
      }
      res.json({
        referralCode: referral.referralCode,
        referrals: referral.referrals,
        bonusEmails: referral.bonusEmails,
      });
    } catch (error) {
      console.error("Error creating referral:", error);
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  app.get("/api/referral/stats", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      let referral = await storage.getReferral(sessionId);
      if (!referral) {
        referral = await storage.createReferral(sessionId);
      }
      res.json({
        totalReferrals: referral.referrals,
        bonusEmails: referral.bonusEmails,
        referralCode: referral.referralCode,
      });
    } catch (error) {
      console.error("Error getting referral stats:", error);
      res.status(500).json({ error: "Failed to get referral stats" });
    }
  });

  app.post("/api/referral/claim/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const referrer = await storage.getReferralByCode(code);
      if (!referrer) {
        res.status(404).json({ error: "Referral code not found" });
        return;
      }
      
      const newReferrals = referrer.referrals + 1;
      const newBonusEmails = referrer.bonusEmails + 50;
      await storage.updateReferral(referrer.id, newReferrals, newBonusEmails);
      
      res.json({ success: true, bonusEmails: 50 });
    } catch (error) {
      console.error("Error claiming referral:", error);
      res.status(500).json({ error: "Failed to claim referral" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
