import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      text: "My son learned to balance in just 2 sessions! Now he zooms everywhere.",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Rahul Mehta",
      text: "The events are so well organized. It's our favorite weekend family activity.",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Anita Desai",
      text: "Such a confidence booster for my daughter. The community is amazing.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Bike animation variants
  const bikeContainerVariants = {
    ride: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center bg-brand-dark pt-40 md:pt-32 lg:pt-20">

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">

        {/* Text Content */}
        <motion.div
          style={{ y: typeof window !== 'undefined' && window.innerWidth >= 1024 ? y1 : 0 }}
          className="text-center lg:text-left z-20 will-change-transform relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <span className="py-2 px-6 rounded-full bg-white/5 border border-white/10 text-brand-gold font-display font-bold uppercase tracking-widest text-sm backdrop-blur-md shadow-lg">
              Season 2026 Registration Open
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display font-extrabold text-5xl md:text-8xl text-white leading-[1.1] mb-8"
          >
            Young Champions, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold">
              Big Dreams
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-sans text-xl text-gray-300 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            India's most colorful balance bike championship. Where every toddler is a champion and the finish line is just the beginning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
          >
            <a href="#events" className="px-10 py-5 bg-brand-gold text-brand-dark font-display font-bold text-lg rounded-full shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] hover:bg-white hover:scale-105 transition-all duration-300 inline-block text-center">
              Find a Race Near You
            </a>
            <button className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-display font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300">
              Watch Video
            </button>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative h-24 max-w-md mx-auto lg:mx-0">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5"
              >
                <img
                  src={testimonials[currentTestimonial].img}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full border-2 border-brand-gold object-cover"
                />
                <div className="text-left">
                  <p className="text-gray-200 text-sm italic">"{testimonials[currentTestimonial].text}"</p>
                  <p className="text-brand-gold text-xs font-bold mt-1">— {testimonials[currentTestimonial].name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-2 justify-center lg:justify-start">
              {testimonials.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hero Visual / Animation */}
        <motion.div
          style={{ y: typeof window !== 'undefined' && window.innerWidth >= 1024 ? y2 : 0 }}
          className="relative h-[500px] lg:h-[600px] flex items-center justify-center z-10"
        >
          {/* Animated Background Composition */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background geometric elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] border border-white/5 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[350px] h-[350px] border border-brand-gold/10 rounded-full"
            />

            {/* Real Kid Image on Bike */}
            <motion.div
              variants={bikeContainerVariants}
              animate="ride"
              className="relative z-20 w-[300px] md:w-[500px]"
            >
              {/* Image of a kid on a balance bike with transparent background */}
              {/* Using a specific Unsplash image but processed with mask or just a clean standard image in a shape */}
              <div className="relative">
                <img
                  src="/images/7.webp"
                  alt="Push Pedal Champion"
                  className="w-full h-auto object-cover rounded-3xl shadow-2xl border-4 border-white/10"
                  style={{
                    maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
                  }}
                />

                {/* Decorative elements around image to make it pop */}
                <div className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-dark font-display font-bold px-6 py-3 rounded-xl shadow-lg transform rotate-3">
                  Start Riding!
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Cards */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-0 md:right-10 glass-panel p-4 rounded-2xl z-30 max-w-[180px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white font-bold uppercase">Live Stats</span>
              </div>
              <p className="text-2xl font-display font-bold text-white">2,450+</p>
              <p className="text-xs text-gray-400">Happy Riders</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-20" />
    </section>
  );
};

export default Hero;