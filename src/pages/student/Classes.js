import React, { useMemo } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { getCurrentUser, loadEnrollments, loadLecturerClasses } from '../../services/auth';

const StudentClasses = () => {
  const classesList = loadLecturerClasses();
  const user = getCurrentUser();
  const enrollments = loadEnrollments();
  const myOtherClasses = useMemo(() => (user ? enrollments.filter(e => e.studentId === user.id) : []), [enrollments, user]);
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
                <div>
                  Meeting Location: {c.meetingLocation ? c.meetingLocation : (c.location ? c.location : <span className="text-danger">Not set</span>)}
                </div>
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
      {myOtherClasses.length > 0 && (
        <div className="mt-4">
          <h5>Other Lecturers' Classes You've Joined</h5>
          <ListGroup>
            {myOtherClasses.map((c, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{c.classTitle}</strong>
                  <div className="text-muted small">{c.subject} • {c.lecturer}</div>
                  {c.schedule && (
                    <div>
                      Scheduled: {isNaN(new Date(c.schedule)) ? c.schedule : new Date(c.schedule).toLocaleString()}
                    </div>
                  )}
                  <div>
                    Meeting Location: {c.meetingLocation ? c.meetingLocation : <span className="text-danger">Not set</span>}
                  </div>
                </div>
                {c.link && (
                  <Button as="a" href={c.link} target="_blank" rel="noreferrer" variant="outline-primary" size="sm">
                    Join
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;


