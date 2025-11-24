// Utilities for article generation and sharing

export interface TableOfContentsItem {
  id: string;
  level: number;
  title: string;
}

export interface ContentBlock {
  type: 'h2' | 'h3' | 'p' | 'list' | 'emphasis' | 'strong';
  content: string;
  id?: string;
  items?: string[];
}

/**
 * Generate table of contents from markdown content
 */
export const generateTableOfContents = (content: string): TableOfContentsItem[] => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ id, level, title });
  }

  return toc;
};

/**
 * Parse and render content blocks professionally
 */
export const parseContentBlocks = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();

    // Heading 2
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace('## ', '').trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      blocks.push({ type: 'h2', content: title, id });
    }
    // Heading 3
    else if (trimmed.startsWith('### ')) {
      const title = trimmed.replace('### ', '').trim();
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      blocks.push({ type: 'h3', content: title, id });
    }
    // Numbered list
    else if (trimmed.match(/^\d+\./)) {
      const items = trimmed.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
      blocks.push({ type: 'list', content: 'ordered', items });
    }
    // Bullet list
    else if (trimmed.startsWith('-')) {
      const items = trimmed.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
      blocks.push({ type: 'list', content: 'unordered', items });
    }
    // Regular paragraph
    else {
      blocks.push({ type: 'p', content: trimmed });
    }
  }

  return blocks;
};

/**
 * Share article on social platforms
 */
export const shareArticleOn = (platform: 'twitter' | 'whatsapp' | 'telegram', {
  title,
  url,
  summary,
}: {
  title: string;
  url: string;
  summary: string;
}) => {
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent(`${title}\n\n${summary}`);
  const shortText = encodeURIComponent(title);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${shortText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${shortText}`,
  };

  const url_share = shareUrls[platform];
  if (url_share) {
    window.open(url_share, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Copy article link to clipboard
 */
export const copyArticleLink = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Author bio data
 */
export interface AuthorBio {
  name: string;
  bio: string;
  expertise: string[];
}

export const authorBios: Record<string, AuthorBio> = {
  "Privacy Expert": {
    name: "Privacy Expert",
    bio: "Leading digital privacy advocate with 10+ years of experience in online security and personal data protection. Passionate about helping people reclaim control over their digital footprint.",
    expertise: ["Privacy Protection", "Email Security", "Data Protection", "Online Safety"],
  },
  "Tech Reviewer": {
    name: "Tech Reviewer",
    bio: "Technology journalist and security researcher focused on evaluating privacy tools and email services. Dedicated to providing transparent, practical guidance for digital privacy.",
    expertise: ["Security Tools", "Email Services", "Tech Review", "Best Practices"],
  },
  "Tech Analyst": {
    name: "Tech Analyst",
    bio: "Tech analyst specializing in email infrastructure and digital communication systems. Passionate about explaining complex technology in accessible, actionable terms.",
    expertise: ["Email Systems", "Tech Analysis", "Infrastructure", "Documentation"],
  },
  "Performance Engineer": {
    name: "Performance Engineer",
    bio: "Performance and infrastructure expert focused on building reliable, fast email systems. Committed to explaining technical concepts and optimization strategies.",
    expertise: ["Performance", "Infrastructure", "Optimization", "Engineering"],
  },
  "Product Manager": {
    name: "Product Manager",
    bio: "Product strategy expert with experience building consumer privacy tools. Focused on creating practical solutions that make privacy accessible to everyone.",
    expertise: ["Product Strategy", "User Experience", "Privacy Tools", "Innovation"],
  },
};
