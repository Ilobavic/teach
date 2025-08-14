import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadLecturerClasses, saveLecturerClasses } from '../../services/auth';

const Classes = () => {
  const [classesList, setClassesList] = useState([]);
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setClassesList(loadLecturerClasses());
  }, []);

  const addClass = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newClass = {
      title: title.trim(),
      schedule: scheduledAt.trim(),
      link: link.trim(),
      createdAt: new Date().toISOString()
    };
    const updated = [newClass, ...classesList];
    setClassesList(updated);
    saveLecturerClasses(updated);
    setTitle('');
    setScheduledAt('');
    setLink('');
  };

  const deleteClass = (index) => {
    if (!window.confirm('Delete this class?')) return;
    const updated = classesList.filter((_, i) => i !== index);
    setClassesList(updated);
    saveLecturerClasses(updated);
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
            <Form.Group className="mb-3">
              <Form.Label>Scheduled At</Form.Label>
              <Form.Control type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
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


