import React, { useState, useEffect } from 'react';
import ToastNotification from './ToastNotification';

// Global toast notification function
export const showToast = (type, title, message) => {
  const event = new CustomEvent('newNotification', {
    detail: {
      type: 'action_feedback',
      data: { type, title, message }
    }
  });
  window.dispatchEvent(event);
};

// Helper functions for common toast types
export const showSuccessToast = (message, title = 'Success') => showToast('success', title, message);
export const showErrorToast = (message, title = 'Error') => showToast('error', title, message);
export const showInfoToast = (message, title = 'Information') => showToast('info', title, message);
export const showWarningToast = (message, title = 'Warning') => showToast('warning', title, message);

const ToastManager = ({ role = 'student' }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for new notifications
    const handleNewNotification = (event) => {
      if (event.detail && 
         (event.detail.type === 'new_content' || event.detail.type === 'action_feedback')) {
        const { data } = event.detail;
        addToast(data);
      }
    };

    // Listen for custom events
    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [role]);

  const addToast = (notification) => {
    const toast = {
      id: Date.now() + Math.random(),
      ...notification
    };
    
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  return (
    <>
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default ToastManager;
