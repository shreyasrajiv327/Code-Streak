function About() {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '5rem auto',
        padding: '0 2rem',
        textAlign: 'center',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1f2937', // Tailwind slate-800
          marginBottom: '1.2rem',
        }}
      >
        About <span style={{ color: '#3b82f6' }}>CodeStreak</span>
      </h1>

      <p
        style={{
          fontSize: '1.15rem',
          color: '#4b5563', // Tailwind gray-600
          marginBottom: '2.5rem',
          lineHeight: '1.7',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
        }}
      >
        CodeStreak is your daily coding companion designed to help you stay consistent, solve daily challenges, and maintain your coding streak like a pro. Whether you're preparing for placements, cracking interviews, or building a habit, CodeStreak keeps you motivated and on track. Built with love for developers, by a developer.
      </p>

      <div
        style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '2rem',
          marginTop: '3rem',
          color: '#6b7280', // Tailwind gray-500
        }}
      >
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Developed by <span style={{ color: '#111827', fontWeight: '600' }}>Shreyas Rajiv</span>
        </h3>
        <p style={{ margin: '0.3rem 0' }}>
          📧 Email: <a href="mailto:shreyasrajiv327@gmail.com" style={{ color: '#3b82f6' }}>shreyasrajiv327@gmail.com</a>
        </p>
        <p>
          💻 GitHub: <a href="https://github.com/shreyasrajiv327" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>github.com/shreyasrajiv327</a>
        </p>
      </div>
    </div>
  );
}

export default About;

