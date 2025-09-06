import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadLecturerNotes, saveLecturerNotes, getCurrentUser } from '../../services/auth';
import { notifyStudentsOfNewContent } from '../../services/notifications';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setNotes(loadLecturerNotes());
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !fileObject) return;
    const objectUrl = URL.createObjectURL(fileObject);
    const newNote = {
      title: title.trim(),
      description: description.trim(),
      fileName: fileObject.name,
      fileUrl: objectUrl,
      createdAt: new Date().toISOString()
    };
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    saveLecturerNotes(newNotes);
    
    // Notify students of new note
    const user = getCurrentUser();
    const notification = notifyStudentsOfNewContent(
      'note',
      newNote.title,
      newNote.description || `New note: ${newNote.fileName}`,
      user?.name || 'Lecturer'
    );
    
    // Trigger toast notification
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
    
    setTitle('');
    setDescription('');
    setFileObject(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteNote = (index) => {
    if (!window.confirm('Delete this note?')) return;
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    saveLecturerNotes(newNotes);
  };

  return (
    <div>
      <h3 className="mb-3">Manage Notes</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addNote}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control ref={fileInputRef} type="file" onChange={(e) => setFileObject(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="success">
              <i className="bi bi-plus-circle me-1"></i>
              Add Note
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        <ListGroup>
          {notes.map((n, idx) => (
            <ListGroup.Item key={idx} className="card-hover">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{n.title}</strong>
                  <div className="text-muted small">{new Date(n.createdAt).toLocaleString()} • {n.fileName}</div>
                  {n.description && <div style={{ whiteSpace: 'pre-wrap' }}>{n.description}</div>}
                </div>
                <div className="d-flex gap-2">
                  {n.fileUrl && (
                    <a href={n.fileUrl} download={n.fileName} className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-download me-1"></i>
                      Download
                    </a>
                  )}
                  <Button variant="outline-danger" size="sm" onClick={() => deleteNote(idx)}>
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Notes;


