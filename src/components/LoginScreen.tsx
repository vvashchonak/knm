import { useState, type FormEvent } from 'react';

const PASSWORD = 'fluggegecheimen';

type Props = {
  onAuthenticated: () => void;
  onBypass: () => void;
};

export function LoginScreen({ onAuthenticated, onBypass }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
    }
  };

  return (
    <div className="screen">
      <div className="card login-card">
        <h1>Wachtwoord</h1>
        <p className="lede">Voer het wachtwoord in om door te gaan.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            className="login-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            autoFocus
            autoComplete="off"
            placeholder="Wachtwoord"
          />
          {error && (
            <p className="hint warning">Verkeerd wachtwoord — probeer opnieuw.</p>
          )}
          <button type="submit" className="btn-primary">
            Inloggen
          </button>
        </form>

        <button
          type="button"
          className="btn-link"
          onClick={onBypass}
        >
          Ik weet het wachtwoord niet
        </button>
      </div>
    </div>
  );
}
