import { Axe, CircleUserRound, Coffee, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useZustandStore from '@/lib/store/zustand';
import { firebaseService } from '@/lib/firebase/firebaseService';
import { useNavigate } from 'react-router-dom';
export default function Navbar({
  onClick,
  translateNavbar,
}: {
  onClick: (type: string) => void;
  translateNavbar: boolean;
}) {
  const { user } = useZustandStore();
  const navigate = useNavigate();
  const [isHome, setIsHome] = useState<boolean>(false);
  const handleButtonClick = (type: string) => {
    if (type === 'home') {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
    onClick(type);
  };
  useEffect(() => {
    if (translateNavbar) {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
  }, [user, translateNavbar]);
  const handleAuthButtonClick = () => {
    if (user) {
      firebaseService.signOut();
    } else {
      handleButtonClick('auth');
    }
  };
  return (
    <motion.header
      initial={false}
      animate={{ y: !isHome ? -70 : 0 }}
      className="top-10 z-100 absolute flex justify-center items-center p-1 w-full h-fit"
    >
      <div className="flex flex-row gap-6 backdrop-blur-sm px-3 py-2 border border-white/5 rounded-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleButtonClick('home')}
            className="flex justify-center items-center bg-primary-50 shadow-lg p-2 rounded-full cursor-pointer nunito"
          >
            <Axe className="text-indigo-500" fillOpacity={0.5} />
          </button>
          <span className="font-bold text-xl tracking-tight nunito">PlanForge</span>
        </div>
        <button
          onClick={() => handleButtonClick('donations')}
          className="group hover:bg-indigo-500/10 px-5 py-2.5 hover:border-indigo-500/50 rounded-full font-semibold text-indigo-400 active:scale-95 transition-all duration-300 cursor-pointer nunito"
        >
          <Coffee size={18} className="inline-block mr-2 group-hover:scale-110 transition-all" />
          Buy me Chai
        </button>
        <button
          onClick={handleAuthButtonClick}
          className="group bg-indigo-600 active:bg-indigo-600 shadow-indigo-600/20 shadow-lg px-5 py-2.5 rounded-full font-bold text-white hover:tracking-wider hover:scale-[102%] active:scale-95 transition-all duration-300 hover:bg-accent-500 cursor-pointer nunito"
        >
          {user ? 'Sign Out' : 'Get Started!'}
          <LogIn size={18} className="inline-block ml-2 group-hover:scale-110 transition-all" />
        </button>
      </div>
      {user && (
        <motion.button
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="backdrop-blur-sm ml-1.5 p-1 border border-white/5 rounded-full hover:scale-[110%] active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {user.photoURL.length > 0 ? (
            <img src={user.photoURL} alt="User Profile" className="rounded-full w-9 h-9" />
          ) : (
            <CircleUserRound className="rounded-full w-9 h-9" />
          )}
        </motion.button>
      )}
    </motion.header>
  );
}
