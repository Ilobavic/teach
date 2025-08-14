import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { loadAssignments } from '../../services/auth';

const StudentAssignments = () => {
	const items = loadAssignments();
	return (
		<div>
			<h4 className="mb-3">Assignments</h4>
			{items.length === 0 ? (
				<div>No assignments.</div>
			) : (
				<ListGroup>
					{items.map((a, idx) => (
						<ListGroup.Item key={idx} className="d-flex justify-content-between align-items-start">
							<div>
								<strong>{a.title}</strong>
								<div className="text-muted small">{new Date(a.createdAt).toLocaleString()} • {a.fileName}</div>
								{a.dueDate && <div>Due: {new Date(a.dueDate).toLocaleDateString()}</div>}
								{a.description && <div style={{ whiteSpace: 'pre-wrap' }}>{a.description}</div>}
							</div>
							{a.fileUrl && (
								<Button as="a" href={a.fileUrl} download={a.fileName} variant="outline-primary" size="sm">Download</Button>
							)}
						</ListGroup.Item>
					))}
				</ListGroup>
			)}
		</div>
	);
};

export default StudentAssignments;


