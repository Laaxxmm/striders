import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminAddEvent from './pages/AdminAddEvent';
import EventDetails from './pages/EventDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/add-event" element={<AdminAddEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
};

export default App;