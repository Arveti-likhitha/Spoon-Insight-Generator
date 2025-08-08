import React from 'react';
import { Loader2, Sparkles, Code, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Analyzing your project..." 
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-12 text-center">
        {/* Animated Icons */}
        <div className="relative mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
            <span className="text-4xl animate-bounce">🥄</span>
            <Code className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Spoon is cooking up insights...
          </h3>
          
          <p className="text-gray-600">{message}</p>
          
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>This usually takes a moment</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>

        {/* Fun Loading Messages */}
        <div className="mt-6 text-xs text-gray-400 italic">
          <p>Stirring up some code analysis magic... ✨</p>
        </div>
      </div>
    </div>
  );
};