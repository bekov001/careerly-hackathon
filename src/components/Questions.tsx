import { useEffect, useState } from 'react';

type Question = {
  text: string;
  options: string[];
};

type Props = {
  userInfo: string;
  setQuestions: (q: string[]) => void;
  setAnswers: (a: string[]) => void;
  onNext: () => void;
  accessToken: string | null; // Add accessToken to props
};

function Questions({ userInfo, setQuestions, setAnswers, onNext, accessToken }: Props) {
  const [questions, setLocalQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setLocalAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const [error, setError] = useState<string | null>(null); // New state for errors

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userInfo || !accessToken) {
        setError("User info or access token is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await fetch('https://kajet24.work.gd/api/chat/questions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Use the passed accessToken
          },
          body: JSON.stringify({ about: userInfo }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data: { questions: Question[] } = await response.json();
        setLocalQuestions(data.questions);
        setQuestions(data.questions.map((q) => q.text)); // Update parent's questions state
      } catch (e: any) {
        console.error("Failed to fetch questions:", e);
        setError(e.message || "An unknown error occurred while fetching questions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [userInfo, setQuestions, accessToken]); // Re-run when userInfo or accessToken changes

  const handleOptionSelect = (option: string) => {
    const updatedAnswers = [...answers, option];
    setLocalAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setAnswers(updatedAnswers);
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[200px] animate-fade-in">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-lg font-semibold text-gray-700">ИИ обдумывает вопросы...</p>
        <style jsx>{`
          @keyframes bounce-dot {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
          }
          .animate-bounce-dot {
            animation: bounce-dot 1.2s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow-lg border border-gray-200 text-center text-red-600">
        <p>Error: {error}</p>
        <p>Please try again later or ensure you are logged in.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow-lg border border-gray-200 text-center">
        <p className="text-gray-700">No questions available.</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow-lg border border-gray-200 animate-fade-in">
      <div className="text-center mb-6">
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Вопрос {currentIndex + 1} из {questions.length}
        </span>
      </div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center animate-slide-in-up">
        {current.text}
      </h2>
      <div className="space-y-4">
        {current.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(option)}
            className="btn-secondary transition-all duration-300 transform hover:scale-102 hover:shadow-md"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Questions;
