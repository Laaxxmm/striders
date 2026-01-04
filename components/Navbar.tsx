import React, { useState, useEffect } from 'react';
import { Menu, X, Bike, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy
      const sections = ['programs', 'gallery', 'locations', 'events', 'coach'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.charAt(0).toUpperCase() + section.slice(1));
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programs = [
    { name: 'Push Pedal Mini', href: '#program-mini', desc: 'Ages 2-3' },
    { name: 'Push Pedal X', href: '#program-x', desc: 'Ages 3-4' },
    { name: 'Push Pedal Pro', href: '#program-pro', desc: 'Ages 4-6' },
  ];

  const mainLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'Training Location', href: '#locations' },
    { name: 'Upcoming Events', href: '#events' },
    { name: 'Ask Coach', href: '#coach' },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`
            relative w-full max-w-6xl rounded-full transition-all duration-300
            ${scrolled
              ? 'bg-brand-dark/80 backdrop-blur-xl border border-white/20 shadow-2xl py-3 px-6'
              : 'bg-white/10 backdrop-blur-md border border-white/10 py-4 px-8'
            }
          `}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group mr-8">
              <img
                src="/assets/logo.png"
                alt="PushPedal Logo"
                className="h-10 md:h-12 w-auto object-contain drop-shadow-lg"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">

              {/* Programs Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsProgramsOpen(true)}
                onMouseLeave={() => setIsProgramsOpen(false)}
              >
                <button className="flex items-center gap-1 font-sans text-sm font-medium text-gray-200 hover:text-brand-gold uppercase tracking-wide py-2">
                  Programs <ChevronDown size={14} className={`transform transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProgramsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden p-2"
                    >
                      {programs.map((prog) => (
                        <a
                          key={prog.name}
                          href={prog.href}
                          className="block px-4 py-3 rounded-xl hover:bg-white/10 group transition-colors"
                        >
                          <span className="block text-white font-bold text-sm group-hover:text-brand-gold transition-colors">{prog.name}</span>
                          <span className="block text-xs text-gray-400">{prog.desc}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {mainLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-sm font-medium transition-all duration-300 tracking-wide uppercase relative
                    ${activeSection === link.name ? 'text-brand-gold' : 'text-gray-200 hover:text-brand-gold'}
                  `}
                >
                  {link.name}
                </a>
              ))}

              <a
                href="#events"
                className="ml-4 bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark px-6 py-2 rounded-full font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all transform hover:scale-105 inline-block"
              >
                Join Race
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-1"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-xl pt-32 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 pb-10">
              {/* Mobile Programs Section */}
              <div className="w-full max-w-xs border-b border-white/10 pb-6 mb-2">
                <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 text-center">Programs</p>
                <div className="flex flex-col gap-3 text-center">
                  {programs.map((prog) => (
                    <a
                      key={prog.name}
                      href={prog.href}
                      onClick={() => setIsOpen(false)}
                      className="text-white font-bold text-lg hover:text-brand-gold"
                    >
                      {prog.name}
                    </a>
                  ))}
                </div>
              </div>

              {mainLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-display text-2xl font-bold hover:text-brand-gold text-white"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#events"
                onClick={() => setIsOpen(false)}
                className="w-full max-w-xs bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark px-8 py-4 rounded-full font-display font-bold text-lg shadow-xl hover:scale-105 transition-transform mt-4 text-center inline-block"
              >
                Join Race
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;