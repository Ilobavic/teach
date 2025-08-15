import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { getCurrentUser, loadLecturerClasses, loadEnrollments, saveEnrollments } from '../../services/auth';

const ClassDirectory = () => {
  const allClasses = loadLecturerClasses();
  const user = getCurrentUser();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [lecturerName, setLecturerName] = useState('');
  const [time, setTime] = useState('');
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  const subjects = useMemo(() => {
    const set = new Set();
    allClasses.forEach((c) => { if (c.subject) set.add(c.subject); });
    return Array.from(set);
  }, [allClasses]);

  const filtered = useMemo(() => {
    return allClasses.filter((c) => {
      const matchesQuery = !query || (c.title?.toLowerCase().includes(query.toLowerCase()) || c.subject?.toLowerCase().includes(query.toLowerCase()));
      const matchesSubject = !subject || c.subject === subject;
      const matchesLecturer = !lecturerName || (c.lecturer && c.lecturer.toLowerCase().includes(lecturerName.toLowerCase()));
      const matchesTime = !time || (c.schedule && String(c.schedule).includes(time));
      return matchesQuery && matchesSubject && matchesLecturer && matchesTime;
    });
  }, [allClasses, query, subject, lecturerName, time]);

  const openJoin = (cls) => { setSelected(cls); setShow(true); };
  const close = () => { setShow(false); setSelected(null); };

  const confirmJoin = () => {
    if (!user || !selected) return;
    const existing = loadEnrollments();
    const newEnrollment = {
      studentId: user.id,
      classTitle: selected.title,
      subject: selected.subject || '',
      lecturer: selected.lecturer || '',
      schedule: selected.schedule || '',
      meetingLocation: selected.meetingLocation || '',
      link: selected.link || '',
      joinedAt: new Date().toISOString()
    };
    saveEnrollments([newEnrollment, ...existing]);
    close();
  };

  return (
    <div>
      <h4 className="mb-3">Class Directory</h4>
      <div className="row g-2 mb-3">
        <div className="col-md-4"><Form.Control placeholder="Search title or subject" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="col-md-2">
          <Form.Select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </Form.Select>
        </div>
        <div className="col-md-3"><Form.Control placeholder="Lecturer name" value={lecturerName} onChange={(e) => setLecturerName(e.target.value)} /></div>
        <div className="col-md-3"><Form.Control placeholder="Day/Time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
      </div>

      <Row>
        {filtered.map((cls, idx) => (
          <Col md={4} key={idx}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{cls.subject || cls.title}</Card.Title>
                {cls.lecturer && <Card.Subtitle className="text-muted">{cls.lecturer}</Card.Subtitle>}
                {cls.schedule && <p className="mb-1">{isNaN(new Date(cls.schedule)) ? cls.schedule : new Date(cls.schedule).toLocaleString()}</p>}
                <div className="text-muted small mb-2">Location: {cls.meetingLocation ? cls.meetingLocation : 'Not set'}</div>
                <Button variant="success" onClick={() => openJoin(cls)}>Join Class</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <div className="fw-bold">{selected.subject || selected.title}</div>
              {selected.lecturer && <div>Lecturer: {selected.lecturer}</div>}
              {selected.schedule && <div>Schedule: {isNaN(new Date(selected.schedule)) ? selected.schedule : new Date(selected.schedule).toLocaleString()}</div>}
              {selected.link && <div>Link: <a href={selected.link} target="_blank" rel="noreferrer">Open</a></div>}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="success" onClick={confirmJoin}>Confirm Enrollment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClassDirectory;


