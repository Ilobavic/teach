import React, { useMemo, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import { getCurrentUser, loadGrades } from '../../services/auth';

const StudentGrades = () => {
  const user = getCurrentUser();
  const all = loadGrades();
  const [filterId, setFilterId] = useState(user?.id || '');
  const items = useMemo(() => all.filter((g) => !filterId ? true : String(g.studentId) === String(filterId)), [all, filterId]);
  const average = items.length
    ? Math.round((items.reduce((sum, g) => sum + g.score / g.max, 0) / items.length) * 100)
    : 0;

  return (
    <div>
      <h4 className="mb-3">Grades</h4>
      <div className="mb-3 d-flex gap-2 align-items-end">
        <div className="flex-grow-1">
          <Form.Label>Filter by Student ID</Form.Label>
          <Form.Control value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder="Enter Student ID" />
        </div>
        {user?.id && (
          <div>
            <small className="text-muted">Your ID: {user.id}</small>
          </div>
        )}
      </div>
      <div className="mb-3">
        Overall average
        <ProgressBar now={average} label={`${average}%`} className="mt-1" />
      </div>
      {items.length === 0 ? (
        <div>No grades yet.</div>
      ) : (
        <ListGroup>
          {items.map((g, idx) => (
            <ListGroup.Item key={idx}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>[{g.type}]</strong> {g.itemTitle}
                  <div className="text-muted small">{new Date(g.date).toLocaleString()}</div>
                </div>
                <div className="fw-bold">{g.score}/{g.max}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StudentGrades;


