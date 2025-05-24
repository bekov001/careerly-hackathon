import React, { useState } from 'react';

type Props = {
  onNext: () => void; // This onNext will now handle showing the modal or proceeding
  setUserInfo: (info: string) => void;
};

function Intro({ onNext, setUserInfo }: Props) {
  const [wordCountError, setWordCountError] = useState<string | null>(null); // State for word count error

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const info = (form.elements.namedItem('info') as HTMLTextAreaElement).value;

    // Calculate word count
    const words = info.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 10) {
      setWordCountError('Пожалуйста, расскажите о себе подробнее (минимум 10 слов).');
      return; // Prevent form submission
    }

    setWordCountError(null); // Clear any previous error
    setUserInfo(info);
    onNext(); // This now triggers the logic in App.tsx
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Расскажи немного о себе 👋</h2>
        <p className="text-gray-600 text-center mb-6">Это поможет нам лучше понять твои интересы и предложить подходящие карьерные пути.</p>
        <div className="mb-6">
          <label htmlFor="info" className="block text-gray-700 text-sm font-medium mb-2 sr-only">
            Информация о себе
          </label>
          <textarea
            id="info"
            name="info"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition duration-300 ease-in-out resize-y focus:shadow-lg"
            placeholder="Например: Я люблю программировать и увлекаюсь изучением новых технологий. В школе мне нравилась математика, а в свободное время я читаю фэнтези и играю в настольные игры. Хочу найти работу, где смогу постоянно развиваться и приносить пользу..."
            required
          />
          {wordCountError && (
            <p className="text-red-500 text-sm mt-2 text-center">{wordCountError}</p>
          )}
        </div>
        <button type="submit" className="btn-primary">
          Далее
        </button>
      </form>
    </div>
  );
}

export default Intro;
