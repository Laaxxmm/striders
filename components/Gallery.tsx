import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const Gallery: React.FC = () => {
    const images = [
        '/event_image_1.jpg',
        '/event_image_2.jpg',
        '/event_image_3.jpg',
        '/category_beginner.jpg',
        '/category_intermediate.jpg',
        '/category_advanced.jpg'
    ];

    return (
        <section id="gallery" className="py-24 bg-brand-dark border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            Champion <span className="text-brand-gold">Moments</span>
                        </h2>
                        <p className="text-gray-400">Capturing the joy, speed, and spirit of our little riders.</p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-brand-gold hover:text-white transition-colors">
                        <Instagram size={20} /> View on Instagram
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {images.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative overflow-hidden rounded-2xl group ${idx === 0 || idx === 3 ? 'col-span-2 row-span-2' : ''}`}
                        >
                            <img
                                src={src} // Fallback logic would normally go here if images missing
                                alt={`Gallery ${idx}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold tracking-widest uppercase text-sm border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
