import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadLecturerClasses, loadLecturerNotes, loadAssignments } from '../../services/auth';

// Helper accessors that include classId fields if present
function getClassById(id) {
  const classes = loadLecturerClasses();
  return classes.find((c) => String(c.id) === String(id));
}

const ClassPage = () => {
  const { id } = useParams();
  const cls = getClassById(id);

  if (!cls) {
    return (
      <Alert variant="warning" className="mt-3">
        This class is currently not available. Please check back later.
      </Alert>
    );
  }

  // Demo-only: load all notes/assignments and show; in a real app, filter by classId/subject
  const notes = loadLecturerNotes ? loadLecturerNotes() : [];
  const assignments = loadAssignments ? loadAssignments() : [];

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{cls.subject || cls.title}</Card.Title>
          {cls.lecturer && <Card.Subtitle className="text-muted mb-2">Lecturer: {cls.lecturer}</Card.Subtitle>}
          {cls.schedule && <div className="mb-2">Schedule: {isNaN(new Date(cls.schedule)) ? cls.schedule : new Date(cls.schedule).toLocaleString()}</div>}
          <div className="mb-2">
            Meeting Location: {cls.meetingLocation ? (
              <span>{cls.meetingLocation}</span>
            ) : (
              <span className="text-danger">Meeting location not set yet</span>
            )}
          </div>
          {cls.link && <Button as="a" href={cls.link} target="_blank" rel="noreferrer" variant="success">Join Live</Button>}
        </Card.Body>
      </Card>

      <h5 className="mb-2">Notes</h5>
      {notes.length === 0 ? (
        <div className="text-muted mb-3">No notes yet.</div>
      ) : (
        <ListGroup className="mb-3">
          {notes.map((n, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{n.title}</strong>
                {n.description && <div>{n.description}</div>}
              </div>
              {n.fileUrl && (
                <Button as="a" href={n.fileUrl} download={n.fileName} variant="outline-primary" size="sm">Download</Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h5 className="mb-2">Assignments</h5>
      {assignments.length === 0 ? (
        <div className="text-muted">No assignments yet.</div>
      ) : (
        <ListGroup>
          {assignments.map((a, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{a.title}</strong>
                {a.dueDate && <div className="text-muted small">Due: {new Date(a.dueDate).toLocaleDateString()}</div>}
                {a.description && <div>{a.description}</div>}
              </div>
              {a.fileUrl && (
                <Button as="a" href={a.fileUrl} download={a.fileName} variant="outline-primary" size="sm">Download</Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="mt-3">
        <Button as={Link} to="/student?tab=directory" variant="secondary">Back to Directory</Button>
      </div>
    </div>
  );
};

export default ClassPage;


