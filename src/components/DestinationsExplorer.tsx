import React, { useState } from 'react';
import { 
  MapPin, 
  Sun, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock, 
  Compass, 
  ChevronRight 
} from 'lucide-react';
import { Destination } from '../types';

interface DestinationsExplorerProps {
  destinations: Destination[];
  selectedDestId: string | null;
  onFilterByDestination: (destName: string) => void;
  onOpenQuoteModal: (destName?: string) => void;
}

export const DestinationsExplorer: React.FC<DestinationsExplorerProps> = ({
  destinations,
  selectedDestId,
  onFilterByDestination,
  onOpenQuoteModal
}) => {
  const [activeCountry, setActiveCountry] = useState<'All' | 'Kenya' | 'Tanzania'>('All');
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    selectedDestId || destinations[0]?.id || 'masai-mara'
  );

  const filteredDestinations = destinations.filter(d => {
    if (activeCountry === 'All') return true;
    return d.country === activeCountry;
  });

  const activeDestination = destinations.find(d => d.id === currentSelectedId) || destinations[0];

  return (
    <section id="destinations-section" className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C05D10]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3.5 py-1.5 rounded-full mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>East Africa Safari Map & Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-white tracking-tight">
              Iconic Safari Destinations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-400 max-w-xl">
              From the Great Migration of the Masai Mara to the caldera of Ngorongoro and the snows of Kilimanjaro in Amboseli.
            </p>
          </div>

          {/* Country Tabs */}
          <div className="flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-2xl border border-stone-700/80">
            {(['All', 'Kenya', 'Tanzania'] as const).map(c => (
              <button
                key={c}
                id={`dest-country-tab-${c}`}
                onClick={() => setActiveCountry(c)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCountry === c
                    ? 'bg-[#C05D10] text-white shadow-lg'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {c === 'All' ? 'All Parks' : `${c}`}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Showcase Grid (Interactive Selector + Detailed Feature Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Quick Selector List */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredDestinations.map(dest => (
              <button
                key={dest.id}
                id={`dest-item-${dest.id}`}
                onClick={() => setCurrentSelectedId(dest.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  currentSelectedId === dest.id
                    ? 'bg-stone-800/90 border-[#C05D10] shadow-xl translate-x-1'
                    : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/50 hover:border-stone-700'
                }`}
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D88B46] uppercase tracking-wider">{dest.country}</span>
                    <span className="text-[10px] text-stone-400 font-medium">{dest.idealDays}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">{dest.name}</h4>
                  <p className="text-[11px] text-stone-400 truncate">{dest.tagline}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  currentSelectedId === dest.id ? 'text-[#C05D10] translate-x-0.5' : 'text-stone-600'
                }`} />
              </button>
            ))}
          </div>

          {/* Right Column: Active Destination Feature Display */}
          {activeDestination && (
            <div className="lg:col-span-8 bg-stone-800/70 rounded-3xl border border-stone-700/80 overflow-hidden shadow-2xl flex flex-col">
              
              {/* Feature Hero Image */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={activeDestination.heroImage}
                  alt={activeDestination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-[#C05D10] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeDestination.country}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
                      {activeDestination.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 italic mt-0.5">
                      "{activeDestination.tagline}"
                    </p>
                  </div>

                  <button
                    id="dest-book-quote-btn"
                    onClick={() => onOpenQuoteModal(activeDestination.name)}
                    className="bg-[#C05D10] hover:bg-[#A84F0C] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Request Safari Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Destination Details Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Description */}
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  {activeDestination.description}
                </p>

                {/* Highlights & Top Wildlife Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-700/60">
                  
                  {/* Highlights */}
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Experiences & Highlights</span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
                      {activeDestination.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#C05D10] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best Season & Climate */}
                  <div className="space-y-4">
                    <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-700 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Optimal Travel Window</span>
                      </div>
                      <p className="text-xs text-stone-300">{activeDestination.bestTimeToVisit}</p>
                    </div>

                    <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-700 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Climate & Weather</span>
                      </div>
                      <p className="text-xs text-stone-300">{activeDestination.climate}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Wildlife Tags & Link to Packages */}
                <div className="pt-4 border-t border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-stone-400">Featured Wildlife:</span>
                    {activeDestination.topWildlife.map((animal, i) => (
                      <span key={i} className="text-xs bg-stone-700/60 text-stone-200 px-2.5 py-1 rounded-lg">
                        {animal}
                      </span>
                    ))}
                  </div>

                  <button
                    id="filter-safaris-by-dest-btn"
                    onClick={() => {
                      onFilterByDestination(activeDestination.name.split(' ')[0]);
                      const el = document.getElementById('safaris-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
                  >
                    <span>View {activeDestination.name.split(' ')[0]} Safaris</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};