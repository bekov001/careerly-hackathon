import React, { useState, useEffect } from 'react';
import './App.css'; // Import global styles

import Intro from './components/Intro';
import Questions from './components/Questions'; // Make sure this import is correct
import Skills from './components/Skills';
import Professions from './components/Professions';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal'; // Import AuthModal
import Header from './components/UI/Header'; // Import Header component
import AIAssistantButton from './components/UI/AIAssistantButton'; // Import AI Assistant button

function App() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showAuthModal, setShowAuthModal] = useState(false); // Control modal visibility
  const [accessToken, setAccessToken] = useState<string | null>(null); // Store access token

  // State for AI assistant
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Check login status on app load from localStorage
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

    // After successful login/register, if they just submitted Intro, proceed to next step
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
    setStep(1);
    setUserInfo('');
    setQuestions([]);
    setAnswers([]);
    setUserSkills([]);
    setSelectedJob(null);
  };

  // Helper function to render the current step component
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Intro
            onNext={() => {
              if (isLoggedIn) {
                setStep(2);
              } else {
                setShowAuthModal(true);
              }
            }}
            setUserInfo={setUserInfo}
          />
        );
      case 2:
        return (
          <Questions
            userInfo={userInfo}
            setQuestions={setQuestions}
            setAnswers={setAnswers}
            onNext={() => setStep(3)}
            accessToken={accessToken} // Pass the accessToken here
          />
        );
      case 3:
        return <Skills setUserSkills={setUserSkills} onNext={() => setStep(4)} />;
      case 4:
        return <Professions answers={answers} setSelectedJob={setSelectedJob} onNext={() => setStep(5)} />;
      case 5:
        return <Dashboard job={selectedJob} userInfo={userInfo} answers={answers} userSkills={userSkills} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center relative overflow-hidden font-inter"> {/* Removed py-8 */}
      {/* Header Component */}
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <div className="w-full max-w-4xl relative mt-8"> {/* Kept mt-8 for spacing between header and content */}
        <div key={step} className="component-enter">
          {renderStep()}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* AI Assistant Floating Button and Chat */}
      <AIAssistantButton isOpen={isAIOpen} setIsOpen={setIsAIOpen} />
    </div>
  );
}

export default App;
