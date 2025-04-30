// components/Counter.tsx
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  targetNumber: number;
  duration: number;
}

const Counter: React.FC<CounterProps> = ({ targetNumber, duration }) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger only once
    threshold: 0.1, // Start counting when 10% of the element is in view
  });

  useEffect(() => {
    if (inView) {
      setIsInView(true);
    }
  }, [inView]);

  useEffect(() => {
    if (isInView) {
      controls.start({
        count: targetNumber,
        transition: { duration, ease: 'easeInOut' },
      });
    }
  }, [isInView, controls, targetNumber, duration]);

  return (
    <div ref={ref}>
      <motion.div
        animate={controls}
        initial={{ count: 0 }}
        style={{ fontSize: '2rem', fontWeight: 'bold' }}
        // Function to format the count value
        // Framer Motion will animate this value to targetNumber
      >
        {((controls as any).count || 0).toFixed(0)}
      </motion.div>
    </div>
  );
};

export default Counter;
