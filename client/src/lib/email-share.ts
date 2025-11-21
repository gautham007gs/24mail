// Email sharing utilities for multiple platforms
export interface EmailShareData {
  from: string;
  to: string;
  subject: string;
  content: string;
  receivedAt: number;
}

export const shareEmail = async (email: EmailShareData) => {
  const shareText = formatEmailForSharing(email);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Email from TempMail",
        text: shareText,
        url: window.location.href,
      });
      return { success: true, message: "Shared successfully!" };
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  }
};

export const shareToWhatsApp = (email: EmailShareData) => {
  const text = encodeURIComponent(formatEmailForSharing(email));
  window.open(`https://wa.me/?text=${text}`, "_blank");
};

export const shareToTwitter = (email: EmailShareData) => {
  const text = encodeURIComponent(`📧 Received email on TempMail:\n\n${email.subject}\n\nFrom: ${email.from}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
};

export const shareToFacebook = (email: EmailShareData) => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
};

export const shareToTelegram = (email: EmailShareData) => {
  const text = encodeURIComponent(formatEmailForSharing(email));
  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, "_blank");
};

export const shareToEmail = (email: EmailShareData) => {
  const subject = encodeURIComponent(`FW: ${email.subject}`);
  const body = encodeURIComponent(formatEmailForSharing(email));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

export const copyToClipboard = async (email: EmailShareData) => {
  const text = formatEmailForSharing(email);
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: "Copied to clipboard!" };
  } catch (err) {
    console.error("Copy failed:", err);
    return { success: false, message: "Copy failed" };
  }
};

export const shareToSMS = (email: EmailShareData) => {
  const text = encodeURIComponent(`Email: ${email.subject}\nFrom: ${email.from}`);
  window.location.href = `sms:?body=${text}`;
};

const formatEmailForSharing = (email: EmailShareData): string => {
  const date = new Date(email.receivedAt).toLocaleString();
  return `From: ${email.from}
To: ${email.to}
Subject: ${email.subject}
Date: ${date}

---
${email.content}
---
Shared via TempMail - Temporary Email Service`;
};
