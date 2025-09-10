import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadQuizzes, saveQuizzes, getCurrentUser } from '../../services/auth';
import { notifyStudentsOfNewContent } from '../../services/notifications';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [builderQuestions, setBuilderQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuizzes(loadQuizzes());
  }, []);

  const addQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim() || options.some((o) => !o.trim())) return;
    setBuilderQuestions([
      ...builderQuestions,
      { text: questionText.trim(), options: options.map((o) => o.trim()), correctIndex: Number(correctIndex) }
    ]);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    setError('');
  };

  const saveQuiz = (e) => {
    e.preventDefault();
    // compile questions including the in-progress one if filled
    const compiled = [...builderQuestions];
    const canAppendCurrent = questionText.trim() && !options.some((o) => !o.trim());
    if (canAppendCurrent) {
      compiled.push({ text: questionText.trim(), options: options.map((o) => o.trim()), correctIndex: Number(correctIndex) });
    }
    if (!title.trim() || compiled.length === 0) {
      setError('Please enter a title and at least one complete question with options.');
      return;
    }
    const newQuiz = { title: title.trim(), questions: compiled, createdAt: new Date().toISOString() };
    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    saveQuizzes(updated);

    // Notify students of new quiz
    const user = getCurrentUser();
    const notification = notifyStudentsOfNewContent(
      'quiz',
      newQuiz.title,
      `A new quiz with ${newQuiz.questions.length} questions has been posted.`,
      user?.name || 'Lecturer'
    );
    
    // Trigger toast notification
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));

    setTitle('');
    setBuilderQuestions([]);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    setError('');
  };

  const deleteQuiz = (idx) => {
    const detail = {
      title: 'Delete quiz',
      message: 'Delete this quiz?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      styleMode: 'dark',
      onConfirm: () => {
        const updated = quizzes.filter((_, i) => i !== idx);
        setQuizzes(updated);
        saveQuizzes(updated);
      }
    };
    window.dispatchEvent(new CustomEvent('showConfirm', { detail }));
  };

  return (
    <div>
      <h3 className="mb-3">Quizzes</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={saveQuiz}>
            <Form.Group className="mb-2">
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <hr />
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <Form.Group className="mb-2">
              <Form.Label>Question</Form.Label>
              <Form.Control value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            </Form.Group>
            {options.map((opt, i) => (
              <Form.Group className="mb-2" key={i}>
                <Form.Label>Option {i + 1}</Form.Label>
                <Form.Control value={opt} onChange={(e) => setOptions(options.map((o, idx) => (idx === i ? e.target.value : o)))} />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Correct Option</Form.Label>
              <Form.Select value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)}>
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2 mb-3">
              <Button variant="secondary" onClick={addQuestion} type="button">Add Question</Button>
              <Button variant="success" type="submit">Save Quiz</Button>
            </div>
            {builderQuestions.length > 0 && (
              <>
                <div className="text-muted small mb-2">Questions added: {builderQuestions.length}</div>
                <ListGroup>
                  {builderQuestions.map((q, idx) => (
                    <ListGroup.Item key={idx}>
                      <div className="fw-bold">Q{idx + 1}. {q.text}</div>
                      <div className="small">Correct: Option {Number(q.correctIndex) + 1}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>

      {quizzes.length === 0 ? (
        <div>No quizzes yet.</div>
      ) : (
        <ListGroup>
          {quizzes.map((q, idx) => (
            <ListGroup.Item key={idx} className="card-hover d-flex justify-content-between align-items-center">
              <div>
                <strong>{q.title}</strong>
                <div className="text-muted small">{new Date(q.createdAt).toLocaleString()}</div>
                <div>{q.questions.length} question(s)</div>
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => deleteQuiz(idx)}>
                <i className="bi bi-trash me-1"></i>
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Quizzes;


