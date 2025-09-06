import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import { getMessagesForUser, markMessageAsRead, getUnreadMessageCount } from '../../services/notifications';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadMessages();
    
    // Update messages every 10 seconds
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const userMessages = getMessagesForUser('student', 50);
    const unread = getUnreadMessageCount('student');
    setMessages(userMessages);
    setUnreadCount(unread);
  };

  const handleMessageClick = (message) => {
    if (!message.read) {
      markMessageAsRead(message.id);
      loadMessages();
    }
    setSelectedMessage(message);
    setShowModal(true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  };

  const getMessageIcon = (subject) => {
    if (subject.toLowerCase().includes('assignment')) return '📚';
    if (subject.toLowerCase().includes('note')) return '📄';
    if (subject.toLowerCase().includes('announcement')) return '📢';
    if (subject.toLowerCase().includes('quiz')) return '📝';
    if (subject.toLowerCase().includes('grade')) return '🏆';
    return '📧';
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-envelope-fill me-2"></i>
            Messages
            {unreadCount > 0 && (
              <Badge bg="danger" className="ms-2">
                {unreadCount}
              </Badge>
            )}
          </h5>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={loadMessages}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {messages.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
              <h6>No messages yet</h6>
              <p className="mb-0">You'll receive messages from your lecturers here.</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {messages.map((message) => (
                <ListGroup.Item
                  key={message.id}
                  className={`border-0 ${!message.read ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMessageClick(message)}
                >
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <span className="fs-4">
                        {getMessageIcon(message.subject)}
                      </span>
                    </Col>
                    <Col>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className={`fw-bold ${!message.read ? 'text-primary' : ''}`}>
                            {message.subject}
                          </div>
                          <div className="text-muted small">
                            From: {message.from}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {!message.read && (
                            <div className="bg-primary rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                          )}
                          <i className="bi bi-chevron-right text-muted"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Message Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMessage && (
              <>
                <span className="me-2">
                  {getMessageIcon(selectedMessage.subject)}
                </span>
                {selectedMessage.subject}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <div className="mb-3">
                <strong>From:</strong> {selectedMessage.from}
              </div>
              <div className="mb-3">
                <strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}
              </div>
              <hr />
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage.content}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Messages;
