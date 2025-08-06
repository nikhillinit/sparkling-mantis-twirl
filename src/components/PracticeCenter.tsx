import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, CheckCircle, Circle } from 'lucide-react';
import { Progress as ProgressType } from '../types';
import { modules } from '../data/modules';
import { updateProgress } from '../utils/storage';

interface PracticeCenterProps {
  progress: ProgressType[];
  onBack: () => void;
  onUpdateProgress: () => void;
}

const PracticeCenter: React.FC<PracticeCenterProps> = ({ 
  progress, 
  onBack, 
  onUpdateProgress 
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId) || {
      moduleId,
      lessonsCompleted: 0,
      totalLessons: 2,
      practiceCompleted: false,
      quizCompleted: false
    };
  };

  const markPracticeComplete = (moduleId: string) => {
    updateProgress(moduleId, { practiceCompleted: true });
    onUpdateProgress();
    // After marking complete, we can update the state locally to show immediate feedback
    // but the main state refresh is handled by onUpdateProgress
  };

  const selectedModule = selectedModuleId ? modules.find(m => m.id === selectedModuleId) : null;

  if (selectedModule) {
    const moduleProgress = getModuleProgress(selectedModule.id);
    
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedModuleId(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice Center
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedModule.title} - Practice</h1>
            <p className="text-muted-foreground">Work through practice problems</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {moduleProgress.practiceCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Target className="h-5 w-5" />
                )}
                <span>{selectedModule.practiceProblems[0].title}</span>
              </CardTitle>
              {moduleProgress.practiceCompleted && <Badge>Completed</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Problem Statement</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p>{selectedModule.practiceProblems[0].problem}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Step-by-Step Solution</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {selectedModule.practiceProblems[0].solution}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Key Learning Points</h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p>{selectedModule.practiceProblems[0].feedback}</p>
              </div>
            </div>

            {!moduleProgress.practiceCompleted && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => markPracticeComplete(selectedModule.id)}
                  size="lg"
                >
                  Mark Practice Complete
                </Button>
              </div>
            )}

            {moduleProgress.practiceCompleted && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>You've completed this practice problem!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Practice Center</h1>
          <p className="text-muted-foreground">Apply your knowledge with hands-on problems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => {
          const moduleProgress = getModuleProgress(module.id);
          return (
            <Card 
              key={module.id} 
              className="flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedModuleId(module.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-primary" />
                  <span>{module.title}</span>
                </CardTitle>
                <CardDescription>Practice problem for this module</CardDescription>
              </CardHeader>
              <CardContent>
                {moduleProgress.practiceCompleted ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Circle className="h-5 w-5" />
                    <span>Not Started</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeCenter;