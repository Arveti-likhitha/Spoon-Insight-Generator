export const parseMarkdownFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const parsePDFFile = async (file: File): Promise<string> => {
  // For now, we'll return a placeholder since we'd need pdf-parse
  // In a real implementation, you'd use a PDF parsing library
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`PDF content from ${file.name} would be parsed here. For now, this is a placeholder text that simulates extracted PDF content including project documentation, technical specifications, and other relevant information.`);
    }, 1000);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const extractProjectFeatures = (content: string): string[] => {
  const features = [];
  const contentLower = content.toLowerCase();
  
  // Feature detection patterns
  const featurePatterns = [
    { pattern: /authentication|auth|login|signup/g, feature: 'User Authentication' },
    { pattern: /api|rest|graphql|endpoint/g, feature: 'API Integration' },
    { pattern: /database|db|sql|mongodb|postgres/g, feature: 'Database Management' },
    { pattern: /responsive|mobile|tablet/g, feature: 'Responsive Design' },
    { pattern: /test|testing|jest|cypress|mocha/g, feature: 'Testing Suite' },
    { pattern: /docker|container|kubernetes/g, feature: 'Containerization' },
    { pattern: /ci\/cd|github actions|workflow|pipeline/g, feature: 'CI/CD Pipeline' },
    { pattern: /real-time|websocket|socket\.io/g, feature: 'Real-time Features' },
    { pattern: /payment|stripe|paypal|billing/g, feature: 'Payment Processing' },
    { pattern: /search|elasticsearch|algolia/g, feature: 'Search Functionality' },
    { pattern: /notification|email|sms|push/g, feature: 'Notification System' },
    { pattern: /admin|dashboard|analytics/g, feature: 'Admin Dashboard' },
    { pattern: /cache|redis|memcached/g, feature: 'Caching System' },
    { pattern: /security|encryption|ssl|https/g, feature: 'Security Features' },
    { pattern: /monitoring|logging|metrics/g, feature: 'Monitoring & Logging' }
  ];
  
  featurePatterns.forEach(({ pattern, feature }) => {
    if (pattern.test(contentLower)) {
      features.push(feature);
    }
  });
  
  return [...new Set(features)]; // Remove duplicates
};

export const extractTechStack = (content: string): string[] => {
  const techStack = [];
  const contentLower = content.toLowerCase();
  
  // Technology detection patterns
  const techPatterns = [
    { pattern: /react|jsx|tsx/g, tech: 'React' },
    { pattern: /vue\.js|vue/g, tech: 'Vue.js' },
    { pattern: /angular/g, tech: 'Angular' },
    { pattern: /node\.js|nodejs|express/g, tech: 'Node.js' },
    { pattern: /python|django|flask|fastapi/g, tech: 'Python' },
    { pattern: /java|spring|springboot/g, tech: 'Java' },
    { pattern: /typescript|ts/g, tech: 'TypeScript' },
    { pattern: /javascript|js/g, tech: 'JavaScript' },
    { pattern: /html|html5/g, tech: 'HTML' },
    { pattern: /css|css3|sass|scss|less/g, tech: 'CSS' },
    { pattern: /tailwind|tailwindcss/g, tech: 'Tailwind CSS' },
    { pattern: /bootstrap/g, tech: 'Bootstrap' },
    { pattern: /mongodb|mongo/g, tech: 'MongoDB' },
    { pattern: /postgresql|postgres/g, tech: 'PostgreSQL' },
    { pattern: /mysql/g, tech: 'MySQL' },
    { pattern: /redis/g, tech: 'Redis' },
    { pattern: /docker/g, tech: 'Docker' },
    { pattern: /kubernetes|k8s/g, tech: 'Kubernetes' },
    { pattern: /aws|amazon web services/g, tech: 'AWS' },
    { pattern: /vercel/g, tech: 'Vercel' },
    { pattern: /netlify/g, tech: 'Netlify' },
    { pattern: /heroku/g, tech: 'Heroku' },
    { pattern: /firebase/g, tech: 'Firebase' },
    { pattern: /graphql/g, tech: 'GraphQL' },
    { pattern: /webpack/g, tech: 'Webpack' },
    { pattern: /vite/g, tech: 'Vite' },
    { pattern: /next\.js|nextjs/g, tech: 'Next.js' },
    { pattern: /nuxt\.js|nuxtjs/g, tech: 'Nuxt.js' },
    { pattern: /gatsby/g, tech: 'Gatsby' }
  ];
  
  techPatterns.forEach(({ pattern, tech }) => {
    if (pattern.test(contentLower)) {
      techStack.push(tech);
    }
  });
  
  return [...new Set(techStack)]; // Remove duplicates
};