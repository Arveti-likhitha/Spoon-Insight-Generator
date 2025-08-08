import React, { useState, useCallback } from 'react';
import { Upload, Github, Loader2, FileText, Sparkles } from 'lucide-react';
import type { InputData } from '../types';
import { extractRepoFromUrl, fetchGitHubRepo, fetchReadme, fetchContributors, fetchCommits, fetchLanguages, fetchPullRequests, fetchReleases } from '../utils/github.ts';
import { parseMarkdownFile, parsePDFFile } from '../utils/fileParser.ts';

interface InputSectionProps {
  onAnalyze: (data: InputData) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubSubmit = async () => {
    if (!githubUrl.trim()) return;
    
    setError(null);
    
    try {
      const repoInfo = extractRepoFromUrl(githubUrl);
      if (!repoInfo) {
        setError('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
        return;
      }
      
      console.log('Fetching repo data for:', repoInfo);
      
      // Fetch repo data first
      const repoData = await fetchGitHubRepo(repoInfo.owner, repoInfo.repo);
      console.log('Repo data fetched:', repoData);
      
      // Then fetch additional data in parallel
      const [readmeContent, contributorsCount, languages, pullRequests, releases] = await Promise.all([
        fetchReadme(repoInfo.owner, repoInfo.repo).catch((err) => {
          console.warn('README fetch failed:', err);
          return 'No README found';
        }),
        fetchContributors(repoInfo.owner, repoInfo.repo).catch((err) => {
          console.warn('Contributors fetch failed:', err);
          return 0;
        }),
        fetchLanguages(repoInfo.owner, repoInfo.repo).catch((err) => {
          console.warn('Languages fetch failed:', err);
          return {};
        }),
        fetchPullRequests(repoInfo.owner, repoInfo.repo).catch((err) => {
          console.warn('Pull requests fetch failed:', err);
          return 0;
        }),
        fetchReleases(repoInfo.owner, repoInfo.repo).catch((err) => {
          console.warn('Releases fetch failed:', err);
          return 0;
        })
      ]);
      
      // Fetch commits separately to avoid blocking
      const commitsCount = await fetchCommits(repoInfo.owner, repoInfo.repo).catch((err) => {
        console.warn('Commits fetch failed:', err);
        return 0;
      });
      
      console.log('All data fetched:', { 
        readmeContent: readmeContent.length, 
        contributorsCount, 
        commitsCount,
        languages: Object.keys(languages).length,
        pullRequests,
        releases
      });
      
      onAnalyze({
        type: 'github',
        content: readmeContent,
        repoData: {
          ...repoData,
          contributorsCount,
          commitsCount,
          languages,
          pullRequests,
          releases
        }
      });
    } catch (err: unknown) {
      console.error('GitHub fetch error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch repository data. Please check the URL and try again.');
      } else {
        setError('Failed to fetch repository data. Please check the URL and try again.');
      }
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    
    try {
      let content = '';
      
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        content = await parseMarkdownFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = await parsePDFFile(file);
      } else {
        setError('Only PDF and Markdown files are supported');
        return;
      }
      
      onAnalyze({
        type: 'file',
        content,
        fileName: file.name
      });
    } catch {
      setError('Failed to parse file. Please try again.');
    }
  }, [onAnalyze]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* GitHub URL Input */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-8 hover:border-purple-200 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Github className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Analyze GitHub Repository</h3>
        </div>
        
        <div className="space-y-4">
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
            disabled={isLoading}
          />
          
          <button
            onClick={handleGitHubSubmit}
            disabled={!githubUrl.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Repository...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Repository
              </>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="h-px bg-gray-300 w-16"></div>
          <span className="text-sm font-medium">OR</span>
          <div className="h-px bg-gray-300 w-16"></div>
        </div>
      </div>

      {/* File Upload */}
      <div
        className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 p-8 ${
          dragActive ? 'border-purple-400 bg-purple-50' : 'border-purple-100 hover:border-purple-200'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Upload Project File</h3>
        </div>
        
        <div className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${
            dragActive ? 'bg-purple-200' : 'bg-purple-100'
          }`}>
            <FileText className="w-10 h-10 text-purple-600" />
          </div>
          
          <p className="text-gray-600 mb-4">
            Drag & drop your PDF or Markdown file here, or click to select
          </p>
          
          <input
            type="file"
            accept=".pdf,.md,.markdown"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 cursor-pointer transition-all duration-200 disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            Choose File
          </label>
          
          <p className="text-sm text-gray-400 mt-2">
            Supports PDF and Markdown files
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-medium">Oops! Something went wrong:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};