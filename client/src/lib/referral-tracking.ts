// Anonymous referral tracking using localStorage
export interface ReferralData {
  referralCode: string;
  emailAddress: string;
  bonusEmails: number;
  referralsUsed: number;
  lastUpdated: number;
}

const REFERRAL_KEY_PREFIX = "tempmail_referral_";
const REFERRAL_CODE_OWNER_PREFIX = "tempmail_code_owner_";
const BONUS_PER_REFERRAL = 50;

export const generateReferralCode = (email: string): string => {
  const code = email.split("@")[0].substring(0, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
  return code;
};

export const getReferralData = (email: string): ReferralData => {
  const key = REFERRAL_KEY_PREFIX + email;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const data = JSON.parse(stored) as ReferralData;
      return data;
    } catch (e) {
      console.error("Failed to parse referral data", e);
    }
  }
  
  const code = generateReferralCode(email);
  const newData: ReferralData = {
    referralCode: code,
    emailAddress: email,
    bonusEmails: 0,
    referralsUsed: 0,
    lastUpdated: Date.now(),
  };
  
  // Store the mapping: code -> email (for the referrer)
  localStorage.setItem(REFERRAL_CODE_OWNER_PREFIX + code, email);
  
  return newData;
};

export const saveReferralData = (data: ReferralData) => {
  const key = REFERRAL_KEY_PREFIX + data.emailAddress;
  localStorage.setItem(key, JSON.stringify(data));
  // Always keep code -> email mapping
  localStorage.setItem(REFERRAL_CODE_OWNER_PREFIX + data.referralCode, data.emailAddress);
};

export const addBonusEmails = (email: string, amount: number = BONUS_PER_REFERRAL) => {
  const data = getReferralData(email);
  data.bonusEmails += amount;
  data.referralsUsed += 1;
  data.lastUpdated = Date.now();
  saveReferralData(data);
  return data;
};

export const addReferralToCode = (referralCode: string) => {
  // Find who owns this code and give them a referral
  const ownerEmail = localStorage.getItem(REFERRAL_CODE_OWNER_PREFIX + referralCode);
  if (ownerEmail) {
    const ownerData = getReferralData(ownerEmail);
    ownerData.bonusEmails += BONUS_PER_REFERRAL;
    ownerData.referralsUsed += 1;
    ownerData.lastUpdated = Date.now();
    saveReferralData(ownerData);
    return true;
  }
  return false;
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
    
    // Award bonus emails to the CLICKER
    addBonusEmails(currentEmail);
    
    // Award bonus emails to the REFERRER
    addReferralToCode(referralCode);
    
    return true;
  }
  
  return false; // Already used this referral code
};

export const getReferralShareUrl = (code: string): string => {
  return `${window.location.origin}?ref=${code}`;
};
