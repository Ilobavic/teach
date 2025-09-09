import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Loading from "./components/Loading";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NotificationBell from "./components/NotificationBell";
import ToastManager from "./components/ToastManager";

import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import LecturerDashboard from "./pages/lecturer/Dashboard";
import Notes from "./pages/lecturer/Notes";
import Classes from "./pages/lecturer/Classes";
import ClassPage from "./pages/student/ClassPage";

import { getCurrentUserRole, isAuthenticated, logout } from "./services/auth";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm">
        <Container>
          <NavbarBrand />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBody />
        </Container>
      </Navbar>

      <Container className="py-4 animate__animated animate__fadeIn">
        <ToastManager role={getCurrentUserRole()} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login />
              </LoginGuard>
            }
          />
          <Route
            path="/login/student"
            element={
              <LoginGuard>
                <Login defaultRole="student" hideRoleSelect />
              </LoginGuard>
            }
          />
          <Route
            path="/login/lecturer"
            element={
              <LoginGuard>
                <Login defaultRole="lecturer" hideRoleSelect />
              </LoginGuard>
            }
          />
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

function NavbarBrand() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const role = getCurrentUserRole();

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (!authed) {
      // If not authenticated, go to home
      navigate("/");
    } else {
      // If authenticated, go to appropriate dashboard
      if (role === "student") {
        navigate("/student");
      } else if (role === "lecturer") {
        navigate("/lecturer");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <Navbar.Brand
      href="#"
      onClick={handleBrandClick}
      style={{ cursor: "pointer" }}
    >
      <i className="bi bi-mortarboard-fill me-2" style={{ fontSize: 24 }}></i>
      Campus Portal
    </Navbar.Brand>
  );
}

function NavbarBody() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname || "";
  const isOnLogin = pathname.startsWith("/login");
  const authed = isAuthenticated();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/", { replace: true });
    }
  };

  if (isOnLogin) return null;

  return (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">{/* Navigation dropdowns removed */}</Nav>
      <Nav className="align-items-center">
        {authed && (
          <div className="me-3">
            <NotificationBell role={getCurrentUserRole()} />
          </div>
        )}
        {!authed ? (
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        ) : (
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  );
}

function LoginGuard({ children }) {
  const authed = isAuthenticated();
  const role = getCurrentUserRole();

  if (authed) {
    // If already authenticated, redirect to appropriate dashboard
    if (role === "student") {
      return <Navigate to="/student" replace />;
    } else if (role === "lecturer") {
      return <Navigate to="/lecturer" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function RequireAuth({ children, role }) {
  const authed = isAuthenticated();
  const currentRole = getCurrentUserRole();
  if (!authed) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

export default App;
