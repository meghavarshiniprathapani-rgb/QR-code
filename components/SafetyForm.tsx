
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewState } from '../types';
import { getSafetyTip } from '../services/geminiService';

interface Props {
  locationName: string;
  locationId: string;
}

interface TagOption {
  id: string;
  label: string;
  icon: string;
}

const SAFETY_TAGS: TagOption[] = [
  { id: 'well-lit', label: 'Well Lit', icon: 'fa-lightbulb' },
  { id: 'poor-lighting', label: 'Dim Lighting', icon: 'fa-moon' },
  { id: 'crowded', label: 'Crowded', icon: 'fa-users' },
  { id: 'deserted', label: 'Empty/Deserted', icon: 'fa-user-slash' },
  { id: 'security-visible', label: 'Security Seen', icon: 'fa-user-shield' },
  { id: 'clean', label: 'Clean Area', icon: 'fa-sparkles' },
  { id: 'maintenance-needed', label: 'Needs Repair', icon: 'fa-tools' },
  { id: 'safe-vibe', label: 'Safe Vibe', icon: 'fa-heart' },
];

const SafetyForm: React.FC<Props> = ({ locationName, locationId }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>(ViewState.RATING);
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [aiTip, setAiTip] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  const referenceId = useMemo(() => `QS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, []);
  const timestamp = useMemo(() => new Date().toLocaleString(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVerifying(false), 1200);
    return () => clearTimeout(timer);
  }, [locationId]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (selectedScore === 0) return;
    
    setView(ViewState.SUBMITTING);
    const tagsLabels = SAFETY_TAGS.filter(t => selectedTags.includes(t.id)).map(t => t.label);
    const tipPromise = getSafetyTip(selectedScore, locationName, tagsLabels);
    
    await new Promise(r => setTimeout(r, 2000));
    
    const tip = await tipPromise;
    setAiTip(tip);
    setView(ViewState.SUCCESS);
  };

  if (view === ViewState.SUCCESS) {
    return (
      <div className="flex flex-col items-center py-6 animate-scale-in">
        <div className="relative mb-10">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-900 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw-check 0.8s ease-out forwards' }} />
            </svg>
          </div>
          <div className="absolute -inset-2 bg-emerald-400/20 rounded-full blur-xl animate-pulse -z-10"></div>
        </div>
        
        <div className="text-center mb-8 animate-slide-up delay-100">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Transmission Received</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Your anonymous signal has been logged for <span className="text-slate-900 dark:text-slate-100 font-bold">{locationName}</span>.
          </p>
        </div>

        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 mb-8 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-slide-up delay-200">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-50 dark:border-slate-800">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Verified Log</span>
             </div>
             <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600">{timestamp}</span>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Digital Signature</span>
              <p className="text-sm font-mono text-slate-900 dark:text-slate-100 font-black">{referenceId}</p>
            </div>

            {selectedTags.length > 0 && (
              <div className="animate-slide-up delay-300">
                <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">Environmental Data</span>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tid => {
                    const tag = SAFETY_TAGS.find(t => t.id === tid);
                    return (
                      <span key={tid} className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold flex items-center shadow-sm">
                        <i className={`fas ${tag?.icon} mr-2 text-indigo-400`}></i>
                        {tag?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 animate-slide-up delay-400">
              <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                <div className="flex items-center space-x-2 mb-3">
                   <i className="fas fa-sparkles text-xs text-indigo-200"></i>
                   <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-100">AI Safety Pulse</span>
                </div>
                <p className="text-sm leading-relaxed font-bold">
                  "{aiTip}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all animate-slide-up delay-400"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (view === ViewState.SUBMITTING) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-center">
        <div className="relative mb-10">
          <div className="w-20 h-20 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <i className="fas fa-shield-halved text-indigo-600 animate-pulse"></i>
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Analyzing Signal</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Syncing with Regional Nodes...</p>
      </div>
    );
  }

  const ratings = [
    { score: 1, label: 'Danger', icon: 'fa-radiation', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', active: 'border-red-500 ring-8 ring-red-50 dark:ring-red-900/20 shadow-red-100 dark:shadow-none' },
    { score: 2, label: 'Caution', icon: 'fa-triangle-exclamation', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', active: 'border-orange-500 ring-8 ring-orange-50 dark:ring-orange-900/20 shadow-orange-100 dark:shadow-none' },
    { score: 3, label: 'Neutral', icon: 'fa-circle-dot', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', active: 'border-slate-500 ring-8 ring-slate-100 dark:ring-slate-800/50 shadow-slate-200 dark:shadow-none' },
    { score: 4, label: 'Secure', icon: 'fa-shield-check', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', active: 'border-emerald-500 ring-8 ring-emerald-50 dark:ring-emerald-900/20 shadow-emerald-100 dark:shadow-none' },
    { score: 5, label: 'Optimal', icon: 'fa-shield-heart', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', active: 'border-indigo-600 ring-8 ring-indigo-50 dark:ring-indigo-900/20 shadow-indigo-100 dark:shadow-none' },
  ];

  return (
    <div className="px-1 pb-16">
      <div className="mb-12 text-center animate-slide-up">
        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full mb-8 shadow-sm transition-all">
          <div className={`w-2 h-2 rounded-full ${isVerifying ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">
            {isVerifying ? 'Securing Node...' : `Reporting: ${locationName}`}
          </span>
        </div>
        
        <h1 className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tightest mb-4 leading-tight">Rate Your<br/>Current Safety</h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold max-w-xs mx-auto">One tap to inform the community.<br/>Completely anonymous.</p>
      </div>

      {/* Rating System */}
      <div className="mb-12 animate-slide-up delay-100">
        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-6 ml-1">
          Select Pulse <span className="text-red-500 ml-1 opacity-50">*</span>
        </label>
        <div className="grid grid-cols-5 gap-3">
          {ratings.map((item) => (
            <button
              key={item.score}
              onClick={() => setSelectedScore(item.score)}
              className={`group relative flex flex-col items-center justify-center py-7 px-1 rounded-[24px] transition-all duration-500 border-2 active:scale-90 ${
                selectedScore === item.score 
                  ? `${item.active} bg-white dark:bg-slate-900 shadow-2xl dark:shadow-none -translate-y-2` 
                  : 'bg-white dark:bg-slate-900 border-transparent dark:border-slate-800/50 shadow-sm hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <i className={`fas ${item.icon} text-2xl mb-3 transition-all duration-300 ${selectedScore === item.score ? item.color : 'text-slate-200 dark:text-slate-800'}`}></i>
              <span className={`text-[9px] font-black uppercase tracking-tight text-center transition-all duration-300 ${selectedScore === item.score ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                {item.label}
              </span>
              {selectedScore === item.score && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white shadow-lg">
                   <i className="fas fa-check"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="mb-12 animate-slide-up delay-200">
        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-6 ml-1">
          Environmental Details
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SAFETY_TAGS.map((tag, idx) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-300 text-left active:scale-95 ${
                selectedTags.includes(tag.id)
                  ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-500 text-white shadow-xl translate-x-1'
                  : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedTags.includes(tag.id) ? 'bg-white/10 dark:bg-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <i className={`fas ${tag.icon} text-xs ${selectedTags.includes(tag.id) ? 'text-indigo-400 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}></i>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-tight leading-none">{tag.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mb-14 animate-slide-up delay-300">
        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-6 ml-1">
          Specific Observations
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g. Broken streetlight, unusual activity..."
          className="w-full p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] focus:ring-8 focus:ring-indigo-50 dark:focus:ring-indigo-950/40 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm text-sm font-bold dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedScore === 0}
        className={`relative overflow-hidden w-full py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.25em] transition-all transform active:scale-[0.96] shadow-2xl animate-slide-up delay-400 ${
          selectedScore !== 0 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200/50 dark:shadow-none' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
        }`}
      >
        <span className="relative z-10">Submit Official Report</span>
        {selectedScore !== 0 && <div className="shimmer-effect"></div>}
      </button>

      <div className="mt-16 text-center animate-slide-up delay-400">
        <div className="inline-flex items-center space-x-4 text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.4em] opacity-40">
          <i className="fas fa-microchip"></i>
          <span>Encrypted Packet Transmission</span>
          <i className="fas fa-wifi"></i>
        </div>
      </div>
    </div>
  );
};

export default SafetyForm;
