import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookOpen, Target, TrendingUp, BarChart3, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'learning', label: 'Learning Path', icon: BookOpen },
  { id: 'practice', label: 'Practice Center', icon: Target },
  { id: 'diagnostic', label: 'Diagnostic', icon: TrendingUp },
  { id: 'progress', label: 'Progress Review', icon: BarChart3 },
];

const NavBar: React.FC<NavBarProps> = ({ currentPage, onNavigate }) => {
  const isMobile = useIsMobile();

  const NavLinks = () => (
    <nav className={`flex gap-2 ${isMobile ? 'flex-col items-start' : 'items-center'}`}>
      {navItems.map(item => (
        <Button
          key={item.id}
          variant={currentPage === item.id ? 'secondary' : 'ghost'}
          onClick={() => onNavigate(item.id)}
          className="w-full justify-start"
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">ACF Mastery</h2>
            <NavLinks />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <NavLinks />;
};

export default NavBar;