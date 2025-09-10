import React from "react";
import Badge from "react-bootstrap/Badge";
import { getUnreadCountByType } from "../services/notifications";

const NotificationBell = ({ type, role = "student" }) => {
  const count = getUnreadCountByType(role, type);
  
  return count > 0 ? (
    <Badge 
      bg="danger" 
      pill 
      className="notification-badge ms-1 position-relative" 
      style={{ fontSize: '0.65rem', padding: '0.25em 0.5em' }}
    >
      {count}
    </Badge>
  ) : null;
};

export default NotificationBell;
