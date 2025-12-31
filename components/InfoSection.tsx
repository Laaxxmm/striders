import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Trophy, Globe, ArrowRightCircle, GraduationCap, Flag, Medal } from 'lucide-react';

const InfoSection: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  const journeySteps = [
    {
      id: 1,
      age: "Step 01",
      title: "ACADEMY",
      desc: "Weekly training sessions with pro coaches. Master the basics of balance, steering, and braking in a fun group environment.",
      Icon: GraduationCap,
      bg: "bg-gradient-to-r from-brand-gold to-brand-yellow", // Darker gold/orange to match reference feel
      buttonColor: "text-[#d97706]",
      textColor: "text-brand-dark"
    },
    {
      id: 2,
      age: "Step 02",
      title: "RACE DAY",
      desc: "Put skills to the test! Age-categorized races on professionally designed tracks with safety barriers and cheering crowds.",
      Icon: Flag,
      bg: "bg-[#5b21b6]", // Violet/Purple
      buttonColor: "text-[#5b21b6]",
      textColor: "text-white"
    },
    {
      id: 3,
      age: "Step 03",
      title: "GLORY",
      desc: "Podium finishes, medals for everyone, and the pride of accomplishment. Memories that last a lifetime.",
      Icon: Medal,
      bg: "bg-[#191717]", // Dark/Black
      buttonColor: "text-black",
      textColor: "text-white"
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section 1: What & Why */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-brand-gold rounded-full" />
              <span className="text-brand-gold font-display font-bold uppercase tracking-widest text-sm">The Revolution</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              More Than Just a <br /><span className="text-brand-violet bg-white px-2 rounded-lg transform -rotate-1 inline-block">Toy Bike</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed font-bold">
              Balance bikes are the modern way to learn to ride. By removing pedals and training wheels, we focus on the hardest part of cycling first: <strong>Balance</strong>.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed font-bold">
              It’s intuitive. It’s natural. And for a toddler, it’s pure magic. Within hours, children as young as 18 months are gliding with feet up, building core strength and unshakeable confidence.
            </p>

            <button className="text-white font-bold border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors">
              Read Our Parent's Guide →
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { icon: Zap, title: "Motor Skills", desc: "Develops coordination fast." },
              { icon: ShieldCheck, title: "Safety First", desc: "Feet are always close to the ground." },
              { icon: Trophy, title: "Confidence", desc: "Mastering a skill independently." },
              { icon: Globe, title: "Community", desc: "Making friends at the track." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className={`glass-panel p-6 rounded-2xl hover:bg-white/10 transition-colors ${idx === 1 || idx === 3 ? 'translate-y-8' : ''}`}
              >
                <feature.icon className="w-8 h-8 text-brand-gold mb-4" />
                <h3 className="font-display font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2: How We Support (Redesigned Pop-out Cards) */}
        <div className="relative pt-20">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Your Journey With Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From the first wobbly steps to the finish line podium.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 gap-y-28 md:gap-y-8 mt-16 md:mt-0">
            {journeySteps.map((step) => (
              <div key={step.id} className="relative group">
                {/* Card Container */}
                <div className={`relative pt-20 h-full`}>
                  <div className={`${step.bg} rounded-3xl p-6 pb-8 text-center h-full flex flex-col items-center shadow-2xl relative z-0 transition-transform duration-300 hover:-translate-y-2`}>

                    {/* Icon popping out */}
                    <div className="-mt-32 mb-4 relative z-10 w-48 h-48 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-brand-dark flex items-center justify-center">
                      <step.Icon size={80} className="text-white" />
                    </div>

                    {/* Content */}
                    <span className={`font-display font-bold text-lg mb-1 ${step.textColor} opacity-80`}>{step.age}</span>
                    <h3 className={`font-display font-black text-3xl mb-4 uppercase tracking-tight ${step.textColor}`}>{step.title}</h3>
                    <p className={`text-sm leading-relaxed mb-8 flex-grow ${step.textColor} opacity-90`}>
                      {step.desc}
                    </p>

                    {/* Button */}
                    <a href="#categories" className={`bg-white ${step.buttonColor} font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg inline-block`}>
                      KNOW MORE <ArrowRightCircle size={18} />
                    </a>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;