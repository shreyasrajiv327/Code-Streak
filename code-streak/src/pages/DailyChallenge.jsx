import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import useWindowSize from '../hooks/useWindowSize';
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

function DailyChallenge({ user, onLogout }) {
  const [dailyProblem, setDailyProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solved, setSolved] = useState(false);
  const { width } = useWindowSize();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) return;

    const fetchDailyProblem = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/daily-challenge`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDailyProblem(res.data);
        setLoading(false);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const streakRes = await axios.get(`${backendUrl}/api/streaks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const todayStreak = streakRes.data.find(
          (streak) => new Date(streak.date).toDateString() === today.toDateString()
        );
        if (todayStreak?.solved) {
          setSolved(true);
        }
      } catch (err) {
        console.error('Error fetching daily problem:', err.message);
        setError('Failed to load daily problem. Please try again.');
        setLoading(false);
      }
    };

    fetchDailyProblem();
  }, [user]);

  const handleMarkAsSolved = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/streaks/solve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSolved(true);
    } catch (err) {
      console.error('Error marking as solved:', err.message);
      setError('Failed to mark as solved. Please try again.');
    }
  };

  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '2rem',
          background: theme === 'light'
            ? 'linear-gradient(to bottom right, #f9f9f9, #eaeaea)'
            : 'linear-gradient(to bottom right, #1a1a1a, #121212)',
          color: theme === 'light' ? '#333' : '#eee',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: '1.25rem',
          fontWeight: '500',
        }}
      >
        Please log in to view the daily challenge.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: width < 768 ? '100%' : '1200px',
        margin: width < 768 ? '2rem auto' : '4rem auto',
        padding: width < 768 ? '0 1rem' : '0 2rem',
        textAlign: 'center',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#1a1a1a',
        minHeight: '100vh',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1
          style={{
            fontSize: width < 768 ? '2rem' : '2.8rem',
            fontWeight: 800,
            color: theme === 'light' ? '#1a1a1a' : '#fff',
            marginBottom: width < 768 ? '0.8rem' : '1.2rem',
          }}
        >
          Daily Challenge
        </h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <p
          style={{
            color: '#ff3b30',
            fontStyle: 'italic',
            fontWeight: 400,
            marginTop: '1rem',
          }}
        >
          {error}
        </p>
      )}

      {dailyProblem && (
        <div
          style={{
            backgroundColor: theme === 'light' ? '#fff' : '#333',
            padding: width < 768 ? '1rem' : '2rem',
            borderRadius: '16px',
            border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: `0 2px 10px ${theme === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)'}`,
          }}
        >
          <h2
            style={{
              fontSize: width < 768 ? '1.5rem' : '2rem',
              fontWeight: 600,
              color: theme === 'light' ? '#1a1a1a' : '#fff',
            }}
          >
            {dailyProblem.problemId.title}
          </h2>
         <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem', // spacing between link and button
    marginTop: '1rem',
  }}
>
  <a
    href={dailyProblem.problemId.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: theme === 'light' ? '#007aff' : '#66b0ff',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: width < 768 ? '1rem' : '1.1rem',
    }}
  >
    View Problem
  </a>

  <button
    onClick={handleMarkAsSolved}
    disabled={solved}
    style={{
      backgroundColor: solved ? '#ccc' : theme === 'light' ? '#007aff' : '#444',
      color: '#fff',
      border: 'none',
      padding: width < 768 ? '0.5rem 1rem' : '0.6rem 1.2rem',
      borderRadius: '8px',
      cursor: solved ? 'not-allowed' : 'pointer',
      fontWeight: 600,
      transition: 'background-color 0.3s ease',
      minWidth: '140px',
    }}
  >
    {solved ? 'Solved!' : 'Mark as Solved'}
  </button>
</div>
        </div>
      )}
    </div>
  );
}

export default DailyChallenge;

