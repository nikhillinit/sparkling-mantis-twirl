import React, { useState, useEffect } from 'react';
import { ACFData, User, DiagnosticResult } from '../types';
import { loadACFData, updateUser, saveDiagnosticResults } from '../utils/storage';
import OnboardingWizard from '../components/OnboardingWizard';
import DiagnosticAssessment from '../components/DiagnosticAssessment';
import Dashboard from '../components/Dashboard';
import LearningPath from '../components/LearningPath';
import PracticeCenter from '../components/PracticeCenter';
import ProgressReview from '../components/ProgressReview';
import Layout from '../components/Layout';

const Index = () => {
  const [acfData, setAcfData] = useState<ACFData>(loadACFData());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(undefined);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const refreshData = () => {
    setAcfData(loadACFData());
  };

  useEffect(() => {
    // Automatically prompt for diagnostic after onboarding if not yet completed
    if (acfData.user?.onboardingComplete && !acfData.user.diagnosticComplete) {
      setShowDiagnostic(true);
    }
  }, [acfData.user]);

  const handleOnboardingComplete = (user: User) => {
    updateUser(user);
    refreshData();
    // The useEffect will then trigger the diagnostic
  };

  const handleDiagnosticComplete = (results: DiagnosticResult[]) => {
    saveDiagnosticResults(results);
    if (acfData.user) {
      updateUser({ ...acfData.user, diagnosticComplete: true });
    }
    setShowDiagnostic(false);
    refreshData();
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string, moduleId?: string) => {
    setCurrentPage(page);
    setSelectedModuleId(moduleId);
  };

  const handleReset = () => {
    // The NavBar component handles clearing localStorage. We just need to refresh state.
    refreshData();
    setCurrentPage('dashboard'); // Go back to the initial state (which will show onboarding)
  };

  const renderContent = () => {
    if (!acfData.user || !acfData.user.onboardingComplete) {
      return <OnboardingWizard onComplete={handleOnboardingComplete} />;
    }

    if (showDiagnostic) {
      return (
        <DiagnosticAssessment
          onComplete={handleDiagnosticComplete}
          onClose={() => setShowDiagnostic(false)}
        />
      );
    }

    const pageProps = {
      user: acfData.user,
      progress: acfData.progress,
      diagnosticResults: acfData.diagnosticResults,
    };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} onNavigate={handleNavigate} onRetakeDiagnostic={() => setCurrentPage('diagnostic')} />;
      case 'learning':
        return <LearningPath progress={acfData.progress} selectedModuleId={selectedModuleId} onBack={() => handleNavigate('dashboard')} onUpdateProgress={refreshData} />;
      case 'practice':
        return <PracticeCenter progress={acfData.progress} onBack={() => handleNavigate('dashboard')} onUpdateProgress={refreshData} />;
      case 'progress':
        return <ProgressReview {...pageProps} onBack={() => handleNavigate('dashboard')} onRetakeDiagnostic={() => setCurrentPage('diagnostic')} />;
      case 'diagnostic':
        return <DiagnosticAssessment onComplete={handleDiagnosticComplete} onClose={() => handleNavigate('dashboard')} />;
      default:
        return <Dashboard {...pageProps} onNavigate={handleNavigate} onRetakeDiagnostic={() => setCurrentPage('diagnostic')} />;
    }
  };

  // If user is not onboarded, show the wizard without the main layout
  if (!acfData.user || !acfData.user.onboardingComplete) {
    return renderContent();
  }

  // If the diagnostic modal should be shown, render it on top of the dashboard
  if (showDiagnostic) {
    return (
      <Layout onNavigate={handleNavigate} onReset={handleReset}>
        <Dashboard 
          user={acfData.user} 
          progress={acfData.progress} 
          diagnosticResults={acfData.diagnosticResults} 
          onNavigate={handleNavigate} 
          onRetakeDiagnostic={() => setCurrentPage('diagnostic')} 
        />
        {renderContent()}
      </Layout>
    );
  }

  return (
    <Layout onNavigate={handleNavigate} onReset={handleReset}>
      {renderContent()}
    </Layout>
  );
};

export default Index;