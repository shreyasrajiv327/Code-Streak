import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
function Home({ user }) {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchStreaks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/streaks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStreaks(res.data);
      } catch (err) {
        setError('Failed to load streak data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, [user]);

  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const isDaySolved = (date) => {
    return streaks.some(streak => {
      const streakDate = new Date(streak.date);
      streakDate.setHours(0, 0, 0, 0);
      return streakDate.getTime() === date.getTime() && streak.solved;
    });
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <h1>Welcome to CodeStreak</h1>
      {user ? (
        <>
          <p style={{ fontSize: '1.2rem' }}>
            Hello, {user.name || 'User'}! Track coding problems, add notes, and build streaks with daily challenges.
          </p>
          <Link
            to="/problems"
            style={{
              backgroundColor: '#007aff',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              margin: '1rem 0',
              cursor: 'pointer',
            }}
          >
            View Your Problems
          </Link>

          <h2>Your Streak (Last 30 Days)</h2>
          {loading && <p>Loading streak data...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {getLast30Days().map(day => {
              const solved = isDaySolved(day);
              return (
                <div
                  key={day.toISOString()}
                  title={day.toDateString() + (solved ? ' - Solved' : ' - Not solved')}
                  style={{
                    width: '30px',
                    height: '30px',
                    margin: '3px',
                    borderRadius: '4px',
                    backgroundColor: solved ? '#4caf50' : '#ddd',
                    boxShadow: solved ? '0 0 5px #4caf50' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: solved ? 'white' : '#999',
                    userSelect: 'none',
                    cursor: 'default',
                  }}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: '1.2rem' }}>
            Track coding problems, add notes, and build streaks with daily challenges. Login to get started!
          </p>
          <button
            onClick={() => (window.location.href = `${backendUrl}/auth/google`)}
            style={{
              backgroundColor: '#007aff',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Login with Google
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
