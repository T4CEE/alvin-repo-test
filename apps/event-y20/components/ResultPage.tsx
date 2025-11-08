import React from 'react';
import { ResultType } from '../types';
import { Y20_GOOGLE_FORM_URL } from '../constants';

interface ResultPageProps {
  type: ResultType;
}

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PlaneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

// Fix: Define a type for the result objects to handle the optional 'action' property.
interface ResultInfo {
  // Fix: Use React.ReactElement instead of JSX.Element to resolve namespace error.
  icon: React.ReactElement;
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
}

const ResultPage: React.FC<ResultPageProps> = ({ type }) => {
  const results: Record<ResultType, ResultInfo> = {
    [ResultType.UnregisteredSuccess]: {
      icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>,
      title: "Thank You for Your Interest",
      message: "We will handle your registration for the SU20 conference with Zoho Backstage and will be in touch shortly with more details.",
    },
    [ResultType.OnlineSuccess]: {
      icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>,
      title: "Attendance Confirmed",
      message: "Thank you for confirming your online attendance. We look forward to seeing you virtually!",
    },
    [ResultType.NotFlyingSuccess]: {
      icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>,
      title: "Information Received",
      message: "Thanks! We've received your travel information and will be in touch as the event nears.",
    },
    [ResultType.FinalSuccess]: {
      icon: <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>,
      title: "Success!",
      message: "Your information has been successfully submitted. Thanks! We'll be in touch as the event nears.",
    },
    [ResultType.RedirectToOBT]: {
      icon: <PlaneIcon className="w-16 h-16 text-alvin-blue mx-auto mb-4"/>,
      title: "Book Your Flight",
      message: "Please proceed to our Online Booking Tool to arrange your travel. A joint Y20xSU20 branded portal is ready for you.",
      action: {
        label: "Go to Alvin Travel",
        url: Y20_GOOGLE_FORM_URL,
      }
    },
  };

  const { icon, title, message, action } = results[type];

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in-up">
      {icon}
      <h2 className="text-2xl font-bold text-alvin-gray-800 mb-2">{title}</h2>
      <p className="text-alvin-gray-600 mb-8">{message}</p>
      
      {action && (
        <a
          href={action.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-alvin-gold text-alvin-blue font-bold py-3 px-8 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alvin-gold transition-transform transform hover:scale-105"
        >
          {action.label}
        </a>
      )}
    </div>
  );
};

export default ResultPage;