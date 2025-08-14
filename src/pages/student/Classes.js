import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { loadLecturerClasses } from '../../services/auth';

const StudentClasses = () => {
  const classesList = loadLecturerClasses();
  return (
    <div>
      <h4 className="mb-3">Classes</h4>
      {classesList.length === 0 ? (
        <div>No classes available.</div>
      ) : (
        <ListGroup>
          {classesList.map((c, idx) => (
            <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{c.title}</strong>
                {c.createdAt && <div className="text-muted small">{new Date(c.createdAt).toLocaleString()}</div>}
                {c.schedule && (
                  <div>
                    Scheduled: {isNaN(new Date(c.schedule)) ? c.schedule : new Date(c.schedule).toLocaleString()}
                  </div>
                )}
              </div>
              {c.link && (
                <Button as="a" href={c.link} target="_blank" rel="noreferrer" variant="primary" size="sm">
                  Join
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StudentClasses;


