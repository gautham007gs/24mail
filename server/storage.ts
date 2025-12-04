import { type Referral } from "@shared/schema";
import { randomUUID } from "crypto";

// User types (stub - not currently used)
type User = any;
type InsertUser = any;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getReferral(sessionId: string): Promise<Referral | undefined>;
  createReferral(sessionId: string): Promise<Referral>;
  getReferralByCode(code: string): Promise<Referral | undefined>;
  updateReferral(sessionId: string, referrals: number, bonusEmails: number): Promise<Referral>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private referrals: Map<string, Referral>;

  constructor() {
    this.users = new Map();
    this.referrals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getReferral(sessionId: string): Promise<Referral | undefined> {
    return this.referrals.get(sessionId);
  }

  async createReferral(sessionId: string): Promise<Referral> {
    const referralCode = this.generateReferralCode();
    const referral: Referral = {
      id: sessionId,
      referralCode,
      createdAt: Date.now(),
      referrals: 0,
      bonusEmails: 0,
    };
    this.referrals.set(sessionId, referral);
    return referral;
  }

  async getReferralByCode(code: string): Promise<Referral | undefined> {
    return Array.from(this.referrals.values()).find(
      (ref) => ref.referralCode === code,
    );
  }

  async updateReferral(sessionId: string, referrals: number, bonusEmails: number): Promise<Referral> {
    let referral = this.referrals.get(sessionId);
    if (!referral) {
      referral = await this.createReferral(sessionId);
    }
    referral.referrals = referrals;
    referral.bonusEmails = bonusEmails;
    this.referrals.set(sessionId, referral);
    return referral;
  }

  private generateReferralCode(): string {
    return "REF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

export const storage = new MemStorage();
