import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Home = () => {
  return (
    <>
      <div className="hero mb-4 animate__animated animate__fadeIn">
        <h1 className="mb-1"><i className="bi bi-mortarboard-fill me-2"></i>Campus Portal</h1>
        <p className="mb-0">Welcome to the Campus Portal The future of education is here</p>
      </div>
      <Row>
        <Col md={6} className="mb-3">
          <Card className="card-hover">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>Login in to access your dashboard and view notes shared by lecturers.</Card.Text>
              <Button as={Link} to="/login/student" variant="success">
                <i className="bi bi-person-fill me-1"></i>
                Login as Student
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="card-hover">
            <Card.Body>
              <Card.Title>Lecturers</Card.Title>
              <Card.Text>Login in to access your dashboard and manage classes.</Card.Text>
              <Button  as={Link} to="/login/lecturer" variant="primary">
                <i className="bi bi-easel2-fill me-1"></i>
                Login as Lecturer
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;


