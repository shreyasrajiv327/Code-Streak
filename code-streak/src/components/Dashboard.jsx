import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import useWindowSize from '../hooks/useWindowSize';
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalProblems: 0,
    difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    tagsBreakdown: {},
  });
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const { width } = useWindowSize();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${backendUrl}/api/problems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const problems = res.data || [];

        const difficultyBreakdown = { Easy: 0, Medium: 0, Hard: 0 };
        const tagsBreakdown = {};

        problems.forEach((problem) => {
          difficultyBreakdown[problem.difficulty] = (difficultyBreakdown[problem.difficulty] || 0) + 1;
          (problem.tags || []).forEach((tag) => {
            tagsBreakdown[tag] = (tagsBreakdown[tag] || 0) + 1;
          });
        });

        setStats({
          totalProblems: problems.length,
          difficultyBreakdown,
          tagsBreakdown,
        });
      } catch (err) {
        console.error('Error fetching stats:', err.message);
      }
    };

    const fetchStreakData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${backendUrl}/api/streaks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStreakData(res.data || []);

        // Calculate streaks
        const sortedStreaks = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        let current = 0;
        let longest = 0;
        let tempStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let prevDate = null;

        sortedStreaks.forEach((streak) => {
          const streakDate = new Date(streak.date);
          streakDate.setHours(0, 0, 0, 0);

          if (streak.solved) {
            if (prevDate) {
              const diffDays = (streakDate - prevDate) / (1000 * 60 * 60 * 24);
              if (diffDays === 1) {
                tempStreak += 1;
              } else if (diffDays > 1) {
                tempStreak = 1;
              }
            } else {
              tempStreak = 1;
            }

            // Check if this streak includes today or yesterday
            const diffFromToday = (today - streakDate) / (1000 * 60 * 60 * 24);
            if (diffFromToday <= 1) {
              current = tempStreak;
            }

            longest = Math.max(longest, tempStreak);
            prevDate = streakDate;
          }
        });

        setCurrentStreak(current);
        setLongestStreak(longest);
      } catch (err) {
        console.error('Error fetching streak data:', err.message);
      }
    };

    fetchStats();
    fetchStreakData();
  }, [user]);

  // Generate a 6-month calendar grid (e.g., 180 days)
  const generateCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const streakEntry = streakData.find(
        (streak) => new Date(streak.date).toDateString() === date.toDateString()
      );
      days.push({
        date,
        solved: streakEntry ? streakEntry.solved : false,
      });
    }
    return days.reverse();
  };

  const calendarDays = generateCalendar();

 return (
  <div
    style={{
      maxWidth: '1000px',
      margin: '4rem auto',
      padding: '2rem',
      backgroundColor: theme === 'light' ? '#fafafa' : '#111',
      fontFamily: `'Inter', 'Segoe UI', sans-serif`,
      transition: 'all 0.3s ease-in-out',
      color: theme === 'light' ? '#1a1a1a' : '#f0f0f0',
    }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        margin: 0,
        color: theme === 'light' ? '#111' : '#f5f5f5',
      }}>
        Dashboard
      </h1>
      <button
        onClick={onLogout}
        style={{
          background: theme === 'light' ? '#e74c3c' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '0.5rem 1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        Logout
      </button>
    </div>

    {/* Your Streak Section */}
    <div style={{
      background: theme === 'light' ? '#ffffff' : '#1f1f1f',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: theme === 'light'
        ? '0 1px 6px rgba(0,0,0,0.05)'
        : '0 1px 6px rgba(255,255,255,0.05)',
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
      }}>
        Your Streak
      </h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4rem',
        marginBottom: '1rem',
      }}>
        <div>
          <p style={{ margin: 0, color: '#888' }}>Current Streak</p>
          <p style={{
            fontSize: '1.6rem',
            fontWeight: 600,
            color: '#34c759',
            margin: 0,
          }}>{currentStreak} day{currentStreak !== 1 && 's'}</p>
        </div>
        <div>
          <p style={{ margin: 0, color: '#888' }}>Longest Streak</p>
          <p style={{
            fontSize: '1.6rem',
            fontWeight: 600,
            color: '#007aff',
            margin: 0,
          }}>{longestStreak} day{longestStreak !== 1 && 's'}</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(30, 12px)`,
          gap: '5px',
          justifyContent: 'center',
          marginTop: '1.5rem',
        }}
      >
        {calendarDays.map((day, index) => (
          <div
            key={index}
            title={day.date.toDateString()}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: day.solved
                ? theme === 'light'
                  ? '#34c759'
                  : '#66ff99'
                : theme === 'light'
                ? '#e5e5e5'
                : '#333',
              borderRadius: '4px',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>

    {/* Stats Section */}
    <div style={{
      background: theme === 'light' ? '#ffffff' : '#1f1f1f',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: theme === 'light'
        ? '0 1px 6px rgba(0,0,0,0.05)'
        : '0 1px 6px rgba(255,255,255,0.05)',
    }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' }}>Problem Stats</h2>
      <p style={{ color: '#888' }}>
        <strong>Total Solved:</strong> {stats.totalProblems}
      </p>
      <p style={{ color: '#888' }}>
        <strong>Difficulty:</strong> Easy ({stats.difficultyBreakdown.Easy}), Medium ({stats.difficultyBreakdown.Medium}), Hard ({stats.difficultyBreakdown.Hard})
      </p>
      <p style={{ color: '#888' }}>
        <strong>Top Tags:</strong>{' '}
        {Object.entries(stats.tagsBreakdown)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag, count]) => `${tag}: ${count}`)
          .join(', ') || 'None'}
      </p>
    </div>
  </div>
);

}

export default Dashboard;
