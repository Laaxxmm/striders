import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, ShieldCheck, ChevronDown } from 'lucide-react';

const Categories: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const programs = [
    {
      id: 1,
      title: "Push Pedal Mini",
      age: "2-3 Years",
      desc: "The perfect start for our youngest riders. Focus on walking with the bike, sitting balance, and simple steering in a safe, play-focused environment.",
      focus: ["Balance Basics", "Confidence Building", "Fun & Safety"],
      icon: ShieldCheck,
      gradient: "from-pink-500 via-rose-500 to-purple-600",
      buttonColor: "bg-rose-500",
      img: "/images/category_beginner.jpg"
    },
    {
      id: 2,
      title: "Push Pedal X",
      age: "3-4 Years",
      desc: "For riders ready to pick up speed! We introduce advanced gliding, turning techniques, and controlled braking on longer tracks.",
      focus: ["Speed Control", "Cornering", "Obstacle Navigation"],
      icon: Zap,
      gradient: "from-blue-500 via-cyan-500 to-teal-400",
      buttonColor: "bg-cyan-600",
      img: "/images/category_intermediate.jpg"
    },
    {
      id: 3,
      title: "Push Pedal Pro",
      age: "4-6 Years",
      desc: "Elite training for race day. Mastering ramps, complex maneuvers, and competitive racing strategies.",
      focus: ["Race Strategy", "Advanced Ramps", "Competitive Edge"],
      icon: Trophy,
      gradient: "from-amber-400 via-orange-500 to-red-500",
      buttonColor: "bg-orange-500",
      img: "/images/category_advanced.jpg"
    }
  ];

  const toggleExpand = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

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
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
            >
              {/* Image Side */}
              <div className="flex-1 w-full relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} rounded-[2rem] md:rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                <div className="relative h-[300px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                  <img
                    src={program.img}
                    alt={program.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  {/* Floating Age Tag with Icon */}
                  <div className="absolute top-8 left-8 relative z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <program.icon className="text-white w-5 h-5" />
                      </div>
                      <span className="text-white font-display font-bold text-lg">{program.age}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block text-[8rem] md:text-[18rem] leading-[0.8] font-display font-black text-transparent bg-clip-text bg-gradient-to-br ${program.gradient} opacity-50 mb-[-30px] md:mb-[-110px] relative z-0 select-none drop-shadow-lg`}>
                  0{program.id}
                </span>
                <h3 className="relative z-10 font-display text-5xl font-bold text-white mb-6">
                  {program.title}
                </h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {program.desc}
                </p>

                {/* Expandable Details */}
                <AnimatePresence>
                  {expandedCard === program.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <p className="text-brand-gold font-bold text-sm uppercase mb-4 tracking-widest">Training Focus</p>
                        <div className="space-y-3">
                          {program.focus.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${program.buttonColor}`} />
                              <span className="text-gray-200 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => toggleExpand(program.id)}
                  className={`px-8 py-4 rounded-full border border-white/20 text-white font-bold transition-all flex items-center gap-2 mx-auto lg:mx-0 ${expandedCard === program.id
                    ? 'bg-brand-gold text-brand-dark border-brand-gold'
                    : 'hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold'
                    }`}
                >
                  View Details
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform ${expandedCard === program.id ? 'rotate-180' : ''}`}
                  />
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