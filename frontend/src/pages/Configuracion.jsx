import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/Configuracion.css';

const Configuracion = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useContext(LanguageContext);

  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [message, setMessage] = useState('');

  const handleSaveLanguage = () => {
    changeLanguage(selectedLanguage);
    setMessage(t('languageSaved'));

    setTimeout(() => {
      setMessage('');
    }, 2800);
  };

  const languages = [
    {
      id: 'es',
      shortName: 'ES',
      name: t('spanish'),
      description: 'Interfaz en español'
    },
    {
      id: 'en',
      shortName: 'EN',
      name: t('english'),
      description: 'Interface in English'
    }
  ];

  return (
    <div className="config-page">
      <AppHeader />

      <main className="config-main">
        <section className="config-hero">
          <div className="config-hero-content">
            <button
              type="button"
              className="config-back-btn"
              onClick={() => navigate('/home')}
            >
              ← {t('backHome')}
            </button>

            

            <h1>{t('settingsTitle')}</h1>
            <p>{t('settingsSubtitle')}</p>
          </div>
        </section>

        <section className="config-panel">
          {message && (
            <div className="config-message">
              {message}
            </div>
          )}

          <div className="config-card">
            <div className="config-card-header">
              <div>
                <span className="config-card-kicker">
                  {t('currentLanguage')}: {language === 'es' ? t('spanish') : t('english')}
                </span>
                <h2>{t('languageTitle')}</h2>
                <p>{t('languageDescription')}</p>
              </div>
            </div>

            <div className="language-options">
              {languages.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`language-card ${selectedLanguage === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage(item.id)}
                >
                  <span className="language-code">
                    {item.shortName}
                  </span>

                  <span className="language-info">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>

                  <span className="language-check">
                    {selectedLanguage === item.id ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>

            <div className="config-preview">
              <span>{t('previewTitle')}</span>
              <p>{t('previewText')}</p>
            </div>

            <div className="config-note">
              {t('note')}
            </div>

            <button
              type="button"
              className="config-save-btn"
              onClick={handleSaveLanguage}
            >
              {t('saveLanguage')}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Configuracion;