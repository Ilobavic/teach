import React, { useMemo, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";
import { getUnreadCountByType } from "../../services/notifications";
import NotificationBell from "../../components/NotificationBell";
import StudentNotes from "./Notes";
import StudentClasses from "./Classes";
import StudentAssignments from "./Assignments";
import StudentQuizzes from "./Quizzes";
import StudentAnnouncements from "./Announcements";
import StudentGrades from "./Grades";
import StudentCalendar from "./Calendar";
import ClassDirectory from "./ClassDirectory";
import Messages from "./Messages";

const StudentDashboard = () => {
  const user = getCurrentUser();
  const [refreshToken, setRefreshToken] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = useMemo(
    () => new URLSearchParams(location.search).get("tab") || "notes",
    [location.search]
  );

  const tabs = [
    { key: "notes", title: "📄 Notes", component: StudentNotes, type: 'note' },
    {
      key: "assignments",
      title: "📚 Assignments",
      component: StudentAssignments,
      type: 'assignment'
    },
    { key: "grades", title: "🏆 Grades", component: StudentGrades, type: 'grade' },
    { key: "quizzes", title: "📝 Take Quiz", component: StudentQuizzes, type: 'quiz' },
    {
      key: "classes",
      title: "🎥 My Lecturer's Classes",
      component: StudentClasses,
      type: 'class'
    },
    {
      key: "directory",
      title: "🎥 Other Lecturers' Classes",
      component: ClassDirectory,
      type: 'directory'
    },
    { key: "calendar", title: "📅 Calendar", component: StudentCalendar },
    {
      key: "announcements",
      title: "📢 Announcements",
      component: StudentAnnouncements,
      count: getUnreadCountByType('student', 'announcement')
    },
    { key: "messages", title: "📧 Messages", component: Messages, count: getUnreadCountByType('student', 'message') },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.key === defaultTab)?.component || StudentNotes;

  return (
    <>
      <h2 className="mb-3">Student Dashboard</h2>
      <Card className="mb-4 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Card.Title>Hello {user?.name || "Student"}</Card.Title>
          <Card.Text>Here are the notes shared by your lecturers.</Card.Text>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setRefreshToken((v) => v + 1)}
          >
            Refresh
          </Button>
        </Card.Body>
      </Card>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>Navigation</Card.Header>
            <Nav variant="pills" className="flex-column">
              {tabs.map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    active={defaultTab === tab.key}
                    onClick={() => navigate(`/student?tab=${tab.key}`)}
                    className="text-start d-flex justify-content-between align-items-center"
                  >
                    <span className="d-flex align-items-center">
                      {tab.title}
                      {tab.type && <NotificationBell type={tab.type} role="student" />}
                    </span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Card>
        </Col>
        <Col md={9}>
          <ActiveComponent key={`${defaultTab}-${refreshToken}`} />
        </Col>
      </Row>
    </>
  );
};

export default StudentDashboard;
