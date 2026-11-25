import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Skalebee',
      subtitle: 'React + Vite + Tailwind CSS starter',
      home: 'Home',
      about: 'About',
      notFound: 'Page not found',
      goHome: 'Go home',
      count: 'Count: {{value}}',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
