import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadCalendarEvents, saveCalendarEvents } from '../../services/auth';

const LecturerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [type, setType] = useState('class');
  const [link, setLink] = useState('');

  useEffect(() => {
    setEvents(loadCalendarEvents());
  }, []);

  const addEvent = (e) => {
    e.preventDefault();
    if (!title.trim() || !datetime) return;
    const newEvent = { title: title.trim(), datetime, type, link: link.trim(), createdAt: new Date().toISOString() };
    const updated = [newEvent, ...events];
    setEvents(updated);
    saveCalendarEvents(updated);
    setTitle('');
    setDatetime('');
    setType('class');
    setLink('');
  };

  const deleteEvent = (idx) => {
    const detail = {
      title: 'Delete event',
      message: 'Delete this event?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      styleMode: 'dark',
      onConfirm: () => {
        const updated = events.filter((_, i) => i !== idx);
        setEvents(updated);
        saveCalendarEvents(updated);
      }
    };
    window.dispatchEvent(new CustomEvent('showConfirm', { detail }));
  };

  return (
    <div>
      <h3 className="mb-3">Calendar</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addEvent}>
            <div className="row g-2">
              <div className="col-md-4">
                <Form.Label>Title</Form.Label>
                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="col-md-3">
                <Form.Label>Date & Time</Form.Label>
                <Form.Control type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
              </div>
              <div className="col-md-2">
                <Form.Label>Type</Form.Label>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="class">Class</option>
                  <option value="deadline">Deadline</option>
                  <option value="event">Event</option>
                </Form.Select>
              </div>
              <div className="col-md-3">
                <Form.Label>Link (optional)</Form.Label>
                <Form.Control value={link} onChange={(e) => setLink(e.target.value)} />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <Button className="mt-2" type="submit" variant="success">Add</Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {events.length === 0 ? (
        <div>No events.</div>
      ) : (
        <ListGroup>
          {events.map((ev, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>[{ev.type}]</strong> {ev.title}
                <div className="text-muted small">{new Date(ev.datetime).toLocaleString()}</div>
                {ev.link && <a href={ev.link} target="_blank" rel="noreferrer">Open Link</a>}
              </div>
              <Button size="sm" variant="outline-danger" onClick={() => deleteEvent(idx)}>Delete</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default LecturerCalendar;


