export function login(role, name, id) {
  const user = { role, name, id };
  localStorage.setItem('portal_user', JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem('portal_user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('portal_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

export function getCurrentUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

export function saveLecturerNotes(notes) {
  localStorage.setItem('lecturer_notes', JSON.stringify(notes));
}

export function loadLecturerNotes() {
  const raw = localStorage.getItem('lecturer_notes');
  return raw ? JSON.parse(raw) : [];
}

export function saveLecturerClasses(classesList) {
  localStorage.setItem('lecturer_classes', JSON.stringify(classesList));
}

export function loadLecturerClasses() {
  const raw = localStorage.getItem('lecturer_classes');
  return raw ? JSON.parse(raw) : [];
}

export function resetDemoData() {
  localStorage.removeItem('lecturer_notes');
  localStorage.removeItem('lecturer_classes');
  localStorage.removeItem('portal_user');
}

// Assignments
export function saveAssignments(assignments) {
  localStorage.setItem('lecturer_assignments', JSON.stringify(assignments));
}

export function loadAssignments() {
  const raw = localStorage.getItem('lecturer_assignments');
  return raw ? JSON.parse(raw) : [];
}

// Quizzes
export function saveQuizzes(quizzes) {
  localStorage.setItem('lecturer_quizzes', JSON.stringify(quizzes));
}

export function loadQuizzes() {
  const raw = localStorage.getItem('lecturer_quizzes');
  return raw ? JSON.parse(raw) : [];
}

// Announcements
export function saveAnnouncements(announcements) {
  localStorage.setItem('lecturer_announcements', JSON.stringify(announcements));
}

export function loadAnnouncements() {
  const raw = localStorage.getItem('lecturer_announcements');
  return raw ? JSON.parse(raw) : [];
}

// Attendance
export function saveAttendanceSessions(sessions) {
  localStorage.setItem('attendance_sessions', JSON.stringify(sessions));
}

export function loadAttendanceSessions() {
  const raw = localStorage.getItem('attendance_sessions');
  return raw ? JSON.parse(raw) : [];
}

// Grades
export function saveGrades(grades) {
  localStorage.setItem('grades_records', JSON.stringify(grades));
}

export function loadGrades() {
  const raw = localStorage.getItem('grades_records');
  return raw ? JSON.parse(raw) : [];
}

// Calendar events
export function saveCalendarEvents(events) {
  localStorage.setItem('calendar_events', JSON.stringify(events));
}

export function loadCalendarEvents() {
  const raw = localStorage.getItem('calendar_events');
  return raw ? JSON.parse(raw) : [];
}


