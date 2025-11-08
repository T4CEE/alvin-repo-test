import React, { useState } from 'react';
import { FormData } from '../types';

interface PersonalDetailsPageProps {
  onNext: (data: Omit<FormData, 'registrationStatus' | 'attendanceType' | 'travelMethod' | 'flightDetails'>) => void;
  onBack: () => void;
}

type FormFields = Omit<FormData, 'registrationStatus' | 'attendanceType' | 'travelMethod' | 'flightDetails'>;

const PersonalDetailsPage: React.FC<PersonalDetailsPageProps> = ({ onNext, onBack }) => {
  const [details, setDetails] = useState<FormFields>({
    firstName: '',
    surname: '',
    email: '',
    countryCode: '',
    contactNumber: '',
    country: '',
    organization: '',
    passportNumber: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    if(errors[name as keyof FormFields]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};
    Object.keys(details).forEach(keyStr => {
      const key = keyStr as keyof FormFields;
      if (!details[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(details);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up">
      <h2 className="text-2xl font-bold text-alvin-gray-800 mb-1">Personal Details</h2>
      <p className="text-alvin-gray-500 mb-6">Please provide your information as it appears on your official documents.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" name="firstName" value={details.firstName} onChange={handleChange} error={errors.firstName} />
          <InputField label="Surname" name="surname" value={details.surname} onChange={handleChange} error={errors.surname} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Country Code" name="countryCode" placeholder="+1" value={details.countryCode} onChange={handleChange} error={errors.countryCode} />
            <InputField label="Contact Number" name="contactNumber" type="tel" value={details.contactNumber} onChange={handleChange} error={errors.contactNumber} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Email" name="email" value={details.email} onChange={handleChange} error={errors.email} />
        <InputField label="Country" name="country" value={details.country} onChange={handleChange} error={errors.country} />
        </div>
        <InputField label="Organization" name="organization" value={details.organization} onChange={handleChange} error={errors.organization} />
        <InputField label="Passport Number" name="passportNumber" value={details.passportNumber} onChange={handleChange} error={errors.passportNumber} />
        
        <div className="pt-4 flex space-x-4">
          {/* <button
            type="button"
            onClick={onBack}
            className="w-full bg-alvin-gray-300 text-alvin-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-alvin-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alvin-gray-400 transition-transform transform hover:scale-105"
          >
            Back
          </button> */}
          <button
            type="submit"
            className="w-full bg-su20-green text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-su20-green transition-transform transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, error, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-alvin-gray-700">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
            className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-alvin-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-alvin-blue focus:border-alvin-blue sm:text-sm transition`}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export default PersonalDetailsPage;