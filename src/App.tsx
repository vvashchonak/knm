import { useEffect, useMemo, useState } from 'react';
import type { QuestionBank, Screen, SessionQuestion } from './types';
import {
  buildSession,
  countByTheme,
  filterByThemes,
  THEMES,
  type Theme,
} from './utils';
import { LoginScreen } from './components/LoginScreen';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultsScreen } from './components/ResultsScreen';

const DEFAULT_QUESTIONS_PER_SESSION = 40;
const AUTH_KEY = 'knm-auth';

type AuthState = 'authenticated' | 'bypassed' | null;

function readAuth(): AuthState {
  const v = sessionStorage.getItem(AUTH_KEY);
  return v === 'authenticated' || v === 'bypassed' ? v : null;
}

function App() {
  const [auth, setAuth] = useState<AuthState>(() => readAuth());
  const [bank, setBank] = useState<QuestionBank | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('idle');
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedThemes, setSelectedThemes] = useState<Set<Theme>>(
    () => new Set(THEMES),
  );

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}questions.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: QuestionBank) => {
        setBank(data);
      })
      .catch((err: Error) =>
        setLoadError(`Kan questions.json niet laden: ${err.message}`),
      );
  }, []);

  const themeList = useMemo(() => {
    if (!bank) return [];
    const counts = countByTheme(bank.questions);
    // Keep THEMES order (book order)
    return THEMES.map((name) => ({ name, count: counts.get(name) ?? 0 }));
  }, [bank]);

  if (auth === null) {
    return (
      <div className="app">
        <div className="govbar" />
        <LoginScreen
          onAuthenticated={() => {
            sessionStorage.setItem(AUTH_KEY, 'authenticated');
            setAuth('authenticated');
          }}
          onBypass={() => {
            sessionStorage.setItem(AUTH_KEY, 'bypassed');
            setAuth('bypassed');
          }}
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app">
        <div className="govbar" />
        <div className="screen">
          <div className="card">
            <h1>Fout</h1>
            <p className="hint warning">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="app">
        <div className="govbar" />
        <div className="screen">
          <div className="card">
            <p>Vragen laden…</p>
          </div>
        </div>
      </div>
    );
  }

  const questionsPerSession =
    bank.questionsPerSession ?? DEFAULT_QUESTIONS_PER_SESSION;

  const handleToggleTheme = (theme: Theme) => {
    setSelectedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(theme)) next.delete(theme);
      else next.add(theme);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedThemes(new Set(THEMES));
  };

  const handleSelectNone = () => {
    setSelectedThemes(new Set());
  };

  const handleStart = () => {
    const filtered = filterByThemes(bank.questions, selectedThemes);
    if (filtered.length === 0) return;
    const sessionSize = Math.min(filtered.length, questionsPerSession);
    setSession(buildSession(filtered, sessionSize));
    setCurrentIndex(0);
    setScreen('in_progress');
  };

  const handleSelect = (shuffledIndex: number) => {
    setSession((prev) =>
      prev.map((sq, i) => {
        if (i !== currentIndex) return sq;
        // Geen wijzigingen meer mogelijk nadat de vraag is gecontroleerd.
        if (sq.checked) return sq;
        return { ...sq, selectedShuffledIndex: shuffledIndex };
      }),
    );
  };

  const handleCheck = () => {
    setSession((prev) =>
      prev.map((sq, i) =>
        i === currentIndex && sq.selectedShuffledIndex !== null
          ? { ...sq, checked: true }
          : sq,
      ),
    );
  };

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(session.length - 1, i + 1));
  const handleFinish = () => setScreen('finished');
  const handleRestart = () => {
    setSession([]);
    setCurrentIndex(0);
    setScreen('idle');
  };

  return (
    <div className="app">
      <div className="govbar" />
      {screen === 'idle' && (
        <StartScreen
          bankSize={bank.questions.length}
          questionsPerSession={questionsPerSession}
          themes={themeList}
          selectedThemes={selectedThemes}
          onToggleTheme={handleToggleTheme}
          onSelectAll={handleSelectAll}
          onSelectNone={handleSelectNone}
          onStart={handleStart}
          authenticated={auth === 'authenticated'}
        />
      )}
      {screen === 'in_progress' && (
        <QuestionScreen
          session={session}
          currentIndex={currentIndex}
          onSelect={handleSelect}
          onCheck={handleCheck}
          onPrev={handlePrev}
          onNext={handleNext}
          onFinish={handleFinish}
        />
      )}
      {screen === 'finished' && (
        <ResultsScreen session={session} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
