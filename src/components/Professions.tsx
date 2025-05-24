import { useState, useEffect } from 'react';

type Props = {
  answers: string[];
  userInfo: string; // Add userInfo to props
  userSkills: string[]; // Add userSkills to props
  setSelectedJob: (job: string) => void;
  onNext: () => void;
  accessToken: string | null; // Add accessToken to props
};

function Professions({ answers, userInfo, userSkills, setSelectedJob, onNext, accessToken }: Props) {
  const [suggestedJobs, setSuggestedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessions = async () => {
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
            questions: [], // The backend sample doesn't use these for suitable_professions, but include for completeness
            answers: answers,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuggestedJobs(data.suitable_professions || []);
      } catch (e: any) {
        setError(`Failed to fetch professions: ${e.message}`);
        console.error("Error fetching professions:", e);
        // Fallback to mock data if API fails
        setSuggestedJobs([
          'Frontend Developer',
          'Backend Developer',
          'UX Designer',
          'Data Analyst',
          'Marketing Specialist',
          'Game Designer',
          'Project Manager',
          'Technical Writer',
        ].slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, [answers, userInfo, userSkills, accessToken]);

  const handleClick = (job: string) => {
    setSelectedJob(job);
    onNext();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in text-center">
        <p className="text-xl font-medium text-blue-600">Загрузка подходящих профессий... 🚀</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in text-center">
        <p className="text-xl font-medium text-red-500">Ошибка: {error}</p>
        <p className="text-gray-600 mt-2">Попробуйте еще раз или выберите из списка ниже.</p>
        <ul className="space-y-4 mt-6">
          {suggestedJobs.map((job) => ( // Display fallback jobs if error
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
        Основываясь на твоих ответах, мы подобрали наиболее подходящие варианты:
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
            Не удалось найти конкретных предложений. Вот несколько общих вариантов:
          </p>
        )}
      </ul>
      {/* If no suggestions from API, show all (or a default set) */}
      {suggestedJobs.length === 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => handleClick('Frontend Developer')} // Default to a common job if no suggestions
            className="text-blue-600 hover:underline text-sm"
          >
            Показать все варианты
          </button>
        </div>
      )}
    </div>
  );
}

export default Professions;