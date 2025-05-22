import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProblemCard from '../components/ProblemCard'; // Still in components/
import NotesModal from '../components/NotesModal'; // Still in components/
import useWindowSize from '../hooks/useWindowSize'; // Path is correct
import { useTheme } from '../context/ThemeContext'; // Path should be correct now
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
// Rest of the Problems.jsx code...

function Problems({ user }) {
  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [folders, setFolders] = useState(['all']);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState({ title: false, link: false, tags: false });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { width } = useWindowSize(); // Use the imported hook

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to home...');
      navigate('/');
      return;
    }

    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const res = await axios.get(`${backendUrl}/api/problems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched problems:', JSON.stringify(res.data, null, 2));
        setProblems(res.data || []);
        const allTags = new Set(res.data.flatMap((problem) => problem.tags || []));
        setFolders(['all', ...allTags]);
        setError(null);
      } catch (err) {
        console.error('Error fetching problems:', err.message);
        setProblems([]);
        setFolders(['all']);
        setError('Failed to fetch problems. Please try logging out and logging in again.');
      }
    };

    fetchProblems();
  }, [user, navigate]);

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newProblem = {
        title,
        link,
        tags: tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
      };
      const res = await axios.post(`${backendUrl}/api/problems`, newProblem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems([...problems, res.data]);
      const allTags = new Set([...problems, res.data].flatMap((problem) => problem.tags || []));
      setFolders(['all', ...allTags]);
      setTitle('');
      setLink('');
      setTags('');
    } catch (err) {
      console.error('Error adding problem:', err.message);
      setError('Failed to add problem. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedProblems = problems.filter((problem) => problem._id !== id);
      setProblems(updatedProblems);
      const allTags = new Set(updatedProblems.flatMap((problem) => problem.tags || []));
      setFolders(['all', ...allTags]);
      if (!allTags.has(selectedFolder) && selectedFolder !== 'all') {
        setSelectedFolder('all');
      }
    } catch (err) {
      console.error('Error deleting problem:', err.message);
      setError('Failed to delete problem. Please try again.');
    }
  };

  const handleEditNotes = (problem) => {
    setSelectedProblem(problem);
    setModalOpen(true);
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${backendUrl}/api/problems/${id}`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProblems(problems.map((problem) => (problem._id === id ? res.data : problem)));
      setModalOpen(false);
      setSelectedProblem(null);
    } catch (err) {
      console.error('Error saving notes:', err.message);
      setError('Failed to save notes. Please try again.');
    }
  };

  const filteredProblems = selectedFolder === 'all'
    ? problems
    : problems.filter((problem) => problem.tags && problem.tags.includes(selectedFolder));

  return (
    <div
      style={{
        maxWidth: width < 768 ? '100%' : '1200px',
        margin: width < 768 ? '2rem auto' : '4rem auto',
        padding: width < 768 ? '0 1rem' : '0 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: width < 768 ? '2rem' : '2.8rem',
          fontWeight: 800,
          color: '#1a1a1a',
          marginBottom: width < 768 ? '0.8rem' : '1.2rem',
          letterSpacing: '-0.03em',
        }}
      >
        Problems
      </h1>
      {error && (
        <p
          style={{
            color: '#ff3b30',
            fontStyle: 'italic',
            fontWeight: 400,
            marginTop: '1rem',
            fontSize: width < 768 ? '0.9rem' : '1rem',
          }}
        >
          {error}
        </p>
      )}
      <div
        style={{
          display: width < 768 ? 'block' : 'flex',
          gap: width < 768 ? '1rem' : '2rem',
          marginTop: width < 768 ? '1rem' : '2rem',
          alignItems: width < 768 ? 'stretch' : 'flex-start',
        }}
      >
        <div
          style={{
            width: width < 768 ? '100%' : '240px',
            backgroundColor: '#fff',
            padding: width < 768 ? '1rem' : '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            height: 'fit-content',
            position: width < 768 ? 'static' : 'sticky',
            top: width < 768 ? 'auto' : '5rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            marginBottom: width < 768 ? '1rem' : 0,
          }}
        >
          <h2
            style={{
              fontSize: width < 768 ? '1rem' : '1.1rem',
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: width < 768 ? '1rem' : '1.5rem',
              letterSpacing: '-0.01em',
              textAlign: 'left',
            }}
          >
            Folders
          </h2>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {folders.map((folder) => (
              <li
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  padding: width < 768 ? '0.5rem 0.8rem' : '0.6rem 1rem',
                  fontSize: width < 768 ? '0.9rem' : '0.95rem',
                  fontWeight: 500,
                  color: selectedFolder === folder || hoveredFolder === folder ? '#007aff' : '#666',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  marginBottom: '0.5rem',
                  backgroundColor:
                    selectedFolder === folder || hoveredFolder === folder
                      ? 'rgba(0, 122, 255, 0.05)'
                      : 'transparent',
                }}
                onMouseEnter={() => setHoveredFolder(folder)}
                onMouseLeave={() => setHoveredFolder(null)}
              >
                {folder}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: width < 768 ? '1rem' : '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            minHeight: '500px',
          }}
        >
          <form
            onSubmit={handleAddProblem}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: width < 768 ? '0.8rem' : '1.2rem',
              marginBottom: width < 768 ? '1rem' : '2rem',
              padding: width < 768 ? '1rem' : '1.5rem',
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <input
              type="text"
              placeholder="Problem Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: width < 768 ? '0.6rem' : '0.8rem',
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                borderRadius: '8px',
                fontSize: width < 768 ? '0.9rem' : '0.95rem',
                backgroundColor: '#fff',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                width: '100%',
                borderColor: inputFocused.title ? '#007aff' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: inputFocused.title ? '0 0 0 3px rgba(0, 122, 255, 0.1)' : 'none',
              }}
              onFocus={() => setInputFocused((prev) => ({ ...prev, title: true }))}
              onBlur={() => setInputFocused((prev) => ({ ...prev, title: false }))}
            />
            <input
              type="url"
              placeholder="Problem Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              style={{
                padding: width < 768 ? '0.6rem' : '0.8rem',
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                borderRadius: '8px',
                fontSize: width < 768 ? '0.9rem' : '0.95rem',
                backgroundColor: '#fff',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                width: '100%',
                borderColor: inputFocused.link ? '#007aff' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: inputFocused.link ? '0 0 0 3px rgba(0, 122, 255, 0.1)' : 'none',
              }}
              onFocus={() => setInputFocused((prev) => ({ ...prev, link: true }))}
              onBlur={() => setInputFocused((prev) => ({ ...prev, link: false }))}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                padding: width < 768 ? '0.6rem' : '0.8rem',
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                borderRadius: '8px',
                fontSize: width < 768 ? '0.9rem' : '0.95rem',
                backgroundColor: '#fff',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                width: '100%',
                borderColor: inputFocused.tags ? '#007aff' : 'rgba(0, 0, 0, 0.1)',
                boxShadow: inputFocused.tags ? '0 0 0 3px rgba(0, 122, 255, 0.1)' : 'none',
              }}
              onFocus={() => setInputFocused((prev) => ({ ...prev, tags: true }))}
              onBlur={() => setInputFocused((prev) => ({ ...prev, tags: false }))}
            />
            <button
              type="submit"
              style={{
                backgroundColor: buttonHovered ? '#0066cc' : '#007aff',
                color: '#fff',
                border: 'none',
                padding: width < 768 ? '0.6rem' : '0.8rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background-color 0.3s ease, transform 0.1s ease',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
                alignSelf: 'flex-end',
                width: width < 768 ? '120px' : '150px',
                fontSize: width < 768 ? '0.9rem' : '1rem',
              }}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
            >
              Add Problem
            </button>
          </form>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: width < 768
                ? '1fr'
                : width < 1024
                ? 'repeat(auto-fill, minmax(250px, 1fr))'
                : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: width < 768 ? '1rem' : '1.5rem',
            }}
          >
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  onEditNotes={() => handleEditNotes(problem)}
                  onDelete={() => handleDelete(problem._id)}
                />
              ))
            ) : (
              <p
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#999',
                  marginTop: '1rem',
                  fontSize: width < 768 ? '0.9rem' : '1rem',
                }}
              >
                No problems in this folder.
              </p>
            )}
          </div>
        </div>
      </div>
      {modalOpen && selectedProblem && (
        <NotesModal
          problem={selectedProblem}
          onSave={handleSaveNotes}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Problems;