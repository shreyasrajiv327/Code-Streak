import { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
function Bookmarks({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [urlFocused, setUrlFocused] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/bookmarks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBookmarks(res.data);
        setError(null);
      } catch {
        setError('Failed to load bookmarks.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required.');
      return;
    }
    setError(null);
    try {
      const res = await axios.post(
        `${backendUrl}/api/bookmarks`,
        { title, url },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBookmarks([res.data, ...bookmarks]);
      setTitle('');
      setUrl('');
    } catch {
      setError('Failed to add bookmark.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch {
      setError('Failed to delete bookmark.');
    }
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Please log in to manage your bookmarks.</p>;

  // Styles
  const styles = {
    container: {
      maxWidth: 700,
      margin: '2rem auto',
      padding: '1rem',
      fontFamily: "'Inter', sans-serif",
      color: '#1a1a1a',
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    input: (focused) => ({
      flex: 1,
      padding: '0.6rem 0.8rem',
      borderRadius: 6,
      border: focused ? '2px solid #007aff' : '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    }),
    button: {
      padding: '0.6rem 1.2rem',
      borderRadius: 6,
      border: 'none',
      backgroundColor: '#007aff',
      color: 'white',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      flexShrink: 0,
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '1rem',
      fontWeight: 600,
    },
    loading: {
      textAlign: 'center',
      marginTop: '1rem',
      fontStyle: 'italic',
      color: '#555',
    },
    list: {
      listStyle: 'none',
      paddingLeft: 0,
      marginTop: 0,
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.8rem 0',
      borderBottom: '1px solid #eee',
    },
    link: {
      color: '#007aff',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '1.05rem',
    },
    deleteBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ff3b30',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Bookmarks</h1>

      <form onSubmit={handleAddBookmark} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          style={styles.input(titleFocused)}
          aria-label="Bookmark title"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setUrlFocused(true)}
          onBlur={() => setUrlFocused(false)}
          style={styles.input(urlFocused)}
          aria-label="Bookmark URL"
        />
        <button type="submit" style={styles.button}>
          Add
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p style={styles.loading}>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>No bookmarks saved yet.</p>
      ) : (
        <ul style={styles.list}>
          {bookmarks.map(({ _id, title, url }) => (
            <li key={_id} style={styles.listItem}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                {title}
              </a>
              <button
                onClick={() => handleDelete(_id)}
                style={styles.deleteBtn}
                title="Delete bookmark"
                aria-label={`Delete bookmark ${title}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookmarks;
