import React, { useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { loadQuizzes } from '../../services/auth';

const StudentQuizzes = () => {
  const quizzes = useMemo(() => loadQuizzes(), []);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(quizzes.length ? 0 : -1);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const currentQuiz = selectedQuizIndex >= 0 ? quizzes[selectedQuizIndex] : null;

  const submitQuiz = (e) => {
    e.preventDefault();
    if (!currentQuiz) return;
    let s = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (Number(answers[idx]) === Number(q.correctIndex)) s += 1;
    });
    setScore(`${s}/${currentQuiz.questions.length}`);
  };

  return (
    <div>
      <h4 className="mb-3">Take Quiz</h4>
      {quizzes.length === 0 ? (
        <div>No quizzes available.</div>
      ) : (
        <>
          <Form.Select className="mb-3" value={selectedQuizIndex} onChange={(e) => { setSelectedQuizIndex(Number(e.target.value)); setAnswers({}); setScore(null); }}>
            {quizzes.map((q, idx) => (
              <option key={idx} value={idx}>{q.title}</option>
            ))}
          </Form.Select>
          {currentQuiz && (
            <Card className="card-hover animate__animated animate__fadeIn">
              <Card.Body>
                <Form onSubmit={submitQuiz}>
                  {currentQuiz.questions.map((q, idx) => (
                    <Form.Group className="mb-3" key={idx}>
                      <div className="fw-bold mb-1">Q{idx + 1}. {q.text}</div>
                      {q.options.map((opt, i) => (
                        <Form.Check
                          key={i}
                          type="radio"
                          name={`q-${idx}`}
                          id={`q-${idx}-opt-${i}`}
                          label={opt}
                          checked={Number(answers[idx]) === i}
                          onChange={() => setAnswers({ ...answers, [idx]: i })}
                        />
                      ))}
                    </Form.Group>
                  ))}
                  <div className="d-flex align-items-center gap-2">
                    <Button type="submit" variant="primary">Submit</Button>
                    {score && <span className="fw-bold">Score: {score}</span>}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default StudentQuizzes;


