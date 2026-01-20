import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Lock, WandSparkles, Zap, ChevronRight } from 'lucide-react';
import GradientText from '@/components/GradientText';
import useApi from '@/lib/hooks/useApi';
import RotatingText from '@/components/RotatingText';
import useZustandStore from '@/lib/store/zustand';
import { useNavigate } from 'react-router-dom';

// Content options based on your UI images
const DomainOptions = ['Tech Product', 'Non-Tech', 'Academic', 'Creative'];
const PlatformOptions = ['Web App', 'Mobile App', 'Desktop App', 'API / Backend', 'Custom'];

export default function InputCard({ setTranslateNavbar }: { setTranslateNavbar: any }) {
  const { loading, executeApi } = useApi();
  const { user } = useZustandStore();
  const navigate = useNavigate();
  const [activeDomainTab, setActiveDomainTab] = useState(0);
  const [activePlatformTab, setActivePlatformTab] = useState(0);
  const [text, setText] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');

  const isCustomSelected = PlatformOptions[activePlatformTab] === 'Custom';
  const isTechSelected = DomainOptions[activeDomainTab] === 'Tech Product';

  const handlePlanSubmit = async () => {
    const platform = isCustomSelected ? customPlatform : PlatformOptions[activePlatformTab];
    const domain = DomainOptions[activeDomainTab];
    const result = await executeApi('getQuestions', { idea: text, domain, platform });
    if (result) {
      navigate(`/questions/${result}`);
    }
  };
  useEffect(() => {
    if (isTechSelected || isCustomSelected) {
      setTranslateNavbar(true);
    } else {
      setTranslateNavbar(false);
    }
  }, [isTechSelected, isCustomSelected]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="z-50 relative flex justify-end items-center mt-20 px-20 w-full"
    >
      {/* Header Section */}
      <div className="mb-8 w-[46%] text-center">
        <h1 className="font-bold text-white text-4xl sm:text-6xl tracking-tight nunito">
          Stop dreaming. <br />
          <GradientText
            colors={['#6366f1', '#EC4C5F', '#6366f1', '#6366f1', '#EC4C5F']}
            animationSpeed={8}
            className="font-black tracking-wide"
            direction="diagonal"
          >
            Start building.
          </GradientText>
        </h1>
        <div className="mt-4 font-medium text-slate-400 text-lg">
          Transform your raw idea into{' '}
          <RotatingText
            texts={['a Masterplan.', 'a Roadmap.', 'Execution.', 'Success.', 'Reality.']}
            mainClassName="inline-block min-w-28 text-indigo-400"
            staggerFrom={'last'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
        </div>
      </div>

      {/* Input Card Container */}
      <div className="relative bg-slate-900/20 shadow-3xl backdrop-blur-xl mx-auto p-6 border border-white/10 rounded-4xl w-[54%] max-w-5xl">
        <div className="-z-10 absolute -inset-2 bg-linear-to-br from-indigo-500/10 via-transparent blur-2xl rounded-4xl to-accent-500/10 pointer-events-none"></div>

        <AutoResizingInput text={text} setText={setText} />

        <div className="flex flex-col gap-5 px-2">
          <div className="flex flex-col gap-4">
            {/* Domain Selection Row */}
            <div className="relative flex bg-white/5 p-1 border border-white/5 rounded-xl w-full overflow-hidden">
              <motion.div
                className="top-1 absolute bg-white/10 rounded-lg h-[calc(100%-8px)]"
                animate={{
                  x: `${activeDomainTab * 100}%`,
                  width: `${100 / DomainOptions.length}%`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
              {DomainOptions.map((option, idx) => (
                <button
                  key={option}
                  onClick={() => setActiveDomainTab(idx)}
                  className={`z-10 flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                    activeDomainTab === idx ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Platform Selection Row (Only shows if Tech is selected) */}
            <AnimatePresence>
              {isTechSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative flex bg-white/5 p-1 border border-white/5 rounded-xl w-full overflow-hidden"
                >
                  <motion.div
                    className="top-1 absolute bg-white/10 rounded-lg h-[calc(100%-8px)]"
                    animate={{
                      x: `${activePlatformTab * 100}%`,
                      width: `${-0.3 + 100 / PlatformOptions.length}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                  {PlatformOptions.map((option, idx) => (
                    <button
                      key={option}
                      onClick={() => setActivePlatformTab(idx)}
                      className={`z-10 flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                        activePlatformTab === idx
                          ? 'text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Custom Platform Input (Appears below when Custom is selected) */}
          <AnimatePresence>
            {isCustomSelected && isTechSelected && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 border border-white/10 focus-within:border-indigo-500/40 rounded-xl transition-colors">
                  <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
                    <ChevronRight size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Describe the platform (e.g. Chrome extension, CLI tool)"
                    value={customPlatform}
                    onChange={e => setCustomPlatform(e.target.value)}
                    className="bg-transparent py-2 border-none outline-none w-full text-white placeholder:text-slate-600 text-sm"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            onClick={handlePlanSubmit}
            disabled={loading || (isCustomSelected && !customPlatform) || !text}
            className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 shadow-indigo-600/20 shadow-xl mt-2 px-8 py-3 rounded-2xl w-full h-14 font-bold text-white hover:scale-[101%] active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed nunito"
          >
            {loading ? (
              <Loader size={20} className="animate-spin" />
            ) : user ? (
              <Zap size={20} fill="currentColor" />
            ) : (
              <Lock size={20} />
            )}
            {loading ? 'Generating Masterplan...' : 'Create my plan'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AutoResizingInput({
  text,
  setText,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextAreaInFocus, setIsTextAreaInFocus] = useState<boolean>(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '64px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [text]);

  return (
    <div className="relative flex items-start mb-6">
      <WandSparkles
        className={`left-5 absolute mt-6 transition-colors duration-300 ${
          isTextAreaInFocus ? 'text-indigo-400' : 'text-slate-600'
        }`}
        size={22}
      />
      <textarea
        ref={textareaRef}
        value={text}
        onFocus={() => setIsTextAreaInFocus(true)}
        onBlur={() => setIsTextAreaInFocus(false)}
        onChange={e => setText(e.target.value)}
        className="bg-white/5 p-5 pl-14 border border-white/5 focus:border-indigo-500/30 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 w-full min-h-8 max-h-30 overflow-y-auto text-white placeholder:text-slate-600 text-xl transition-all duration-200 caret-indigo-400 resize-none"
        placeholder="I have an idea for..."
        rows={1}
      />
    </div>
  );
}
