
import React, { useState } from 'react';
import { askComplexQuestion } from '../services/geminiService';
import Spinner from './Spinner';
import { SparklesIcon } from './icons';

const ThinkingMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');
    try {
      const result = await askComplexQuestion(prompt);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8 border-t-4 border-primary">
      <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-primary" />
        AI Financial Assistant (Thinking Mode)
      </h2>
      <p className="text-secondary mt-2 mb-4">Ask complex financial questions. Our most powerful model will analyze it for you.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Compare my electricity bill with the national average...'"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Spinner size="sm"/> : 'Ask AI'}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}
      
      {isLoading && !response && (
        <div className="mt-6 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
          <Spinner text="Our AI is thinking..." />
          <p className="text-sm text-secondary mt-2">This may take a moment for complex queries.</p>
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-light rounded-lg border">
          <h3 className="text-lg font-semibold text-dark mb-2">AI Response:</h3>
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
};

export default ThinkingMode;
