import React from 'react';
import { Award, Compass, ShieldCheck, HeartHandshake, Feather } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="py-16 bg-[#FAF8F5] text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#92400E]">
            Our Story & Heritage
          </span>
          <h1 className="text-4xl font-serif-display font-bold text-stone-900 leading-tight">
            The Philosophy of Artisan Haven
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            Founded in Manila, Artisan Haven was born from a singular passion: creating handcrafted minimalist leather goods and curated accessories that resist the throwaway nature of fast fashion.
          </p>
        </div>

        {/* 2-Column Visual & Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E7E2D9] aspect-4/3 bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan Haven Workshop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
            <h2 className="text-2xl font-serif-display font-bold text-stone-900">
              Honest Materials. Master Hands.
            </h2>
            <p>
              We believe a wallet, tote, or bracelet is not merely a tool—it is a companion that journeys with you through every milestone. As genuine vegetable-tanned leather absorbs natural oils and sunlight, it deepens into an unmistakable honeyed patina.
            </p>
            <p>
              By connecting local Filipino crafters directly with buyers, we ensure that every artisan receives fair wages, automated GCash settlements, and full creative autonomy.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[#92400E]">
              <span>✓ 100% Full Grain Leather</span>
              <span>•</span>
              <span>✓ Hand Saddle-Stitched</span>
              <span>•</span>
              <span>✓ PayMongo Verified</span>
            </div>
          </div>
        </div>

        {/* Core Principles Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E7E2D9]">
          <div className="bg-white p-6 rounded-xl border border-[#E7E2D9] space-y-2">
            <Compass className="w-6 h-6 text-[#92400E]" />
            <h3 className="font-serif-display font-bold text-base text-stone-900">Minimalist Architecture</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Eliminating extraneous pockets, synthetic linings, and bulky hardware to create sleek, pocket-friendly silhouettes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E2D9] space-y-2">
            <Feather className="w-6 h-6 text-[#92400E]" />
            <h3 className="font-serif-display font-bold text-base text-stone-900">Nautical Resilience</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our waterproof macrame bracelets and 316L stainless steel clasps are tested in tropical sea salt and daily showers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E2D9] space-y-2">
            <HeartHandshake className="w-6 h-6 text-[#92400E]" />
            <h3 className="font-serif-display font-bold text-base text-stone-900">Artisan Community First</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every peso spent directly funds the workshop tools, family livelihood, and apprenticeship of Filipino craftspeople.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
