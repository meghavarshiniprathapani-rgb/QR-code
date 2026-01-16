
import React from 'react';

interface Props {
  locationId: string;
}

const QRCodeGenerator: React.FC<Props> = ({ locationId }) => {
  // Using the specific branded QR asset provided by the user
  const qrImageUrl = `https://ik.imagekit.io/z5fowzj2wr/QR-CODE.png`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative group p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105">
        <div className="bg-white p-2 rounded-[14px]">
          <img 
            src={qrImageUrl} 
            alt="Safety Report QR Code" 
            className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-lg"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-md">
          <i className="fas fa-shield-heart text-xs"></i>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] text-center text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em]">
        Scan to Inform Community
      </p>
    </div>
  );
};

export default QRCodeGenerator;
