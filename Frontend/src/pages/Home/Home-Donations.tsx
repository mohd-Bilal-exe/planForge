import { useState } from 'react';
import { ArrowRight, Heart, Link, SquareArrowOutUpRight } from 'lucide-react';
import chaiImg from '@/assets/chai.jpg';

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');

  const options = [
    { glasses: 1, price: 30 },
    { glasses: 2, price: 60 },
    { glasses: 5, price: 150 },
    { glasses: 10, price: 300 },
  ];

  const getPrice = () => {
    if (customAmount && Number(customAmount) > 0) {
      return Number(customAmount) * 30;
    }
    return options.find(opt => opt.glasses === selectedAmount)?.price || 0;
  };

  const getCurrentAmount = () => {
    return customAmount && Number(customAmount) > 0 ? Number(customAmount) : selectedAmount;
  };

  return (
    <div className="relative flex flex-col justify-center items-center px-2 sm:px-0 h-full overflow-hidden text-white scrollbar-track-blue-400 scrollbar nunito">
      {/* Background Decorative Glow */}
      <div className="top-[25%] right-[-10%] absolute blur-[80px] sm:blur-[120px] rounded-full w-48 sm:w-96 h-48 sm:h-96 bg-accent-500/10" />
      <div className="bottom-[25%] left-[-10%] absolute bg-indigo-500/10 blur-[80px] sm:blur-[120px] rounded-full w-48 sm:w-96 h-48 sm:h-96" />

      <div className="relative flex lg:flex-row flex-col gap-4 sm:gap-6 lg:gap-10 bg-white/5 shadow-2xl backdrop-blur-2xl p-4 sm:p-6 lg:p-8 border border-white/10 rounded-2xl sm:rounded-4xl lg:rounded-[3rem] w-full max-w-sm sm:max-w-4xl h-fit max-h-[90vh] overflow-y-auto">
        {/* Left Content: Text and Selection */}
        <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 font-semibold text-[10px] text-slate-500 sm:text-xs uppercase tracking-[0.2em] nunito">
              <Heart size={14} className="animate-pulse text-accent-500" fill="currentColor" />

              <div className="flex items-center gap-1.5">
                <span className="opacity-70">Support</span>
                <a
                  href="https://mohd-bilal.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-slate-300 hover:text-white decoration-accent-500/30 hover:underline underline-offset-4 transition-all duration-300"
                >
                  The Developer
                  <SquareArrowOutUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-all -translate-x-0.5 -translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 duration-300 text-accent-400"
                  />
                </a>
              </div>
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-tight">
              Gift a cup of tea
            </h1>
            <p className="mt-2 sm:mt-3 lg:mt-4 max-w-md text-white/50 text-xs sm:text-sm lg:text-base leading-relaxed">
              Our team works very hard to provide you with the best tools. You can support our
              journey by buying us a tea.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <p className="font-semibold text-sm sm:text-base lg:text-lg">
              How many glasses would you like to donate?
            </p>

            {/* Grid Selectors */}
            <div className="gap-2 sm:gap-3 lg:gap-4 grid grid-cols-2 sm:grid-cols-4">
              {options.map(opt => (
                <button
                  key={opt.glasses}
                  onClick={() => {
                    setSelectedAmount(opt.glasses);
                    setCustomAmount('');
                  }}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl border transition-all duration-300 ${
                    selectedAmount === opt.glasses && !customAmount
                      ? 'border-accent-500 bg-accent-500/10 ring-1 ring-accent-500'
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-lg sm:text-xl lg:text-2xl">{opt.glasses}</span>
                  <span className="text-white/40 text-xs uppercase tracking-tighter">
                    Rs. {opt.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="group relative">
              <input
                type="number"
                placeholder="Or enter a custom number of cups"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="bg-white/5 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border border-white/5 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-1 w-full text-xs sm:text-sm lg:text-base transition-all focus:ring-accent-500/50"
              />
            </div>

            {/* Donate Action */}
            <button className="group flex justify-center items-center gap-2 sm:gap-3 shadow-xl px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl w-full font-bold text-white text-xs sm:text-sm lg:text-base active:scale-95 transition-all bg-accent-500 shadow-accent-500/20 hover:bg-accent-400">
              Confirm Donation of {getCurrentAmount()} cup{getCurrentAmount() !== 1 ? 's' : ''} (Rs.{' '}
              {getPrice()})
              <ArrowRight
                size={16}
                className="sm:w-4.5 lg:w-5 sm:h-4.5 lg:h-5 transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Right Content: Visual Image */}
        <div className="flex-1 lg:flex-none lg:w-80">
          <div className="group relative h-32 sm:h-48 lg:h-full lg:min-h-96">
            <div className="z-10 absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent rounded-xl sm:rounded-2xl lg:rounded-4xl" />
            <img
              src={chaiImg}
              alt="Tea Glass"
              className="grayscale-20 group-hover:grayscale-0 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] w-full min-w-64 h-full object-cover transition-all duration-700"
            />
            <a
              href="https://unsplash.com/@harsh_clicks__"
              target="_blank"
              className="top-2 sm:top-3 lg:top-6 left-2 sm:left-3 lg:left-6 z-20 absolute flex gap-1 sm:gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 border border-white/10 rounded-full text-xs lg:text-xs hover:scale-[102%] active:scale-95 transition-all ease-in-out cursor-pointer"
            >
              Picture Credits <Link size={12} className="sm:w-3.5 lg:w-4 sm:h-3.5 lg:h-4" />
            </a>
            {/* Overlay Badge */}
            <div className="right-2 sm:right-3 lg:right-6 bottom-2 sm:bottom-3 lg:bottom-6 z-20 absolute bg-white/10 backdrop-blur-md px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 border border-white/10 rounded-full text-xs lg:text-sm">
              ⚡ Powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
