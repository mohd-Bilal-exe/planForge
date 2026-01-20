import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { firebaseService } from '@/lib/firebase/firebaseService';

export default function Auth({ setComponentToShow }: { setComponentToShow: any }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await firebaseService.signInWithEmail(email, password);
        setComponentToShow('home');
      } else {
        await firebaseService.signUpWithEmail(email, password);
        setComponentToShow('home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      await firebaseService.signInWithGoogle();
      setComponentToShow('home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-2 sm:px-0 h-full text-white nunito">
      <div className="relative bg-white/5 shadow-2xl backdrop-blur p-4 sm:p-6 lg:p-8 border border-white/10 rounded-2xl sm:rounded-4xl lg:rounded-[2.5rem] w-full max-w-xl sm:max-w-3xl h-fit max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="mb-3 sm:mb-2 lg:mb-4 text-center">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-1 sm:mt-2 text-white/50 text-xs sm:text-sm lg:text-base">
            {isLogin ? 'Sign in to your account' : 'Join PlanForge today'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleEmailAuth} className="space-y-2 sm:space-y-3">
          {error && (
            <div className="bg-red-500/10 px-3 sm:px-4 py-2 sm:py-3 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <div className="group relative">
            <label className="top-2 sm:top-3 left-3 sm:left-4 absolute text-white/40 text-xs uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="username@gmail.com"
              className="bg-white/5 px-3 sm:px-4 pt-6 sm:pt-7 pb-2 sm:pb-3 border border-white/5 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-1 w-full text-xs sm:text-sm lg:text-base transition-all focus:ring-accent-500/50"
              required
            />
          </div>

          <div className="group relative">
            <label className="top-2 sm:top-3 left-3 sm:left-4 absolute text-white/40 text-xs uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 px-3 sm:px-4 pt-6 sm:pt-7 pb-2 sm:pb-3 border border-white/5 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-1 w-full text-xs sm:text-sm lg:text-base transition-all focus:ring-accent-500/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="group group flex justify-center items-center gap-2 sm:gap-3 bg-indigo-600 active:bg-indigo-600 shadow-indigo-600/20 shadow-lg px-4 sm:px-6 py-3 sm:py-4 rounded-xl lg:rounded-2xl w-full font-bold text-white text-xs sm:text-sm lg:text-base hover:tracking-wider hover:scale-[102%] active:scale-95 transition-all duration-300 hover:bg-accent-500 cursor-pointer disabled:cursor-not-allowed nunito"
          >
            {loading ? (
              <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-2 sm:my-4 lg:my-6">
          <div className="flex-1 bg-white/10 h-px" />
          <span className="px-3 sm:px-4 text-white/30 text-xs uppercase">or</span>
          <div className="flex-1 bg-white/10 h-px" />
        </div>

        {/* Social Auth */}
        <div className="space-y-2 sm:space-y-3">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="group flex justify-between items-center bg-white/5 hover:bg-white/10 disabled:bg-white/5 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border border-white/5 rounded-xl lg:rounded-2xl w-full text-xs sm:text-sm lg:text-base transition-all disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {loading ? (
                <Loader2 className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4.5 lg:w-5 sm:h-4.5 lg:h-5 text-white"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <g fill="none" fillRule="evenodd" clipRule="evenodd">
                    <path
                      fill="#f44336"
                      d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
                      opacity="0.987"
                    />
                    <path
                      fill="#ffc107"
                      d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
                      opacity="0.997"
                    />
                    <path
                      fill="#448aff"
                      d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
                      opacity="0.999"
                    />
                    <path
                      fill="#43a047"
                      d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
                      opacity="0.993"
                    />
                  </g>
                </svg>
              )}
              <span className="font-medium">Continue with Google</span>
            </div>
            <ArrowRight
              size={14}
              className="sm:w-4 lg:w-4.5 sm:h-4 lg:h-4.5 text-white/20 group-hover:text-white transition-all group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Toggle Switch */}
        <div className="mt-3 sm:mt-4 lg:mt-6 text-center">
          <p className="text-white/50 text-xs sm:text-sm lg:text-base">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold transition-colors text-accent-400 hover:text-accent-300"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
