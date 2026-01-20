import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';

export default function FloatingWidgets() {
  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: [0, -10, 0],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        className="hidden lg:block top-10 left-16 absolute"
      >
        <div className="bg-slate-900/80 shadow-2xl backdrop-blur-md p-4 border border-white/10 rounded-2xl w-48 text-left">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="font-semibold text-xs">Today's Tasks</span>
          </div>
          <div className="space-y-2">
            <div className="bg-white/5 rounded-lg w-full h-2"></div>
            <div className="bg-white/5 rounded-lg w-3/4 h-2"></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: [0, -10, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          },
        }}
        className="hidden lg:block top-12 right-16 absolute"
      >
        <div className="bg-slate-900/80 shadow-2xl backdrop-blur-md p-4 border border-white/10 rounded-2xl w-44 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-400" />
            <span className="font-semibold text-xs">Reminders</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">Team Sync in 15 mins</p>
        </div>
      </motion.div>
    </>
  );
}
