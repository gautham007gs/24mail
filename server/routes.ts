import type { Express } from "express";
import { createServer, type Server } from "http";
import axios, { AxiosError } from "axios";
import { emailSummarySchema, emailSchema, domainSchema, referralStatsSchema } from "@shared/schema";
import { storage } from "@shared/storage.ts";
import { z } from "zod";

const TEMP_MAIL_API = "https://api.barid.site";

// Validation schemas for request parameters
const emailParamSchema = z.string().email();
const emailIdParamSchema = z.string().min(1);

export async function registerRoutes(app: Express): Promise<Server> {
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
      const sessionId = req.sessionID || "anonymous";
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
      const sessionId = req.sessionID || "anonymous";
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
