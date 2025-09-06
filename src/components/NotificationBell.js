import React, { useState, useEffect } from 'react';
import { Button, Badge, Dropdown, ListGroup } from 'react-bootstrap';
import { getUnreadCount, getNotificationsForRole, markAsRead, markAllAsRead } from '../services/notifications';

const NotificationBell = ({ role = 'student' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    updateNotifications();
    
    // Update notifications every 5 seconds
    const interval = setInterval(updateNotifications, 5000);
    return () => clearInterval(interval);
  }, [role]);

  const updateNotifications = () => {
    const count = getUnreadCount(role);
    const notifs = getNotificationsForRole(role, 5);
    setUnreadCount(count);
    setNotifications(notifs);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
      updateNotifications();
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    updateNotifications();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'note': return '📄';
      case 'assignment': return '📚';
      case 'announcement': return '📢';
      case 'quiz': return '📝';
      case 'grade': return '🏆';
      default: return '🔔';
    }
  };

  return (
    <Dropdown show={show} onToggle={setShow}>
      <Dropdown.Toggle as={Button} variant="link" className="position-relative p-0">
        <i className="bi bi-bell-fill fs-5 text-white"></i>
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.7rem' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" style={{ minWidth: '300px', maxWidth: '400px' }}>
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
          <h6 className="mb-0">Notifications</h6>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="p-0"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-3 text-center text-muted">
            <i className="bi bi-bell-slash fs-4 mb-2 d-block"></i>
            No notifications yet
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`border-0 ${!notification.read ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="d-flex align-items-start">
                  <span className="me-2 fs-5">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{notification.title}</div>
                    <div className="text-muted small">
                      From: {notification.from}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        
        {notifications.length > 0 && (
          <div className="p-2 border-top text-center">
            <Button variant="link" size="sm" className="text-decoration-none">
              View all notifications
            </Button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
