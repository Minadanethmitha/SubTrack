import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState('system');

  const resolvedTheme = useMemo(() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    return systemScheme === 'dark' ? 'dark' : 'light';
  }, [theme, systemScheme]);

  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    // no-op placeholder for future persistence; runtime theme can still be set from UI
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
