import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { diagnosticQuestions } from '@/data/modules';
import { DiagnosticResult } from '@/types';

interface DiagnosticAssessmentProps {
  onComplete: (results: DiagnosticResult[]) => void;
  onClose: () => void;
}

const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({ onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(diagnosticQuestions.length).fill(null));

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < diagnosticQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    const results: DiagnosticResult[] = diagnosticQuestions.map((q, i) => ({
      questionId: q.id,
      module: q.module,
      selectedAnswer: answers[i]!,
      correct: answers[i] === q.correctAnswer,
    }));
    onComplete(results);
  };

  const currentQuestion = diagnosticQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / diagnosticQuestions.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Diagnostic Assessment</CardTitle>
          <CardDescription>Let's see what you already know. This will help personalize your learning path.</CardDescription>
          <Progress value={progressPercentage} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="font-semibold text-lg">{currentQuestion.question}</p>
            <RadioGroup
              value={answers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={onClose}>Skip for now</Button>
          {currentQuestionIndex < diagnosticQuestions.length - 1 ? (
            <Button onClick={handleNext} disabled={answers[currentQuestionIndex] === null}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={answers[currentQuestionIndex] === null}>
              Finish Assessment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiagnosticAssessment;