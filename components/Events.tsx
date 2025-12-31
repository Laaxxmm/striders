import React, { useState } from 'react';
import { MapPin, ArrowRight, Loader } from 'lucide-react';
import { generateEventImage } from '../services/gemini';
import { EventItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Events: React.FC = () => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);

  // Mock data state
  const [events] = useState<EventItem[]>([
    {
      id: '1',
      title: 'Mumbai Monsoon Cup',
      date: 'Aug 24, 2024',
      location: 'Jio World Garden, Mumbai',
      category: 'All Categories',
      imageUrl: '/event_image_2.jpg'
    },
    {
      id: '2',
      title: 'Bangalore Strider Blast',
      date: 'Sept 10, 2024',
      location: 'Cubbon Park, Bangalore',
      category: 'Advanced Only',
      imageUrl: '/event_image_1.jpg'
    },
    {
      id: '3',
      title: 'Delhi Capital Race',
      date: 'Oct 02, 2024',
      location: 'Nehru Park, Delhi',
      category: 'Beginners Special',
      imageUrl: '/event_image_3.jpg'
    }
  ]);

  const handleGeneratePreview = async () => {
    if (!process.env.API_KEY) {
      alert("API Key missing! Cannot generate image.");
      return;
    }
    setLoadingImg(true);
    const result = await generateEventImage("Kids balance bike race in a colorful park in India, vibrant colors, photorealistic, 4k, cinematic lighting, purple and yellow flags");
    if (result) setGeneratedImg(result);
    setLoadingImg(false);
  };

  return (
    <section id="events" className="py-24 bg-brand-dark relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-brand-gold font-bold tracking-widest text-xs uppercase">Live Registrations</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Upcoming <span className="text-brand-gold">Races</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="hidden md:flex items-center gap-2 text-white font-bold hover:text-brand-gold transition-colors">
              Full Calendar <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-5 space-y-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                onMouseEnter={() => { setHoveredEvent(event.id); setGeneratedImg(null); }}
                className={`group p-6 rounded-2xl cursor-pointer bg-white/5 border relative`}
                animate={{
                  borderColor: hoveredEvent === event.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                  backgroundColor: hoveredEvent === event.id ? 'rgba(76, 29, 149, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: hoveredEvent === event.id ? '0 0 25px rgba(251, 191, 36, 0.2)' : '0 0 0 rgba(0,0,0,0)'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text - xs font - bold uppercase tracking - wider px - 2 py - 1 rounded transition - colors duration - 300 ${hoveredEvent === event.id ? 'bg-white/20 text-white' : 'bg-brand-gold/20 text-brand-gold'} `}>
                    {event.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{event.date}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{event.title}</h3>
                <div className="flex items-center text-gray-400 group-hover:text-gray-200 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7 h-[300px] md:h-[500px] relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-brand-dark/50">
            <div className="absolute inset-0 bg-brand-violet/20 animate-pulse z-0" />

            {/* Main Image */}
            <AnimatePresence mode='wait'>
              <motion.img
                key={hoveredEvent || 'default'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={generatedImg || (hoveredEvent ? events.find(e => e.id === hoveredEvent)?.imageUrl : events[0]?.imageUrl)}
                alt="Event Preview"
                className="w-full h-full object-cover relative z-10"
              />
            </AnimatePresence>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent z-20 flex flex-col justify-end p-8 md:p-12">
              <div className="glass-panel p-6 rounded-2xl backdrop-blur-md">
                <h4 className="font-display font-bold text-2xl text-white mb-2">
                  {hoveredEvent ? events.find(e => e.id === hoveredEvent)?.title : events[0]?.title}
                </h4>
                <div className="flex justify-between items-end">
                  <p className="text-gray-300 text-sm max-w-sm">
                    A professionally managed track with safety barriers, medical support, and photography team.
                  </p>

                  {/* AI Preview Button Removed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;