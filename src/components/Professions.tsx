// src/components/Professions.tsx
import { useState, useEffect } from 'react';
import type { BackendAnalysisResponse } from '../types'// Import from shared types

type Props = {
  answers: string[];
  userInfo: string;
  userSkills: string[];
  setSelectedJob: (job: string) => void;
  onNext: () => void;
  accessToken: string | null;
  setAnalysisData: (data: BackendAnalysisResponse) => void; // New prop
};

function Professions({ answers, userInfo, userSkills, setSelectedJob, onNext, accessToken, setAnalysisData }: Props) {
  const [suggestedJobs, setSuggestedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionsAndAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://kajet24.work.gd/api/chat/analysis/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
          },
          body: JSON.stringify({
            skills: userSkills,
            about: userInfo,
            questions: [],
            answers: answers,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BackendAnalysisResponse = await response.json();
        setSuggestedJobs(data.suitable_professions || []);
        setAnalysisData(data); // Store the full analysis data in App's state

      } catch (e: any) {
        setError(`Failed to fetch professions and analysis: ${e.message}`);
        console.error("Error fetching professions and analysis:", e);
        setSuggestedJobs([ // Fallback suggestions
          'Frontend Developer', 'Backend Developer', 'UX Designer', 'Data Analyst', 'Project Manager'
        ]);
        // analysisData will remain null, Dashboard will handle it
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionsAndAnalysis();
  }, [answers, userInfo, userSkills, accessToken, setAnalysisData]);

  const handleClick = (job: string) => {
    setSelectedJob(job);
    onNext();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in text-center">
        <p className="text-xl font-medium text-blue-600">Загрузка подходящих профессий и анализ данных... 🚀</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in text-center">
        <p className="text-xl font-medium text-red-500">Ошибка: {error}</p>
        <p className="text-gray-600 mt-2">Попробуйте еще раз или выберите из списка ниже. Детальный анализ может быть недоступен.</p>
        <ul className="space-y-4 mt-6">
          {suggestedJobs.map((job) => (
            <li key={job}>
              <button
                onClick={() => handleClick(job)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-left text-blue-800 font-semibold shadow-sm hover:shadow-md transition duration-300 ease-in-out transform hover:scale-102 flex justify-between items-center"
              >
                <span>{job}</span>
                <span className="text-blue-500 text-sm">Выбрать →</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Твои потенциальные карьеры 🌟
      </h2>
      <p className="mb-6 text-gray-600 text-center">
        Основываясь на твоих ответах и предварительном анализе, мы подобрали наиболее подходящие варианты:
      </p>
      <ul className="space-y-4">
        {suggestedJobs.length > 0 ? (
          suggestedJobs.map((job) => (
            <li key={job}>
              <button
                onClick={() => handleClick(job)}
                className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-left text-blue-800 font-semibold shadow-sm hover:shadow-md transition duration-300 ease-in-out transform hover:scale-102 flex justify-between items-center"
              >
                <span>{job}</span>
                <span className="text-blue-500 text-sm">Узнать больше →</span>
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Не удалось найти предложений. Попробуйте изменить ответы или выберите из стандартных опций.
          </p>
        )}
      </ul>
      {suggestedJobs.length === 0 && !error && (
        <div className="mt-8 text-center">
          <button
            onClick={() => handleClick('Frontend Developer')} // Default example
            className="text-blue-600 hover:underline text-sm"
          >
            Выбрать Frontend Developer (Пример)
          </button>
        </div>
      )}
    </div>
  );
}

export default Professions;