// JSON-LD Schema markup for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TempMail",
  "description": "Free temporary email service - get instant disposable email addresses for privacy protection",
  "url": "https://tempmail.org",
  "logo": "https://tempmail.org/logo.png",
  "sameAs": [
    "https://twitter.com/tempmail",
    "https://facebook.com/tempmail"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "support@tempmail.org"
  }
};

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TempMail",
  "description": "Free temporary email address generator with instant inbox access, QR code sharing, and 99.9% uptime",
  "url": "https://tempmail.org",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "500",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "TempMail"
  },
  "version": "2.6.0"
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "TempMail",
  "description": "Free temporary email service",
  "url": "https://tempmail.org",
  "image": "https://tempmail.org/logo.png",
  "priceRange": "Free",
  "areaServed": "Worldwide"
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is temporary email legal and safe to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, temporary email is completely legal and safe. It's used by millions worldwide—developers for testing, businesses for security research, and individuals for privacy protection."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a temporary email address last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TempMail provides an active, usable inbox during your session. The temporary address remains active and receives emails while you're using the service."
      }
    },
    {
      "@type": "Question",
      "name": "Why does TempMail have 99.9% uptime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "TempMail uses enterprise-grade distributed infrastructure with redundancy, automated failover, and multi-region servers."
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
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://tempmail.org/logo.png",
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "datePublished": article.datePublished,
  "url": article.url
});
