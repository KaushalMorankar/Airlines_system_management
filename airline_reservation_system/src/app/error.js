// src/app/error.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to the console or send to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Oops, something went wrong!</h1>
        <p style={styles.message}>
          We're working hard to fix the issue. Please try again later.
        </p>
        <button style={styles.button} onClick={() => router.push('/')}>
          Return Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6b73ff 0%, #000dff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1rem',
    fontSize: '2rem',
    color: '#333'
  },
  message: {
    marginBottom: '1.5rem',
    fontSize: '1.125rem',
    color: '#666'
  },
  button: {
    backgroundColor: '#000dff',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
