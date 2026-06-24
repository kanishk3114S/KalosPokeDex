import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PokemonDetail from './pages/PokemonDetail';
import Navbar from './components/Navbar';
import Credits from './components/Credits';
import MegaDex from './pages/MegaDex';
import TeamBuilder from './pages/TeamBuilder';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <>
            <Navbar />
            <Credits />
            <Dashboard />
          </>
        } />
        <Route path="/mega-dex" element={
          <>
            <Navbar />
            <Credits />
            <MegaDex />
          </>
        } />
        <Route path="/pokemon/:id" element={
          <>
            <Navbar />
            <Credits />
            <PokemonDetail />
          </>
        } />
        <Route path="/team-builder" element={
          <>
            <Navbar />
            <Credits />
            <TeamBuilder />
          </>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
