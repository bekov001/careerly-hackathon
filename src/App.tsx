// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Import global styles

// Import your components
import Intro from './components/Intro';
import Questions from './components/Questions';
import Skills from './components/Skills';
import Professions from './components/Professions'; // Import Professions
import Dashboard from './components/Dashboard'; // Import Dashboard
import AuthModal from './components/AuthModal'; // Authentication modal
import Header from './components/UI/Header'; // Application header
import AIAssistantButton from './components/UI/AIAssistantButton'; // AI Assistant button

function App() {
  const [step, setStep] = useState(1); // Current step in the user flow
  const [userInfo, setUserInfo] = useState(''); // Stores the "About Me" text
  const [questions, setQuestions] = useState<string[]>([]); // Stores generated questions
  const [answers, setAnswers] = useState<string[]>([]); // Stores user answers to questions
  const [userSkills, setUserSkills] = useState<string[]>([]); // Stores user's selected skills
  const [selectedJob, setSelectedJob] = useState<string | null>(null); // Stores the selected job/profession

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks user's login status
  const [showAuthModal, setShowAuthModal] = useState(false); // Controls visibility of the authentication modal
  const [accessToken, setAccessToken] = useState<string | null>(null); // Stores the user's access token

  const [isAIOpen, setIsAIOpen] = useState(false); // State for AI assistant chat window

  // Effect to check login status from localStorage on app load
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Callback for successful authentication (login or registration)
  const handleAuthSuccess = (tokens: { access: string; refresh: string }) => {
    setAccessToken(tokens.access);
    setIsLoggedIn(true);
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    setShowAuthModal(false);

    // If we were on the intro step and userInfo is set, advance to questions
    if (step === 1 && userInfo) {
      setStep(2);
    }
  };

  // Callback for user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Reset the wizard
    setStep(1);
    setUserInfo('');
    setQuestions([]);
    setAnswers([]);
    setUserSkills([]);
    setSelectedJob(null);
  };

  // Render the component for the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Intro
        // Pass userInfo
            setUserInfo={setUserInfo}
            accessToken={accessToken}
            onNext={(isValid, errorMessage) => {
              if (isValid) {
                if (isLoggedIn) {
                  setStep(2);
                } else {
                  setShowAuthModal(true);
                }
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
            userInfo={userInfo} // Pass userInfo here
            userSkills={userSkills} // Pass userSkills here
            setSelectedJob={setSelectedJob}
            onNext={() => setStep(5)}
            accessToken={accessToken} // Pass accessToken here
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center relative overflow-hidden font-inter">
      {/* Header with login/logout controls */}
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
      />

      {/* Main content */}
      <div className="w-full max-w-4xl relative mt-8">
        <div key={step} className="component-enter">
          {renderStep()}
        </div>
      </div>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* AI assistant */}
      <AIAssistantButton isOpen={isAIOpen} setIsOpen={setIsAIOpen} />
    </div>
  );
}

export default App;