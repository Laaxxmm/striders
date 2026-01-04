import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    price: string;
}

interface EventData {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    deadline: string;
    razorpayLink: string;
    googleFormUrl?: string;
    image: string;
    categories: Category[];
}

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        parentName: '',
        contact: '',
        email: '',
        category: ''
    });

    useEffect(() => {
        const fetchEvent = () => {
            const storedEvents = localStorage.getItem('adminEvents');
            if (storedEvents) {
                const events: EventData[] = JSON.parse(storedEvents);
                const foundEvent = events.find((e) => e.id === id);
                if (foundEvent) {
                    setEvent(foundEvent);
                } else {
                    // Event not found handling
                }
            }
            setLoading(false);
        };

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event) return;

        const timer = setInterval(() => {
            const deadlineDate = new Date(event.deadline).getTime();
            const now = new Date().getTime();
            const difference = deadlineDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft(null); // Deadline passed
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [event]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare Data
        const selectedCategory = event?.categories.find(c => c.id === formData.category);

        const submissionData = {
            eventName: event?.name,
            parentName: formData.parentName,
            riderName: formData.name,
            contact: formData.contact,
            email: formData.email,
            categoryName: selectedCategory?.name,
            categoryPrice: selectedCategory?.price,
        };

        // Send to Google Sheet if URL exists
        if (event?.googleFormUrl) {
            try {
                await fetch(event.googleFormUrl, {
                    method: "POST",
                    body: JSON.stringify(submissionData),
                    mode: "no-cors" // Standard for GAS Webhook
                });
                console.log("Data sent to Google Sheet");
            } catch (error) {
                console.error("Error sending to Google Sheet", error);
            }
        }

        if (event?.razorpayLink) {
            window.location.href = event.razorpayLink;
        }
    };

    if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Loading...</div>;
    if (!event) return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white gap-4">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <button onClick={() => navigate('/')} className="text-brand-gold hover:underline">Return Home</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-gold selection:text-brand-dark">
            {/* Hero Banner */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                {event.image ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500">No Banner Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />

                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/50 transition-colors">
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="max-w-7xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-brand-gold text-brand-dark font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block"
                        >
                            Registration Open
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-display font-black mb-4"
                        >
                            {event.name}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-6 text-gray-300"
                        >
                            <div className="flex items-center gap-2">
                                <Calendar className="text-brand-gold" size={20} />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-brand-gold" size={20} />
                                <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-brand-gold" size={20} />
                                <span>{event.location}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
                {/* Left Content */}
                <div className="md:col-span-2 space-y-12">

                    {/* Countdown */}
                    {timeLeft ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6 text-center">Registration Closes In</h3>
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-3xl md:text-5xl font-display font-bold text-brand-gold mb-1">{timeLeft.days}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Days</div>
                                </div>
                                <div>
                                    <div className="text-3xl md:text-5xl font-display font-bold text-white mb-1">{timeLeft.hours}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Hours</div>
                                </div>
                                <div>
                                    <div className="text-3xl md:text-5xl font-display font-bold text-white mb-1">{timeLeft.minutes}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Mins</div>
                                </div>
                                <div>
                                    <div className="text-3xl md:text-5xl font-display font-bold text-white mb-1">{timeLeft.seconds}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Secs</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 font-bold flex items-center justify-center gap-2">
                            <AlertCircle /> Registration Closed
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-6">About the Event</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-6">Race Categories</h3>
                        <div className="grid gap-4">
                            {event.categories.map((cat) => (
                                <div key={cat.id} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                                    <span className="font-bold text-white">{cat.name}</span>
                                    <span className="text-brand-gold font-bold">₹{cat.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-6">Location</h3>
                        <div className="w-full h-64 bg-gray-800 rounded-2xl flex items-center justify-center border border-white/10">
                            <div className="text-center text-gray-500">
                                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                <p>{event.location}</p>
                                <p className="text-xs mt-2 uppercase tracking-wide opacity-50">Map Integration Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Registration */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="bg-white text-brand-dark rounded-3xl p-8 shadow-2xl">
                            <h3 className="font-display font-bold text-2xl mb-2">Register Now</h3>
                            <p className="text-gray-500 text-sm mb-6">Secure your spot for the big race!</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Rider Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 border-none rounded-lg p-3 font-medium focus:ring-2 focus:ring-brand-gold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Parent Name</label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 border-none rounded-lg p-3 font-medium focus:ring-2 focus:ring-brand-gold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 border-none rounded-lg p-3 font-medium focus:ring-2 focus:ring-brand-gold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 border-none rounded-lg p-3 font-medium focus:ring-2 focus:ring-brand-gold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 border-none rounded-lg p-3 font-medium focus:ring-2 focus:ring-brand-gold"
                                        required
                                    >
                                        <option value="" disabled>Select a Category</option>
                                        {event.categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name} - ₹{cat.price}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!timeLeft}
                                    className={`w-full py-4 rounded-xl font-bold text-lg mt-4 transition-all ${timeLeft
                                        ? 'bg-brand-dark text-white hover:bg-black shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {timeLeft ? 'Proceed to Payment' : 'Registration Closed'}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    You will be redirected to Razorpay securely.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
