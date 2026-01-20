import type { ComponentProps } from '@/lib/types/homeTypes';
import { motion } from 'framer-motion';

export default function HeroSection({ variants }: ComponentProps) {
  return (
    <motion.div variants={variants} className="space-y-6">
      <h1 className="font-extrabold text-5xl md:text-7xl leading-[1.1] tracking-tight">
        Think, plan, and track <br />
        <span className="bg-clip-text bg-linear-to-r from-blue-400 via-blue-500 to-indigo-400 text-transparent">
          all in one place
        </span>
      </h1>
      <p className="mx-auto max-w-xl text-slate-400 text-lg md:text-xl leading-relaxed">
        Efficiently manage your tasks and boost productivity with AI-driven roadmaps tailored for
        your specific goals.
      </p>
    </motion.div>
  );
}
