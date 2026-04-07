import React from "react";
import { motion } from "framer-motion";
import { Hammer, Sparkles, Send, Mail } from "lucide-react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans flex items-center justify-center relative overflow-hidden text-slate-100">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/30 blur-[120px] rounded-full mix-blend-screen" />

      {/* Starry Dust overlay optional animation */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl px-6 w-full mx-auto flex flex-col items-center text-center">
        {/* Floating icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <div className="relative h-20 w-20 bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
            <Hammer className="text-blue-400 w-10 h-10" />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="text-violet-400 w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent"
        >
          Building the Future
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
        >
          We are currently crafting a revolutionary new portal. Our engineering
          teams are working behind the scenes to bring you an unparalleled
          experience.
        </motion.p>

        {/* Notification form / Glassmorphism card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-3xl pointer-events-none" />

          <h3 className="text-left font-medium mb-4 text-slate-200 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            Notify me when we launch
          </h3>

          <form className="flex m-0 gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-grow">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-3 transition-colors flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-sm text-slate-600 font-medium"
        >
          © {new Date().getFullYear()} All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
