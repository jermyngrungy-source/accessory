import React from 'react';
import { Feather, ShieldCheck, Sparkles, Smartphone, Award, RefreshCw, Star, HeartHandshake } from 'lucide-react';

export const Features: React.FC = () => {
  const pillars = [
    {
      icon: <Feather className="w-5 h-5 text-[#5A3E2B]" />,
      title: 'Full-Grain Vegetable Tannage',
      description: 'We exclusively curate Italian & locally sourced full-grain vegetable-tanned hides that age with a rich patina rather than peeling or degrading.'
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#5A3E2B]" />,
      title: 'Direct Artisan Empowerment',
      description: 'Zero predatory middlemen markups. Filipino craftspeople set their own pricing, manage their ateliers directly, and receive instant GCash settlements.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#5A3E2B]" />,
      title: 'PayMongo & GCash Checkout',
      description: 'Seamlessly pay via GCash, Maya, or international credit cards with bank-grade encryption and automated instant payment verification.'
    },
    {
      icon: <Star className="w-5 h-5 text-[#5A3E2B]" />,
      title: 'Verified 5-Star Reviews',
      description: 'Genuine reviews and star ratings from verified buyers with photo-ready material feedback so you know the exact texture and hand-feel.'
    }
  ];

  return (
    <section className="py-20 bg-[#F9F7F2] border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-6 bg-black/20"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-black/40">
              Our Craft Philosophy
            </span>
            <span className="h-[1px] w-6 bg-black/20"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-[#2C2C2C]">
            Built with Intent. Sourced with Honor.
          </h2>
          <p className="text-base text-black/60 leading-relaxed max-w-xl mx-auto">
            Every stitch is placed by hand using traditional saddle-stitching techniques that never unravel even if a single thread is severed.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-white/60 p-8 border border-black/10 shadow-none hover:border-black/30 transition-all text-left space-y-4 group"
            >
              <div className="w-10 h-10 bg-[#E8E4DF] border border-black/10 flex items-center justify-center group-hover:bg-[#5A3E2B] group-hover:text-white transition-all">
                {pillar.icon}
              </div>
              <h3 className="font-serif italic font-bold text-lg text-[#2C2C2C] leading-snug">
                {pillar.title}
              </h3>
              <p className="text-xs text-black/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Design Principle Callout */}
        <div className="mt-16 bg-[#2C2C2C] text-[#F9F7F2] p-8 sm:p-12 relative overflow-hidden border border-black/10 shadow-lg">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 text-left">
              <span className="text-[#E8E4DF] text-[10px] uppercase font-bold tracking-widest block opacity-75">
                Artisan Haven Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-white leading-tight">
                Slow Craftsmanship in a World of Fast Trends
              </h3>
              <p className="text-[#F9F7F2]/70 text-xs sm:text-sm leading-relaxed">
                Our artisans spend 3 to 6 hours on each piece—hand-beveling edges, applying organic beeswax burnishing, and double-needling with bonded polycord thread. The result is a piece that looks better in year five than it did on day one.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <div className="bg-black/40 border border-white/10 p-4 text-left">
                <span className="text-[#E8E4DF] font-serif italic font-bold text-lg block">316L Surgical Steel</span>
                <span className="text-white/60 text-[11px]">Rustproof, salt-resistant jewelry clasps</span>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 text-left">
                <span className="text-[#E8E4DF] font-serif italic font-bold text-lg block">Italian Badalassi Carlo</span>
                <span className="text-white/60 text-[11px]">World-class vegetable tannage</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

