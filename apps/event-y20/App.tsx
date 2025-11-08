import React, { useState, useCallback } from "react";
import { Page, FormData, ResultType } from "./types";
import HomePage from "./components/HomePage";
import PersonalDetailsPage from "./components/PersonalDetailsPage";
import MultiChoicePage from "./components/MultiChoicePage";
import FlightDetailsPage from "./components/FlightDetailsPage";
import ResultPage from "./components/ResultPage";
// import ChatBot from "./components/ChatBot";
import { submitRegistration } from "./services/geminiService";

const Header: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => (
  <header className="bg-su20-green shadow-md">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
          onClick={onGoHome}
          role="button"
          aria-label="Go to homepage"
        >
          <img
            src="https://framerusercontent.com/images/6QxYuP8TGVnJoYAd6LsHTF7dbLY.png?width=1080&height=819"
            alt="SU20 South Africa 2025 Logo"
            className="h-20 md:h-24 object-contain"
          />
        </div>
        <div className="text-right">
          <img
            src="https://framerusercontent.com/images/OIMMKTHRWVTk6hG95tjnpG1As8.png?width=653&height=382"
            alt="Alvin Events Logo"
            className="h-12 md:h-14 object-contain"
          />
        </div>
      </div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-white mt-auto py-4">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-alvin-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Alvin Technologies (Pty.) Ltd. All rights reserved. Technology
      Official technology partner for the G20's Y20 engagement group.
    </div>
  </footer>
);

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-alvin-gray-200 rounded-full h-2.5 mb-8">
      <div
        className="bg-su20-green h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [pageHistory, setPageHistory] = useState<Page[]>([]);

  const totalSteps = 6;
  const pageToStepMap = {
    [Page.Home]: 0,
    [Page.PersonalDetails]: 1,
    [Page.RegistrationStatus]: 2,
    [Page.AttendanceType]: 3,
    [Page.TravelDetails]: 4,
    [Page.FlightDetails]: 5,
    [Page.Result]: 6,
  };

  const handleGoHome = useCallback(() => {
    setCurrentPage(Page.Home);
    setFormData({});
    setResultType(null);
    setPageHistory([]);
  }, []);

  const handleGoBack = useCallback(() => {
    setPageHistory(prev => {
      const newHistory = [...prev];
      const lastPage = newHistory.pop();
      if (lastPage) {
        setCurrentPage(lastPage);
      }
      return newHistory;
    });
  }, []);

  const updateFormDataAndNavigate = useCallback(
    (data: Partial<FormData>, nextPage: Page, resType?: ResultType) => {
      setPageHistory(prev => [...prev, currentPage]);
      const newFormData = { ...formData, ...data };
      setFormData(newFormData);
      setCurrentPage(nextPage);
      if (resType !== undefined) {
        setResultType(resType);
      }

      if (nextPage === Page.Result) {
        submitRegistration(newFormData);
      }
    },
    [formData, currentPage]
  );

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <HomePage
            onAuthenticated={() => setCurrentPage(Page.PersonalDetails)}
          />
        );
      case Page.PersonalDetails:
        return (
          <PersonalDetailsPage
            onNext={(data) =>
              updateFormDataAndNavigate(data, Page.RegistrationStatus)
            }
            onBack={handleGoBack}
          />
        );
      case Page.RegistrationStatus:
        return (
          <MultiChoicePage
            title="Registration Status"
            question="Have you already registered for the summit?"
            options={[
              { label: "I have registered", value: "registered" },
              { label: "I have not yet registered", value: "not_registered" },
            ]}
            onSelect={(value) => {
              if (value === "registered") {
                updateFormDataAndNavigate(
                  { registrationStatus: "registered" },
                  Page.AttendanceType
                );
              } else {
                updateFormDataAndNavigate(
                  { registrationStatus: "not_registered" },
                  Page.Result,
                  ResultType.UnregisteredSuccess
                );
              }
            }}
            onBack={handleGoBack}
          />
        );
      case Page.AttendanceType:
        return (
          <MultiChoicePage
            title="Attendance Type"
            question="How will you be attending the conference?"
            options={[
              { label: "In-Person", value: "in_person" },
              { label: "Online", value: "online" },
            ]}
            onSelect={(value) => {
              if (value === "in_person") {
                updateFormDataAndNavigate(
                  { attendanceType: "in_person" },
                  Page.TravelDetails
                );
              } else {
                updateFormDataAndNavigate(
                  { attendanceType: "online" },
                  Page.Result,
                  ResultType.OnlineSuccess
                );
              }
            }}
            onBack={handleGoBack}
          />
        );
      case Page.TravelDetails:
        return (
          <MultiChoicePage
            title="Travel Plans"
            question="How are you traveling to the event?"
            options={[
              {
                label: "I'm traveling via plane and have NOT booked my flight",
                value: "plane_not_booked",
              },
              {
                label: "I'm traveling via plane and have booked my flight",
                value: "plane_booked",
              },
              {
                label: "I am not traveling to the summit via plane",
                value: "not_plane",
              },
            ]}
            onSelect={(value) => {
              if (value === "plane_booked") {
                updateFormDataAndNavigate(
                  { travelMethod: "plane_booked" },
                  Page.FlightDetails
                );
              } else if (value === "plane_not_booked") {
                updateFormDataAndNavigate(
                  { travelMethod: "plane_not_booked" },
                  Page.Result,
                  ResultType.RedirectToOBT
                );
              } else {
                updateFormDataAndNavigate(
                  { travelMethod: "not_plane" },
                  Page.Result,
                  ResultType.NotFlyingSuccess
                );
              }
            }}
            onBack={handleGoBack}
          />
        );
      case Page.FlightDetails:
        return (
          <FlightDetailsPage
            onNext={(data) =>
              updateFormDataAndNavigate(
                { flightDetails: data },
                Page.Result,
                ResultType.FinalSuccess
              )
            }
            onBack={handleGoBack}
          />
        );
      case Page.Result:
        if (resultType === null) return <div>Error: Result type not set.</div>;
        return <ResultPage type={resultType} />;
      default:
        return (
          <HomePage
            onAuthenticated={() => setCurrentPage(Page.PersonalDetails)}
          />
        );
    }
  };

  const currentStep = pageToStepMap[currentPage];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header onGoHome={handleGoHome} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {currentPage !== Page.Home && currentPage !== Page.Result && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">
                  Y20 Delegation Registration
                </h2>
                <p className="text-sm text-gray-500">
                  for the Y20 @ G20 Social Summit 2025
                </p>
              </div>{" "}
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </>
          )}
          {renderPage()}
        </div>
      </main>
      <Footer />
      {/* <ChatBot /> */}
    </div>
  );
}

export default App;
