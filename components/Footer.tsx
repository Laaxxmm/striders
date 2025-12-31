import React from 'react';
import { Bike, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-brand-gold p-2 rounded-full">
                <Bike className="h-6 w-6 text-brand-dark" />
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Little<span className="text-brand-gold">Striders</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of riders through fun, safe, and competitive balance bike events across India.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Race Categories</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Upcoming Events</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Safety Rules</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Parent Guide</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Sponsorship</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-brand-gold hover:text-brand-dark text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-brand-gold hover:text-brand-dark text-white transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-brand-gold hover:text-brand-dark text-white transition-all"><Twitter size={20} /></a>
            </div>
            <div className="flex flex-col space-y-2 mt-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>hello@littlestriders.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91 91 0 82823 61</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 Little Striders India. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;