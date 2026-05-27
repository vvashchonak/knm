# KNM oefenexamen

Локальная веб-платформа для тренировки к нидерландскому экзамену **KNM** (Kennis van de Nederlandse Maatschappij). Каждая сессия — N случайных вопросов из банка, один правильный вариант на вопрос, в конце — % правильных и подробная разбивка.

## Запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:5173

Production-сборка:

```bash
npm run build
npm run preview
```

## Банк вопросов

Все вопросы лежат в [`public/questions.json`](public/questions.json). Файл редактируется без перекомпиляции — Vite перезаливает его на лету.

### Формат

```json
{
  "questionsPerSession": 40,
  "questions": [
    {
      "id": "geschiedenis-001",
      "topic": "geschiedenis",
      "question": "In welk jaar werd Nederland bevrijd van de Duitse bezetting?",
      "options": ["1940", "1945", "1948", "1953"],
      "correctIndex": 1,
      "explanation": "Nederland werd bevrijd in mei 1945."
    }
  ]
}
```

| Поле                  | Обязательное | Описание                                                            |
|-----------------------|--------------|---------------------------------------------------------------------|
| `questionsPerSession` | нет          | Сколько вопросов в одной сессии. По умолчанию `40`.                 |
| `questions[].id`      | да           | Стабильный уникальный идентификатор.                                |
| `questions[].topic`   | нет          | Тема (показывается тегом). Например `geschiedenis`, `politiek`.     |
| `questions[].question`| да           | Текст вопроса (NL).                                                 |
| `questions[].options` | да           | Массив вариантов (минимум 2). Порядок будет перемешан в сессии.     |
| `questions[].correctIndex` | да      | Индекс правильного варианта в исходном `options` (с нуля).          |
| `questions[].explanation`  | нет     | Пояснение, показывается на экране результатов.                      |

### Демо

Стартовый файл содержит 5 примеров и `questionsPerSession: 5`, чтобы можно было сразу прогнать сессию. Для реальной тренировки:

1. Поднять `questionsPerSession` до `40`.
2. Добавить хотя бы 40 вопросов в `questions[]` (иначе кнопка Start заблокирована).

## Поведение

- На старте — fetch `questions.json`, показывается размер банка.
- Сессия выбирает случайные `questionsPerSession` вопросов через Fisher–Yates.
- Варианты ответов перемешиваются индивидуально на каждый вопрос.
- Можно переходить **Vorige / Volgende** между вопросами и менять выбор до финиша.
- Правильные ответы показываются только на финальном экране.
- Без ответа = неправильно (помечается `Niet beantwoord`).

## Структура

```
src/
  App.tsx                     ← state machine: idle → in_progress → finished
  types.ts                    ← Question, SessionQuestion, ...
  utils.ts                    ← shuffle, buildSession, isCorrect, countCorrect
  components/
    StartScreen.tsx
    QuestionScreen.tsx
    ResultsScreen.tsx
  index.css                   ← Rijksoverheid-style минимал
public/
  questions.json              ← банк вопросов
```
