import type { SessionQuestion } from '../types';

type Props = {
  session: SessionQuestion[];
  currentIndex: number;
  onSelect: (shuffledIndex: number) => void;
  onCheck: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function QuestionScreen({
  session,
  currentIndex,
  onSelect,
  onCheck,
  onPrev,
  onNext,
  onFinish,
}: Props) {
  const sq = session[currentIndex];
  const total = session.length;
  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;
  const hasAnswer = sq.selectedShuffledIndex !== null;
  const isChecked = sq.checked;

  const correctOriginalIndex = sq.question.correctIndex;
  const selectedOriginalIndex =
    sq.selectedShuffledIndex !== null
      ? sq.shuffledOptions[sq.selectedShuffledIndex].originalIndex
      : null;
  const isCorrect =
    isChecked && selectedOriginalIndex === correctOriginalIndex;

  const checkedCount = session.filter((s) => s.checked).length;

  return (
    <div className="screen">
      <div className="progress">
        <div className="progress-text">
          Vraag {currentIndex + 1} / {total}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
        <div className="progress-meta">
          {checkedCount} van {total} gecontroleerd
        </div>
      </div>

      <div className="card">
        {sq.question.topic && (
          <div className="topic-tag">{sq.question.topic}</div>
        )}
        <h2 className="question-text">{sq.question.question}</h2>

        {sq.question.image && (
          <figure className="question-figure">
            <img
              src={`${import.meta.env.BASE_URL}${sq.question.image.replace(/^\//, '')}`}
              alt={sq.question.imageAlt ?? ''}
            />
          </figure>
        )}

        <ul className="options">
          {sq.shuffledOptions.map((opt, i) => {
            const selected = sq.selectedShuffledIndex === i;
            const inputId = `opt-${currentIndex}-${i}`;
            const isThisCorrect = opt.originalIndex === correctOriginalIndex;
            const isThisSelected = selected;

            let stateClass = '';
            if (isChecked) {
              if (isThisCorrect) stateClass = 'option-correct';
              else if (isThisSelected) stateClass = 'option-wrong';
              else stateClass = 'option-locked';
            } else if (selected) {
              stateClass = 'option-selected';
            }

            return (
              <li key={i}>
                <label
                  htmlFor={inputId}
                  className={`option ${stateClass}`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`q-${currentIndex}`}
                    checked={selected}
                    disabled={isChecked}
                    onChange={() => onSelect(i)}
                  />
                  <span>{opt.text}</span>
                  {isChecked && isThisCorrect && (
                    <span className="option-mark mark-correct">✓</span>
                  )}
                  {isChecked && isThisSelected && !isThisCorrect && (
                    <span className="option-mark mark-wrong">✗</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>

        {isChecked && (
          <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            <div className="feedback-title">
              {isCorrect ? '✓ Goed!' : '✗ Fout'}
            </div>
            {sq.question.explanation && (
              <div className="feedback-explanation">{sq.question.explanation}</div>
            )}
          </div>
        )}
      </div>

      <div className="nav">
        <button
          type="button"
          className="btn-secondary"
          onClick={onPrev}
          disabled={isFirst}
        >
          Vorige
        </button>
        {!isChecked ? (
          <button
            type="button"
            className="btn-primary"
            onClick={onCheck}
            disabled={!hasAnswer}
          >
            Controleren
          </button>
        ) : isLast ? (
          <button type="button" className="btn-primary" onClick={onFinish}>
            Resultaten bekijken
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={onNext}>
            Volgende
          </button>
        )}
      </div>
    </div>
  );
}
