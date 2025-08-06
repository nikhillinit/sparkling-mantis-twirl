import React, { useState, useEffect } from 'react';
import { loadACFData, updateUser, saveDiagnosticResults, clearACFData } from '@/utils/storage';
import { ACFData, User, DiagnosticResult } from '@/types';
import OnboardingWizard from '@/components/OnboardingWizard';
import DiagnosticAssessment from '@/components/DiagnosticAssessment';
import Dashboard from '@/components/Dashboard';
import LearningPath from '@/components/LearningPath';
import PracticeCenter from '@/components/PracticeCenter';
import ProgressReview from '@/components/ProgressReview';
import NavBar from '@/components/NavBar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type Page = 'dashboard' | 'learning' | 'practice' | 'diagnostic' | 'progress';

const Index = () => {
  const [acfData, setAcfData] = useState<ACFData | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(undefined);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    const data = loadACFData();
    setAcfData(data);
    if (data.user?.onboardingComplete && !data.user.diagnosticComplete) {
      setShowDiagnostic(true);
    }
  }, []);

  const handleOnboardingComplete = (user: User) => {
    updateUser(user);
    setAcfData(prev => ({ ...prev!, user }));
    setShowDiagnostic(true);
  };

  const handleDiagnosticComplete = (results: DiagnosticResult[]) => {
    saveDiagnosticResults(results);
    const data = loadACFData();
    if (data.user) {
      data.user.diagnosticComplete = true;
      updateUser(data.user);
    }
    setAcfData(data);
    setShowDiagnostic(false);
    setCurrentPage('dashboard');
  };

  const handleUpdateProgress = () => {
    setAcfData(loadACFData());
  };

  const handleNavigate = (page: Page, moduleId?: string) => {
    setCurrentPage(page);
    setSelectedModuleId(moduleId);
    if (page === 'diagnostic') {
      setShowDiagnostic(true);
    }
  };

  const handleRetakeDiagnostic = () => {
    setShowDiagnostic(true);
  };

  const handleReset = () => {
    clearACFData();
    window.location.reload();
  };

  if (!acfData) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!acfData.user?.onboardingComplete) {
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

  const renderPage = () => {
    switch (currentPage) {
      case 'learning':
        return (
          <LearningPath
            progress={acfData.progress}
            selectedModuleId={selectedModuleId}
            onBack={() => setCurrentPage('dashboard')}
            onUpdateProgress={handleUpdateProgress}
          />
        );
      case 'practice':
        return (
          <PracticeCenter
            progress={acfData.progress}
            onBack={() => setCurrentPage('dashboard')}
            onUpdateProgress={handleUpdateProgress}
          />
        );
      case 'progress':
        return (
          <ProgressReview
            user={acfData.user!}
            progress={acfData.progress}
            diagnosticResults={acfData.diagnosticResults}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            user={acfData.user!}
            progress={acfData.progress}
            diagnosticResults={acfData.diagnosticResults}
            onNavigate={handleNavigate as any}
            onRetakeDiagnostic={handleRetakeDiagnostic}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <header className="md:w-64 p-4 border-b md:border-r md:border-b-0">
        <NavBar currentPage={currentPage} onNavigate={handleNavigate as any} />
      </header>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderPage()}
        <div className="mt-8">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Developer Note</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Want to start over? All data is stored in localStorage.</span>
              <Button variant="destructive" size="sm" onClick={handleReset}>
                Reset Data
              </Button>
            </AlertDescription>
          </Alert>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;