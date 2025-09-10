import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadAssignments, loadQuizzes, loadGrades, saveGrades, getCurrentUser } from '../../services/auth';
import { notifyStudentsOfNewContent } from '../../services/notifications';

const LecturerGrades = () => {
  const [grades, setGrades] = useState([]);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('assignment');
  const [itemIndex, setItemIndex] = useState(-1);
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState('');
  const [max, setMax] = useState('');

  useEffect(() => {
    setGrades(loadGrades());
  }, []);

  useEffect(() => {
    if (type === 'assignment') setItems(loadAssignments());
    else setItems(loadQuizzes());
    setItemIndex(-1);
  }, [type]);

  const addGrade = (e) => {
    e.preventDefault();
    if (itemIndex < 0 || !studentId.trim() || !score || !max) return;
    const target = items[itemIndex];
    const newRecord = {
      type,
      itemTitle: target.title,
      studentId: studentId.trim(),
      score: Number(score),
      max: Number(max),
      date: new Date().toISOString()
    };
    const updated = [newRecord, ...grades];
    setGrades(updated);
    saveGrades(updated);

    // Notify students of new grade
    const user = getCurrentUser();
    const notification = notifyStudentsOfNewContent(
      'grade',
      `New Grade for ${newRecord.itemTitle}`,
      `You received a score of ${newRecord.score}/${newRecord.max}`,
      user?.name || 'Lecturer'
    );

    // Trigger toast notification
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));

    setStudentId('');
    setScore('');
    setMax('');
  };

  const deleteGrade = (idx) => {
    const detail = {
      title: 'Delete grade',
      message: 'Delete this grade?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      styleMode: 'dark',
      onConfirm: () => {
        const updated = grades.filter((_, i) => i !== idx);
        setGrades(updated);
        saveGrades(updated);
      }
    };
    window.dispatchEvent(new CustomEvent('showConfirm', { detail }));
  };

  return (
    <div>
      <h3 className="mb-3">Grades</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addGrade}>
            <div className="row g-2">
              <div className="col-md-3">
                <Form.Label>Type</Form.Label>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                </Form.Select>
              </div>
              <div className="col-md-4">
                <Form.Label>Item</Form.Label>
                <Form.Select value={itemIndex} onChange={(e) => setItemIndex(Number(e.target.value))}>
                  <option value={-1}>Select...</option>
                  {items.map((it, idx) => (
                    <option key={idx} value={idx}>{it.title}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Form.Label>Student ID</Form.Label>
                <Form.Control value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              </div>
              <div className="col-md-1">
                <Form.Label>Score</Form.Label>
                <Form.Control type="number" value={score} onChange={(e) => setScore(e.target.value)} />
              </div>
              <div className="col-md-1">
                <Form.Label>Max</Form.Label>
                <Form.Control type="number" value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <Button type="submit" variant="success">Add</Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {grades.length === 0 ? (
        <div>No grades yet.</div>
      ) : (
        <ListGroup>
          {grades.map((g, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>[{g.type}]</strong> {g.itemTitle} — {g.studentId}
                <div className="text-muted small">{new Date(g.date).toLocaleString()}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold">{g.score}/{g.max}</span>
                <Button size="sm" variant="outline-danger" onClick={() => deleteGrade(idx)}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default LecturerGrades;


