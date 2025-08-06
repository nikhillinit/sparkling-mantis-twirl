import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { User, Progress as ProgressType, DiagnosticResult } from '../types';
import { modules, diagnosticQuestions } from '../data/modules';

interface ProgressReviewProps {
  user: User;
  progress: ProgressType[];
  diagnosticResults: DiagnosticResult[];
  onBack: () => void;
}

const ProgressReview: React.FC<ProgressReviewProps> = ({
  user,
  progress,
  diagnosticResults,
  onBack,
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
    if (moduleResults.length === 0) return { score: null, correct: 0, total: 0 };
    const correct = moduleResults.filter(r => r.correct).length;
    return {
      score: Math.round((correct / moduleResults.length) * 100),
      correct,
      total: moduleResults.length,
    };
  };

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

      {/* Diagnostic Assessment Review */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Assessment Review</CardTitle>
          <CardDescription>
            {diagnosticResults.length > 0
              ? 'Your performance on the initial diagnostic.'
              : 'You have not completed the diagnostic assessment yet.'}
          </CardDescription>
        </CardHeader>
        {diagnosticResults.length > 0 && (
          <CardContent className="space-y-4">
            {diagnosticQuestions.map(question => {
              const result = diagnosticResults.find(r => r.questionId === question.id);
              if (!result) return null;

              const isCorrect = result.correct;
              const selectedOption = question.options[result.selectedAnswer];
              const correctOption = question.options[question.correctAnswer];

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="text-sm space-y-1">
                    <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {isCorrect ? (
                        <CheckCircle className="inline h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="inline h-4 w-4 mr-1" />
                      )}
                      Your answer: {selectedOption}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        <CheckCircle className="inline h-4 w-4 mr-1" />
                        Correct answer: {correctOption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* Module by Module Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Module Completion Status</CardTitle>
          <CardDescription>Your progress in each learning module.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {modules.map(module => {
            const moduleProgress = getModuleProgress(module.id);
            const diagnostic = getDiagnosticScoreByModule(module.id);
            const lessonsProgress = Math.round(
              (moduleProgress.lessonsCompleted / moduleProgress.totalLessons) * 100
            );

            return (
              <div key={module.id} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{module.title}</h3>
                
                {diagnostic.score !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Diagnostic Score:</span>
                    <Badge variant={diagnostic.score >= 70 ? 'default' : 'secondary'}>
                      {diagnostic.score}% ({diagnostic.correct}/{diagnostic.total})
                    </Badge>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lessons Completed</span>
                    <span>{lessonsProgress}% ({moduleProgress.lessonsCompleted}/{moduleProgress.totalLessons})</span>
                  </div>
                  <Progress value={lessonsProgress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Practice Problem:</span>
                  {moduleProgress.practiceCompleted ? (
                    <Badge variant="default">Completed</Badge>
                  ) : (
                    <Badge variant="outline">Incomplete</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Module Quiz:</span>
                  {moduleProgress.quizCompleted ? (
                    <Badge variant="default">Completed</Badge>
                  ) : (
                    <Badge variant="outline">Incomplete</Badge>
                  )}
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