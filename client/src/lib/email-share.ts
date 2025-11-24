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

// Generate unique shareable link for email
export const generateEmailShareLink = (toAddress: string, emailSubject: string): string => {
  const encodedEmail = encodeURIComponent(toAddress);
  const encodedSubject = encodeURIComponent(emailSubject);
  const baseUrl = window.location.origin;
  return `${baseUrl}/?email=${encodedEmail}&subject=${encodedSubject}`;
};

// Copy email share link to clipboard
export const copyEmailShareLink = async (toAddress: string, emailSubject: string) => {
  const link = generateEmailShareLink(toAddress, emailSubject);
  try {
    await navigator.clipboard.writeText(link);
    return { success: true, message: "Link copied to clipboard!" };
  } catch (err) {
    console.error("Copy link failed:", err);
    return { success: false, message: "Failed to copy link" };
  }
};

// Download email as PDF
export const downloadEmailAsPDF = (email: EmailShareData) => {
  try {
    // Simple PDF generation using data URI
    const date = new Date(email.receivedAt).toLocaleString();
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${email.subject}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .content { white-space: pre-wrap; word-wrap: break-word; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
    .footer { margin-top: 30px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${email.subject}</h1>
  </div>
  <div class="field">
    <span class="label">From:</span> ${email.from}
  </div>
  <div class="field">
    <span class="label">To:</span> ${email.to}
  </div>
  <div class="field">
    <span class="label">Date:</span> ${date}
  </div>
  <div class="content">${email.content}</div>
  <div class="footer">
    <p>Downloaded from TempMail - Free Temporary Email Service</p>
  </div>
</body>
</html>`;

    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `email_${new Date().getTime()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
    
    return { success: true, message: "Email downloaded!" };
  } catch (err) {
    console.error("Download failed:", err);
    return { success: false, message: "Download failed" };
  }
};
