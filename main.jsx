import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h1>MHR Study Zone</h1>
      <p>Welcome to MHR Study Zone!</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
