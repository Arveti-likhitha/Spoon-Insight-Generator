import React from 'react';
import { 
  Star, 
  GitFork, 
  Users, 
  GitCommit, 
  AlertCircle, 
  Download, 
  Copy,
  RefreshCw,
  TrendingUp,
  Zap,
  Target,
  Code,
  MessageCircle,
  ExternalLink,
  Activity,
  GitPullRequest,
  Package,
  Globe,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { ProjectInsights, GitHubRepo } from '../types';

interface InsightsDisplayProps {
  insights: ProjectInsights;
  repoData?: GitHubRepo;
  fileName?: string;
  onGenerateAgain: () => void;
}

export const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ 
  insights, 
  repoData, 
  fileName,
  onGenerateAgain 
}) => {
  
  const handleExport = () => {
    const exportContent = `
# Project Insights Report

## Summary
${insights.summary}

## Features
${insights.features.map(feature => `- ${feature}`).join('\n')}

## Use Cases
${insights.useCases.map(useCase => `- ${useCase}`).join('\n')}

## Tech Stack
${insights.techStack.join(', ')}

## Analytics
- Stars: ${insights.analytics.stars || 'N/A'}
- Forks: ${insights.analytics.forks || 'N/A'}
- Contributors: ${insights.analytics.contributors || 'N/A'}
- Commits: ${insights.analytics.commits || 'N/A'}

## Challenges
${insights.challenges.map(challenge => `- ${challenge}`).join('\n')}

## Spoon's Take
"${insights.humorousComment}"

## Assessment
- Effort Level: ${insights.effortLevel}
- README Quality: ${insights.readmeQuality}
    `;
    
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-insights.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(insights.summary);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header with Project Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl text-white p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl">🥄</div>
          <div className="absolute bottom-4 left-4 text-4xl">✨</div>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🥄</span>
              <h1 className="text-3xl font-bold">
                {repoData ? repoData.name : fileName || 'Project Analysis'}
              </h1>
              {insights.deploymentStatus === 'Live' && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Live
                </span>
              )}
            </div>
            {repoData?.description && (
              <p className="text-purple-100 text-lg">{repoData.description}</p>
            )}
            {insights.liveDemo && (
              <a
                href={insights.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors"
              >
                <Globe className="w-4 h-4" />
                View Live Demo
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onGenerateAgain}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Again
            </button>
            <button
              onClick={handleExport}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {repoData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-md border-2 border-yellow-100 p-6 hover:border-yellow-200 transition-colors">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Stars</p>
                <p className="text-2xl font-bold text-gray-900">{repoData.stars.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6 hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-3">
              <GitFork className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Forks</p>
                <p className="text-2xl font-bold text-gray-900">{repoData.forks.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border-2 border-green-100 p-6 hover:border-green-200 transition-colors">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Contributors</p>
                <p className="text-2xl font-bold text-gray-900">{insights.analytics.contributors}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border-2 border-purple-100 p-6 hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-3">
              <GitCommit className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Commits</p>
                <p className="text-2xl font-bold text-gray-900">{insights.analytics.commits}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border-2 border-indigo-100 p-6 hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-3">
              <GitPullRequest className="w-6 h-6 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Pull Requests</p>
                <p className="text-2xl font-bold text-gray-900">{insights.analytics.pullRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border-2 border-pink-100 p-6 hover:border-pink-200 transition-colors">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-pink-500" />
              <div>
                <p className="text-sm text-gray-600">Releases</p>
                <p className="text-2xl font-bold text-gray-900">{insights.analytics.releases}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality & Activity Indicators */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md border-2 border-emerald-100 p-6 hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Code Quality</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{insights.codeQuality}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border-2 border-orange-100 p-6 hover:border-orange-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Activity Level</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{insights.activityLevel}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border-2 border-cyan-100 p-6 hover:border-cyan-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold text-gray-800">Last Updated</h3>
          </div>
          <p className="text-lg font-bold text-cyan-600">{insights.analytics.lastUpdated || 'Unknown'}</p>
        </div>
      </div>

      {/* Languages Breakdown */}
      {insights.analytics.languages && Object.keys(insights.analytics.languages).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 p-8 hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-gray-900">Language Breakdown</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(insights.analytics.languages)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([language, bytes]) => {
                const total = Object.values(insights.analytics.languages!).reduce((sum, val) => sum + val, 0);
                const percentage = ((bytes / total) * 100).toFixed(1);
                
                return (
                  <div key={language} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">{language}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-gray-600">{percentage}%</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Main Insights Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-8 hover:border-purple-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">{insights.summary}</p>
          
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {insights.effortLevel}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              README: {insights.readmeQuality}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              {insights.codeQuality}
            </span>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              Copy Summary
            </button>
          </div>
        </div>

        {/* Humorous Comment Card */}
        <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl shadow-lg text-white p-8 hover:from-pink-600 hover:to-orange-600 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Spoon's Hot Take 🌶️</h2>
          </div>
          
          <blockquote className="text-xl font-medium italic mb-4">
            "{insights.humorousComment}"
          </blockquote>
          
          <div className="flex items-center gap-2 text-pink-100">
            <span className="text-2xl">🥄</span>
            <span className="text-sm">- Your friendly AI project critic</span>
          </div>
        </div>
      </div>

      {/* Features and Tech Stack */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-8 hover:border-green-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Features</h2>
          </div>
          
          <ul className="space-y-3">
            {insights.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {insights.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases and Challenges */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Use Cases */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-teal-100 p-8 hover:border-teal-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Use Cases</h2>
          </div>
          
          <ul className="space-y-3">
            {insights.useCases.map((useCase, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-8 hover:border-orange-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
          </div>
          
          <ul className="space-y-3">
            {insights.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};