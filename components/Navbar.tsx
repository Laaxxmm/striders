import React, { useState, useEffect } from 'react';
import { Menu, X, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('About');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll Spy
      const sections = ['about', 'categories', 'events', 'coach'];
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

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Categories', href: '#categories' },
    { name: 'Events', href: '#events' },
    { name: 'Coach', href: '#coach' },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`
            relative w-full max-w-4xl rounded-full transition-all duration-300
            ${scrolled
              ? 'bg-brand-dark/60 backdrop-blur-xl border border-white/20 shadow-2xl py-3 px-6'
              : 'bg-white/10 backdrop-blur-md border border-white/10 py-4 px-8'
            }
          `}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-brand-gold p-2 rounded-full text-brand-dark transform group-hover:rotate-12 transition-transform">
                <Bike size={20} strokeWidth={3} />
              </div>
              <span className={`font-display font-extrabold text-xl tracking-tight ${scrolled ? 'text-white' : 'text-white'}`}>
                Little<span className="text-brand-gold">Striders</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-sm font-medium transition-all duration-300 tracking-wide uppercase relative
                    ${activeSection === link.name ? 'text-brand-gold scale-105' : 'text-gray-200 hover:text-brand-gold'}
                  `}
                >
                  {link.name}
                  {activeSection === link.name && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold rounded-full"
                    />
                  )}
                </a>
              ))}
              <button className="bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark px-6 py-2 rounded-full font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all transform hover:scale-105">
                Join Race
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-1"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Dropdown - separate from the floating pill to cover screen or drop nicely */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-xl pt-32 px-6 md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-display text-2xl font-bold hover:text-brand-gold ${activeSection === link.name ? 'text-brand-gold' : 'text-white'}`}
                >
                  {link.name}
                </a>
              ))}
              <button className="w-full max-w-xs bg-gradient-to-r from-brand-gold to-brand-yellow text-brand-dark px-8 py-4 rounded-full font-display font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Join Race
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;