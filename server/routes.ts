import type { Express } from "express";
import { createServer, type Server } from "http";
import axios, { AxiosError } from "axios";
import { emailSummarySchema, emailSchema, domainSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
