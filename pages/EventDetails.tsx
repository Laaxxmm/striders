import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronDown, Download, Gift, Users, Trophy } from 'lucide-react';
import { supabase, Event, EventCategory, EventInfoSection, EventSponsor } from '../lib/supabase';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [infoSections, setInfoSections] = useState<EventInfoSection[]>([]);
    const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        parentName: '',
        name: '',
        contact: '',
        email: '',
        category: ''
    });

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const fetchEventData = async () => {
        if (!id) return;

        try {
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);

            const { data: categoriesData, error: categoriesError } = await supabase
                .from('event_categories')
                .select('*')
                .eq('event_id', id);

            if (categoriesError) throw categoriesError;
            setCategories(categoriesData || []);

            const { data: infoData, error: infoError } = await supabase
                .from('event_info_sections')
                .select('*')
                .eq('event_id', id)
                .order('order', { ascending: true });

            if (infoError) throw infoError;
            setInfoSections(infoData || []);

            const { data: sponsorsData, error: sponsorsError } = await supabase
                .from('event_sponsors')
                .select('*')
                .eq('event_id', id)
                .order('order', { ascending: true });

            if (sponsorsError) throw sponsorsError;
            setSponsors(sponsorsData || []);

        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!event?.deadline) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const deadline = new Date(event.deadline).getTime();
            const distance = deadline - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [event?.deadline]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCategory = categories.find(c => c.id === formData.category);

        const submissionData = {
            eventName: event?.name,
            parentName: formData.parentName,
            riderName: formData.name,
            contact: formData.contact,
            email: formData.email,
            categoryName: selectedCategory?.name,
            categoryPrice: selectedCategory?.price,
        };

        console.log('Submitting data:', submissionData);
        console.log('Google Form URL:', event?.google_form_url);

        if (event?.google_form_url) {
            try {
                const response = await fetch(event.google_form_url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                    mode: "no-cors"
                });
                console.log("Data sent to Google Sheet successfully");
            } catch (error) {
                console.error("Error sending to Google Sheet:", error);
            }
        } else {
            console.warn('No Google Form URL configured for this event');
        }

        if (event?.razorpay_link) {
            window.location.href = event.razorpay_link;
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-white text-2xl font-display">Loading...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-white text-2xl font-display">Event not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark">
            {/* Hero Banner */}
            {event.image_url && (
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <img
                        src={event.image_url}
                        alt={event.name}
                        className="w-full h-full object-cover object-center"
                        style={{ objectPosition: 'center 30%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />

                    <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
                        <div className="container mx-auto px-4 md:px-6">
                            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-4">
                                {event.name}
                            </h1>
                            <div className="flex flex-wrap gap-3 md:gap-6 text-sm md:text-base text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-brand-gold" size={18} />
                                    <span className="text-xs md:text-base">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="text-brand-gold" size={18} />
                                    <span className="text-xs md:text-base">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-brand-gold" size={18} />
                                    <span className="text-xs md:text-base">{event.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Status Badge */}
                    <div className="absolute top-4 md:top-8 right-4 md:right-8">
                        <div className={`px-3 md:px-6 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider ${event.registration_status === 'open'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}>
                            Registration {event.registration_status}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Countdown Timer */}
                {event.registration_status === 'open' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-brand-gold/10 to-brand-yellow/10 border border-brand-gold/30 rounded-xl md:rounded-2xl p-4 md:p-8 mb-8 md:mb-12"
                    >
                        <h3 className="text-brand-gold font-bold text-xs md:text-sm uppercase tracking-widest mb-3 md:mb-4 text-center">
                            Registration Closes In
                        </h3>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hours', value: timeLeft.hours },
                                { label: 'Minutes', value: timeLeft.minutes },
                                { label: 'Seconds', value: timeLeft.seconds }
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div className="bg-brand-dark/50 rounded-lg md:rounded-xl p-2 md:p-4 mb-1 md:mb-2">
                                        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
                                            {item.value.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-gray-400 text-[10px] md:text-sm uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                    {/* LEFT COLUMN - Registration Form */}
                    <div className="space-y-6">
                        {event.registration_status === 'open' ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 lg:sticky lg:top-6"
                            >
                                <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-4 md:mb-6">Register Now</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase mb-2">Rider Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Parent Name</label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Contact</label>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Select Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-gold focus:outline-none"
                                            required
                                        >
                                            <option value="">Choose a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name} - ₹{cat.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark font-display font-bold text-base md:text-xl py-3 md:py-4 rounded-lg md:rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
                                    >
                                        Proceed to Payment
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                                <h3 className="font-display font-bold text-2xl text-red-500 mb-2">Registration Closed</h3>
                                <p className="text-gray-400">Registration for this event has ended.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Event Details */}
                    <div className="space-y-6">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8"
                        >
                            <h3 className="font-display font-bold text-2xl text-white mb-4 flex items-center gap-2">
                                <Trophy className="text-brand-gold" size={24} />
                                About This Event
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {event.description}
                            </p>
                        </motion.div>

                        {/* Categories/Age Groups */}
                        {categories.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8"
                            >
                                <h3 className="font-display font-bold text-lg md:text-2xl text-white mb-3 md:mb-4 flex items-center gap-2">
                                    <Users className="text-brand-gold" size={24} />
                                    Age Categories
                                </h3>
                                <div className="space-y-3">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex justify-between items-center bg-black/20 rounded-xl p-4">
                                            <span className="text-white font-bold">{cat.name}</span>
                                            <span className="text-brand-gold font-bold">₹{cat.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Course Map */}
                        {event.course_map_url && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8"
                            >
                                <h3 className="font-display font-bold text-2xl text-white mb-4">Course Map</h3>
                                <a
                                    href={event.course_map_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                                >
                                    <Download size={20} /> Download Course Map
                                </a>
                            </motion.div>
                        )}

                        {/* Info Sections (Expandable) */}
                        {infoSections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="font-display font-bold text-2xl text-white mb-4 flex items-center gap-2">
                                    <Gift className="text-brand-gold" size={24} />
                                    Event Information
                                </h3>
                                <div className="space-y-3">
                                    {infoSections.map((section) => (
                                        <div key={section.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                            >
                                                <span className="font-bold text-lg text-white">{section.title}</span>
                                                <ChevronDown
                                                    size={24}
                                                    className={`text-brand-gold transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {expandedSection === section.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 pt-0 text-gray-300 leading-relaxed whitespace-pre-line">
                                                            {section.content}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Sponsors (Full Width) */}
                {sponsors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="border-t border-white/10 pt-12 mt-12"
                    >
                        <h3 className="font-display font-bold text-3xl text-white mb-8 text-center">Our Sponsors</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-center hover:scale-105 transition-transform">
                                    <img
                                        src={sponsor.logo_url}
                                        alt={sponsor.name}
                                        className="max-w-full max-h-20 object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
