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
import ConfirmModal from "./components/ConfirmModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./scripts/responsive.js";

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
  const [loadingClass, setLoadingClass] = useState("");

  useEffect(() => {
    // Start with a minimum loading time for better UX
    const minLoadTime = 2500;
    
    // Simulate app initialization
    const initializeApp = async () => {
      // Add any initialization logic here
      await new Promise(resolve => setTimeout(resolve, minLoadTime));
      
      // Fade out loading screen
      setLoadingClass("fade-out");
      
      // Remove loading component after animation completes
      setTimeout(() => setLoading(false), 500);
    };
    
    initializeApp();
    
    return () => {};
  }, []);

  if (loading) {
    return (
      <div className={loadingClass}>
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm">
        <Container>
          <NavbarBrand />
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Navbar.Toggle>
          <NavbarBody />
        </Container>
      </Navbar>
      
      {/* Toast Manager for notifications */}
      <ToastManager />

      <Container className="py-4 animate__animated animate__fadeIn">
        <ConfirmModal />
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
    // show the styled confirm modal via a custom event
    const detail = {
      title: 'Logout',
      message: 'Are you sure you want to logout? You will be returned to the homepage.',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      styleMode: 'dark',
      onConfirm: () => {
        // play a quick page fade-out by adding a class to root
        document.documentElement.classList.add('cp-page-exit');
        setTimeout(() => {
          logout();
          navigate('/', { replace: true });
        }, 420);
      },
    };
    window.dispatchEvent(new CustomEvent('showConfirm', { detail }));
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
