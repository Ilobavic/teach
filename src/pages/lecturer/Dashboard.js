import React, { useMemo } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";
import { getUnreadCountByType } from "../../services/notifications";
import Notes from "./Notes";
import Assignments from "./Assignments";
import Quizzes from "./Quizzes";
import Classes from "./Classes";
import Announcements from "./Announcements";
import LecturerAttendance from "./Attendance";
import LecturerGrades from "./Grades";
import LecturerCalendar from "./Calendar";

const LecturerDashboard = () => {
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const active = useMemo(
    () => new URLSearchParams(location.search).get("tab") || "notes",
    [location.search]
  );

  const tabs = [
    { key: "notes", title: "📄 Notes", component: Notes, count: getUnreadCountByType('lecturer', 'note') },
    { key: "assignments", title: "📚 Assignments", component: Assignments, count: getUnreadCountByType('lecturer', 'assignment') },
    { key: "quizzes", title: "📝 Quizzes", component: Quizzes, count: getUnreadCountByType('lecturer', 'quiz') },
    { key: "classes", title: "🎥 Classes", component: Classes },
    {
      key: "attendance",
      title: "✅ Attendance",
      component: LecturerAttendance,
    },
    { key: "grades", title: "🏆 Grades", component: LecturerGrades, count: getUnreadCountByType('lecturer', 'grade') },
    { key: "calendar", title: "📅 Calendar", component: LecturerCalendar },
    {
      key: "announcements",
      title: "📢 Announcements",
      component: Announcements,
      count: getUnreadCountByType('lecturer', 'announcement')
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.key === active)?.component || Notes;

  return (
    <>
      <h2 className="mb-3">Lecturer Dashboard</h2>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Card.Title>Welcome {user?.name || "Lecturer"}</Card.Title>
          <Card.Text>
            Use the navigation below to manage your content.
          </Card.Text>
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
                    active={active === tab.key}
                    onClick={() => navigate(`/lecturer?tab=${tab.key}`)}
                    className="text-start d-flex justify-content-between align-items-start"
                  >
                    {tab.title}
                    {tab.count > 0 && <Badge bg="danger">{tab.count}</Badge>}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Card>
        </Col>
        <Col md={9}>
          <ActiveComponent />
        </Col>
      </Row>
    </>
  );
};

export default LecturerDashboard;
