import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Event } from '../lib/supabase';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('registration_status', 'open')
        .order('date', { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <section id="events" className="py-24 bg-brand-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-white text-xl">Loading events...</div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events" className="py-24 bg-brand-dark relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming <span className="text-brand-gold">Races</span>
          </h2>
          <p className="text-gray-400">No upcoming events at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

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
              <Link key={event.id} to={`/event/${event.id}`}>
                <motion.div
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  className={`group p-6 rounded-2xl cursor-pointer bg-white/5 border relative`}
                  animate={{
                    borderColor: hoveredEvent === event.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                    backgroundColor: hoveredEvent === event.id ? 'rgba(76, 29, 149, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: hoveredEvent === event.id ? '0 0 25px rgba(251, 191, 36, 0.2)' : '0 0 0 rgba(0,0,0,0)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors duration-300 ${hoveredEvent === event.id ? 'bg-white/20 text-white' : 'bg-brand-gold/20 text-brand-gold'}`}>
                      {event.registration_status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{formatDate(event.date)}</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">{event.name}</h3>
                  <div className="flex items-center text-gray-400 group-hover:text-gray-200 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </motion.div>
              </Link>
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
                src={hoveredEvent ? events.find(e => e.id === hoveredEvent)?.image_url || '/event_image_1.jpg' : events[0]?.image_url || '/event_image_1.jpg'}
                alt="Event Preview"
                className="w-full h-full object-cover relative z-10"
              />
            </AnimatePresence>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent z-20 flex flex-col justify-end p-8 md:p-12">
              <div className="glass-panel p-6 rounded-2xl backdrop-blur-md">
                <h4 className="font-display font-bold text-2xl text-white mb-2">
                  {hoveredEvent ? events.find(e => e.id === hoveredEvent)?.name : events[0]?.name}
                </h4>
                <div className="flex justify-between items-end">
                  <p className="text-gray-300 text-sm max-w-sm">
                    {hoveredEvent ? events.find(e => e.id === hoveredEvent)?.description.substring(0, 100) + '...' : events[0]?.description.substring(0, 100) + '...'}
                  </p>
                  <Link
                    to={`/event/${hoveredEvent || events[0]?.id}`}
                    className="bg-brand-gold text-brand-dark px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    View Event <ArrowRight size={18} />
                  </Link>
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