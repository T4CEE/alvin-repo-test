import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiChoicePageProps {
  title: string;
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  onBack: () => void;
}

const MultiChoicePage: React.FC<MultiChoicePageProps> = ({ title, question, options, onSelect, onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in-up">
      <h2 className="text-2xl font-bold text-alvin-gray-800 mb-2">{title}</h2>
      <p className="text-alvin-gray-600 mb-8">{question}</p>
      
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="w-full text-left p-4 border border-alvin-gray-300 rounded-lg hover:bg-su20-green hover:border-su20-green focus:outline-none focus:ring-2 focus:ring-su20-green transition group"
          >
            <span className="font-semibold text-lg text-alvin-gray-700 group-hover:text-white">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={onBack}
          className="w-full bg-alvin-gray-300 text-alvin-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-alvin-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alvin-gray-400 transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MultiChoicePage;