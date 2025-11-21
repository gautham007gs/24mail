// Anonymous referral tracking using localStorage
export interface ReferralData {
  referralCode: string;
  emailAddress: string;
  bonusEmails: number;
  referralsUsed: number;
  lastUpdated: number;
}

const REFERRAL_KEY = "tempmail_referral_data";
const BONUS_PER_REFERRAL = 50;

export const generateReferralCode = (email: string): string => {
  const code = email.split("@")[0].substring(0, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
  return code;
};

export const getReferralData = (email: string): ReferralData => {
  const stored = localStorage.getItem(REFERRAL_KEY);
  
  if (stored) {
    try {
      const data = JSON.parse(stored) as ReferralData;
      if (data.emailAddress === email) {
        return data;
      }
    } catch (e) {
      console.error("Failed to parse referral data", e);
    }
  }
  
  return {
    referralCode: generateReferralCode(email),
    emailAddress: email,
    bonusEmails: 0,
    referralsUsed: 0,
    lastUpdated: Date.now(),
  };
};

export const saveReferralData = (data: ReferralData) => {
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(data));
};

export const addBonusEmails = (email: string, amount: number = BONUS_PER_REFERRAL) => {
  const data = getReferralData(email);
  data.bonusEmails += amount;
  data.referralsUsed += 1;
  data.lastUpdated = Date.now();
  saveReferralData(data);
  return data;
};

export const checkAndApplyReferral = (referralCode: string, currentEmail: string): boolean => {
  // Don't apply referral code to the same email that generated it
  const referralData = getReferralData(currentEmail);
  if (referralData.referralCode === referralCode) {
    return false; // Can't use your own referral code
  }
  
  const used = localStorage.getItem(`tempmail_referral_used_${referralCode}`);
  if (!used) {
    // Mark this referral code as used by this email
    localStorage.setItem(`tempmail_referral_used_${referralCode}`, currentEmail);
    // Award bonus emails
    addBonusEmails(currentEmail);
    return true;
  }
  
  return false; // Already used this referral code
};

export const getReferralShareUrl = (code: string): string => {
  return `${window.location.origin}?ref=${code}`;
};
