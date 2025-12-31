import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollTrack: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to path length
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bikePos = useTransform(scrollYProgress, [0, 1], ["0%", "95%"]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none hidden md:block">
      {/* The Track Line SVG */}
      <svg className="w-full h-full" preserveAspectRatio="none">
        <motion.path
          d="M 100,0 Q 150,300 500,600 T 900,1200 T 200,1800 T 800,2400" 
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="40"
          strokeLinecap="round"
          className="h-full"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d="M 100,0 Q 150,300 500,600 T 900,1200 T 200,1800 T 800,2400"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          strokeDasharray="20 10"
          style={{ pathLength }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* The Bike riding along the side (Simplified vertical tracker) */}
      <div className="absolute right-4 top-0 bottom-0 w-2">
        <motion.div 
            className="sticky top-1/2 -translate-y-1/2"
            style={{ top: bikePos }}
        >
             {/* Not sticking perfectly to SVG path in this simple implementation, 
                 but acting as a progress indicator on the right */}
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollTrack;