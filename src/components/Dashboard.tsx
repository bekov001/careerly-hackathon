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

// Register all necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Props = {
  job: string | null;
  userInfo: string;
  answers: string[];
  userSkills: string[];
  accessToken: string | null;
};

// Define an interface for the backend response structure
interface BackendAnalysisResponse {
  suitable_professions: string[];
  vacancies: {
    [key: string]: {
      title: string;
      company: string;
      salary: string;
      link?: string; // Add link field if backend provides it, otherwise we'll mock it
    }[];
  };
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
  pdf_links: {
    [key: string]: string;
  };
}

function Dashboard({ job, userInfo, answers, userSkills, accessToken }: Props) {
  const [backendData, setBackendData] = useState<BackendAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!job) {
      setError('Ошибка: профессия не выбрана 😔');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
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

        const data: BackendAnalysisResponse = await response.json();
        setBackendData(data);
      } catch (e: any) {
        setError(`Не удалось загрузить данные: ${e.message}`);
        console.error("Error fetching analysis data:", e);
        // Fallback to sample data if API fails
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
            'Неделя 1–2: Изучить основы программирования (например, Python или JavaScript) и основные концепции разработки ПО.',
            'Неделя 3–4: Пройти онлайн-курс по основам вашей выбранной профессии (например, "Введение во Frontend" или "Основы Data Science").',
            'Неделя 5–8: Создать 1-2 простых проекта для портфолио, используя базовые знания.',
            'Неделя 9–12: Углубиться в специализированные инструменты и фреймворки (например, React для Frontend, Django для Backend, Figma для UX).',
            'Неделя 13–16: Реализовать более сложный проект, который продемонстрирует ваши продвинутые навыки.',
            'Неделя 17–20: Подготовиться к собеседованиям, решить алгоритмические задачи, составить резюме и сопроводительное письмо.',
            'Неделя 21+: Активно искать работу, проходить собеседования и налаживать связи в индустрии.',
          ],
          pdf_links: {
            "Back-End Engineer": "https://roadmap.sh/pdfs/roadmaps/back-end.pdf",
            "Software Engineer": "https://roadmap.sh/pdfs/roadmaps/software-engineer.pdf",
            "Python Developer": "https://roadmap.sh/pdfs/roadmaps/python.pdf",
            "API Developer": "https://roadmap.sh/pdfs/roadmaps/rest-apis.pdf",
            "Django Developer": "https://roadmap.sh/pdfs/roadmaps/django.pdf",
            // Add other common roles if needed for fallback
            "Frontend Developer": "https://roadmap.sh/pdfs/roadmaps/frontend.pdf",
            "UX Designer": "https://roadmap.sh/pdfs/roadmaps/ux-design.pdf",
            "Data Analyst": "https://roadmap.sh/pdfs/roadmaps/data-scientist.pdf", // Closest for Data Analyst
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [job, userInfo, answers, userSkills, accessToken]);

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
        Нет данных для отображения. Пожалуйста, убедитесь, что профессия выбрана и данные загружены.
      </p>
    );
  }

  const currentSkillRatings = [2, 1, 1, 3]; // Mock data for now, as backend doesn't provide it
  const targetSkillRatings = [4, 3, 4, 5]; // Mock data for now, as backend doesn't provide it

  // Mock data for roadmap phase focus (e.g., in percentages of total learning time)
  const roadmapPhaseFocusData = {
    labels: ['Основы', 'Курсы', 'Проекты', 'Подготовка', 'Поиск работы'],
    datasets: [
      {
        label: 'Рекомендуемое распределение усилий',
        data: [20, 25, 30, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Skill Proficiency Comparison Chart Data
  const skillProficiencyChartData = {
    labels: ['Основы программирования', 'Алгоритмы', 'Инструменты', 'Soft Skills'],
    datasets: [
      {
        label: 'Твоя текущая оценка',
        data: currentSkillRatings,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Целевая оценка',
        data: targetSkillRatings,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for Skill Proficiency Comparison Chart
  const skillProficiencyOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Оценка навыков: Текущая vs. Целевая',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: (value) => {
            const v = Number(value);
            switch (v) {
              case 1: return 'Начальный';
              case 2: return 'Базовый';
              case 3: return 'Средний';
              case 4: return 'Хороший';
              case 5: return 'Эксперт';
              default: return '';
            }
          },
        },
      },
    },
  };

  // Options for Roadmap Phase Focus Chart
  const roadmapFocusOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'Фокус по этапам роадмапа',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  // Existing Known Skills Chart Data
  const knownSkillsChartData = {
    labels: userSkills.length > 0 ? userSkills.slice(0, 5) : ['Нет выбранных навыков'],
    datasets: [
      {
        label: 'Имеющиеся навыки',
        data: userSkills.length > 0 ? userSkills.slice(0, 5).map(() => 100) : [0],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const knownSkillsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Твои уже имеющиеся навыки',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const relevantVacancies = backendData.vacancies[job] || [];

  // Determine the PDF link for the current job, considering variations
  const getPdfLink = (jobTitle: string) => {
    // Normalize job title to match keys in pdf_links, e.g., "Back-End Engineer" vs "Backend Developer"
    const normalizedJobTitle = jobTitle.toLowerCase().replace(/dev(eloper)?|engineer/g, '').trim();

    // Check direct match
    if (backendData.pdf_links[jobTitle]) {
      return backendData.pdf_links[jobTitle];
    }
    // Check for "Backend" or "Python" if job is related
    if (normalizedJobTitle.includes('backend') || normalizedJobTitle.includes('back-end')) {
      return backendData.pdf_links['Back-End Engineer'] || backendData.pdf_links['Software Engineer'];
    }
    if (normalizedJobTitle.includes('python')) {
      return backendData.pdf_links['Python Developer'];
    }
    if (normalizedJobTitle.includes('software')) {
        return backendData.pdf_links['Software Engineer'];
    }
    if (normalizedJobTitle.includes('frontend') || normalizedJobTitle.includes('front-end')) {
        return backendData.pdf_links['Frontend Developer'];
    }
    if (normalizedJobTitle.includes('data analyst')) {
        return backendData.pdf_links['Data Analyst'];
    }
    if (normalizedJobTitle.includes('ux') || normalizedJobTitle.includes('ui')) {
        return backendData.pdf_links['UX Designer'];
    }
    if (normalizedJobTitle.includes('api')) {
      return backendData.pdf_links['API Developer'];
    }
    if (normalizedJobTitle.includes('django')) {
        return backendData.pdf_links['Django Developer'];
    }

    // Fallback to a generic or null if no match
    return null;
  };

  const currentPdfLink = job ? getPdfLink(job) : null;

  // Helper function to safely extract salary number from salary string
  const extractSalaryNumber = (salaryString: string | undefined | null): number => {
    if (!salaryString || typeof salaryString !== 'string') {
      return 100000; // Default fallback salary
    }
    
    // Try to find numbers in the salary string
    const numbers = salaryString.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      // Take the first number found and convert to integer
      return parseInt(numbers[0].replace(/\s/g, ''), 10);
    }
    
    return 100000; // Default fallback salary
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Твой индивидуальный карьерный роадмап 🚀</h2>
      <p className="text-xl mb-4 text-blue-700 font-semibold text-center">{job}</p>

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

      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Твои исходные данные:</h3>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-700">
          <p className="mb-2"><span className="font-semibold">О себе:</span> {userInfo}</p>
          <p className="mb-2"><span className="font-semibold">Ответы на вопросы:</span> {answers.join(', ')}</p>
          {userSkills.length > 0 && <p className="mb-2"><span className="font-semibold">Имеющиеся навыки:</span> {userSkills.join(', ')}</p>}
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Твои сильные стороны:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
          {backendData.strengths.length > 0 ? (
            backendData.strengths.map((strength, idx) => (
              <li key={idx}>{strength}</li>
            ))
          ) : (
            <li>Не удалось определить сильные стороны.</li>
          )}
        </ul>
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Области для улучшения:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
          {backendData.weaknesses.length > 0 ? (
            backendData.weaknesses.map((weakness, idx) => (
              <li key={idx}>{weakness}</li>
            ))
          ) : (
            <li>Не удалось определить области для улучшения.</li>
          )}
        </ul>
      </div>

      <div className="mt-8 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skill Proficiency Chart */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            <Bar data={skillProficiencyChartData as ChartData<'bar'>} options={skillProficiencyOptions as ChartOptions<'bar'>} />
            <p className="mt-4 text-gray-500 text-sm text-center">Сравнение твоей текущей оценки навыков с целевым уровнем для выбранной профессии.</p>
          </div>
        </div>

        {/* Roadmap Focus Pie Chart */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            <Pie data={roadmapPhaseFocusData as ChartData<'pie'>} options={roadmapFocusOptions as ChartOptions<'pie'>} />
            <p className="mt-4 text-gray-500 text-sm text-center">Рекомендуемое распределение усилий по этапам твоего карьерного роадмапа.</p>
          </div>
        </div>

        {/* Known Skills Chart */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            {userSkills.length > 0 ? (
              <Bar data={knownSkillsChartData as ChartData<'bar'>} options={knownSkillsChartOptions as ChartOptions<'bar'>} />
            ) : (
              <p className="text-center text-gray-500 h-full flex items-center justify-center">Навыки не выбраны. Вернись на страницу "Навыки" и добавь их!</p>
            )}
            <p className="mt-4 text-gray-500 text-sm text-center">Визуализация навыков, которые ты отметил как уже известные.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Вакансии (Примеры) 💼</h3>
        <p className="mb-6 text-gray-600 text-center">Вот несколько примеров вакансий на основе твоей выбранной профессии и навыков. Нажми, чтобы перейти на hh.kz!</p>
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
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    Перейти на hh.kz →
                  </button>
                </a>
              );
            })
          ) : (
            <p className="text-center text-gray-500 md:col-span-2">Вакансии для данной профессии не найдены.</p>
          )}
        </div>
        <p className="mt-6 text-center text-gray-500 text-sm italic">Обрати внимание: это примеры вакансий. Для более точного поиска используй фильтры на hh.kz.</p>
      </div>

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