// JSON-LD Schema markup for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Burner Email",
  "alternateName": ["burner email", "temp mail", "temporary email", "disposable email", "private email"],
  "description": "Free temporary email service - get instant burner email, temp mail, and disposable email addresses for privacy protection and spam prevention",
  "url": "https://burneremail.email",
  "logo": "https://burneremail.email/logo-256.png",
  "keywords": "burner email, temp mail, temporary email, disposable email, private email, secure email, anonymous email",
  "sameAs": [
    "https://twitter.com/burneremail",
    "https://facebook.com/burneremail"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "support@burneremail.email"
  }
};

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Burner Email",
  "alternateName": ["burner email", "temp mail", "temporary email", "disposable email", "private email", "secure email"],
  "description": "Free burner email, temp mail, and temporary email address generator with instant inbox access, QR code sharing, anonymous private email, and 99.9% uptime",
  "url": "https://burneremail.email",
  "applicationCategory": "UtilityApplication",
  "keywords": "burner email, temp mail, temporary email, disposable email, private email, secure email, anonymous email, throwaway email, spam prevention",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "5000",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "Burner Email"
  },
  "version": "2.6.0"
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Burner Email",
  "description": "Free burner email, temp mail, and temporary email service. Get instant disposable email and private mail addresses for secure anonymous communication.",
  "url": "https://burneremail.email",
  "image": "https://burneremail.email/logo-256.png",
  "priceRange": "Free",
  "areaServed": "Worldwide",
  "keywords": "burner email, temp mail, temporary email, disposable email, private email, secure email"
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a burner email and why use temporary email?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A burner email (also called temp mail or temporary email) is a disposable email address that protects your privacy. Use burner email for spam prevention, online privacy, and anonymous communication without revealing your real email."
      }
    },
    {
      "@type": "Question",
      "name": "Is burner email legal and safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, burner email and temporary email are completely legal and safe. They're used by millions worldwide—developers for testing, businesses for security research, and individuals for privacy protection and spam prevention."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a temporary email address last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Burner Email provides an active, usable inbox during your session. Your temporary email address remains active and receives emails while you're using the service."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between burner email and regular email?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Burner email (temp mail) is disposable and anonymous, offering better privacy. Regular email requires signup and reveals your identity. Use burner email for secure private communication without spam."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use secure email and private email for business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, burner email is perfect for business testing, security research, and protecting your main email from spam. Use temporary email (temp mail) to keep your primary secure email separate."
      }
    }
  ]
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const articleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  url: string;
  keywords?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://burneremail.email/logo-256.png",
  "keywords": article.keywords?.join(", ") || "burner email, temp mail, temporary email, disposable email, private email, secure email",
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "datePublished": article.datePublished,
  "url": article.url
});
