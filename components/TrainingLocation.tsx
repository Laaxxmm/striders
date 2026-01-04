import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const TrainingLocation: React.FC = () => {
    const locations = [
        {
            city: "Mumbai",
            area: "Jio World Garden",
            address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
            days: "Sat - Sun",
            time: "4:00 PM - 6:00 PM"
        },
        {
            city: "Bangalore",
            area: "Cubbon Park",
            address: "Kasturba Road, Behind High Court, Bengaluru",
            days: "Sat - Sun",
            time: "7:00 AM - 9:00 AM"
        },
        {
            city: "Delhi",
            area: "Nehru Park",
            address: "Vinay Marg, Chanakyapuri, New Delhi",
            days: "Sat - Sun",
            time: "8:00 AM - 10:00 AM"
        }
    ];

    return (
        <section id="locations" className="py-24 bg-brand-dark border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 text-center">
                    Training <span className="text-brand-gold">Locations</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {locations.map((loc, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                            <div className="mb-6 inline-block bg-brand-violet/20 p-4 rounded-2xl group-hover:bg-brand-violet/30 transition-colors">
                                <MapPin className="text-brand-violet w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-2xl text-white mb-2">{loc.city}</h3>
                            <p className="text-brand-gold font-medium mb-4">{loc.area}</p>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                {loc.address}
                            </p>
                            <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">When</p>
                                    <p className="text-white text-sm mt-1">{loc.days} • {loc.time}</p>
                                </div>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <Navigation size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrainingLocation;
