import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import LecturerDashboard from './pages/lecturer/Dashboard';
import Notes from './pages/lecturer/Notes';
import Classes from './pages/lecturer/Classes';
import ClassPage from './pages/student/ClassPage';

import { getCurrentUserRole, isAuthenticated, logout } from './services/auth';

function App() {
  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="bi bi-mortarboard-fill me-2" style={{ fontSize: 24 }}></i>
            Campus Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBody />
        </Container>
      </Navbar>

      <Container className="py-4 animate__animated animate__fadeIn">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/student" element={<Login defaultRole="student" hideRoleSelect />} />
          <Route path="/login/lecturer" element={<Login defaultRole="lecturer" hideRoleSelect />} />
          <Route
            path="/student/*"
            element={
              <RequireAuth role="student">
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/lecturer"
            element={
              <RequireAuth role="lecturer">
                <LecturerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/lecturer/notes"
            element={
              <RequireAuth role="lecturer">
                <Notes />
              </RequireAuth>
            }
          />
          <Route
            path="/lecturer/classes"
            element={
              <RequireAuth role="lecturer">
                <Classes />
              </RequireAuth>
            }
          />
          <Route
            path="/class/:id"
            element={
              <RequireAuth role="student">
                <ClassPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

function NavbarBody() {
  const location = useLocation();
  const pathname = location.pathname || '';
  const isOnLogin = pathname.startsWith('/login');
  const role = getCurrentUserRole();
  const authed = isAuthenticated();
  const isStudentArea = pathname.startsWith('/student');
  const isLecturerArea = pathname.startsWith('/lecturer');

  if (isOnLogin) return null;

  return (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        {!authed && (
          <>
            <Nav.Link as={Link} to="/login/student">Student Login</Nav.Link>
            <Nav.Link as={Link} to="/login/lecturer">Lecturer Login</Nav.Link>
          </>
        )}
        {authed && role === 'student' && isStudentArea && (
          <NavDropdown title="Student" id="student-nav-dropdown">
            <NavDropdown.Item as={Link} to="/student?tab=notes">Notes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=assignments">Assignments</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=grades">Grades</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=quizzes">Take Quiz</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=classes">Join Class</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=calendar">Calendar</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/student?tab=announcements">Announcements</NavDropdown.Item>
          </NavDropdown>
        )}
        {authed && role === 'lecturer' && isLecturerArea && (
          <NavDropdown title="Lecturer" id="lecturer-nav-dropdown">
            <NavDropdown.Item as={Link} to="/lecturer?tab=notes">Notes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=assignments">Assignments</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=quizzes">Quizzes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=classes">Classes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=attendance">Attendance</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=grades">Grades</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=calendar">Calendar</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/lecturer?tab=announcements">Announcements</NavDropdown.Item>
          </NavDropdown>
        )}
      </Nav>
      <Nav>
        {!authed ? (
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        ) : (
          <Nav.Link onClick={() => { logout(); window.location.href = '/'; }}>Logout</Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  );
}

function RequireAuth({ children, role }) {
  const authed = isAuthenticated();
  const currentRole = getCurrentUserRole();
  if (!authed) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

export default App;
