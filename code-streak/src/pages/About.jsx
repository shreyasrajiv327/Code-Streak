function About() {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          color: '#1a1a1a',
          marginBottom: '1.2rem',
          letterSpacing: '-0.03em',
        }}
      >
        About CodeStreak
      </h1>
      <p
        style={{
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#666',
          marginBottom: '2rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        CodeStreak is your daily coding companion designed to help you track your coding problems, solve daily challenges, and maintain your coding streak. Built with love for coders by a coder!
      </p>
    </div>
  );
}

export default About;