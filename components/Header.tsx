
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-[#C1272D] to-[#006233] text-white overflow-hidden shadow-xl">
      {/* Decorative Star Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center scale-150">
        <svg width="400" height="400" viewBox="0 0 200 200">
           <polygon points="100,10 40,198 190,78 10,78 160,198" fill="white" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/10 p-4 rounded-full mb-6 backdrop-blur-md border border-white/20">
          <i className="fa-solid fa-building-circle-check text-5xl text-yellow-400"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
          بيانات مباني المملكة المغربية
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl opacity-90">
          منصة متكاملة لإدارة وتحميل روابط خرائط المباني الحديثة (Quadkeys) المخصصة للمغرب.
        </p>
      </div>
      
      {/* Bottom Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50 opacity-100"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;
