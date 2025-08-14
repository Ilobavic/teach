import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadCalendarEvents } from '../../services/auth';

const StudentCalendar = () => {
  const events = loadCalendarEvents();
  return (
    <div>
      <h4 className="mb-3">Calendar</h4>
      {events.length === 0 ? (
        <div>No events.</div>
      ) : (
        <ListGroup>
          {events.map((ev, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>[{ev.type}]</strong> {ev.title}
                <div className="text-muted small">{new Date(ev.datetime).toLocaleString()}</div>
              </div>
              {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">Open</a>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StudentCalendar;


