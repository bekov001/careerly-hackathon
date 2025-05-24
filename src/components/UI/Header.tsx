import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  // New prop: A function to call when the login button is clicked
  onLoginClick: () => void;
}

function Header({ isLoggedIn, onLogout, onLoginClick }: HeaderProps) {
  return (
    // Removed specific padding (p-5) and rounded corners (rounded-2xl)
    // to make it span full width and without margins.
    // 'w-full' already ensures full width.
    <header className="w-full bg-white bg-opacity-95 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center px-6 py-4">
      <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">
        Careerly
      </h1>
      {/* Conditional rendering for Login or Logout button */}
      {isLoggedIn ? (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-full text-base font-medium transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Выйти
        </button>
      ) : (
        <button
          onClick={onLoginClick} // Call the new onLoginClick prop
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-full text-base font-medium transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Войти
        </button>
      )}
    </header>
  );
}

export default Header;