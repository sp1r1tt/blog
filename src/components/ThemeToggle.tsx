// src/components/ThemeToggle.tsx
'use client'; // Ensure this is a client component

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button'; // Adjust import based on your setup

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders after mounting on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a fallback during SSR (e.g., nothing or a placeholder)
    return <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800/50" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-white hover:bg-gray-800/50"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}