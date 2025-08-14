import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { loadAnnouncements } from '../../services/auth';

const StudentAnnouncements = () => {
  const items = loadAnnouncements();
  return (
    <div>
      <h4 className="mb-3">Announcements</h4>
      {items.length === 0 ? (
        <div>No announcements.</div>
      ) : (
        <ListGroup>
          {items.map((a, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <div>{a.message || <span className="text-muted">(no message)</span>}</div>
                <div className="text-muted small">{new Date(a.createdAt).toLocaleString()}</div>
                {a.link && <a href={a.link} target="_blank" rel="noreferrer">Open link</a>}
              </div>
              {a.fileUrl && (
                <Button as="a" href={a.fileUrl} download={a.fileName} variant="outline-primary" size="sm">Download</Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StudentAnnouncements;


