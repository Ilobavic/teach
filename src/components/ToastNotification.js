import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ notification, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'note': return '📄';
      case 'assignment': return '📚';
      case 'announcement': return '📢';
      case 'quiz': return '📝';
      case 'grade': return '🏆';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'note': return 'primary';
      case 'assignment': return 'warning';
      case 'announcement': return 'info';
      case 'quiz': return 'success';
      case 'grade': return 'secondary';
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'primary';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast 
        show={show} 
        onClose={handleClose}
        bg={getNotificationColor(notification.type)}
        className="text-white animate__animated animate__fadeIn"
      >
        <Toast.Header closeButton={false}>
          <span className="me-2 fs-5">
            {getNotificationIcon(notification.type)}
          </span>
          <strong className="me-auto">New {notification.type}</strong>
          <small className="text-muted">now</small>
        </Toast.Header>
        <Toast.Body>
          <div className="fw-bold">{notification.title}</div>
          <div className="small">
            From: {notification.from}
          </div>
          {notification.content && (
            <div className="small mt-1" style={{ opacity: 0.9 }}>
              {notification.content.length > 100 
                ? notification.content.substring(0, 100) + '...'
                : notification.content
              }
            </div>
          )}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
