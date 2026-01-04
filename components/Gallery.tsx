import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Camera } from 'lucide-react';

const Gallery: React.FC = () => {
    const images = [
        '/images/event_image_1.jpg',
        '/images/category_advanced.jpg',
        '/images/event_image_2.jpg',
        '/images/category_beginner.jpg',
        '/images/event_image_3.jpg',
        '/images/category_intermediate.jpg',
        '/images/event_delhi.png',
        '/images/event_bangalore.png',
        '/images/event_mumbai.png'
    ];

    return (
        <section id="gallery" className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Camera className="text-brand-gold" size={24} />
                            <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Our Moments</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            Life at <span className="text-brand-gold">Striders</span>
                        </h2>
                        <p className="text-gray-400 max-w-lg">
                            Capturing the pure joy, determination, and speed of our little champions on track.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-white/70 hover:text-brand-gold transition-colors group">
                        <span className="text-sm font-medium">Follow us @LittleStridersIndia</span>
                        <Instagram size={20} className="transform group-hover:rotate-12 transition-transform" />
                    </a>
                </div>

                {/* Masonry Grid */}
                <div className="columns-2 md:columns-3 gap-6 space-y-6">
                    {images.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="break-inside-avoid relative group cursor-pointer"
                        >
                            {/* Glassmorphism Container */}
                            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-500 hover:shadow-brand-gold/20 hover:border-brand-gold/30">

                                {/* Image */}
                                <img
                                    src={src}
                                    alt={`Gallery moment ${idx + 1}`}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Dark Overlay with Content */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-bold text-lg">Little Striders</p>
                                        <p className="text-brand-gold text-xs uppercase tracking-wider font-bold mt-1">View Moment</p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center md:hidden">
                    <a href="#" className="flex items-center gap-2 text-brand-gold font-bold">
                        <Instagram size={20} /> View on Instagram
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
