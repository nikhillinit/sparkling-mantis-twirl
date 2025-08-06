import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, TrendingUp, LayoutDashboard, BarChart3 } from 'lucide-react';
import { clearACFData } from '../utils/storage';

interface NavBarProps {
  onNavigate: (page: string) => void;
  onReset: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onNavigate, onReset }) => {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      clearACFData();
      onReset();
    }
  };

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ACF Mastery</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('learning')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Learning Path
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('practice')}>
            <Target className="mr-2 h-4 w-4" />
            Practice
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('diagnostic')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Diagnostic
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('progress')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Progress
          </Button>
        </nav>
        <div>
          <Button variant="destructive" size="sm" onClick={handleReset}>
            Reset Data
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;