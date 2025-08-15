import React, { useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import StudentNotes from './Notes';
import StudentClasses from './Classes';
import StudentAssignments from './Assignments';
import StudentQuizzes from './Quizzes';
import StudentAnnouncements from './Announcements';
import StudentGrades from './Grades';
import StudentCalendar from './Calendar';
import ClassDirectory from './ClassDirectory';

const StudentDashboard = () => {
  const user = getCurrentUser();
  const [refreshToken, setRefreshToken] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = useMemo(() => new URLSearchParams(location.search).get('tab') || 'notes', [location.search]);

  return (
    <>
      <h2 className="mb-3">Student Dashboard</h2>
      <Card className="mb-4 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Card.Title>Hello {user?.name || 'Student'}</Card.Title>
          <Card.Text>Here are the notes shared by your lecturers.</Card.Text>
          <Button variant="outline-secondary" size="sm" onClick={() => setRefreshToken((v) => v + 1)}>
            Refresh
          </Button>
        </Card.Body>
      </Card>
      <Tabs activeKey={defaultTab} onSelect={(k) => navigate(`/student?tab=${k}`)} className="mb-3">
        <Tab eventKey="notes" title="📄 Notes">
          <StudentNotes key={`notes-${refreshToken}`} />
        </Tab>
        <Tab eventKey="assignments" title="📚 Assignments">
          <StudentAssignments key={`assign-${refreshToken}`} />
        </Tab>
        <Tab eventKey="grades" title="🏆 Grades">
          <StudentGrades key={`grades-${refreshToken}`} />
        </Tab>
        <Tab eventKey="quizzes" title="📝 Take Quiz">
          <StudentQuizzes key={`quiz-${refreshToken}`} />
        </Tab>
        <Tab eventKey="classes" title="🎥 My Lecturer's Classes">
          <StudentClasses key={`classes-${refreshToken}`} />
        </Tab>
        <Tab eventKey="directory" title="🎥 Other Lecturers' Classes">
          <ClassDirectory />
        </Tab>
        <Tab eventKey="calendar" title="📅 Calendar">
          <StudentCalendar key={`cal-${refreshToken}`} />
        </Tab>
        <Tab eventKey="announcements" title="📢 Announcements">
          <StudentAnnouncements key={`ann-${refreshToken}`} />
        </Tab>
      </Tabs>
    </>
  );
};

export default StudentDashboard;


