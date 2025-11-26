import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/HomeFigma';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Meetups from './pages/Meetups';
import MeetupDetail from './pages/MeetupDetail';
import CreateMeetup from './pages/CreateMeetup';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const location = useLocation();

  // Scroll to top whenever the route changes (e.g., Explore movies button)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideLayout =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';

  return (
    <div className="App">
      {!hideLayout && <Navbar />}
      <div className={hideLayout ? "" : "container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/meetups/:id" element={<MeetupDetail />} />
          <Route path="/meetups/create" element={<PrivateRoute><CreateMeetup /></PrivateRoute>} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
