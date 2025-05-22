import { useState } from 'react';
import useWindowSize from '../hooks/useWindowSize'; // Import the hook

function ProblemCard({ problem, onEditNotes, onDelete }) {
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const { width } = useWindowSize();

  if (!problem || !problem._id || !problem.title) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: width < 768 ? '1rem' : '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          color: '#999',
          fontStyle: 'italic',
          fontSize: width < 768 ? '0.9rem' : '1rem',
        }}
      >
        Invalid problem data
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: width < 768 ? '1rem' : '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: width < 768 ? '0.6rem' : '0.8rem',
      }}
    >
      <h3
        style={{
          fontSize: width < 768 ? '1rem' : '1.2rem',
          fontWeight: 600,
          marginBottom: 0,
          color: '#1a1a1a',
          letterSpacing: '-0.01em',
        }}
      >
        {problem.title}
      </h3>
      <a
        href={problem.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: linkHovered ? '#0066cc' : '#007aff',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'color 0.3s ease',
          fontSize: width < 768 ? '0.9rem' : '1rem',
        }}
        onMouseEnter={() => setLinkHovered(true)}
        onMouseLeave={() => setLinkHovered(false)}
      >
        View Problem
      </a>
      <p
        style={{
          margin: 0,
          fontSize: width < 768 ? '0.85rem' : '0.95rem',
          fontWeight: 400,
          color: '#666',
        }}
      >
        <strong>Notes:</strong> {problem.notes || 'No notes yet.'}
      </p>
      {problem.tags && problem.tags.length > 0 && (
        <p
          style={{
            margin: 0,
            fontSize: width < 768 ? '0.85rem' : '0.95rem',
            fontWeight: 400,
            color: '#666',
          }}
        >
          <strong>Tags:</strong> {problem.tags.join(', ')}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          gap: width < 768 ? '0.3rem' : '0.5rem',
          marginTop: width < 768 ? '0.5rem' : '0.8rem',
        }}
      >
        <button
          onClick={onEditNotes}
          style={{
            backgroundColor: editHovered ? '#0066cc' : '#007aff',
            color: '#fff',
            border: 'none',
            padding: width < 768 ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background-color 0.3s ease, transform 0.1s ease',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
            fontSize: width < 768 ? '0.85rem' : '1rem',
          }}
          onMouseEnter={() => setEditHovered(true)}
          onMouseLeave={() => setEditHovered(false)}
        >
          Edit Notes
        </button>
        <button
          onClick={onDelete}
          style={{
            backgroundColor: deleteHovered ? '#e32b20' : '#ff3b30',
            color: '#fff',
            border: 'none',
            padding: width < 768 ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background-color 0.3s ease, transform 0.1s ease',
            boxShadow: '0 2px 8px rgba(255, 59, 48, 0.2)',
            fontSize: width < 768 ? '0.85rem' : '1rem',
          }}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProblemCard;