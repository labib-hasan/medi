import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLanguage(savedLang);
      // Apply Bangla font class to body when language is Bengali
      if (savedLang === "bn") {
        document.body.classList.add("bangla-font");
      } else {
        document.body.classList.remove("bangla-font");
      }
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    // Apply Bangla font class to body when language is Bengali
    if (lang === "bn") {
      document.body.classList.add("bangla-font");
    } else {
      document.body.classList.remove("bangla-font");
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
