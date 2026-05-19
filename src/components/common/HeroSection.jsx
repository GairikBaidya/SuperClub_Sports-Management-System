import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] py-12">
      {/* Background decoration - Sporty & Fun */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-10 -right-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-20 animate-pulse delay-300"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 animate-pulse delay-700"></div>
      </div>
      
      {/* Floating Sport Icons */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-8 md:left-20 text-4xl md:text-6xl animate-bounce opacity-30 drop-shadow-md">⚽</div>
        <div className="absolute top-24 right-10 md:right-24 text-5xl md:text-7xl animate-bounce delay-300 opacity-30 drop-shadow-md" style={{ animationDelay: '0.5s' }}>🏀</div>
        <div className="absolute bottom-16 left-1/4 text-4xl md:text-5xl animate-bounce opacity-30 drop-shadow-md" style={{ animationDelay: '0.2s' }}>🏆</div>
        <div className="absolute bottom-24 right-1/4 text-3xl md:text-4xl animate-bounce opacity-30 drop-shadow-md" style={{ animationDelay: '0.8s' }}>🏸</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-4">
        {/* Badge */}
        <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-sm md:text-base font-extrabold uppercase tracking-widest mb-8 shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-pointer border-2 border-white">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>
          Ready to Play?
        </Link>
        
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 uppercase italic transform -skew-x-6 hover:-skew-x-2 transition-transform duration-500 leading-tight drop-shadow-sm">
          Welcome To <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 inline-block pr-6 pb-2 -mb-2">
            SuperClub
          </span>
          ! 🚀
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-bold leading-relaxed mb-8 drop-shadow-sm bg-white/60 p-4 rounded-2xl backdrop-blur-sm">
          The most <span className="text-orange-500 font-extrabold text-2xl md:text-3xl">AWESOME</span> place for kids to play sports, win medals, and have fun! Get your gear ready!
        </p>

        {/* Action/Fun elements */}
        <div className="flex justify-center gap-6 text-3xl md:text-4xl mt-4">
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🌟</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🏃‍♂️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>🥇</span>
          <span className="animate-bounce" style={{ animationDelay: '0.7s' }}>⚡</span>
        </div>
      </div>
    </div>
  );
}
