import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Billing from "./pages/Billing";
import Preview from "./pages/Preview.jsx";
import Projects from "./pages/Projects";
import Modify from "./pages/Modify";
import Deploy from "./pages/Deploy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="/deploy" element={<Deploy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
