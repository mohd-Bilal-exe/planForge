import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import { firebaseService } from '@/lib/firebase/firebaseService';
import useApi from '@/lib/hooks/useApi';

export default function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { executeApi, loading } = useApi();
  // State Management
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 1. Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return navigate('/');
        const project = await firebaseService.getProjectDocument(id);

        if (project?.questions) {
          setQuestionsData(project.questions);
        } else {
          navigate('/'); // Redirect if project has no questions
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Derived State
  const currentQuestion = questionsData[currentIndex];
  const progress = questionsData.length > 0 ? ((currentIndex + 1) / questionsData.length) * 100 : 0;
  const isCustomActive = selectedOption === 'Custom';

  // 2. Navigation Handlers
  const handleNext = () => {
    const finalAnswer = isCustomActive ? customValue : selectedOption;

    // Store answer for current question
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: finalAnswer || '' }));

    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null); // Reset for next question
      setCustomValue('');
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // Optional: Restore previous answer if needed
      setSelectedOption(null);
      setCustomValue('');
    }
  };

  const handleFinalSubmit = async () => {
    if (!id) return;
    console.log('Final Answers to Submit:', answers);
    firebaseService.updateProjectDocument(id, { answers });
    const result = await executeApi('getPlan', {
      projectId: id,
      answers,
    });
    if (result) {
      navigate(`/plan/${id}`);
    }
  };

  // 3. Loading State UI
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center bg-[#030711] w-dvw h-dvh text-white">
        <Loader2 className="mb-4 text-indigo-500 animate-spin" size={40} />
        <p className="font-medium text-slate-400 animate-pulse">
          Loading your Masterplan questions...
        </p>
      </div>
    );
  }

  // Safety check for empty data
  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col justify-center items-center bg-[#030711] p-4 w-dvw h-dvh min-h-screen overflow-hidden text-white">
      {/* Progress Section */}
      <div className="mb-8 w-full max-w-xl">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="font-bold text-indigo-400 text-xs uppercase tracking-widest">
            Step {currentIndex + 1} of {questionsData.length}
          </span>
          <span className="font-medium text-slate-500 text-xs">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-full w-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="bg-linear-to-r from-indigo-500 h-full to-accent-500"
          />
        </div>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-slate-900/40 shadow-2xl backdrop-blur-xl p-8 border border-white/10 rounded-3xl w-full max-w-xl"
        >
          <div className="-z-10 absolute inset-0 bg-indigo-500/5 blur-3xl rounded-3xl pointer-events-none" />

          <h2 className="mb-8 font-bold text-2xl sm:text-3xl leading-tight tracking-tight">
            {currentQuestion.question}
          </h2>

          {/* Options List */}
          <div className="gap-3 grid">
            {currentQuestion.options.map((option: string) => {
              // Check if the option text itself suggests it's a custom input
              const isActuallyCustom = option.toLowerCase().includes('custom');

              return (
                <OptionButton
                  key={option}
                  label={option}
                  isSelected={
                    selectedOption === option || (isActuallyCustom && selectedOption === 'Custom')
                  }
                  onClick={() => {
                    setSelectedOption(option);
                    // If this specific option is the 'custom' one,
                    // the AnimatePresence block will trigger based on this check
                    if (isActuallyCustom) {
                      setSelectedOption('Custom');
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Custom Input Field */}
          <AnimatePresence>
            {isCustomActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Tell us more..."
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  className="bg-white/5 p-4 border border-white/10 focus:border-indigo-500/50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 w-full text-white placeholder:text-slate-700 transition-all"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 mt-10">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 disabled:opacity-0 px-4 py-2 font-medium text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedOption || (isCustomActive && !customValue) || loading}
              className="flex flex-1 sm:flex-none justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 shadow-indigo-600/20 shadow-lg px-8 py-3 rounded-2xl font-bold disabled:text-slate-600 active:scale-95 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </>
              ) : currentIndex === questionsData.length - 1 ? (
                <>
                  Finalize <Send size={18} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-8 font-medium text-slate-600 text-sm">
        Step through your ideas to build something great.
      </p>
    </div>
  );
}

// Reusable Option Sub-component
function OptionButton({ label, isSelected, onClick, isCustom = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-2">
        {isCustom && (
          <Sparkles size={16} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? 'border-indigo-400 bg-indigo-400 scale-110' : 'border-slate-600'
        }`}
      >
        {isSelected && <div className="bg-white rounded-full w-2 h-2" />}
      </div>
    </button>
  );
}
