import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  job: string | null;
  userInfo: string;
  answers: string[];
  userSkills: string[]; // New prop
};

function Dashboard({ job, userInfo, answers, userSkills }: Props) {
  if (!job)
    return <p className="text-center text-red-500 text-lg font-medium">Ошибка: профессия не выбрана 😔</p>;

  // Mock data for skill proficiency (would be dynamic in a real app)
  const skillData = {
    labels: ['Основы программирования', 'Алгоритмы', 'Инструменты', 'Soft Skills'],
    datasets: [
      {
        label: 'Твоя текущая оценка',
        data: [2, 1, 1, 3], // Example: 1-5 scale
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue-500
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Example: How to use userSkills for a chart (mocking it for now)
  const knownSkillsChartData = {
    labels: userSkills.length > 0 ? userSkills.slice(0, 5) : ['Нет выбранных навыков'], // Show up to 5 known skills
    datasets: [
      {
        label: 'Имеющиеся навыки',
        data: userSkills.length > 0 ? userSkills.slice(0, 5).map(() => 100) : [0], // Represent as 100% known
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // emerald-500
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const skillOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Оценка ключевых навыков (старт)',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: function (value: number) {
            if (value === 1) return 'Начальный';
            if (value === 2) return 'Базовый';
            if (value === 3) return 'Средний';
            if (value === 4) return 'Хороший';
            if (value === 5) return 'Эксперт';
            return '';
          },
        },
      },
    },
  };

  const knownSkillsChartOptions = {
    responsive: true,
    indexAxis: 'y' as const, // Horizontal bar chart
    plugins: {
      legend: {
        display: false,
      },
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
          callback: function (value: number) {
            return value + '%';
          },
        },
      },
    },
  };


  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Твой индивидуальный карьерный роадмап 🚀</h2>
      <p className="text-xl mb-4 text-blue-700 font-semibold text-center">{job}</p>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Основные шаги на пути:</h3>
        <ul className="space-y-3 text-lg text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">💡</span>
            <span>
              <span className="font-semibold">Неделя 1–2:</span> Изучить основы выбранной сферы через YouTube / freeCodeCamp. Фокус на базовых концепциях.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">📚</span>
            <span>
              <span className="font-semibold">Неделя 3–4:</span> Пройти интерактивный курс на Coursera, Udemy или Stepik. Получить сертификат.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">🛠️</span>
            <span>
              <span className="font-semibold">Неделя 5–8:</span> Реализовать мини-проект(ы) для портфолио и выложить на GitHub. Применить полученные знания на практике.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">🎯</span>
            <span>
              <span className="font-semibold">Неделя 9–12:</span> Подготовка к собеседованиям (LeetCode, технические вопросы), составление резюме и сопроводительного письма.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">🤝</span>
            <span>
              <span className="font-semibold">Неделя 13+:</span> Активный поиск работы, нетворкинг, прохождение собеседований и начало нового пути!
            </span>
          </li>
        </ul>
        <p className="mt-6 text-gray-500 text-sm italic border-t pt-4">
          <span className="font-semibold">🔥 Совет:</span> Ссылки на конкретные курсы и ресурсы можно сгенерировать через GPT или найти вручную.
        </p>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Твои исходные данные:</h3>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-700">
          <p className="mb-2"><span className="font-semibold">О себе:</span> {userInfo}</p>
          <p className="mb-2"><span className="font-semibold">Ответы на вопросы:</span> {answers.join(', ')}</p>
          {userSkills.length > 0 && (
            <p className="mb-2"><span className="font-semibold">Имеющиеся навыки:</span> {userSkills.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
          <Bar data={skillData as ChartData<'bar'>} options={skillOptions as ChartOptions<'bar'>} />
            <p className="mt-4 text-gray-500 text-sm text-center">
              Эта диаграмма показывает твою стартовую оценку по ключевым навыкам, важным для выбранной профессии.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col justify-between">
            {userSkills.length > 0 ? (
              <Bar data={knownSkillsChartData as ChartData<'bar'>} options={knownSkillsChartOptions as ChartOptions<'bar'>} />

            ) : (
              <p className="text-center text-gray-500 h-full flex items-center justify-center">
                Навыки не выбраны. Вернись на страницу "Навыки" и добавь их!
              </p>
            )}
            <p className="mt-4 text-gray-500 text-sm text-center">
              Визуализация навыков, которые ты отметил как уже известные.
            </p>
          </div>
        </div>
      </div>


      <div className="mt-8 text-center">
        <button onClick={() => alert('Функция генерации ссылок будет добавлена позже!')} className="btn-primary">
          Сгенерировать полезные ссылки
        </button>
      </div>
    </div>
  );
}

export default Dashboard;