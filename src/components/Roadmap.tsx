type Props = {
    job: string | null;
  };
  
  function Roadmap({ job }: Props) {
    if (!job) return <p className="text-center">Ошибка: профессия не выбрана</p>;
  
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Твой карьерный роадмап</h2>
        <p className="text-lg mb-2 text-blue-700">{job}</p>
        <p>📌 Неделя 1–2: Изучить основы через YouTube / freeCodeCamp</p>
        <p>📌 Неделя 3–4: Пройти интерактивный курс на Coursera</p>
        <p>📌 Неделя 5–8: Сделать мини-проект и выложить на GitHub</p>
        <p>📌 Неделя 9–12: Подготовка к собеседованиям, LeetCode, резюме</p>
        <p className="mt-4 text-gray-500">🔥 Ссылки можно сгенерировать через GPT или вставить руками</p>
      </div>
    );
  }
  
  export default Roadmap;
  