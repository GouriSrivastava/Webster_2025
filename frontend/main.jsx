import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="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">
    <App />
  </GoogleOAuthProvider>
);
