import { useState, useEffect } from 'react';

type Props = {
  answers: string[];
  setSelectedJob: (job: string) => void;
  onNext: () => void;
};

function Professions({ answers, setSelectedJob, onNext }: Props) {
  const [suggestedJobs, setSuggestedJobs] = useState<string[]>([]);
  const allJobs = ['Frontend Developer', 'Backend Developer', 'UX Designer', 'Data Analyst', 'Marketing Specialist', 'Game Designer', 'Project Manager', 'Technical Writer'];

  useEffect(() => {
    // Simple mock logic for job suggestion based on answers
    const generateSuggestions = () => {
      const suggestions = new Set<string>();

      if (answers.includes('Решать логические задачи') || answers.includes('Точные науки (математика, физика)')) {
        suggestions.add('Frontend Developer');
        suggestions.add('Backend Developer');
        suggestions.add('Data Analyst');
      }
      if (answers.includes('Творить и придумывать новое') || answers.includes('Искусство и дизайн')) {
        suggestions.add('UX Designer');
        suggestions.add('Game Designer');
      }
      if (answers.includes('Помогать людям') || answers.includes('Взаимодействовать с клиентами')) {
        suggestions.add('Project Manager');
        suggestions.add('Marketing Specialist');
      }
      if (answers.includes('Структурировать информацию')) {
        suggestions.add('Technical Writer');
        suggestions.add('Data Analyst');
      }

      // Fallback if no specific suggestions
      if (suggestions.size === 0) {
        return allJobs.slice(0, 3); // Show first 3 jobs if no strong match
      }

      return Array.from(suggestions).slice(0, 5); // Limit to top 5 suggestions
    };

    setSuggestedJobs(generateSuggestions());
  }, [answers]);

  const handleClick = (job: string) => {
    setSelectedJob(job);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Твои потенциальные профессии 🌟</h2>
      <p className="mb-6 text-gray-600 text-center">На основе твоих ответов мы подобрали наиболее подходящие варианты:</p>
      <ul className="space-y-4">
        {suggestedJobs.map((job) => (
          <li key={job}>
            <button
              onClick={() => handleClick(job)}
              className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-left text-blue-800 font-semibold shadow-sm hover:shadow-md transition duration-300 ease-in-out transform hover:scale-102 flex justify-between items-center"
            >
              <span>{job}</span>
              <span className="text-blue-500 text-sm">Узнать больше →</span>
            </button>
          </li>
        ))}
      </ul>
      {suggestedJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Не удалось найти конкретных предложений. Вот несколько общих вариантов:</p>
      )}
      <div className="mt-8 text-center">
        <button onClick={() => handleClick(allJobs[0])} className="text-blue-600 hover:underline text-sm">
          Показать все варианты
        </button>
      </div>
    </div>
  );
}

export default Professions;