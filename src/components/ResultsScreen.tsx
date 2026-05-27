import type { SessionQuestion } from '../types';
import { countCorrect, isCorrect } from '../utils';

type Props = {
  session: SessionQuestion[];
  onRestart: () => void;
};

export function ResultsScreen({ session, onRestart }: Props) {
  const total = session.length;
  const correct = countCorrect(session);
  const percentage = Math.round((correct / total) * 100);

  const passThreshold = Math.round(total * 0.7);
  const passed = correct >= passThreshold;

  const verdict =
    percentage >= 80
      ? 'Uitstekend!'
      : percentage >= 60
      ? 'Goed bezig — blijf oefenen.'
      : 'Nog wat oefening nodig.';

  return (
    <div className="screen">
      <div className={`card score-card ${passed ? 'pass' : 'fail'}`}>
        <div className="score-percentage">{percentage}%</div>
        <div className="score-fraction">
          {correct} van {total} goed
        </div>
        <p className="score-verdict">{verdict}</p>
        <p className={`pass-fail ${passed ? 'pass' : 'fail'}`}>
          {passed ? 'Geslaagd' : 'Niet geslaagd'} — je hebt minimaal{' '}
          <strong>{passThreshold} van de {total}</strong> goed nodig om te
          slagen (70%).
        </p>
        <button type="button" className="btn-primary" onClick={onRestart}>
          Opnieuw beginnen
        </button>
      </div>

      <h2 className="results-heading">Overzicht</h2>

      <ol className="results-list">
        {session.map((sq, i) => {
          const correctIdx = sq.question.correctIndex;
          const correctText = sq.question.options[correctIdx];
          const selectedText =
            sq.selectedShuffledIndex !== null
              ? sq.shuffledOptions[sq.selectedShuffledIndex].text
              : null;
          const ok = isCorrect(sq);
          const status = selectedText === null
            ? 'unanswered'
            : ok
            ? 'correct'
            : 'wrong';

          return (
            <li key={sq.question.id} className={`result result-${status}`}>
              <div className="result-header">
                <span className="result-num">{i + 1}.</span>
                <span className="result-question">{sq.question.question}</span>
                <span className={`result-badge badge-${status}`}>
                  {status === 'correct'
                    ? 'Goed'
                    : status === 'wrong'
                    ? 'Fout'
                    : 'Niet beantwoord'}
                </span>
              </div>
              {sq.question.image && (
                <figure className="result-figure">
                  <img
                    src={`${import.meta.env.BASE_URL}${sq.question.image.replace(/^\//, '')}`}
                    alt={sq.question.imageAlt ?? ''}
                  />
                </figure>
              )}
              <div className="result-body">
                {selectedText !== null && (
                  <div>
                    <span className="label">Jouw antwoord: </span>
                    <span className={ok ? 'text-correct' : 'text-wrong'}>
                      {selectedText}
                    </span>
                  </div>
                )}
                {!ok && (
                  <div>
                    <span className="label">Juiste antwoord: </span>
                    <span className="text-correct">{correctText}</span>
                  </div>
                )}
                {sq.question.explanation && (
                  <div className="explanation">{sq.question.explanation}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
