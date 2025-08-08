export const extractRepoFromUrl = (url: string): { owner: string; repo: string } | null => {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  
  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  }
  
  return null;
};

export const fetchGitHubRepo = async (owner: string, repo: string) => {
  try {
    // Use GitHub API directly - most browsers allow this
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found. Please check the URL.');
      } else if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    return {
      name: data.name,
      description: data.description || 'No description available',
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      language: data.language || 'Unknown',
      topics: data.topics || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      openIssues: data.open_issues_count || 0,
      watchers: data.watchers_count || 0,
      size: data.size || 0,
      defaultBranch: data.default_branch || 'main',
      owner: {
        login: data.owner.login,
        avatarUrl: data.owner.avatar_url
      },
      url: data.html_url
    };
  } catch (error) {
    console.error('Error fetching GitHub repo:', error);
    throw error;
  }
};

export const fetchReadme = async (owner: string, repo: string): Promise<string> => {
  const possibleReadmeNames = ['README.md', 'readme.md', 'README.txt', 'readme.txt', 'README'];
  
  for (const fileName of possibleReadmeNames) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Spoon-App'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.content) {
          // Decode base64 content
          const decodedContent = atob(data.content.replace(/\n/g, ''));
          return decodedContent;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch ${fileName}:`, error);
    }
  }
  
  return 'No README found';
};

export const fetchContributors = async (owner: string, repo: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for contributors: ${response.status}`);
      return 0;
    }
    
    // Get the total count from the Link header
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        return parseInt(lastPageMatch[1], 10);
      }
    }
    
    // If no Link header, get the actual contributors array length
    const contributors = await response.json();
    return Array.isArray(contributors) ? contributors.length : 0;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return 0;
  }
};

export const fetchCommits = async (owner: string, repo: string): Promise<number> => {
  try {
    // Get commits with pagination info
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for commits: ${response.status}`);
      return 0;
    }
    
    // Get the total count from the Link header
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        return parseInt(lastPageMatch[1], 10);
      }
    }
    
    // If no Link header, we need to count manually (this means <= 100 commits)
    try {
      const allCommitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Spoon-App'
        }
      });
      
      if (allCommitsResponse.ok) {
        const commits = await allCommitsResponse.json();
        return Array.isArray(commits) ? commits.length : 0;
      }
    } catch (error) {
      console.warn('Error fetching all commits:', error);
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return 0;
  }
};

export const fetchLanguages = async (owner: string, repo: string): Promise<{ [key: string]: number }> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for languages: ${response.status}`);
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {};
  }
};

export const fetchPullRequests = async (owner: string, repo: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for pull requests: ${response.status}`);
      return 0;
    }
    
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        return parseInt(lastPageMatch[1], 10);
      }
    }
    
    const prs = await response.json();
    return Array.isArray(prs) ? prs.length : 0;
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    return 0;
  }
};

export const fetchReleases = async (owner: string, repo: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Spoon-App'
      }
    });
    
    if (!response.ok) {
      console.warn(`GitHub API error for releases: ${response.status}`);
      return 0;
    }
    
    const releases = await response.json();
    return Array.isArray(releases) ? releases.length : 0;
  } catch (error) {
    console.error('Error fetching releases:', error);
    return 0;
  }
};

export const detectLiveDemo = (readmeContent: string, repoData?: GitHubRepo): string | undefined => {
  const content = readmeContent.toLowerCase();
  
  // Common demo URL patterns
  const demoPatterns = [
    /demo[:\s]*https?:\/\/[^\s\)]+/gi,
    /live[:\s]*https?:\/\/[^\s\)]+/gi,
    /preview[:\s]*https?:\/\/[^\s\)]+/gi,
    /deployed[:\s]*https?:\/\/[^\s\)]+/gi,
    /https?:\/\/[^\s\)]*\.vercel\.app[^\s\)]*/gi,
    /https?:\/\/[^\s\)]*\.netlify\.app[^\s\)]*/gi,
    /https?:\/\/[^\s\)]*\.herokuapp\.com[^\s\)]*/gi,
    /https?:\/\/[^\s\)]*\.github\.io[^\s\)]*/gi,
  ];
  
  for (const pattern of demoPatterns) {
    const matches = readmeContent.match(pattern);
    if (matches && matches[0]) {
      // Extract just the URL part
      const urlMatch = matches[0].match(/https?:\/\/[^\s\)]+/);
      if (urlMatch) {
        return urlMatch[0];
      }
    }
  }
  
  // Check if it's a GitHub Pages repo
  if (repoData && repoData.name.includes('.github.io')) {
    return `https://${repoData.owner.login}.github.io/${repoData.name}`;
  }
  
  return undefined;
};