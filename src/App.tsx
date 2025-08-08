import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { InsightsDisplay } from './components/InsightsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateInsights } from './utils/aiAnalysis';
import type { InputData, ProjectInsights } from './types';

function App() {
  const [insights, setInsights] = useState<ProjectInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState<InputData | null>(null);

  const handleAnalyze = async (inputData: InputData) => {
    setIsLoading(true);
    setCurrentInput(inputData);
    setInsights(null);
    
    try {
      const generatedInsights = await generateInsights(
        inputData.content,
        inputData.repoData
      );
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Analysis failed:', error);
      // You could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgain = () => {
    if (currentInput) {
      handleAnalyze(currentInput);
    }
  };

  const handleStartOver = () => {
    setInsights(null);
    setCurrentInput(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl">🥄</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Spoon
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-2">
            AI-powered project insights generator
          </p>
          
          <p className="text-gray-500 max-w-2xl mx-auto">
            Drop a GitHub repo link or upload your project files, and get instant insights, 
            features analysis, tech stack detection, and hilariously honest feedback.
          </p>
        </header>

        {/* Main Content */}
        <main>
          {isLoading ? (
            <LoadingSpinner 
              message={currentInput?.type === 'github' 
                ? 'Fetching repository data and analyzing...' 
                : 'Processing file and generating insights...'
              } 
            />
          ) : insights && currentInput ? (
            <div className="space-y-8">
              <InsightsDisplay 
                insights={insights}
                repoData={currentInput.repoData}
                fileName={currentInput.fileName}
                onGenerateAgain={handleGenerateAgain}
              />
              
              {/* Start Over Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleStartOver}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-8 rounded-xl font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-200"
                >
                  Analyze Another Project
                </button>
              </div>
            </div>
          ) : (
            <InputSection 
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">
            Made with 💜 by Spoon • Your friendly AI project critic since 2024
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;