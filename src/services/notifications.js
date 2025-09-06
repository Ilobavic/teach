// Notification system for campus portal
export function createNotification(type, title, content, from, targetRole = 'student') {
  const notification = {
    id: Date.now() + Math.random(),
    type, // 'note', 'assignment', 'announcement', 'quiz', 'grade'
    title,
    content,
    from,
    targetRole,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  const notifications = loadNotifications();
  notifications.unshift(notification); // Add to beginning
  saveNotifications(notifications);
  
  return notification;
}

export function loadNotifications() {
  const raw = localStorage.getItem('campus_notifications');
  return raw ? JSON.parse(raw) : [];
}

export function saveNotifications(notifications) {
  localStorage.setItem('campus_notifications', JSON.stringify(notifications));
}

export function markAsRead(notificationId) {
  const notifications = loadNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
}

export function markAllAsRead() {
  const notifications = loadNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
}

export function getUnreadCount(role = 'student') {
  const notifications = loadNotifications();
  return notifications.filter(n => !n.read && n.targetRole === role).length;
}

export function getNotificationsForRole(role = 'student', limit = 10) {
  const notifications = loadNotifications();
  return notifications
    .filter(n => n.targetRole === role)
    .slice(0, limit);
}

export function deleteNotification(notificationId) {
  const notifications = loadNotifications();
  const updated = notifications.filter(n => n.id !== notificationId);
  saveNotifications(updated);
}

// Message system (email-like)
export function createMessage(subject, content, from, to = 'student') {
  const message = {
    id: Date.now() + Math.random(),
    subject,
    content,
    from,
    to,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  const messages = loadMessages();
  messages.unshift(message);
  saveMessages(messages);
  
  return message;
}

export function loadMessages() {
  const raw = localStorage.getItem('campus_messages');
  return raw ? JSON.parse(raw) : [];
}

export function saveMessages(messages) {
  localStorage.setItem('campus_messages', JSON.stringify(messages));
}

export function markMessageAsRead(messageId) {
  const messages = loadMessages();
  const updated = messages.map(m => 
    m.id === messageId ? { ...m, read: true } : m
  );
  saveMessages(updated);
}

export function getMessagesForUser(role = 'student', limit = 20) {
  const messages = loadMessages();
  return messages
    .filter(m => m.to === role)
    .slice(0, limit);
}

export function getUnreadMessageCount(role = 'student') {
  const messages = loadMessages();
  return messages.filter(m => !m.read && m.to === role).length;
}

// Helper function to trigger notifications when lecturer creates content
export function notifyStudentsOfNewContent(type, title, content, lecturerName) {
  // Create notification
  createNotification(type, title, content, lecturerName, 'student');
  
  // Create message
  createMessage(
    `New ${type}: ${title}`,
    content,
    lecturerName,
    'student'
  );
  
  // Trigger toast notification (this will be handled by the component)
  return {
    type: 'new_content',
    data: {
      type,
      title,
      content,
      from: lecturerName
    }
  };
}
