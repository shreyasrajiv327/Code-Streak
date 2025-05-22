import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Home from './pages/Home.jsx';
import Problems from './pages/Problems.jsx';
import DailyChallenge from './pages/DailyChallenge.jsx';
import About from './pages/About.jsx';
import Bookmark from './pages/Bookmarks.jsx'
import AuthCallback from "./pages/AuthCallBack.jsx"; // 👈 Import here
const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

function App() {
  const [user, setUser] = useState(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (location.pathname === '/auth/callback' && token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/');
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id });
        axios
          .get(`${backendUrl}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUser(res.data.user);
            navigate('/problems');
          })
          .catch(() => {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
          });
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
      }
    } else if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id });
        axios
          .get(`${backendUrl}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUser(res.data.user))
          .catch(() => {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
          });
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
      }
    }
  }, [location, navigate]);

  const handleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        color: '#1a1a1a',
        lineHeight: 1.7,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <nav
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '1rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
          }}
        >
          CodeStreak
        </h2>
       <ul
  style={{
    listStyle: 'none',
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  }}
>
  {['Home', 'Problems', 'Daily Challenge', 'About', 'Bookmarks'].map((item) => (
    <li key={item}>
      <Link
        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
        style={{
          color: linkHovered[item] ? '#1a1a1a' : '#666',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={() => setLinkHovered((prev) => ({ ...prev, [item]: true }))}
        onMouseLeave={() => setLinkHovered((prev) => ({ ...prev, [item]: false }))}
      >
        {item}
      </Link>
    </li>
  ))}
  {user ? (
    <li>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: logoutHovered ? '#e32b20' : '#ff3b30',
          color: '#fff',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'background-color 0.3s ease, transform 0.1s ease',
          boxShadow: '0 2px 8px rgba(255, 59, 48, 0.2)',
        }}
        onMouseEnter={() => setLogoutHovered(true)}
        onMouseLeave={() => setLogoutHovered(false)}
      >
        Logout
      </button>
    </li>
  ) : (
    <li>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: loginHovered ? '#0066cc' : '#007aff',
          color: '#fff',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'background-color 0.3s ease, transform 0.1s ease',
          boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
        }}
        onMouseEnter={() => setLoginHovered(true)}
        onMouseLeave={() => setLoginHovered(false)}
      >
        Login with Google
      </button>
    </li>
  )}
</ul>

          
      </nav>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/problems" element={<Problems user={user} />} />
        <Route path="/daily-challenge" element={<DailyChallenge user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/bookmarks" element={<Bookmark user={user} />} />
        <Route path="/auth/callback" element={<AuthCallback />} /> {/* 👈 Add this */}
        <Route path="*" element={<Home user={user} />} />
      </Routes>
    </div>
  );
}

export default App;