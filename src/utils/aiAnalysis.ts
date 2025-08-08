import type { ProjectInsights, GitHubRepo } from '../types';
import { detectLiveDemo } from './github.ts';

// Free AI API using Hugging Face Inference API
const HUGGING_FACE_API_URL = import.meta.env.VITE_AI_INSIGHTS_URL;
const HUGGING_FACE_API_TOKEN = import.meta.env.VITE_AI_INSIGHTS_TOKEN;

export const generateAIInsights = async (content: string, repoData?: GitHubRepo): Promise<string> => {
  try {
    const prompt = `Analyze this project and provide insights:

Project: ${repoData?.name || 'Unknown Project'}
Description: ${repoData?.description || 'No description'}
Content: ${content.substring(0, 1000)}...

Please provide a brief analysis of this project including its purpose, features, and quality.`;

    if (!HUGGING_FACE_API_URL) {
      throw new Error('HUGGING_FACE_API_URL is not defined');
    }
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result[0]?.generated_text || '';
    }
  } catch {
    console.warn('AI API failed, using fallback analysis');
  }

  return '';
};

// Enhanced analysis with better logic
export const generateInsights = async (
  content: string,
  repoData?: GitHubRepo
): Promise<ProjectInsights> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const aiInsights = await generateAIInsights(content, repoData);
  
  // Analyze content for better insights
  const contentLower = content.toLowerCase();
  const hasReact = contentLower.includes('react') || contentLower.includes('jsx');
  const hasNode = contentLower.includes('node') || contentLower.includes('express');
  const hasPython = contentLower.includes('python') || contentLower.includes('django') || contentLower.includes('flask');
  const hasDocker = contentLower.includes('docker') || contentLower.includes('dockerfile');
  const hasAPI = contentLower.includes('api') || contentLower.includes('rest') || contentLower.includes('graphql');
  const hasDatabase = contentLower.includes('database') || contentLower.includes('sql') || contentLower.includes('mongodb');
  const hasAuth = contentLower.includes('auth') || contentLower.includes('login') || contentLower.includes('jwt');
  const hasTesting = contentLower.includes('test') || contentLower.includes('jest') || contentLower.includes('cypress');
  
  // Enhanced feature detection
  const hasCI = contentLower.includes('github actions') || contentLower.includes('ci/cd') || contentLower.includes('workflow');
  const hasMonitoring = contentLower.includes('monitoring') || contentLower.includes('analytics') || contentLower.includes('logging');
  const hasPerformance = contentLower.includes('performance') || contentLower.includes('optimization') || contentLower.includes('caching');
  
  // Smart tech stack detection
  const detectedTechStack = [];
  if (hasReact) detectedTechStack.push('React', 'JavaScript', 'JSX');
  if (hasNode) detectedTechStack.push('Node.js', 'Express');
  if (hasPython) detectedTechStack.push('Python');
  if (hasDocker) detectedTechStack.push('Docker');
  if (hasDatabase) detectedTechStack.push('Database');
  if (hasTesting) detectedTechStack.push('Testing Framework');
  
  // Add common web technologies
  if (contentLower.includes('css') || contentLower.includes('tailwind')) detectedTechStack.push('CSS');
  if (contentLower.includes('typescript')) detectedTechStack.push('TypeScript');
  if (contentLower.includes('vite')) detectedTechStack.push('Vite');
  if (contentLower.includes('webpack')) detectedTechStack.push('Webpack');
  
  // Add detected languages from GitHub API
  if (repoData?.languages) {
    const topLanguages = Object.keys(repoData.languages)
      .sort((a, b) => repoData.languages![b] - repoData.languages![a])
      .slice(0, 3);
    detectedTechStack.push(...topLanguages);
  }
  
  // Fallback tech stack if nothing detected
  const fallbackTechStack = ['JavaScript', 'HTML', 'CSS'];
  const finalTechStack = detectedTechStack.length > 0 ? detectedTechStack : fallbackTechStack;
  
  // Smart features detection
  const detectedFeatures = [];
  if (hasAuth) detectedFeatures.push('User authentication and authorization');
  if (hasAPI) detectedFeatures.push('RESTful API integration');
  if (hasDatabase) detectedFeatures.push('Database management system');
  if (hasReact) detectedFeatures.push('Interactive user interface');
  if (hasDocker) detectedFeatures.push('Containerized deployment');
  if (hasTesting) detectedFeatures.push('Automated testing suite');
  if (contentLower.includes('responsive')) detectedFeatures.push('Responsive web design');
  if (contentLower.includes('real-time') || contentLower.includes('websocket')) detectedFeatures.push('Real-time functionality');
  if (hasCI) detectedFeatures.push('Continuous Integration/Deployment');
  if (hasMonitoring) detectedFeatures.push('Monitoring and analytics');
  if (hasPerformance) detectedFeatures.push('Performance optimization');
  
  // Fallback features
  const fallbackFeatures = [
    'Clean code architecture',
    'Modern development practices',
    'User-friendly interface',
    'Scalable design patterns'
  ];
  
  const finalFeatures = detectedFeatures.length > 0 ? detectedFeatures : fallbackFeatures;
  
  // Smart use cases based on content
  const useCases = [];
  if (contentLower.includes('portfolio') || contentLower.includes('personal')) {
    useCases.push('Perfect for portfolio showcases');
  }
  if (contentLower.includes('startup') || contentLower.includes('business')) {
    useCases.push('Ideal for startup MVPs');
  }
  if (contentLower.includes('learning') || contentLower.includes('tutorial')) {
    useCases.push('Great for educational purposes');
  }
  if (contentLower.includes('enterprise') || contentLower.includes('production')) {
    useCases.push('Suitable for enterprise applications');
  }
  
  // Default use cases if none detected
  if (useCases.length === 0) {
    useCases.push(
      'Perfect for learning modern web development',
      'Great foundation for larger projects',
      'Ideal for rapid prototyping'
    );
  }
  
  // Humorous comments based on repo stats
  const humorousComments = [
    "This code is spicier than a Carolina Reaper 🌶️",
    "Your README needs a hug and maybe some therapy",
    "Chef's kiss 💋 - this is art",
    "More commits than my relationship has texts",
    "Documentation so good it made me cry tears of joy",
    "This repo is hotter than production on a Friday",
    "Slayed harder than a dragon in a fantasy novel",
    "Your code architecture is cleaner than my browser history",
    "More features than a Swiss Army knife having an identity crisis",
    "This project has more potential than my New Year's resolutions"
  ];
  
  // Smart humorous comment selection
  let selectedComment = humorousComments[Math.floor(Math.random() * humorousComments.length)];
  
  if (repoData) {
    if (repoData.stars > 1000) {
      selectedComment = "This project has more stars than my existential dread ⭐";
    } else if (repoData.stars === 0) {
      selectedComment = "Zero stars but infinite potential - like my dating life 💫";
    } else if (repoData.forks > repoData.stars) {
      selectedComment = "More forks than a fancy restaurant - people love to build on this! 🍴";
    } else if (content.length < 100) {
      selectedComment = "Short and sweet, like a good tweet or my attention span 🐦";
    }
  }
  
  // Smart effort level assessment
  let effortLevel: 'Weekend Hack' | 'Side Project' | 'Production Ready' | 'Enterprise Beast' = 'Side Project';
  
  if (repoData) {
    const totalActivity = (repoData.stars || 0) + (repoData.forks || 0) + (repoData.contributorsCount || 0);
    if (totalActivity > 500) effortLevel = 'Enterprise Beast';
    else if (totalActivity > 100) effortLevel = 'Production Ready';
    else if (totalActivity > 10) effortLevel = 'Side Project';
    else effortLevel = 'Weekend Hack';
  }
  
  // Smart README quality assessment
  let readmeQuality: 'Needs CPR' | 'Acceptable' | 'Chef\'s Kiss' | 'Documentation God' = 'Acceptable';
  
  if (content.length > 2000) readmeQuality = 'Documentation God';
  else if (content.length > 1000) readmeQuality = 'Chef\'s Kiss';
  else if (content.length > 300) readmeQuality = 'Acceptable';
  else readmeQuality = 'Needs CPR';
  
  // Smart challenges based on detected tech
  const challenges = [];
  if (hasReact) challenges.push('Managing complex component state and lifecycle');
  if (hasAPI) challenges.push('Handling API rate limits and error states');
  if (hasDatabase) challenges.push('Optimizing database queries for performance');
  if (hasAuth) challenges.push('Implementing secure authentication flows');
  if (hasDocker) challenges.push('Container orchestration and deployment');
  
  // Default challenges if none detected
  if (challenges.length === 0) {
    challenges.push(
      'Maintaining code quality as the project grows',
      'Balancing feature richness with simplicity',
      'Ensuring cross-browser compatibility'
    );
  }
  
  // Detect live demo
  const liveDemo = detectLiveDemo(content, repoData);
  
  // Determine deployment status
  let deploymentStatus: 'Live' | 'Inactive' | 'Unknown' = 'Unknown';
  if (liveDemo) {
    deploymentStatus = 'Live';
  } else if (contentLower.includes('deployed') || contentLower.includes('live')) {
    deploymentStatus = 'Live';
  }
  
  // Assess code quality based on various factors
  let codeQuality: 'Needs Refactoring' | 'Decent' | 'Clean' | 'Pristine' = 'Decent';
  if (hasTesting && hasCI && contentLower.includes('eslint')) {
    codeQuality = 'Pristine';
  } else if (hasTesting || hasCI) {
    codeQuality = 'Clean';
  } else if (content.length < 200) {
    codeQuality = 'Needs Refactoring';
  }
  
  // Determine activity level
  let activityLevel: 'Dormant' | 'Occasional' | 'Active' | 'Very Active' = 'Occasional';
  if (repoData) {
    const daysSinceUpdate = repoData.updatedAt ? 
      Math.floor((Date.now() - new Date(repoData.updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : 365;
    
    if (daysSinceUpdate < 7) activityLevel = 'Very Active';
    else if (daysSinceUpdate < 30) activityLevel = 'Active';
    else if (daysSinceUpdate < 90) activityLevel = 'Occasional';
    else activityLevel = 'Dormant';
  }
  
  return {
    aiInsights,
    summary: `This project demonstrates ${effortLevel.toLowerCase()} level engineering with a focus on ${finalTechStack.slice(0, 2).join(' and ')} development. The architecture shows thoughtful consideration of modern development practices, making it both maintainable and scalable. ${repoData ? `With ${repoData.stars} stars and ${repoData.forks} forks, it has gained solid community traction.` : 'The codebase reflects careful planning and execution.'}`,
    features: finalFeatures.slice(0, 6),
    useCases: useCases.slice(0, 4),
    techStack: [...new Set(finalTechStack)].slice(0, 8), // Remove duplicates and limit
    analytics: {
      stars: repoData?.stars,
      forks: repoData?.forks,
      contributors: repoData?.contributorsCount,
      commits: repoData?.commitsCount,
      issues: repoData?.openIssues,
      codeSize: repoData ? `${Math.round(repoData.size / 1024)} MB` : undefined,
      lastUpdated: repoData?.updatedAt ? new Date(repoData.updatedAt).toLocaleDateString() : undefined,
      languages: repoData?.languages,
      pullRequests: repoData?.pullRequests,
      releases: repoData?.releases
    },
    challenges: challenges.slice(0, 4),
    humorousComment: selectedComment,
    effortLevel,
    readmeQuality,
    liveDemo,
    deploymentStatus,
    codeQuality,
    activityLevel
  };
};