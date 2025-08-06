import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, BookOpen, FileQuestion } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress as ProgressType } from '@/types';
import { modules } from '@/data/modules';
import { updateProgress } from '@/utils/storage';

interface LearningPathProps {
  progress: ProgressType[];
  selectedModuleId?: string;
  onBack: () => void;
  onUpdateProgress: () => void;
}

const LearningPath: React.FC<LearningPathProps> = ({
  progress,
  selectedModuleId: initialModuleId,
  onBack,
  onUpdateProgress,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(initialModuleId || null);

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId) || {
      moduleId,
      lessonsCompleted: 0,
      totalLessons: 2,
      practiceCompleted: false,
      quizCompleted: false,
    };
  };

  const markLessonComplete = (moduleId: string, lessonIndex: number) => {
    const moduleProgress = getModuleProgress(moduleId);
    if (lessonIndex + 1 > moduleProgress.lessonsCompleted) {
      updateProgress(moduleId, { lessonsCompleted: lessonIndex + 1 });
      onUpdateProgress();
    }
  };

  if (selectedModuleId) {
    const module = modules.find(m => m.id === selectedModuleId);
    if (!module) return null;
    const moduleProgress = getModuleProgress(selectedModuleId);

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedModuleId(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Path
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {module.lessons.map((lesson, index) => {
            const isCompleted = index < moduleProgress.lessonsCompleted;
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="flex items-center">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                      {lesson.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  {!isCompleted && (
                    <Button className="mt-4" onClick={() => markLessonComplete(module.id, index)}>
                      Mark as Complete
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileQuestion />
                    <span>Module Quiz</span>
                </CardTitle>
                <CardDescription>Test your knowledge on {module.title}.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Quiz functionality is not yet implemented.</p>
                <Button disabled>Start Quiz</Button>
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
          <h1 className="text-2xl font-bold">Learning Path</h1>
          <p className="text-muted-foreground">Follow these modules to master ACF.</p>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map(module => {
          const moduleProgress = getModuleProgress(module.id);
          const isComplete = moduleProgress.lessonsCompleted === moduleProgress.totalLessons;
          return (
            <Card
              key={module.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedModuleId(module.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center space-x-3">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span>{module.title}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                    </div>
                    {isComplete && <Badge variant="default">Completed</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress: {moduleProgress.lessonsCompleted} / {moduleProgress.totalLessons} lessons</span>
                    <Button variant="link" size="sm">
                        Start Learning
                    </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;