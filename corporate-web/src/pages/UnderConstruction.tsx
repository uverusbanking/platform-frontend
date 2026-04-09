import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6 text-foreground">
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        {/* Animated Gear Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="relative h-24 w-24 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="text-primary w-20 h-20" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground"
          style={{
            fontFamily: "Manrope, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Under Construction
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-lg text-muted-foreground max-w-lg leading-relaxed"
        >
          We are currently upgrading our platform to provide a more robust and
          seamless corporate banking experience. Check back soon for the new
          portal launch.
        </motion.p>

        {/* Simple status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          System Maintenance in Progress
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-xs text-muted-foreground/60 font-medium"
        >
          © {new Date().getFullYear()} All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
