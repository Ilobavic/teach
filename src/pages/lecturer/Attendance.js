import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadLecturerClasses, loadAttendanceSessions, saveAttendanceSessions } from '../../services/auth';

const LecturerAttendance = () => {
  const [classesList, setClassesList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filterClassTitle, setFilterClassTitle] = useState('');
  const [classIndex, setClassIndex] = useState(-1);
  const [sessionDate, setSessionDate] = useState('');
  const [roster, setRoster] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    setClassesList(loadLecturerClasses());
    setSessions(loadAttendanceSessions());
  }, []);

  const addStudent = () => {
    if (!studentName.trim() || !studentId.trim()) return;
    setRoster([...roster, { name: studentName.trim(), id: studentId.trim(), present: false }]);
    setStudentName('');
    setStudentId('');
  };

  const togglePresent = (idx) => {
    setRoster(roster.map((s, i) => (i === idx ? { ...s, present: !s.present } : s)));
  };

  const saveSession = (e) => {
    e.preventDefault();
    if (classIndex < 0 || !sessionDate) return;
    const cls = classesList[classIndex];
    const newSession = {
      classTitle: cls.title,
      classLink: cls.link,
      scheduledAt: cls.schedule,
      date: sessionDate,
      entries: roster
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveAttendanceSessions(updated);
    setRoster([]);
    setSessionDate('');
    setClassIndex(-1);
  };

  const deleteSession = (idx) => {
    if (!window.confirm('Delete this attendance session?')) return;
    const updated = sessions.filter((_, i) => i !== idx);
    setSessions(updated);
    saveAttendanceSessions(updated);
  };

  const classSummaries = sessions.reduce((map, s) => {
    const key = s.classTitle || 'Untitled Class';
    if (!map[key]) map[key] = { count: 0, totalMarked: 0 };
    map[key].count += 1;
    map[key].totalMarked += (Array.isArray(s.entries) ? s.entries.length : 0);
    return map;
  }, {});

  const filteredSessions = filterClassTitle
    ? sessions.filter((s) => s.classTitle === filterClassTitle)
    : sessions;

  return (
    <div>
      <h3 className="mb-3">Attendance</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={saveSession}>
            <Form.Group className="mb-2">
              <Form.Label>Class</Form.Label>
              <Form.Select value={classIndex} onChange={(e) => setClassIndex(Number(e.target.value))}>
                <option value={-1}>Select a class</option>
                {classesList.map((c, idx) => (
                  <option key={idx} value={idx}>{c.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Session Date</Form.Label>
              <Form.Control type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </Form.Group>
            <div className="mb-2 fw-bold">Roster</div>
            <div className="d-flex gap-2 mb-2">
              <Form.Control placeholder="Student name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
              <Form.Control placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              <Button type="button" variant="secondary" onClick={addStudent}>Add</Button>
            </div>
            {roster.length > 0 && (
              <ListGroup className="mb-3">
                {roster.map((s, idx) => (
                  <ListGroup.Item key={idx} className="d-flex align-items-center justify-content-between">
                    <div>
                      <strong>{s.name}</strong> <span className="text-muted">({s.id})</span>
                    </div>
                    <Form.Check
                      type="checkbox"
                      label="Present"
                      checked={s.present}
                      onChange={() => togglePresent(idx)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            <Button variant="success" type="submit">Save Session</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-bold">Your Classes (with attendance)</div>
            {filterClassTitle && (
              <Button size="sm" variant="outline-secondary" onClick={() => setFilterClassTitle('')}>Show All</Button>
            )}
          </div>
          {Object.keys(classSummaries).length === 0 ? (
            <div>No classes with attendance yet.</div>
          ) : (
            <ListGroup>
              {Object.entries(classSummaries).map(([title, info]) => (
                <ListGroup.Item
                  key={title}
                  action
                  active={filterClassTitle === title}
                  onClick={() => setFilterClassTitle(title)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>{title}</div>
                  <div className="text-muted small">{info.count} session(s)</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <div className="mb-2 fw-bold">Past Sessions {filterClassTitle ? `— ${filterClassTitle}` : ''}</div>
      {filteredSessions.length === 0 ? (
        <div>No sessions yet.</div>
      ) : (
        <ListGroup>
          {filteredSessions.map((s, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <div><strong>{s.classTitle}</strong> — {new Date(s.date).toLocaleDateString()}</div>
                <div className="text-muted small">Present: {s.entries.filter(e => e.present).length}/{s.entries.length}</div>
              </div>
              <Button size="sm" variant="outline-danger" onClick={() => deleteSession(idx)}>Delete</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default LecturerAttendance;


