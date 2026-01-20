import { motion } from 'framer-motion';
import { Mail, MessageSquare, Target, Layout } from 'lucide-react';
import type { ComponentProps, IntegrationItem } from '../../../lib/types/homeTypes';

export default function IntegrationCards({ variants }: ComponentProps) {
  const integrations: IntegrationItem[] = [
    { icon: <Mail />, label: 'Email Sync' },
    { icon: <MessageSquare />, label: 'Slack Bot' },
    { icon: <Target />, label: 'Goal Tracking' },
    { icon: <Layout />, label: 'Kanban' },
  ];

  return (
    <motion.div variants={variants} className="gap-6 grid grid-cols-2 md:grid-cols-4 mt-8 w-full">
      {integrations.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-white/5 p-4 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors cursor-default"
        >
          {item.icon}
          <span className="font-medium text-sm">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
