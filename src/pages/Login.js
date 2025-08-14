import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { login } from '../services/auth';

const Login = ({ defaultRole = 'student', hideRoleSelect = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.role) setRole(location.state.role);
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !userId.trim()) {
      setError('Please enter name and ID Number');
      return;
    }
    // mock auth: accept any credentials
    login(role, name.trim(), userId.trim());
    if (role === 'student') {
      navigate('/student', { replace: true });
    } else {
      navigate('/lecturer', { replace: true });
    }
  };

  return (
    <Card className="mx-auto card-hover animate__animated animate__fadeIn" style={{ maxWidth: 480 }}>
      <Card.Body>
        <Card.Title className="mb-3">Login</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {!hideRoleSelect && (
            <Form.Group className="mb-3">
              <Form.Label>Login as</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ID Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your ID Number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            <i className="bi bi-box-arrow-in-right me-1"></i>
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;


