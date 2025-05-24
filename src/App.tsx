// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';

import Intro from './components/Intro';
import Questions from './components/Questions';
import Skills from './components/Skills';
import Professions from './components/Professions';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import Header from './components/UI/Header';
import AIAssistantButton from './components/UI/AIAssistantButton';

import type { BackendAnalysisResponse } from './types'; // Import from shared types

function App() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // New state for storing the full analysis data
  const [analysisData, setAnalysisData] = useState<BackendAnalysisResponse | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSuccess = (tokens: { access: string; refresh: string }) => {
    setAccessToken(tokens.access);
    setIsLoggedIn(true);
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    setShowAuthModal(false);
    if (step === 1 && userInfo) {
      setStep(2);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setStep(1);
    setUserInfo('');
    setQuestions([]);
    setAnswers([]);
    setUserSkills([]);
    setSelectedJob(null);
    setAnalysisData(null); // Reset analysis data on logout
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Intro
            setUserInfo={setUserInfo}
            accessToken={accessToken}
            onNext={(isValid) => {
              if (isValid) {
                if (isLoggedIn) setStep(2);
                else setShowAuthModal(true);
              }
            }}
          />
        );
      case 2:
        return (
          <Questions
            userInfo={userInfo}
            setQuestions={setQuestions}
            setAnswers={setAnswers}
            onNext={() => setStep(3)}
            accessToken={accessToken}
          />
        );
      case 3:
        return <Skills setUserSkills={setUserSkills} onNext={() => setStep(4)} />;
      case 4:
        return (
          <Professions
            answers={answers}
            userInfo={userInfo}
            userSkills={userSkills}
            setSelectedJob={setSelectedJob}
            onNext={() => setStep(5)}
            accessToken={accessToken}
            setAnalysisData={setAnalysisData} // Pass the setter function
          />
        );
      case 5:
        return (
          <Dashboard
            job={selectedJob}
            userInfo={userInfo}
            answers={answers}
            userSkills={userSkills}
            accessToken={accessToken}
            analysisData={analysisData} // Pass the fetched analysis data
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center relative overflow-hidden font-inter">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
      />
      <div className="w-full max-w-4xl relative mt-8">
        <div key={step} className="component-enter">
          {renderStep()}
        </div>
      </div>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      <AIAssistantButton isOpen={isAIOpen} setIsOpen={setIsAIOpen} />
    </div>
  );
}

export default App;