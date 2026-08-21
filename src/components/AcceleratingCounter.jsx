import React, { useState, useEffect, useRef } from 'react';

/**
 * AcceleratingCounter Component
 * Animates numerical values with an authentic ACCELERATING curve (Ease-In / Speed-up).
 * Numbers start ticking slowly, accelerate into high speed, and land solidly on the final value.
 */
const AcceleratingCounter = ({
  end = 0,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  useGrouping = true
}) => {
  const [displayValue, setDisplayValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const runAcceleration = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsAnimating(true);
    setIsFinished(false);
    let startTime = null;
    const diff = end - start;

    // True Acceleration curve:
    // Starts slowly, accelerates rapidly (cubic/quartic ease-in) and hits the peak
    const easeInAcceleration = (t) => {
      // Piecewise: Acceleration up to 85% of time, slight deceleration snap on final 15%
      if (t < 0.85) {
        // Accelerating phase (t^2.8)
        const normalizedT = t / 0.85;
        return 0.85 * Math.pow(normalizedT, 2.8);
      } else {
        // Final landing settle
        const settleT = (t - 0.85) / 0.15;
        const settleProgress = 1 - Math.pow(1 - settleT, 2);
        return 0.85 + (0.15 * settleProgress);
      }
    };

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const curveFactor = easeInAcceleration(progress);
      const currentVal = start + (diff * curveFactor);

      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        setIsAnimating(false);
        setIsFinished(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Re-trigger acceleration when entering view
          runAcceleration();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    // Immediate run on component mount
    const timer = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        runAcceleration();
      }
    }, 100);

    return () => {
      if (el) observer.unobserve(el);
      clearTimeout(timer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [end, start, duration]);

  // Format the number
  let formattedNumber;
  if (decimals > 0) {
    formattedNumber = Number(displayValue).toFixed(decimals);
  } else {
    const rounded = Math.round(displayValue);
    formattedNumber = useGrouping ? rounded.toLocaleString() : rounded.toString();
  }

  return (
    <span 
      ref={elementRef} 
      className={`${className} ${isAnimating ? 'accelerating-active' : ''} ${isFinished ? 'accelerating-complete' : ''}`}
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        transition: 'transform 0.2s ease'
      }}
    >
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default AcceleratingCounter;