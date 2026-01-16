
import React, { useEffect } from 'react';

interface Props {
  locationName: string;
  locationId: string;
}

const Poster: React.FC<Props> = ({ locationName, locationId }) => {
  // Using the specific branded QR asset provided by the user for high-quality printing
  const qrImageUrl = `https://ik.imagekit.io/z5fowzj2wr/QR-CODE.png`;

  useEffect(() => {
    console.log("Poster ready for printing. Location:", locationName);
  }, [locationName]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-0 print:p-0">
      {/* UI Overlay for Admin - hidden on print */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center print:hidden bg-white/80 backdrop-blur p-4 rounded-2xl border border-gray-200 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold">
            <i className="fas fa-print"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Poster Preview</p>
            <p className="text-xs font-bold text-gray-900">{locationName}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
          >
            Back
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-black text-white rounded-xl text-xs font-bold hover:opacity-80 transition-all flex items-center space-x-2"
          >
            <i className="fas fa-print"></i>
            <span>Print Now</span>
          </button>
        </div>
      </div>

      {/* The Printable Poster Container */}
      <div className="w-full max-w-[21cm] h-full flex flex-col items-center justify-center bg-white border-[16px] border-black p-12 text-black text-center print:border-[20px] print:w-screen print:h-screen print:max-w-none">
        
        {/* Headline Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-[900] leading-none tracking-tighter uppercase mb-4 print:text-7xl">
            SCAN TO RATE<br/>YOUR SAFETY
          </h1>
          <div className="h-2 w-48 bg-black mx-auto"></div>
        </div>

        {/* QR Zone */}
        <div className="relative p-8 border-4 border-black mb-12">
          <img 
            src={qrImageUrl} 
            alt="Safety QR" 
            className="w-80 h-80 sm:w-[400px] sm:h-[400px] object-contain"
          />
          {/* Corner Marks */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-black"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-black"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-black"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-black"></div>
        </div>

        {/* Instructions */}
        <div className="mb-16">
          <p className="text-3xl font-black uppercase tracking-tight mb-2 print:text-4xl">
            Takes less than 30 seconds
          </p>
          <p className="text-lg font-bold text-gray-600 uppercase tracking-widest print:text-xl">
            No Login Required • 100% Anonymous
          </p>
        </div>

        {/* Branding/Footer */}
        <div className="mt-auto w-full flex items-center justify-between border-t-4 border-black pt-8">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">QuickSafe Protocol</p>
            <p className="text-xs font-bold opacity-60">PUBLIC SAFETY MONITORING SYSTEM</p>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Location Verified</p>
            <p className="text-xs font-bold uppercase">{locationName}</p>
          </div>
        </div>

        {/* Seal Icon */}
        <div className="absolute bottom-20 right-20 opacity-10 print:opacity-5 pointer-events-none">
          <i className="fas fa-shield-halved text-[200px]"></i>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};

export default Poster;
