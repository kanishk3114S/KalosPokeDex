import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PokemonDetail from './pages/PokemonDetail';
import MegaDex from './pages/MegaDex';
import TeamBuilder from './pages/TeamBuilder';
import PokemonCompare from './pages/PokemonCompare';
import Navbar from './components/Navbar';
import Credits from './components/Credits';
import AuthModal from './components/AuthModal';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Credits />
      <AuthModal />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Guest-First: Root immediately accesses the Pokédex */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mega-dex" element={<MegaDex />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/compare" element={<PokemonCompare />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <AnimatedRoutes />
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
