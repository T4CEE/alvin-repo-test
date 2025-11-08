import React, { useState } from 'react';

interface HomePageProps {
  onAuthenticated: () => void;
}

const PASSWORD = "Y20G20SS77"

const HomePage: React.FC<HomePageProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setError('');
      onAuthenticated();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in-up">
      <img src="https://g20.org/wp-content/uploads/2024/11/G20SA-Logo-28Oct_VertiFColour-1.png" alt="G20 South Africa Logo" className="mx-auto mb-6 h-32 w-auto"/>
      <h2 className="text-2xl font-bold text-alvin-gray-800 mb-2">
        Welcome to the G20 South Africa
        <br />
        2025 Social Summit!
      </h2>
      <p className="text-alvin-gray-600 mb-6">Please enter the password from your invitation email to proceed.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <div>
            <label htmlFor="password-input" className="sr-only">Password</label>
            <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-alvin-gray-300 rounded-lg focus:ring-2 focus:ring-alvin-blue focus:border-alvin-blue transition"
            />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-su20-green text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-su20-green transition-transform transform hover:scale-105"
        >
          Proceed
        </button>
      </form>
    </div>
  );
};

export default HomePage;