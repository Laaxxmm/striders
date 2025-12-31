import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfoSection from './components/InfoSection';
import Categories from './components/Categories';
import Events from './components/Events';
import AiCoach from './components/AiCoach';
import Footer from './components/Footer';
import ScrollTrack from './components/ScrollTrack';

const App: React.FC = () => {
  return (
    <div className="bg-brand-dark min-h-screen font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      <ScrollTrack />
      <Navbar />
      <Hero />
      <InfoSection />
      <Categories />
      <Events />
      <AiCoach />
      <Footer />
    </div>
  );
};

export default App;