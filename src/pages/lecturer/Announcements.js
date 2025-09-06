import React, { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadAnnouncements, saveAnnouncements, getCurrentUser } from '../../services/auth';
import { notifyStudentsOfNewContent } from '../../services/notifications';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setAnnouncements(loadAnnouncements());
  }, []);

  const addAnnouncement = (e) => {
    e.preventDefault();
    if (!message.trim() && !fileObject && !link.trim()) return;
    let fileUrl = null;
    let fileName = null;
    if (fileObject) {
      fileUrl = URL.createObjectURL(fileObject);
      fileName = fileObject.name;
    }
    const newItem = {
      message: message.trim(),
      link: link.trim(),
      fileUrl,
      fileName,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...announcements];
    setAnnouncements(updated);
    saveAnnouncements(updated);
    
    // Notify students of new announcement
    const user = getCurrentUser();
    const title = message.trim() || (fileName ? `New file: ${fileName}` : 'New announcement');
    const content = message.trim() || (fileName ? `New file uploaded: ${fileName}` : 'New announcement posted');
    
    const notification = notifyStudentsOfNewContent(
      'announcement',
      title,
      content,
      user?.name || 'Lecturer'
    );
    
    // Trigger toast notification
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
    
    setMessage('');
    setLink('');
    setFileObject(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteAnnouncement = (idx) => {
    if (!window.confirm('Delete this announcement?')) return;
    const updated = announcements.filter((_, i) => i !== idx);
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  return (
    <div>
      <h3 className="mb-3">Announcements</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addAnnouncement}>
            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Optional Link</Form.Label>
              <Form.Control placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Optional Attachment</Form.Label>
              <Form.Control ref={fileRef} type="file" onChange={(e) => setFileObject(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="success">Post</Button>
          </Form>
        </Card.Body>
      </Card>

      {announcements.length === 0 ? (
        <div>No announcements yet.</div>
      ) : (
        <ListGroup>
          {announcements.map((a, idx) => (
            <ListGroup.Item key={idx} className="card-hover d-flex justify-content-between align-items-start">
              <div>
                <div>{a.message || <span className="text-muted">(no message)</span>}</div>
                <div className="text-muted small">{new Date(a.createdAt).toLocaleString()}</div>
                {a.link && <a href={a.link} target="_blank" rel="noreferrer">Open link</a>}
                {a.fileUrl && (
                  <div>
                    <a href={a.fileUrl} download={a.fileName} className="btn btn-outline-primary btn-sm mt-1">Download attachment</a>
                  </div>
                )}
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => deleteAnnouncement(idx)}>
                <i className="bi bi-trash me-1"></i>
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Announcements;


