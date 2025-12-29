import React from 'react';

// Polyfill for crypto.randomUUID for non-secure contexts
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
    crypto.randomUUID = () => {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };
}
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
