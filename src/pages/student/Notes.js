import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { loadLecturerNotes } from '../../services/auth';

const StudentNotes = () => {
  const notes = loadLecturerNotes();
  return (
    <div>
      <h4 className="mb-3">Notes</h4>
      {notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        <ListGroup>
          {notes.map((n, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{n.title}</strong>
                {n.createdAt && <div className="text-muted small">{new Date(n.createdAt).toLocaleString()} • {n.fileName}</div>}
                {n.description && <div style={{ whiteSpace: 'pre-wrap' }}>{n.description}</div>}
              </div>
              {n.fileUrl && (
                <Button as="a" href={n.fileUrl} download={n.fileName} variant="outline-primary" size="sm">
                  Download
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StudentNotes;


