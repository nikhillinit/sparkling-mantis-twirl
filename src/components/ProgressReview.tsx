import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { User, Progress as ProgressType, DiagnosticResult } from '../types';
import { modules } from '../data/modules';

interface ProgressReviewProps {
  user: User;
  progress: ProgressType[];
  diagnosticResults: DiagnosticResult[];
  onBack: () => void;
  onRetakeDiagnostic: () => void;
}

const ProgressReview: React.FC<ProgressReviewProps> = ({
  user,
  progress,
  diagnosticResults,
  onBack,
  onRetakeDiagnostic,
}) => {
  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId) || {
      moduleId,
      lessonsCompleted: 0,
      totalLessons: 2,
      practiceCompleted: false,
      quizCompleted: false,
    };
  };

  const getDiagnosticScoreByModule = (moduleId: string) => {
    const moduleResults = diagnosticResults.filter(r => r.module === moduleId);
    if (moduleResults.length === 0) return null;
    const correct = moduleResults.filter(r => r.correct).length;
    return {
      score: Math.round((correct / moduleResults.length) * 100),
      correct,
      total: moduleResults.length,
    };
  };

  const overallDiagnosticScore = diagnosticResults.length > 0
    ? Math.round((diagnosticResults.filter(r => r.correct).length / diagnosticResults.length) * 100)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Progress Review</h1>
          <p className="text-muted-foreground">A detailed look at your ACF mastery journey, {user.name}.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Diagnostic Assessment Summary</span>
          </CardTitle>
          <CardDescription>
            Your initial strengths and weaknesses. Overall Score: {overallDiagnosticScore}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {modules.map(module => {
            const scoreData = getDiagnosticScoreByModule(module.id);
            return (
              <div key={module.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{module.title}</span>
                  {scoreData ? (
                    <span className="text-sm text-muted-foreground">
                      {scoreData.correct}/{scoreData.total} ({scoreData.score}%)
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not taken</span>
                  )}
                </div>
                <Progress value={scoreData?.score || 0} className="h-2" />
              </div>
            );
          })}
          <div className="pt-4">
            <Button onClick={onRetakeDiagnostic} variant="outline" className="w-full">
              Retake Diagnostic Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Module Completion Status</CardTitle>
          <CardDescription>Track your completion of lessons, practice, and quizzes for each module.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {modules.map(module => {
            const moduleProgress = getModuleProgress(module.id);
            const isCompleted = moduleProgress.lessonsCompleted === moduleProgress.totalLessons &&
                                moduleProgress.practiceCompleted &&
                                moduleProgress.quizCompleted;
            return (
              <div key={module.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{module.title}</h3>
                  {isCompleted ? (
                    <Badge>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Module Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lessons</p>
                    <div className="flex items-center justify-center space-x-1">
                      {moduleProgress.lessonsCompleted === moduleProgress.totalLessons ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span>{moduleProgress.lessonsCompleted}/{moduleProgress.totalLessons}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Practice</p>
                    {moduleProgress.practiceCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quiz</p>
                    {moduleProgress.quizCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressReview;