import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import Gallery from '../components/Gallery';
import TrainingLocation from '../components/TrainingLocation';
import Events from '../components/Events';
import AiCoach from '../components/AiCoach';
import Footer from '../components/Footer';
import ScrollTrack from '../components/ScrollTrack';
import Categories from '../components/Categories';

const Home: React.FC = () => {
    return (
        <div className="bg-brand-dark min-h-screen font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
            <ScrollTrack />
            <Navbar />
            <Hero />
            <InfoSection />
            <Categories />
            <Gallery />
            <TrainingLocation />
            <Events />
            <AiCoach />
            <Footer />
        </div>
    );
};

export default Home;
