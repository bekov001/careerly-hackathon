import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import React, { useState, useEffect } from 'react';
import type { BackendAnalysisResponse } from '../types'; // Import from shared types

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

type Props = {
  job: string | null;
  userInfo: string;
  answers: string[];
  userSkills: string[];
  accessToken: string | null;
  analysisData: BackendAnalysisResponse | null; // New prop for pre-fetched data
};

function Dashboard({ job, userInfo, answers, userSkills, accessToken, analysisData: analysisDataProp }: Props) {
  const [backendData, setBackendData] = useState<BackendAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If analysis data is passed as a prop, use it directly
    if (analysisDataProp) {
      if (!job) {
        setError('Ошибка: профессия не выбрана для отображения анализа 😔');
        setLoading(false);
        setBackendData(null);
        return;
      }
      setBackendData(analysisDataProp);
      setLoading(false);
      setError(null);
      // console.log("Dashboard using pre-fetched analysis data."); // For debugging
      return;
    }

    // Fallback: If analysisDataProp is not provided, fetch the data
    if (!job) {
      setError('Ошибка: профессия не выбрана 😔');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      // console.log("Dashboard is fetching analysis data itself..."); // For debugging
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
        setBackendData(data);
      } catch (e: any) {
        setError(`Не удалось загрузить данные: ${e.message}`);
        console.error("Error fetching analysis data in Dashboard:", e);
        // Fallback to sample data (existing logic)
        setBackendData({
            suitable_professions: ['Frontend Developer', 'Backend Developer'],
            vacancies: {
              'Frontend Developer': [
                { title: 'Junior Frontend Developer', company: 'Tech Solutions Inc.', salary: '250 000 - 400 000 KZT', link: 'https://hh.kz/vacancy/99123456' },
                { title: 'UX/UI Designer', company: 'Creative Agency', salary: '200 000 - 350 000 KZT', link: 'https://hh.kz/vacancy/99345678' },
              ],
              'Backend Developer': [
                { title: 'Python Backend Developer', company: 'Innovate Systems', salary: '300 000 - 550 000 KZT', link: 'https://hh.kz/vacancy/99234567' },
                { title: 'Data Analyst Intern', company: 'Global Analytics', salary: '150 000 - 250 000 KZT', link: 'https://hh.kz/vacancy/99456789' },
              ],
            },
            strengths: ['Problem Solving', 'Adaptability'],
            weaknesses: ['Lack of specific industry knowledge'],
            roadmap: [
              'Неделя 1–2: Изучить основы программирования...',
              'Неделя 3–4: Пройти онлайн-курс...',
              // ... (rest of your mock roadmap)
            ],
            pdf_links: {
              "Back-End Engineer": "https://roadmap.sh/pdfs/roadmaps/back-end.pdf",
              "Software Engineer": "https://roadmap.sh/pdfs/roadmaps/software-engineer.pdf",
               // ... (rest of your mock pdf_links)
            },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [job, userInfo, answers, userSkills, accessToken, analysisDataProp]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in-up text-center">
        <p className="text-xl font-medium text-blue-600">Загрузка твоего карьерного роадмапа... 🚀</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-lg font-medium">
        {error}
      </p>
    );
  }

  if (!backendData || !job) {
    return (
      <p className="text-center text-red-500 text-lg font-medium">
        Нет данных для отображения. Убедитесь, что профессия выбрана и данные загружены.
        {analysisDataProp === null && !loading && " (Предварительный анализ не был загружен.)"}
      </p>
    );
  }

  // --- Chart Data Definitions ---
  // You need to properly define these with 'labels' and 'datasets'
  const currentSkillRatings = [2, 1, 1, 3];
  const targetSkillRatings = [4, 3, 4, 5];

  const skillProficiencyChartData: ChartData<'bar'> = {
    labels: ['Коммуникация', 'Программирование', 'Анализ данных', 'Решение проблем'],
    datasets: [
      {
        label: 'Твой уровень',
        data: currentSkillRatings,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Целевой уровень',
        data: targetSkillRatings,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const skillProficiencyOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Оценка навыков',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  const roadmapPhaseFocusData: ChartData<'pie'> = {
    labels: ['Основы', 'Изучение', 'Практика', 'Развитие'],
    datasets: [
      {
        label: 'Распределение усилий',
        data: [20, 30, 40, 10], // Example data, adjust as needed
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const roadmapFocusOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Фокус на этапах роадмапа',
      },
    },
  };

  const knownSkillsChartData: ChartData<'bar'> = {
    labels: userSkills.length > 0 ? userSkills : ['Нет навыков'],
    datasets: [
      {
        label: 'Твои навыки',
        data: userSkills.length > 0 ? userSkills.map(() => 1) : [0], // Assign a default value, e.g., 1 for each skill
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const knownSkillsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Известные навыки',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Since we are just showing presence, max can be 1
        ticks: {
          display: false, // Hide y-axis ticks as they are not meaningful for simple presence
        },
      },
    },
  };

  const relevantVacancies = backendData.vacancies[job] || [];

  const getPdfLink = (jobTitle: string) => {
    const normalizedJobTitle = jobTitle.toLowerCase().replace(/dev(eloper)?|engineer/g, '').trim();
    if (backendData.pdf_links[jobTitle]) return backendData.pdf_links[jobTitle];
    if (normalizedJobTitle.includes('backend') || normalizedJobTitle.includes('back-end')) return backendData.pdf_links['Back-End Engineer'] || backendData.pdf_links['Software Engineer'];
    // Add more conditions if needed for other job titles
    return null;
  };
  const currentPdfLink = job ? getPdfLink(job) : null;

  const extractSalaryNumber = (salaryString: string | undefined | null): number => {
    if (!salaryString || typeof salaryString !== 'string') return 100000;
    const numbers = salaryString.match(/\d+/g);
    if (numbers && numbers.length > 0) return parseInt(numbers[0].replace(/\s/g, ''), 10);
    return 100000;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Твой индивидуальный карьерный роадмап 🚀</h2>
      <p className="text-xl mb-4 text-blue-700 font-semibold text-center">{job}</p>

      {/* Roadmap Steps */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Основные шаги на пути:</h3>
        <ul className="space-y-3 text-lg text-gray-700">
          {backendData.roadmap.length > 0 ? (
            backendData.roadmap.map((stepText, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">💡</span>
                <span>{stepText}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Шаги роадмапа не сгенерированы.</p>
          )}
        </ul>
        <p className="mt-6 text-gray-500 text-sm italic border-t pt-4">
          <span className="font-semibold">🔥 Совет:</span> Ссылки на конкретные курсы и ресурсы можно найти, используя сгенерированные ниже роадмапы.
        </p>
      </div>

      {/* User Input Summary */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Твои исходные данные:</h3>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-700">
          <p className="mb-2"><span className="font-semibold">О себе:</span> {userInfo}</p>
          <p className="mb-2"><span className="font-semibold">Ответы на вопросы:</span> {answers.join(', ')}</p>
          {userSkills.length > 0 && <p className="mb-2"><span className="font-semibold">Имеющиеся навыки:</span> {userSkills.join(', ')}</p>}
        </div>
      </div>

      {/* Strengths */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Твои сильные стороны:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
          {backendData.strengths.length > 0 ? (
            backendData.strengths.map((strength, idx) => <li key={idx}>{strength}</li>)
          ) : (
            <li>Не удалось определить сильные стороны.</li>
          )}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Области для улучшения:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
          {backendData.weaknesses.length > 0 ? (
            backendData.weaknesses.map((weakness, idx) => <li key={idx}>{weakness}</li>)
          ) : (
            <li>Не удалось определить области для улучшения.</li>
          )}
        </ul>
      </div>
      
      {/* Charts */}
      <div className="mt-8 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            <Bar data={skillProficiencyChartData} options={skillProficiencyOptions} />
            <p className="mt-4 text-gray-500 text-sm text-center">Сравнение твоей текущей оценки навыков с целевым уровнем.</p>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            <Pie data={roadmapPhaseFocusData} options={roadmapFocusOptions} />
            <p className="mt-4 text-gray-500 text-sm text-center">Рекомендуемое распределение усилий по этапам роадмапа.</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            {userSkills.length > 0 ? (
              <Bar data={knownSkillsChartData} options={knownSkillsChartOptions} />
            ) : (
              <p className="text-center text-gray-500 h-full flex items-center justify-center">Навыки не выбраны.</p>
            )}
            <p className="mt-4 text-gray-500 text-sm text-center">Визуализация твоих уже имеющихся навыков.</p>
          </div>
        </div>
      </div>

      {/* Vacancies */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Вакансии (Примеры) 💼</h3>
        <p className="mb-6 text-gray-600 text-center">Примеры вакансий на hh.kz на основе твоей профессии.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relevantVacancies.length > 0 ? (
            relevantVacancies.map((vacancy, idx) => {
              const salaryNumber = extractSalaryNumber(vacancy.salary);
              const searchUrl = `https://hh.kz/search/vacancy?text=${encodeURIComponent(vacancy.title)}&salary_from=${salaryNumber}&only_with_salary=true&enable_snippets=true&ored_clusters=true&hhtmFrom=vacancy_search_list`;
              return (
                <a 
                  key={idx} 
                  href={vacancy.link || searchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{vacancy.title}</h4>
                  <p className="text-gray-600 text-sm mb-1">{vacancy.company}</p>
                  <p className="text-green-600 font-bold text-md mb-3">{vacancy.salary || 'Зарплата не указана'}</p>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Перейти на hh.kz →
                  </button>
                </a>
              );
            })
          ) : (
            <p className="text-center text-gray-500 md:col-span-2">Вакансии для данной профессии не найдены.</p>
          )}
        </div>
      </div>

      {/* PDF Link */}
      <div className="mt-8 text-center">
        {currentPdfLink ? (
          <a
            href={currentPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Скачать Roadmap PDF для "{job}"
          </a>
        ) : (
          <button onClick={() => alert('PDF-роадмап для этой профессии пока недоступен.')} className="btn-primary opacity-70 cursor-not-allowed">
            Сгенерировать полезные ссылки
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;