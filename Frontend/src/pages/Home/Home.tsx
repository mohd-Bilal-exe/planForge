import { motion, type Variants } from 'framer-motion';
import DotGrid from '@/components/DotGrid';
import Navbar from './components/Navbar';
//import FloatingWidgets from './components/FloatingWidgets';
import InputCard from './components/InputCard';
import { useState } from 'react';
import Auth from './Home-Auth';
import Donations from './Home-Donations';

export default function Home() {
  const [componentToShow, setComponentToShow] = useState<string>('home');
  const [translateNavbar, setTranslateNavbar] = useState<boolean>(false);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const handleNavbarButtonClicks = (name: string) => {
    setComponentToShow(name);
  };
  return (
    <div className="relative bg-[#030712] selection:bg-blue-500/30 px-3 sm:px-6 py-4 sm:py-8 w-dvw h-dvh overflow-x-hidden font-sans text-slate-100 antialiased">
      <div className="top-0 left-0 absolute px-3 sm:px-6 py-4 sm:py-8 w-dvw h-dvh">
        <div className="border border-primary-50/10 rounded-xl sm:rounded-3xl w-full h-full overflow-hidden">
          <DotGrid
            dotSize={3}
            gap={22}
            baseColor="#271e37"
            activeColor="#E63946"
            proximity={120}
            shockRadius={300}
            shockStrength={5}
            resistance={750}
            returnDuration={2}
            className="absolute bg-transparent"
          />
        </div>
      </div>
      <div className="z-10 relative flex flex-col w-full h-full">
        {/* --- NAVBAR --- */}
        <Navbar onClick={handleNavbarButtonClicks} translateNavbar={componentToShow !== 'home'} />

        <main className="flex flex-col flex-1 justify-center items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-50 relative flex flex-col justify-center items-center gap-12 rounded-3xl w-full h-full overflow-hidden text-center den"
          >
            {/*<FloatingWidgets />*/}

            <motion.div
              className="flex flex-col gap-10 w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)]"
              initial={{ y: '-200%' }}
              animate={{
                y:
                  componentToShow === 'home'
                    ? '-215%'
                    : componentToShow === 'auth'
                    ? '-105%'
                    : componentToShow === 'donations'
                    ? '5%'
                    : '-66.66%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 30000 }}
            >
              <div className="flex justify-center items-center px-2 sm:px-0 h-full shrink-0">
                <Donations />
              </div>
              <div className="flex justify-center items-center px-2 sm:px-0 h-full shrink-0">
                <Auth setComponentToShow={setComponentToShow} />
              </div>
              <div className="flex justify-center items-center px-2 sm:px-0 pt-20 h-full">
                <InputCard setTranslateNavbar={setTranslateNavbar} />
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
