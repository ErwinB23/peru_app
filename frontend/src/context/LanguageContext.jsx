/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
  es: {
    settingsTitle: 'Configuración',
    settingsSubtitle: 'Cambia el idioma de la aplicación.',
    backHome: 'Volver al inicio',
    languageTitle: 'Idioma de la aplicación',
    languageDescription: 'Selecciona el idioma que deseas usar en PERU APP.',
    spanish: 'Español',
    english: 'Inglés',
    currentLanguage: 'Idioma actual',
    saveLanguage: 'Guardar idioma',
    languageSaved: 'Idioma guardado correctamente',
    previewTitle: 'Vista previa',
    previewText: 'Así se mostrará el idioma seleccionado dentro del sistema.',
    appName: 'PERU APP',
    note: 'Por ahora el cambio se aplica en la pantalla de configuración. Luego podemos conectarlo al menú, Home y demás páginas.'
  },
  en: {
    settingsTitle: 'Settings',
    settingsSubtitle: 'Change the application language.',
    backHome: 'Back to home',
    languageTitle: 'Application language',
    languageDescription: 'Select the language you want to use in PERU APP.',
    spanish: 'Spanish',
    english: 'English',
    currentLanguage: 'Current language',
    saveLanguage: 'Save language',
    languageSaved: 'Language saved successfully',
    previewTitle: 'Preview',
    previewText: 'This is how the selected language will be displayed inside the system.',
    appName: 'PERU APP',
    note: 'For now, the change applies to the settings screen. Later we can connect it to the menu, Home, and other pages.'
  }
};

const getStoredLanguage = () => {
  return localStorage.getItem('idioma') || 'es';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getStoredLanguage);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('idioma', newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.es[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};