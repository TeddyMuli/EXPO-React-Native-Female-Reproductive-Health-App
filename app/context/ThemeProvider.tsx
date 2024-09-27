import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children } : { children: any }) => {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemTheme === 'dark');
  }, [systemTheme]);

  const toggleTheme = () => {
    setIsDarkMode(prevTheme => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
