
import React, { useEffect } from 'react';
import { Routes, Route, useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import SafetyForm from './components/SafetyForm';
import QRCodeGenerator from './components/QRCodeGenerator';
import Poster from './components/Poster';
import GhostCursor from './components/GhostCursor';
import PixelBlast from './components/PixelBlast';

const KNOWN_LOCATIONS = [
  { id: 'general', name: 'Universal Access', zone: 'Sector 0' },
  { id: 'central-plaza', name: 'The Grand Plaza', zone: 'Downtown' },
  { id: 'north-transit', name: 'Northern Hub', zone: 'Sector 4' },
];

const formatLocationId = (id: string): string => {
  return id.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isReportPage = location.pathname.startsWith('/report/');

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-950/70 backdrop-blur-2xl z-50 border-b border-slate-800 h-16 flex items-center transition-all duration-300">
      <div className="max-w-6xl w-full mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isHomePage && (
            <button 
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 transition-all active:scale-90"
              aria-label="Go Back"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 safe-gradient rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-900/40 group-active:scale-90 transition-transform">
              <i className="fas fa-shield-heart text-sm"></i>
            </div>
            <span className="font-extrabold text-white text-xs uppercase tracking-[0.2em] hidden xs:inline">{isReportPage ? 'Secure Link' : 'QuickSafe'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const HomeView: React.FC = () => (
  <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* Left Part: Description */}
      <div className="text-left animate-slide-up">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-950/40 text-indigo-400 rounded-full mb-6 border border-indigo-900/50">
          <i className="fas fa-satellite-dish text-[10px]"></i>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Safety Protocol v2.0</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-[950] text-white mb-8 tracking-tightest leading-[0.9]">
          Real-time <br/>
          <span className="text-indigo-500">Community</span> <br/>
          Vigilance.
        </h1>
        
        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mb-10">
          QuickSafe turns every public corner into an anonymous feedback node. 
          By deploying these QR access points, urban developers and security teams 
          receive instant, encrypted environmental safety pulses from the people on the ground.
        </p>
        
        <div className="mb-12">
          <div className="flex flex-col space-y-2 max-w-xs">
            <div className="flex items-center space-x-2 text-slate-200">
              <i className="fas fa-user-secret text-indigo-500 text-sm"></i>
              <span className="text-xs font-black uppercase tracking-widest">Anonymous Reporting</span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold leading-tight">
              No login required. We value privacy and collective safety above all else. 
              Your data is processed and aggregated without personal identifiers.
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-slate-700">
            <i className="fas fa-shield-check text-xs"></i>
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Privacy First Infrastructure</p>
          </div>
        </div>
      </div>

      {/* Right Part: QR Node */}
      <div className="flex flex-col items-center animate-slide-up delay-200">
        <div className="w-full max-w-sm">
          <div className="bg-slate-900/80 backdrop-blur-md p-12 rounded-[60px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] border border-slate-800 flex flex-col items-center relative group transition-colors duration-300">
            {/* Background decorative glow */}
            <div className="absolute inset-20 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-colors"></div>
            
            <div className="mb-10 text-center">
              <span className="px-6 py-2.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-xl">
                Gateway: Universal
              </span>
            </div>
            
            <div className="transform transition-all duration-500 hover:scale-[1.05] hover:rotate-1">
              <QRCodeGenerator locationId="general" />
            </div>
            
            <div className="mt-12 w-full pt-10 border-t border-slate-800/50">
               <Link 
                  to="/report/general"
                  className="relative overflow-hidden w-full py-6 bg-indigo-600 text-white font-black rounded-[32px] text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-700 active:scale-[0.96] transition-all flex items-center justify-center space-x-4"
                >
                  <i className="fas fa-play text-white/50 text-[10px]"></i>
                  <span>Test Prototype</span>
                  <div className="shimmer-effect"></div>
                </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

const ReportView: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const knownLoc = KNOWN_LOCATIONS.find(l => l.id === locationId);
  const identifiedName = knownLoc ? knownLoc.name : (locationId ? formatLocationId(locationId) : 'Global Node');

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-8 animate-slide-up">
           <Link to="/" className="inline-flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-indigo-500 transition-colors">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Gateway</span>
           </Link>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-slate-800">
          <SafetyForm locationName={identifiedName} locationId={locationId || 'general'} />
        </div>
      </div>
    </div>
  );
};

const PosterView: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const knownLoc = KNOWN_LOCATIONS.find(l => l.id === locationId);
  const identifiedName = knownLoc ? knownLoc.name : (locationId ? formatLocationId(locationId) : 'Global Node');
  return <Poster locationName={identifiedName} locationId={locationId || 'general'} />;
}

const App: React.FC = () => {
  useEffect(() => {
    // Force dark class on mounting
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen text-white transition-colors duration-300 overflow-x-hidden relative bg-slate-950">
      
      {/* PIXEL BLAST BACKGROUND (Fixed Layer -10) */}
      <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: -10, 
          width: "100vw", 
          height: "100vh",
          pointerEvents: "none"
        }}
      >
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B19EEF"
          patternScale={2}
          patternDensity={1}
          enableRipples={true}
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          speed={0.5}
          transparent={true}
          edgeFade={0.25}
        />
      </div>

      {/* ATMOSPHERIC DECORATIVE BLURS (-20) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/15 blur-[120px] rounded-full -z-20 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/15 blur-[120px] rounded-full -z-20 pointer-events-none"></div>

      <GhostCursor />

      {/* FOREGROUND CONTENT LAYER (z-10) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/report/:locationId" element={<ReportView />} />
            <Route path="/poster/:locationId" element={<PosterView />} />
          </Routes>
        </main>
        
        <footer className="py-12 text-center mt-auto animate-slide-up delay-400">
          <p className="text-[10px] text-slate-700 font-black tracking-[0.6em] uppercase">QuickSafe Infrastructure • Built for Resilience</p>
        </footer>
      </div>
    </div>
  );
};

export default App;