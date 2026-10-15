// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client"
import axios from 'axios';
// main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
// WAJIB ADA INI:
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </StrictMode>,
)
