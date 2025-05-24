import React, { useState } from 'react';
// Make sure to import all necessary authentication functions
import { registerUser, loginUser, loginWithGoogleBackend } from '../api/auth';
import { signInWithGoogle } from '../api/firebaseAuth';

type AuthMode = 'login' | 'register';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // This prop expects an object containing both access and refresh tokens
  onAuthSuccess: (tokens: { access: string; refresh: string }) => void;
};

function AuthModal({ isOpen, onClose, onAuthSuccess }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Unified submit: handles both login and register + auto-login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const regResult = await registerUser(username, password);
        if (!regResult.success) {
          setError(regResult.message);
          setLoading(false);
          return;
        }
        // Auto-login after successful registration
        const loginResult = await loginUser(username, password);
        setLoading(false);
        if (loginResult.success && loginResult.token) {
          setSuccessMessage('Регистрация и вход выполнены успешно!');
          onAuthSuccess(loginResult.token);
          onClose();
        } else {
          setError(loginResult.message || 'Ошибка при автоматическом входе после регистрации.');
        }
      } else {
        // Traditional login
        const loginResult = await loginUser(username, password);
        setLoading(false);
        if (loginResult.success && loginResult.token) {
          setSuccessMessage(loginResult.message);
          onAuthSuccess(loginResult.token);
          // Optionally close modal here
          onClose();
        } else {
          setError(loginResult.message);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('Error during auth submission:', err);
      setError('Произошла ошибка при подключении к серверу. Попробуйте снова.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const firebaseResult = await signInWithGoogle();
      if (firebaseResult.success && firebaseResult.token) {
        setSuccessMessage(firebaseResult.message);
        const backendAuthResult = await loginWithGoogleBackend(firebaseResult.token);
        if (backendAuthResult.success && backendAuthResult.token) {
          setSuccessMessage(backendAuthResult.message);
          onAuthSuccess(backendAuthResult.token);
          onClose();
        } else {
          setError(backendAuthResult.message);
        }
      } else {
        setError(firebaseResult.message);
      }
    } catch (err) {
      console.error('Error during Google sign-in process:', err);
      setError('Произошла ошибка при входе через Google. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"><span>{error}</span></div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"><span>{successMessage}</span></div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm mb-2">Имя пользователя:</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm mb-2">Пароль:</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-4 text-gray-500 text-sm">или</span>
          <div className="flex-grow border-t"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : <><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" className="w-5 h-5 mr-2"/>Войти через Google</>}
        </button>

        <p className="text-center text-gray-600 mt-4">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setSuccessMessage('');
              setUsername('');
              setPassword('');
            }}
            className="text-blue-600 hover:underline ml-1"
            disabled={loading}
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
