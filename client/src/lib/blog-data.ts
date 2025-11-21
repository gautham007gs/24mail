export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  content: React.ReactNode;
  image: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  keywords: string[];
  featured: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-temporary-email-complete-guide",
    title: "What Is Temporary Email? A Complete Guide to Disposable Email Addresses",
    description: "Learn what temporary email addresses are, how they work, and why they're essential for protecting your online privacy in 2024.",
    metaDescription: "Discover what temporary email addresses are. Complete guide explaining disposable email benefits, security advantages, and best use cases for online privacy.",
    content: null,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop",
    author: "Privacy Expert",
    date: "2024-01-15",
    readTime: 6,
    category: "Privacy",
    keywords: ["temporary email", "disposable email", "what is temp mail", "email privacy", "anonymous email"],
    featured: true,
  },
  {
    id: "2",
    slug: "protect-privacy-spam-disposable-email",
    title: "How to Protect Your Privacy and Stop Spam Using Disposable Email Addresses",
    description: "Comprehensive guide on using temporary email addresses to prevent spam, protect personal information, and maintain online privacy effectively.",
    metaDescription: "Protect your privacy with disposable email addresses. Learn how to stop spam, prevent data breaches, and keep your inbox clean with temporary email.",
    content: null,
    image: "https://images.unsplash.com/photo-1526374965328-7f5ae516e5a2?w=800&h=400&fit=crop",
    author: "Privacy Expert",
    date: "2024-01-10",
    readTime: 8,
    category: "Security",
    keywords: ["stop spam", "prevent spam emails", "privacy protection", "email security", "online privacy"],
    featured: true,
  },
  {
    id: "3",
    slug: "temporary-email-safe-online-shopping",
    title: "Is Temporary Email Safe for Online Shopping? Security Guide & Best Practices",
    description: "Explore whether temporary email is safe for shopping, the security benefits it provides, and best practices for protecting your personal data online.",
    metaDescription: "Is temporary email safe for shopping? Security guide covering encryption, data protection, and safe usage of disposable email for online transactions.",
    content: null,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    author: "Privacy Expert",
    date: "2024-01-05",
    readTime: 7,
    category: "Security",
    keywords: ["temporary email safe", "email security", "online shopping privacy", "data protection"],
    featured: true,
  },
  {
    id: "4",
    slug: "best-temporary-email-services-2024",
    title: "Best Temporary Email Services in 2024: Features, Comparison & Reviews",
    description: "Compare the top temporary email services available in 2024. Discover features, pricing, security measures, and find the perfect disposable email solution.",
    metaDescription: "Best temporary email services 2024. Compare features, security, speed, and ease of use. Find the top-rated disposable email provider for your needs.",
    content: null,
    image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800&h=400&fit=crop",
    author: "Privacy Expert",
    date: "2023-12-28",
    readTime: 9,
    category: "Reviews",
    keywords: ["best temporary email", "temp mail service", "disposable email comparison", "email service review"],
    featured: false,
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "Is temporary email legal?",
    answer: "Yes, temporary email is completely legal. It's used by millions of people worldwide for legitimate privacy protection purposes. Developers use it for testing, businesses use it for security research, and individuals use it to protect personal privacy."
  },
  {
    question: "Can I use temporary email for important accounts?",
    answer: "No, temporary emails are not suitable for important accounts like banking, email providers, or accounts with payment information. Use temporary email only for one-time signups, newsletters, and services you don't plan to use long-term."
  },
  {
    question: "How long does a temporary email last?",
    answer: "Duration varies by service, typically ranging from 10 minutes to several hours. TempMail provides an active inbox during your session. Emails auto-delete after the temporary address expires to protect your privacy."
  },
  {
    question: "Can someone find my real email from temporary email?",
    answer: "No, temporary email addresses are completely disconnected from your real email. The service provider cannot and does not share information linking temporary addresses to actual identities."
  },
  {
    question: "Do temporary emails show in search results?",
    answer: "No, temporary email addresses are not indexed by search engines. They're private by design and only visible to you and the services you explicitly share them with."
  },
  {
    question: "Is my data safe on temporary email?",
    answer: "Yes, reputable temporary email services use encryption and automatically delete data. Since emails auto-expire, there's no long-term data storage to worry about."
  },
];

export const getFeaturedPosts = () => blogPosts.filter(post => post.featured).slice(0, 4);
export const getPostBySlug = (slug: string) => blogPosts.find(post => post.slug === slug);
export const getRelatedPosts = (currentSlug: string, limit = 3) => 
  blogPosts.filter(post => post.slug !== currentSlug).slice(0, limit);
