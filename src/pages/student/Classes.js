import React, { useMemo } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  getCurrentUser,
  loadEnrollments,
  loadLecturerClasses,
} from "../../services/auth";

const StudentClasses = () => {
  const classesList = loadLecturerClasses();
  const user = getCurrentUser();
  const enrollments = loadEnrollments();
  const myOtherClasses = useMemo(
    () => (user ? enrollments.filter((e) => e.studentId === user.id) : []),
    [enrollments, user]
  );

  return (
    <div>
      <h4 className="mb-3">Classes</h4>
      {classesList.length === 0 ? (
        <div>No classes available.</div>
      ) : (
        <Row>
          {classesList.map((c, idx) => (
            <Col md={6} lg={4} key={idx} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{c.title}</Card.Title>
                  <Card.Text>
                    {c.createdAt && (
                      <div className="text-muted small">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    )}
                    {c.schedule && (
                      <div>
                        Scheduled:{" "}
                        {isNaN(new Date(c.schedule))
                          ? c.schedule
                          : new Date(c.schedule).toLocaleString()}
                      </div>
                    )}
                    <div>
                      Meeting Location:{" "}
                      {c.meetingLocation ? (
                        c.meetingLocation
                      ) : c.location ? (
                        c.location
                      ) : (
                        <span className="text-danger">Not set</span>
                      )}
                    </div>
                  </Card.Text>
                  <Badge bg="success" className="me-2">
                    Available
                  </Badge>
                  <Button variant="success" size="sm" className="me-2">
                    <i className="bi bi-person-plus-fill me-1"></i>
                    Enroll
                  </Button>
                  {c.link && (
                    <Button
                      as="a"
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      variant="primary"
                      size="sm"
                    >
                      Join
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {myOtherClasses.length > 0 && (
        <div className="mt-4">
          <h5>Other Lecturers' Classes You've Joined</h5>
          <Row>
            {myOtherClasses.map((c, idx) => (
              <Col md={6} lg={4} key={idx} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{c.classTitle}</Card.Title>
                    <Card.Text>
                      <div className="text-muted small">
                        {c.subject} • {c.lecturer}
                      </div>
                      {c.schedule && (
                        <div>
                          Scheduled:{" "}
                          {isNaN(new Date(c.schedule))
                            ? c.schedule
                            : new Date(c.schedule).toLocaleString()}
                        </div>
                      )}
                      <div>
                        Meeting Location:{" "}
                        {c.meetingLocation ? (
                          c.meetingLocation
                        ) : (
                          <span className="text-danger">Not set</span>
                        )}
                      </div>
                    </Card.Text>
                    <Badge bg="secondary" className="me-2">
                      Enrolled
                    </Badge>
                    {c.link && (
                      <Button
                        as="a"
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        variant="outline-primary"
                        size="sm"
                      >
                        Join
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
