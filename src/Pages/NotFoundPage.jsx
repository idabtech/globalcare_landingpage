import React from 'react';

const NotFoundPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#333' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#666' }}>Page Not Found</h2>
            <p style={{ color: '#888' }}>The page you are looking for doesn't exist or has been moved.</p>
            <a href="/" style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
                Go Back Home
            </a>
        </div>
    );
};

export default NotFoundPage;
