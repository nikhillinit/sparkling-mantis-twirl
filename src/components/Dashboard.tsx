import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Progress as ProgressType, DiagnosticResult } from '@/types';
import { modules } from '@/data/modules';
import { BookOpen, Target, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  progress: ProgressType[];
  diagnosticResults: DiagnosticResult[];
  onNavigate: (page: 'learning' | 'practice' | 'progress' | 'diagnostic', moduleId?: string) => void;
  onRetakeDiagnostic: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, onNavigate, onRetakeDiagnostic }) => {
  const totalLessons = progress.reduce((sum, p) => sum + p.totalLessons, 0);
  const completedLessons = progress.reduce((sum, p) => sum + p.lessonsCompleted, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const nextModule = modules.find(m => {
    const p = progress.find(prog => prog.moduleId === m.id);
    return p && (p.lessonsCompleted < p.totalLessons || !p.practiceCompleted || !p.quizCompleted);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Your goal: {user.goal}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-4" />
          <p className="text-center text-sm text-muted-foreground mt-2">{overallProgress}% complete</p>
        </CardContent>
      </Card>

      {nextModule && (
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Recommended Next Step</CardTitle>
            <CardDescription className="text-primary-foreground/80">{nextModule.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{nextModule.description}</p>
            <Button variant="secondary" onClick={() => onNavigate('learning', nextModule.id)}>
              Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('learning')}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning Path</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Explore Modules</div>
            <p className="text-xs text-muted-foreground">Follow a structured path to mastery.</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('practice')}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Practice Center</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hone Your Skills</div>
            <p className="text-xs text-muted-foreground">Apply what you've learned.</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('progress')}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progress Review</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Track Your Growth</div>
            <p className="text-xs text-muted-foreground">See how far you've come.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Assessment</CardTitle>
          <CardDescription>You can retake the assessment anytime to adjust your learning path.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetakeDiagnostic}>
            <TrendingUp className="mr-2 h-4 w-4" /> Retake Diagnostic
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;