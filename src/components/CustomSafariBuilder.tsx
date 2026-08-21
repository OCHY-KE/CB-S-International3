import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Check, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  BedDouble, 
  Coffee,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SafariTier, CurrencyCode } from '../types';
import { CURRENCIES, CBSI_CONTACT } from '../data/safariData';

interface CustomSafariBuilderProps {
  currentCurrency: CurrencyCode;
}

const DESTINATION_OPTIONS = [
  { id: 'mara', name: 'Masai Mara (Kenya)', icon: '🦁', baseCostPerDay: 350 },
  { id: 'serengeti', name: 'Serengeti (Tanzania)', icon: '🐆', baseCostPerDay: 380 },
  { id: 'amboseli', name: 'Amboseli / Kilimanjaro (Kenya)', icon: '🐘', baseCostPerDay: 280 },
  { id: 'ngorongoro', name: 'Ngorongoro Crater (Tanzania)', icon: '🦏', baseCostPerDay: 420 },
  { id: 'nakuru', name: 'Lake Nakuru & Naivasha (Kenya)', icon: '🦩', baseCostPerDay: 240 },
  { id: 'samburu', name: 'Samburu & Ol Pejeta (Kenya)', icon: '🦓', baseCostPerDay: 300 },
  { id: 'zanzibar', name: 'Zanzibar Beach Extension', icon: '🏖️', baseCostPerDay: 260 }
];

const ADDON_OPTIONS = [
  { id: 'balloon', name: 'Sunrise Hot Air Balloon Safari & Champagne Breakfast', costPerPerson: 450, icon: '🎈' },
  { id: 'maasai', name: 'Authentic Maasai Cultural Village Visit & Dance', costPerPerson: 30, icon: '🛖' },
  { id: 'boat', name: 'Lake Naivasha Hippo Boat Safari & Crescent Island', costPerPerson: 60, icon: '🚤' },
  { id: 'bush_dinner', name: 'Private Starlit Bush Dinner & Campfire Barbecue', costPerPerson: 90, icon: '🕯️' },
  { id: 'night_drive', name: 'Private Night Game Drive with Spotlights', costPerPerson: 120, icon: '🌙' }
];

export const CustomSafariBuilder: React.FC<CustomSafariBuilderProps> = ({
  currentCurrency
}) => {
  // Builder Form State
  const [selectedDests, setSelectedDests] = useState<string[]>(['mara', 'nakuru']);
  const [durationDays, setDurationDays] = useState<number>(4);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [tier, setTier] = useState<SafariTier>('Classic Mid-Range');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['maasai']);
  const [travelMonth, setTravelMonth] = useState<string>('July - August (Migration Peak)');
  
  // Contact details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [contactVia, setContactVia] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleDestination = (destId: string) => {
    if (selectedDests.includes(destId)) {
      if (selectedDests.length > 1) {
        setSelectedDests(selectedDests.filter(id => id !== destId));
      }
    } else {
      setSelectedDests([...selectedDests, destId]);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Estimate calculation
  const estimatedTotalUSD = useMemo(() => {
    const tierMultipliers: Record<SafariTier, number> = {
      'Luxury Lodge': 1.6,
      'Classic Mid-Range': 1.0,
      'Budget Adventure': 0.75,
      'Fly-In Safari': 1.8,
      'Honeymoon': 1.65,
      'Family': 0.95
    };

    // Calculate base daily cost
    const activeDestsData = DESTINATION_OPTIONS.filter(d => selectedDests.includes(d.id));
    const avgDailyBase = activeDestsData.reduce((sum, d) => sum + d.baseCostPerDay, 0) / (activeDestsData.length || 1);

    const basePerAdult = avgDailyBase * durationDays * (tierMultipliers[tier] || 1.0);
    const basePerChild = basePerAdult * 0.65; // Children discount

    // Add-ons
    const addonsCost = selectedAddons.reduce((sum, addId) => {
      const addObj = ADDON_OPTIONS.find(a => a.id === addId);
      return sum + (addObj ? addObj.costPerPerson * (adults + children * 0.8) : 0);
    }, 0);

    const total = (basePerAdult * adults) + (basePerChild * children) + addonsCost;
    return Math.round(total);
  }, [selectedDests, durationDays, adults, children, tier, selectedAddons]);

  const estimatedPerPersonUSD = useMemo(() => {
    const totalTravelers = adults + (children * 0.7) || 1;
    return Math.round(estimatedTotalUSD / totalTravelers);
  }, [estimatedTotalUSD, adults, children]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || (!email && !phone)) {
      alert('Please provide your name and either email or WhatsApp number so our specialist can send your itinerary.');
      return;
    }

    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (contactVia === 'WhatsApp' && phone) {
      const destNames = DESTINATION_OPTIONS.filter(d => selectedDests.includes(d.id)).map(d => d.name).join(', ');
      const msg = `Hello CBSI Safaris! I just built a custom safari on your website:
- Name: ${fullName}
- Destinations: ${destNames}
- Duration: ${durationDays} Days
- Travelers: ${adults} Adults, ${children} Children
- Style: ${tier}
- Approx Budget: $${estimatedTotalUSD} USD
- Travel Season: ${travelMonth}
${notes ? `Special Notes: ${notes}` : ''}
Please send me a detailed custom quote.`;

      window.open(`https://wa.me/254722774952?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <section id="custom-builder-section" className="py-20 bg-gradient-to-b from-[#FAF7F2] to-amber-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C05D10] bg-orange-100 px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Bespoke & Private</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-stone-900 tracking-tight">
            Tailor-Made Safari Builder
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600">
            Customize your dream East Africa wildlife trip. Select your favorite parks, comfort level, and activities for an instant transparent estimate.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-200 max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold font-outfit text-stone-900">Custom Safari Request Received!</h3>
              <p className="text-stone-600 text-sm mt-2">
                Asante sana (thank you), <span className="font-bold text-stone-900">{fullName}</span>! Our lead safari naturalist at our Nairobi office will review your preferences and contact you via {contactVia} within 2 hours with a comprehensive day-by-day proposal and lodge availability.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
              <div className="font-bold text-stone-900 text-sm mb-2">Trip Summary:</div>
              <div><span className="text-stone-500">Destinations:</span> {selectedDests.map(id => DESTINATION_OPTIONS.find(d => d.id === id)?.name).join(', ')}</div>
              <div><span className="text-stone-500">Duration:</span> {durationDays} Days ({tier})</div>
              <div><span className="text-stone-500">Travelers:</span> {adults} Adults, {children} Children</div>
              <div><span className="text-stone-500">Estimated Total:</span> <span className="font-bold text-[#C05D10]">{CURRENCIES[currentCurrency].format(estimatedTotalUSD)}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/254722774952?text=Hi%20CBSI%20Safaris,%20I%20just%20submitted%20a%20quote%20request%20for%20${fullName}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Follow up on WhatsApp (+254 722 774952)</span>
              </a>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2"
              >
                Build Another Itinerary
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Interactive Builder Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80 space-y-8">
              
              {/* Step 1: Destination Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#C05D10] text-white text-xs font-black flex items-center justify-center">1</span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">Select Parks & Regions</h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">Choose 1 or more</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DESTINATION_OPTIONS.map(dest => {
                    const isSelected = selectedDests.includes(dest.id);
                    return (
                      <button
                        type="button"
                        key={dest.id}
                        id={`builder-dest-${dest.id}`}
                        onClick={() => toggleDestination(dest.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50/80 border-[#C05D10] text-stone-900 shadow-sm'
                            : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{dest.icon}</span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold">{dest.name}</div>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#C05D10] border-[#C05D10] text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration & Travelers */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#C05D10] text-white text-xs font-black flex items-center justify-center">2</span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">Duration & Number of Travelers</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Days Slider / Picker */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Safari Duration: <span className="text-[#C05D10] text-sm font-extrabold">{durationDays} Days</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full accent-[#C05D10] cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
                      <span>2 Days</span>
                      <span>7 Days</span>
                      <span>14 Days</span>
                    </div>
                  </div>

                  {/* Adults */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <label className="text-xs font-bold text-stone-700 block mb-2">
                      Adults (Age 12+):
                    </label>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span className="text-base font-extrabold text-stone-900">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <label className="text-xs font-bold text-stone-700 block mb-2">
                      Children (Under 12):
                    </label>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span className="text-base font-extrabold text-stone-900">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Comfort Level / Accommodation Tier */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#C05D10] text-white text-xs font-black flex items-center justify-center">3</span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">Accommodation Tier</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Classic Mid-Range', title: 'Classic Comfort', desc: 'Quality permanent tented camps with en-suite baths & buffet dining' },
                    { id: 'Luxury Lodge', title: 'Luxury Lodges', desc: '5-star boutique tented suites, infinity pools, fine bush dining & prime locations' },
                    { id: 'Budget Adventure', title: 'Adventure Budget', desc: 'Standard comfortable camps & basic lodges for cost-conscious travelers' },
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTier(t.id as SafariTier)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        tier === t.id
                          ? 'bg-amber-50/90 border-[#C05D10] text-stone-900 shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-extrabold text-stone-900">{t.title}</div>
                      <div className="text-[11px] text-stone-500 mt-1 leading-snug">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Special Activities / Add-ons */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#C05D10] text-white text-xs font-black flex items-center justify-center">4</span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">Optional Extra Experiences</h3>
                  </div>
                  <span className="text-xs text-stone-500">Select any you'd like</span>
                </div>

                <div className="space-y-2">
                  {ADDON_OPTIONS.map(addon => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50/80 border-[#C05D10] text-stone-900'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{addon.icon}</span>
                          <span className="text-xs sm:text-sm font-semibold">{addon.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#C05D10]">
                            +{CURRENCIES[currentCurrency].format(addon.costPerPerson)}/p
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-[#C05D10] border-[#C05D10] text-white' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Contact Info & Preferences */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#C05D10] text-white text-xs font-black flex items-center justify-center">5</span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">Where Should We Send Your Itinerary?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      id="builder-name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C05D10] focus:ring-1 focus:ring-[#C05D10]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      id="builder-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah@example.com"
                      className="w-full bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C05D10] focus:ring-1 focus:ring-[#C05D10]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">WhatsApp / Phone (with country code)</label>
                    <input
                      type="tel"
                      id="builder-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 555 123 4567"
                      className="w-full bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C05D10] focus:ring-1 focus:ring-[#C05D10]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Preferred Travel Window</label>
                    <select
                      value={travelMonth}
                      onChange={(e) => setTravelMonth(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C05D10] focus:ring-1 focus:ring-[#C05D10]"
                    >
                      <option value="July - August (Migration Peak)">July - August (Migration River Crossing Peak)</option>
                      <option value="September - October (Late Migration)">September - October (Dry Season Predator Action)</option>
                      <option value="December - January (Festive Season)">December - January (Holiday Season)</option>
                      <option value="January - March (Calving Season)">January - March (Southern Serengeti Calving)</option>
                      <option value="April - May (Green Season Value)">April - May (Emerald Season Super Value)</option>
                      <option value="June (Early Migration)">June (Early Migration Start)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold text-stone-700 block mb-1">Special Wishes / Notes (Optional)</label>
                  <textarea
                    id="builder-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Celebrating our 10th anniversary, keen on photography, dietary requirements..."
                    className="w-full bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C05D10] focus:ring-1 focus:ring-[#C05D10]"
                  />
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Live Cost Breakdown & Instant Submission Widget */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sticky Price Estimator Card */}
              <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-800 sticky top-28 space-y-6">
                
                <div className="pb-4 border-b border-stone-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Trip Estimate</div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                        {CURRENCIES[currentCurrency].format(estimatedTotalUSD)}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        ~{CURRENCIES[currentCurrency].format(estimatedPerPersonUSD)} / person
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#C05D10] text-white px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                      Private 4x4
                    </span>
                  </div>
                </div>

                {/* Configuration Summary Pills */}
                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-800">
                    <span className="text-stone-400">Destinations ({selectedDests.length}):</span>
                    <span className="font-semibold text-right max-w-[60%] truncate">
                      {selectedDests.map(id => DESTINATION_OPTIONS.find(d => d.id === id)?.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800">
                    <span className="text-stone-400">Duration:</span>
                    <span className="font-semibold">{durationDays} Days / {durationDays - 1} Nights</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800">
                    <span className="text-stone-400">Travelers:</span>
                    <span className="font-semibold">{adults} Adults {children > 0 ? `, ${children} Children` : ''}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800">
                    <span className="text-stone-400">Comfort Level:</span>
                    <span className="font-semibold text-amber-300">{tier}</span>
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Add-ons:</span>
                      <span className="font-semibold text-amber-300">{selectedAddons.length} Selected</span>
                    </div>
                  )}
                </div>

                {/* What's always included note */}
                <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/80 text-[11px] text-stone-300 space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Included in this estimate:</span>
                  </div>
                  <div className="text-stone-300 leading-relaxed">
                    • Dedicated 4x4 Land Cruiser & certified guide<br />
                    • All national park & conservation fees<br />
                    • Full board meals & bottled water<br />
                    • 24/7 Flying Doctors emergency insurance
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    id="submit-builder-quote-btn"
                    onClick={handleSubmit}
                    className="w-full py-3.5 bg-[#C05D10] hover:bg-[#A94F0C] text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Me Detailed Itinerary & Quote</span>
                  </button>

                  <a
                    href="https://wa.me/254722774952?text=Hello%20CBSI%20Safaris,%20I'm%20customizing%20a%20safari%20and%20would%20like%20to%20chat."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-xs rounded-2xl border border-emerald-600/50 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Chat on WhatsApp (+254 722 774952)</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};