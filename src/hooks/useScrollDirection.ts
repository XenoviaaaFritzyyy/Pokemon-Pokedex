import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevOffset, setPrevOffset] = useState(0);
  const threshold = 10; // Minimum scroll amount before changing direction

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      
      if (Math.abs(currentOffset - prevOffset) < threshold) {
        return;
      }

      const direction = currentOffset > prevOffset ? 'down' : 'up';
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      
      setPrevOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollDirection, prevOffset]);

  return scrollDirection;
}; 