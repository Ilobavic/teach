import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const Home = () => {
  return (
    <Container fluid className="px-3 px-md-4 py-3">
      <div className="hero mb-4 animate__animated animate__fadeIn text-center text-md-start p-3 p-md-4 rounded">
        <h1 className="mb-2 mb-md-3 fs-2 fs-md-1"><i className="bi bi-mortarboard-fill me-2"></i>Campus Portal</h1>
        <p className="mb-0 fs-6 fs-md-5">Welcome to the Campus Portal The future of education is here</p>
      </div>
      <Row className="g-3">
        <Col xs={12} md={6} className="mb-3">
          <Card className="card-hover h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-4 mb-3">Students</Card.Title>
              <Card.Text className="flex-grow-1">Login in to access your dashboard and view notes shared by lecturers.</Card.Text>
              <div className="mt-auto text-center text-md-start">
                <Button as={Link} to="/login/student" variant="success" className="w-100 w-md-auto">
                  <i className="bi bi-person-fill me-1"></i>
                  Login as Student
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <Card className="card-hover h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="fs-4 mb-3">Lecturers</Card.Title>
              <Card.Text className="flex-grow-1">Login in to access your dashboard and manage classes.</Card.Text>
              <div className="mt-auto text-center text-md-start">
                <Button as={Link} to="/login/lecturer" variant="primary" className="w-100 w-md-auto">
                  <i className="bi bi-easel2-fill me-1"></i>
                  Login as Lecturer
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;


