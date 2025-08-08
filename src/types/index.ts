export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  openIssues: number;
  watchers: number;
  size: number;
  defaultBranch: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  url: string;
  contributorsCount?: number;
  commitsCount?: number;
  languages?: { [key: string]: number };
  pullRequests?: number;
  releases?: number;
}

export interface ProjectInsights {
  summary: string;
  aiInsights: string;
  features: string[];
  useCases: string[];
  techStack: string[];
  analytics: {
    stars?: number;
    forks?: number;
    contributors?: number;
    commits?: number;
    issues?: number;
    codeSize?: string;
    lastUpdated?: string;
    languages?: { [key: string]: number };
    weeklyCommits?: number;
    pullRequests?: number;
    releases?: number;
  };
  challenges: string[];
  humorousComment: string;
  effortLevel: 'Weekend Hack' | 'Side Project' | 'Production Ready' | 'Enterprise Beast';
  readmeQuality: 'Needs CPR' | 'Acceptable' | 'Chef\'s Kiss' | 'Documentation God';
  liveDemo?: string;
  deploymentStatus?: 'Live' | 'Inactive' | 'Unknown';
  codeQuality: 'Needs Refactoring' | 'Decent' | 'Clean' | 'Pristine';
  activityLevel: 'Dormant' | 'Occasional' | 'Active' | 'Very Active';
}

export interface InputData {
  type: 'github' | 'file';
  content: string;
  fileName?: string;
  repoData?: GitHubRepo;
}