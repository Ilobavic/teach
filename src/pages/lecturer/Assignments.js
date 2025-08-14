import React, { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { loadAssignments, saveAssignments } from '../../services/auth';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setAssignments(loadAssignments());
  }, []);

  const addAssignment = (e) => {
    e.preventDefault();
    if (!title.trim() || !fileObject) return;
    const url = URL.createObjectURL(fileObject);
    const newItem = {
      title: title.trim(),
      description: description.trim(),
      fileName: fileObject.name,
      fileUrl: url,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...assignments];
    setAssignments(updated);
    saveAssignments(updated);
    setTitle('');
    setDescription('');
    setDueDate('');
    setFileObject(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteAssignment = (idx) => {
    if (!window.confirm('Delete this assignment?')) return;
    const updated = assignments.filter((_, i) => i !== idx);
    setAssignments(updated);
    saveAssignments(updated);
  };

  return (
    <div>
      <h3 className="mb-3">Assignments</h3>
      <Card className="mb-3 card-hover animate__animated animate__fadeIn">
        <Card.Body>
          <Form onSubmit={addAssignment}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control ref={fileRef} type="file" onChange={(e) => setFileObject(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="success">
              <i className="bi bi-plus-circle me-1"></i>
              Add Assignment
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {assignments.length === 0 ? (
        <div>No assignments yet.</div>
      ) : (
        <ListGroup>
          {assignments.map((a, idx) => (
            <ListGroup.Item key={idx} className="card-hover d-flex justify-content-between align-items-start">
              <div>
                <strong>{a.title}</strong>
                <div className="text-muted small">{new Date(a.createdAt).toLocaleString()} • {a.fileName}</div>
                {a.dueDate && <div>Due: {new Date(a.dueDate).toLocaleDateString()}</div>}
                {a.description && <div style={{ whiteSpace: 'pre-wrap' }}>{a.description}</div>}
              </div>
              <div className="d-flex gap-2">
                <a href={a.fileUrl} download={a.fileName} className="btn btn-outline-primary btn-sm">Download</a>
                <Button size="sm" variant="outline-danger" onClick={() => deleteAssignment(idx)}>
                  <i className="bi bi-trash me-1"></i>
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Assignments;


