import type { Theme } from '../utils';

type Props = {
  bankSize: number;
  questionsPerSession: number;
  themes: { name: Theme; count: number }[];
  selectedThemes: ReadonlySet<Theme>;
  onToggleTheme: (theme: Theme) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onStart: () => void;
  authenticated: boolean;
};

export function StartScreen({
  bankSize,
  questionsPerSession,
  themes,
  selectedThemes,
  onToggleTheme,
  onSelectAll,
  onSelectNone,
  onStart,
  authenticated,
}: Props) {
  const availableCount = themes
    .filter((t) => selectedThemes.has(t.name))
    .reduce((sum, t) => sum + t.count, 0);
  const sessionSize = Math.min(availableCount, questionsPerSession);
  const canStart = availableCount > 0;

  return (
    <div className="screen">
      <header className="hero">
        <h1>KNM oefenexamen</h1>
        <p className="lede">
          Oefen voor het examen Kennis van de Nederlandse Maatschappij. Per
          sessie krijg je tot {questionsPerSession} willekeurige vragen uit de
          gekozen thema's.
        </p>
      </header>

      {authenticated ? (
        <figure className="secret-figure">
          <img
            src={`${import.meta.env.BASE_URL}images/fluggegecheimen.jpg`}
            alt="Fluggegecheimen"
          />
        </figure>
      ) : (
        <div className="card bypass-message">
          <p>Niets aan de hand — je kunt nog steeds oefenen.</p>
        </div>
      )}

      <div className="card disclaimer">
        <p>
          <strong>Let op:</strong> dit zijn <em>geen</em> officiële
          examenvragen. De vragen zijn gegenereerd op basis van de boeken{' '}
          <em>Kijk op Nederland</em> (Robert de Boer) en{' '}
          <em>Welkom in Nederland</em> (Marilene Gathier). Gebruik dit om te
          oefenen — niet als bron van officiële antwoorden.
        </p>
      </div>

      <div className="card">
        <div className="topics-header">
          <h2>Kies thema's</h2>
          <div className="topics-actions">
            <button type="button" className="btn-link" onClick={onSelectAll}>
              Alles
            </button>
            <span className="separator">·</span>
            <button type="button" className="btn-link" onClick={onSelectNone}>
              Niets
            </button>
          </div>
        </div>

        <ul className="themes-list">
          {themes.map((t) => {
            const checked = selectedThemes.has(t.name);
            const id = `theme-${t.name.replace(/\s+/g, '-')}`;
            return (
              <li key={t.name}>
                <label
                  htmlFor={id}
                  className={`theme-row ${checked ? 'theme-checked' : ''}`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleTheme(t.name)}
                  />
                  <span className="theme-name">{t.name}</span>
                  <span className="theme-count">{t.count}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="topics-summary">
          <strong>{availableCount}</strong> van {bankSize} vragen geselecteerd —
          sessie van <strong>{sessionSize}</strong>{' '}
          {sessionSize === 1 ? 'vraag' : 'willekeurige vragen'}.
          {sessionSize > 0 && (
            <>
              {' '}Minimaal <strong>{Math.round(sessionSize * 0.7)}</strong>{' '}
              goed nodig om te slagen (70%).
            </>
          )}
        </div>

        {canStart ? (
          <button type="button" className="btn-primary" onClick={onStart}>
            Start sessie
          </button>
        ) : (
          <>
            <button type="button" className="btn-primary" disabled>
              Start sessie
            </button>
            <p className="hint warning">Kies minstens één thema.</p>
          </>
        )}
      </div>

      <ul className="rules">
        <li>Eén antwoord per vraag.</li>
        <li>Je kunt vooruit en terug navigeren tussen vragen.</li>
        <li>De juiste antwoorden zie je pas aan het einde.</li>
      </ul>
    </div>
  );
}
