import React, { useMemo, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
// removed unused imports
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import Notes from './Notes';
import Assignments from './Assignments';
import Quizzes from './Quizzes';
import Classes from './Classes';
import Announcements from './Announcements';
import LecturerAttendance from './Attendance';
import LecturerGrades from './Grades';
import LecturerCalendar from './Calendar';

const LecturerDashboard = () => {
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const active = useMemo(() => new URLSearchParams(location.search).get('tab') || 'notes', [location.search]);
  return (
    <>
      <h2 className="mb-3">Lecturer Dashboard</h2>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Card.Title>Welcome {user?.name || 'Lecturer'}</Card.Title>
          <Card.Text>Use the tabs below to manage your content.</Card.Text>
        </Card.Body>
      </Card>
      <Tabs activeKey={active} onSelect={(k) => navigate(`/lecturer?tab=${k}`)} className="mb-3">
        <Tab eventKey="notes" title="📄 Notes">
          <Notes />
        </Tab>
        <Tab eventKey="assignments" title="📚 Assignments">
          <Assignments />
        </Tab>
        <Tab eventKey="quizzes" title="📝 Quizzes">
          <Quizzes />
        </Tab>
        <Tab eventKey="classes" title="🎥 Classes">
          <Classes />
        </Tab>
        <Tab eventKey="attendance" title="✅ Attendance">
          <LecturerAttendance />
        </Tab>
        <Tab eventKey="grades" title="🏆 Grades">
          <LecturerGrades />
        </Tab>
        <Tab eventKey="calendar" title="📅 Calendar">
          <LecturerCalendar />
        </Tab>
        <Tab eventKey="announcements" title="📢 Announcements">
          <Announcements />
        </Tab>
      </Tabs>
    </>
  );
};

export default LecturerDashboard;


