import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import useWindowSize from '../hooks/useWindowSize';

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
        const res = await axios.get('http://localhost:5001/api/problems', {
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
        const res = await axios.get('http://localhost:5001/api/streaks', {
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
          Dashboard
        </h1>
        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: theme === 'light' ? '#ff3b30' : '#666',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {/* Streak Stats */}
      <div
        style={{
          backgroundColor: theme === 'light' ? '#fff' : '#333',
          padding: width < 768 ? '1rem' : '2rem',
          borderRadius: '16px',
          border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'}`,
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            fontSize: width < 768 ? '1.5rem' : '2rem',
            fontWeight: 600,
            color: theme === 'light' ? '#1a1a1a' : '#fff',
            marginBottom: '1rem',
          }}
        >
          Your Streak
        </h2>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <div>
            <p
              style={{
                fontSize: width < 768 ? '1rem' : '1.2rem',
                fontWeight: 500,
                color: theme === 'light' ? '#666' : '#ccc',
              }}
            >
              Current Streak
            </p>
            <p
              style={{
                fontSize: width < 768 ? '1.5rem' : '2rem',
                fontWeight: 700,
                color: theme === 'light' ? '#007aff' : '#66b0ff',
              }}
            >
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: width < 768 ? '1rem' : '1.2rem',
                fontWeight: 500,
                color: theme === 'light' ? '#666' : '#ccc',
              }}
            >
              Longest Streak
            </p>
            <p
              style={{
                fontSize: width < 768 ? '1.5rem' : '2rem',
                fontWeight: 700,
                color: theme === 'light' ? '#007aff' : '#66b0ff',
              }}
            >
              {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        {/* Streak Calendar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width < 768 ? 20 : 30}, 12px)`,
            gap: '4px',
            justifyContent: 'center',
            marginTop: '1rem',
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
                  ? '#ebedf0'
                  : '#444',
                borderRadius: '3px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Existing Stats */}
      <div
        style={{
          backgroundColor: theme === 'light' ? '#fff' : '#333',
          padding: width < 768 ? '1rem' : '2rem',
          borderRadius: '16px',
          border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'}`,
        }}
      >
        <h2
          style={{
            fontSize: width < 768 ? '1.5rem' : '2rem',
            fontWeight: 600,
            color: theme === 'light' ? '#1a1a1a' : '#fff',
            marginBottom: '1rem',
          }}
        >
          Problem Statistics
        </h2>
        <p
          style={{
            fontSize: width < 768 ? '1rem' : '1.2rem',
            color: theme === 'light' ? '#666' : '#ccc',
          }}
        >
          <strong>Total Problems Solved:</strong> {stats.totalProblems}
        </p>
        <p
          style={{
            fontSize: width < 768 ? '1rem' : '1.2rem',
            color: theme === 'light' ? '#666' : '#ccc',
          }}
        >
          <strong>Difficulty Breakdown:</strong>
          <br />
          Easy: {stats.difficultyBreakdown.Easy}, Medium: {stats.difficultyBreakdown.Medium}, Hard: {stats.difficultyBreakdown.Hard}
        </p>
        <p
          style={{
            fontSize: width < 768 ? '1rem' : '1.2rem',
            color: theme === 'light' ? '#666' : '#ccc',
          }}
        >
          <strong>Top Tags:</strong>
          <br />
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