import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

const Programs: React.FC = () => {
    const programs = [
        {
            id: "mini",
            title: "Push Pedal Mini",
            age: "2-3 Years",
            desc: "The perfect start for our youngest riders. Focus on walking with the bike, sitting balance, and simple steering in a safe, play-focused environment.",
            focus: ["Balance Basics", "Confidence Building", "Fun & Safety"],
            icon: ShieldCheck,
            color: "from-pink-500 to-rose-500",
            buttonColor: "bg-rose-500",
            image: "/images/3.webp" // Testing with known working image
        },
        {
            id: "x",
            title: "Push Pedal X",
            age: "3-4 Years",
            desc: "For riders ready to pick up speed! We introduce advanced gliding, turning techniques, and controlled braking on longer tracks.",
            focus: ["Speed Control", "Cornering", "Obstacle Navigation"],
            icon: Zap,
            color: "from-blue-500 to-cyan-500",
            buttonColor: "bg-cyan-600",
            image: "/images/3.webp"
        },
        {
            id: "pro",
            title: "Push Pedal Pro",
            age: "4-6 Years",
            desc: "Elite training for race day. Mastering ramps, complex maneuvers, and competitive racing strategies.",
            focus: ["Race Strategy", "Advanced Ramps", "Competitive Edge"],
            icon: Trophy,
            color: "from-amber-400 to-orange-500",
            buttonColor: "bg-orange-500",
            image: "/images/6.webp"
        }
    ];

    return (
        <section id="programs" className="py-24 bg-brand-dark/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <span className="py-2 px-4 rounded-full bg-white/10 border border-white/10 text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                            World Class Coaching
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="font-display font-bold text-4xl md:text-5xl text-white mb-6"
                    >
                        Our Training <span className="text-brand-gold">Programs</span>
                    </motion.h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Structured curriculum designed by professional cyclists to take your child from first steps to the finish line.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {programs.map((program, idx) => (
                        <motion.div
                            key={program.id}
                            id={`program-${program.id}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="group relative rounded-[2.5rem] bg-brand-dark border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500"
                        >
                            {/* Image Header */}
                            <div className="h-48 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-20 z-10`} /> {/* Reduced gradient opacity overlay */}
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/20">
                                        <program.icon className="text-white w-5 h-5" />
                                    </div>
                                    <span className="text-white font-display font-bold text-sm tracking-wider uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{program.age}</span>
                                </div>
                            </div>

                            {/* Body Content */}
                            <div className="p-8">
                                <h3 className="font-display font-bold text-3xl text-white mb-4">{program.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 h-20">
                                    {program.desc}
                                </p>

                                <div className="space-y-4 mb-8">
                                    {program.focus.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${program.buttonColor}`} />
                                            <span className="text-gray-300 text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 transform group-hover:scale-[1.02] ${program.buttonColor} shadow-lg shadow-${program.buttonColor}/20`}>
                                    View Details <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;
