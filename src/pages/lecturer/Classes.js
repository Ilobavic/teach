import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { getCurrentUser, loadLecturerClasses, saveLecturerClasses } from '../../services/auth';

const Classes = () => {
  const [classesList, setClassesList] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setClassesList(loadLecturerClasses());
  }, []);

  const addClass = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newClass = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      title: title.trim(),
      subject: subject.trim(),
      lecturer: getCurrentUser()?.name || '',
      schedule: scheduledAt.trim(),
      meetingLocation: meetingLocation.trim(),
      link: link.trim(),
      classNotes: '',
      testDates: [],
      assignments: [],
      createdAt: new Date().toISOString()
    };
    const updated = [newClass, ...classesList];
    setClassesList(updated);
    saveLecturerClasses(updated);
    setTitle('');
    setScheduledAt('');
    setSubject('');
    setMeetingLocation('');
    setLink('');
  };

  const deleteClass = (index) => {
    const detail = {
      title: 'Delete class',
      message: 'Delete this class?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      styleMode: 'dark',
      onConfirm: () => {
        const updated = classesList.filter((_, i) => i !== index);
        setClassesList(updated);
        saveLecturerClasses(updated);
      }
    };
    window.dispatchEvent(new CustomEvent('showConfirm', { detail }));
  };

  return (
    <div>
      <h3 className="mb-3">Manage Classes</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addClass}>
            <Form.Group className="mb-2">
              <Form.Label>Class Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Subject</Form.Label>
              <Form.Control value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Scheduled At</Form.Label>
              <Form.Control type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Meeting Location</Form.Label>
              <Form.Control placeholder="e.g., Room 205 or Online" value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Meeting Link</Form.Label>
              <Form.Control placeholder="https://meet... or https://zoom.us/..." value={link} onChange={(e) => setLink(e.target.value)} />
            </Form.Group>
            <Button type="submit" variant="info">
              <i className="bi bi-plus-circle me-1"></i>
              Add Class
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {classesList.length === 0 ? (
        <div>No classes yet.</div>
      ) : (
        <ListGroup>
          {classesList.map((c, idx) => (
            <ListGroup.Item key={idx} className="card-hover">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{c.title}</strong>
                  {c.createdAt && <div className="text-muted small">{new Date(c.createdAt).toLocaleString()}</div>}
                  {c.schedule && (
                    <div>
                      Scheduled: {isNaN(new Date(c.schedule)) ? c.schedule : new Date(c.schedule).toLocaleString()}
                    </div>
                  )}
                  <div>
                    Meeting Location: {c.meetingLocation ? c.meetingLocation : <span className="text-danger">Not set</span>}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {c.link && (
                    <a href={c.link} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">Join</a>
                  )}
                  <Button variant="outline-danger" size="sm" onClick={() => deleteClass(idx)}>
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Classes;


