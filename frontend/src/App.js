import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Components
import { Home } from './components/Home';
import { About } from './components/About';
import { Users } from './components/Users';
import { NavBar } from './components/Navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
