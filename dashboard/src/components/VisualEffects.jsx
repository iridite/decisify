import React from "react";
import { motion } from "framer-motion";

// Glitch effect for high-impact moments
export function GlitchText({ children, trigger }) {
  return (
    <motion.span
      animate={
        trigger
          ? {
              x: [0, -2, 2, -1, 1, 0],
              textShadow: [
                "0 0 0 transparent",
                "2px 0 #00ffc2, -2px 0 #f59e0b",
                "-2px 0 #00ffc2, 2px 0 #f59e0b",
                "0 0 0 transparent",
              ],
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
}

// Scan line effect for terminal aesthetic
export function ScanLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-5">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-iridyne-green to-transparent h-8"
        animate={{ y: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />
    </div>
  );
}

// Particle effect for background ambiance
export function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-iridyne-green"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: particle.duration,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Spotlight effect following cursor
export function CursorSpotlight() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,194,0.1) 0%, transparent 70%)",
          left: position.x - 192,
          top: position.y - 192,
        }}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </div>
  );
}

// Pulse effect for critical alerts
export function PulseRing({ color = "iridyne-green", size = "large" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <motion.div
        className={`absolute inset-0 rounded-full bg-${color} opacity-75`}
        animate={{
          scale: [1, 2, 2],
          opacity: [0.75, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeOut",
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full bg-${color} opacity-75`}
        animate={{
          scale: [1, 2, 2],
          opacity: [0.75, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          delay: 1,
          ease: "easeOut",
        }}
      />
      <div className={`absolute inset-0 rounded-full bg-${color}`} />
    </div>
  );
}

// Matrix-style data rain effect
export function DataRain({ active }) {
  const columns = 30;
  const chars = "01アイウエオカキクケコサシスセソタチツテト";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500 ${
        active ? "opacity-10" : "opacity-0"
      }`}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 font-mono text-iridyne-green text-xs"
          style={{ left: `${(i / columns) * 100}%` }}
          animate={{
            y: ["0vh", "100vh"],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 5,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="opacity-50">
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// Holographic border effect
export function HoloBorder({ children, active }) {
  return (
    <div className="relative">
      {active && (
        <motion.div
          className="absolute -inset-0.5 rounded-lg opacity-75 blur-sm"
          style={{
            background:
              "linear-gradient(45deg, #00ffc2, #f59e0b, #00ffc2, #f59e0b)",
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

// Typewriter effect for text
export function TypewriterText({ text, speed = 50 }) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
}

// Neon glow effect
export function NeonGlow({ children, color = "iridyne-green" }) {
  return (
    <motion.div
      className={`text-${color}`}
      style={{
        textShadow: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor`,
      }}
      animate={{
        textShadow: [
          "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          "0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor",
          "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
