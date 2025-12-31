import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BikeLevel } from '../types';
import { Info } from 'lucide-react';

const Categories: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const categories = [
    {
      id: 1,
      name: BikeLevel.BEGINNER,
      age: "2-3 Years",
      desc: "Tiny steps lead to big glides. A safe, padded environment for our youngest riders.",
      skills: "Focus: Walking with bike, sitting balance, and simple steering.",
      gradient: "from-pink-500 via-rose-500 to-purple-600",
      img: "/category_beginner.jpg"
    },
    {
      id: 2,
      name: BikeLevel.INTERMEDIATE,
      age: "3-4 Years",
      desc: "Speed picking up! Navigating gentle curves and longer straights.",
      skills: "Focus: Lifting feet for longer glides, turning coordination, and braking.",
      gradient: "from-brand-violet via-purple-600 to-indigo-600",
      img: "/category_intermediate.jpg"
    },
    {
      id: 3,
      name: BikeLevel.ADVANCED,
      age: "4-5+ Years",
      desc: "Pro level! Obstacles, ramps, and intense competition for the seasoned rider.",
      skills: "Focus: High speed control, obstacle navigation, and competitive starts.",
      gradient: "from-blue-500 via-cyan-500 to-teal-400",
      img: "/category_advanced.jpg"
    }
  ];

  return (
    <section id="categories" className="py-24 bg-brand-dark relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              Choose Your <br /> <span className="text-brand-gold">Category</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-md text-right hidden md:block">
            Strict age grouping ensures safe and fair play for every child.
          </p>
        </div>

        <div className="space-y-32">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
            >
              {/* Image Side */}
              <div className="flex-1 w-full relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} rounded-[2rem] md:rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                <div className="relative h-[300px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  {/* Floating Age Tag with Tooltip */}
                  <div
                    className="absolute top-8 left-8 relative z-20"
                    onMouseEnter={() => setActiveTooltip(cat.id)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full cursor-help flex items-center gap-2">
                      <span className="text-white font-display font-bold">{cat.age}</span>
                      <Info size={16} className="text-brand-gold" />
                    </div>

                    {/* Tooltip Popup */}
                    <AnimatePresence>
                      {activeTooltip === cat.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute top-full left-0 mt-3 w-64 bg-brand-dark/95 backdrop-blur-xl border border-brand-gold/30 p-4 rounded-xl shadow-2xl z-50"
                        >
                          <div className="absolute -top-1 left-8 w-2 h-2 bg-brand-dark border-l border-t border-brand-gold/30 transform rotate-45"></div>
                          <p className="text-brand-gold font-bold text-xs uppercase mb-1">Skills Developed</p>
                          <p className="text-white text-sm leading-snug">{cat.skills}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block text-[8rem] md:text-[18rem] leading-[0.8] font-display font-black text-transparent bg-clip-text bg-gradient-to-br ${cat.gradient} opacity-50 mb-[-30px] md:mb-[-110px] relative z-0 select-none drop-shadow-lg`}>
                  0{cat.id}
                </span>
                <h3 className="relative z-10 font-display text-5xl font-bold text-white mb-6">
                  {cat.name}
                </h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {cat.desc}
                </p>
                <button className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all">
                  View Rules & Regs
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;