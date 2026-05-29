import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Destinations from './components/Destinations/Destinations';
import PropertyGrid from './components/PropertyGrid/PropertyGrid';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Footer from './components/Footer/Footer';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PropertyDetails from './components/PropertyDetails/PropertyDetails';
import UserDashboard from './components/UserDashboard/UserDashboard';
import './App.css';
import 'lenis/dist/lenis.css';

const Home = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isOwner = user && user.role === 'owner';
  
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Destinations />
        <PropertyGrid />
        {isOwner && <RegistrationForm />}
      </main>
      <Footer />
    </>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.05,
      wheelMultiplier: 0.8,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
