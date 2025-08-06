import React from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  onReset: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, onReset }) => {
  return (
    <div className="min-h-screen bg-muted/40">
      <NavBar onNavigate={onNavigate} onReset={onReset} />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;