import React, { useState } from 'react';

type Props = {
  onNext: (isValid: boolean, errorMessage?: string) => void;
  setUserInfo: (info: string) => void;
  accessToken: string | null;
};

function Intro({ onNext, setUserInfo, accessToken }: Props) {
  const [wordCountError, setWordCountError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const info = (form.elements.namedItem('info') as HTMLTextAreaElement).value;

    const words = info.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 10) {
      setWordCountError('Please tell us more about yourself (at least 10 words).');
      setBackendError(null);
      return;
    }

    setWordCountError(null);
    setBackendError(null);
    setUserInfo(info);
    setIsLoading(true);

    try {
      const response = await fetch('https://kajet24.work.gd/api/chat/check/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ about: info }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        onNext(true);
      } else {
        const errorMessage = data.recommendations || 'An error occurred while validating the information.';
        setBackendError(errorMessage);
        onNext(false, errorMessage);
      }
    } catch (error) {
      console.error('Error during "About Me" validation:', error);
      setBackendError('Failed to connect to the server. Please try again later.');
      onNext(false, 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Tell us a little about yourself 👋</h2>
        <p className="text-gray-600 text-center mb-6">This will help us understand your interests and suggest suitable career paths.</p>
        <div className="mb-6">
          <label htmlFor="info" className="block text-gray-700 text-sm font-medium mb-2 sr-only">
            About yourself
          </label>
          <textarea
            id="info"
            name="info"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition duration-300 ease-in-out resize-y focus:shadow-lg"
            placeholder="For example: I love programming and exploring new technologies. In school, I enjoyed math, and in my free time I read fantasy and play board games. I want to find a job where I can continuously grow and make a positive impact..."
            required
            disabled={isLoading}
          />
          {/* Display client-side word count error */}
          {wordCountError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{wordCountError}</span>
            </div>
          )}
          {/* Display backend validation error */}
          {backendError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{backendError}</span>
            </div>
          )}
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Checking...' : 'Next'}
        </button>
      </form>
    </div>
  );
}

export default Intro;
