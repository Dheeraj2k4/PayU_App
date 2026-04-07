import { useThemeContext } from '../store/context/ThemeContext';
export { ThemeMode } from '../store/context/ThemeContext';

export function useTheme() {
  return useThemeContext();
}
