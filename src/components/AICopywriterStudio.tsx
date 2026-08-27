import React, { useState } from 'react';
import { Sparkles, Copy, Check, PenTool, Share2, Camera, Compass, ArrowRight, RefreshCw } from 'lucide-react';
import { CopywritingPromptType } from '../types';

export const AICopywriterStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CopywritingPromptType>('product_description');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form Fields for Prompt 1: Product Description
  const [prodName, setProdName] = useState('Pueblo Bifold Wallet');
  const [prodMaterials, setProdMaterials] = useState('Italian Badalassi Carlo vegetable-tanned leather, Japanese polycord thread, natural beeswax');
  const [prodVibe, setProdVibe] = useState('cozy, minimal, everyday street style');

  // Form Fields for Prompt 2: Social Media
  const [storeName, setStoreName] = useState('Artisan Haven');
  const [socialTone, setSocialTone] = useState('warm, relatable, aesthetic');

  // Form Fields for Prompt 3: Visuals & Photography
  const [accessoryType, setAccessoryType] = useState('hand-crafted blue macrame bracelet');
  const [backgroundSurface, setBackgroundSurface] = useState('warm wooden texture, soft neutral linen');

  // Form Fields for Prompt 4: Brand Identity & Taglines
  const [brandStoreName, setBrandStoreName] = useState('Artisan Haven');
  const [brandFocus, setBrandFocus] = useState('long-lasting, handcrafted minimalist leather goods, and versatile daily wear');

  // Output State
  const [generatedOutput, setGeneratedOutput] = useState<string>(`### Minimalist Pueblo Bifold Wallet
**Headline:** Timeless Patina, Uncompromising Hand-Stitched Durability

**Overview:** Cut by hand from world-renowned Italian Badalassi Carlo vegetable-tanned leather, this piece is engineered to age with distinction through decades of daily pocket carry. Reinforced with double saddle-stitching, it stands as an enduring testament to honest craftsmanship.

**Feature Highlights:**
• **100% Full-Grain Vegetable-Tanned Hide:** Matures with a lustrous, deep patina unique to your daily journey.
• **Hand-Burnished Natural Edges:** Sealed with pure beeswax and Tokonole gum for snag-free pocket draw.
• **Reinforced Bonded Stitching:** Hand-stitched with bonded Japanese polycord for lifelong structural integrity.

**Styling Suggestion:** Pairs seamlessly with raw selvedge denim, relaxed linen shirts, or tailored blazers for an understated luxury statement.`);

  const handleGenerate = async (typeOverride?: CopywritingPromptType) => {
    const promptType = typeOverride || activeTab;
    setIsLoading(true);

    try {
      const payload: any = { type: promptType };

      if (promptType === 'product_description') {
        payload.productName = prodName;
        payload.materials = prodMaterials;
        payload.vibe = prodVibe;
      } else if (promptType === 'social_captions') {
        payload.storeName = storeName;
        payload.tone = socialTone;
      } else if (promptType === 'visual_prompt') {
        payload.accessory = accessoryType;
        payload.background = backgroundSurface;
      } else if (promptType === 'brand_identity') {
        payload.storeName = brandStoreName;
        payload.focus = brandFocus;
      }

      const res = await fetch('/api/ai/copywrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.result) {
        setGeneratedOutput(data.result);
      }
    } catch (err) {
      console.error('Copywriting generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 bg-[#F9F7F2] min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white/60 p-6 sm:p-8 border border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[9px] uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Gemini AI E-Commerce & Brand Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2C2C2C]">
              Artisan Haven AI Copywriter Studio
            </h1>
            <p className="text-xs text-black/60 max-w-2xl">
              Generate conversion-focused e-commerce product descriptions, viral Instagram/TikTok captions, rule-of-thirds photography prompts, and memorable brand taglines with one click.
            </p>
          </div>
        </div>

        {/* 4 Tool Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setActiveTab('product_description');
              handleGenerate('product_description');
            }}
            className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'product_description'
                ? 'bg-[#5A3E2B] text-white border-black/20 shadow-sm'
                : 'bg-white/60 text-[#2C2C2C] border-black/10 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <PenTool className={`w-4 h-4 ${activeTab === 'product_description' ? 'text-amber-200' : 'text-[#5A3E2B]'}`} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Prompt 1</span>
            </div>
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">Product Descriptions</span>
              <span className="text-[10px] opacity-70">Catchy headline & highlights</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('social_captions');
              handleGenerate('social_captions');
            }}
            className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'social_captions'
                ? 'bg-[#5A3E2B] text-white border-black/20 shadow-sm'
                : 'bg-white/60 text-[#2C2C2C] border-black/10 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Share2 className={`w-4 h-4 ${activeTab === 'social_captions' ? 'text-amber-200' : 'text-[#5A3E2B]'}`} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Prompt 2</span>
            </div>
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">Social Media & Captions</span>
              <span className="text-[10px] opacity-70">5 IG/TikTok concepts + CTAs</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('visual_prompt');
              handleGenerate('visual_prompt');
            }}
            className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'visual_prompt'
                ? 'bg-[#5A3E2B] text-white border-black/20 shadow-sm'
                : 'bg-white/60 text-[#2C2C2C] border-black/10 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Camera className={`w-4 h-4 ${activeTab === 'visual_prompt' ? 'text-amber-200' : 'text-[#5A3E2B]'}`} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Prompt 3</span>
            </div>
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">AI Product Photography</span>
              <span className="text-[10px] opacity-70">Lighting & Rule of Thirds specs</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('brand_identity');
              handleGenerate('brand_identity');
            }}
            className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'brand_identity'
                ? 'bg-[#5A3E2B] text-white border-black/20 shadow-sm'
                : 'bg-white/60 text-[#2C2C2C] border-black/10 hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Compass className={`w-4 h-4 ${activeTab === 'brand_identity' ? 'text-amber-200' : 'text-[#5A3E2B]'}`} />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Prompt 4</span>
            </div>
            <div>
              <span className="text-xs font-bold block uppercase tracking-wider">Brand Identity & Taglines</span>
              <span className="text-[10px] opacity-70">10 taglines + mission</span>
            </div>
          </button>
        </div>

        {/* 2-Column Workspace (Inputs on Left, AI Output on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Parameters (5 cols) */}
          <div className="lg:col-span-5 bg-white/60 p-6 border border-black/10 space-y-4 text-xs">
            <h3 className="font-serif italic font-bold text-sm text-[#2C2C2C] border-b border-black/5 pb-2">
              Parameters & Placeholders
            </h3>

            {/* Prompt 1 Fields */}
            {activeTab === 'product_description' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Product Name / Type [Insert Product Name/Type]
                  </label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. macrame bracelet, gold ring, leather wallet"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Key Materials [List key materials]
                  </label>
                  <input
                    type="text"
                    value={prodMaterials}
                    onChange={(e) => setProdMaterials(e.target.value)}
                    placeholder="e.g. waterproof cord, 316L stainless steel, Badalassi Carlo leather"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Target Vibe / Aesthetic [Insert Vibe]
                  </label>
                  <input
                    type="text"
                    value={prodVibe}
                    onChange={(e) => setProdVibe(e.target.value)}
                    placeholder="e.g. cozy, minimal, everyday street style"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            {/* Prompt 2 Fields */}
            {activeTab === 'social_captions' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Store Name [Insert Store Name]
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Artisan Haven"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Tone of Voice [e.g., warm, relatable, aesthetic]
                  </label>
                  <input
                    type="text"
                    value={socialTone}
                    onChange={(e) => setSocialTone(e.target.value)}
                    placeholder="e.g. warm, relatable, aesthetic"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            {/* Prompt 3 Fields */}
            {activeTab === 'visual_prompt' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Accessory Type [Insert Accessory]
                  </label>
                  <input
                    type="text"
                    value={accessoryType}
                    onChange={(e) => setAccessoryType(e.target.value)}
                    placeholder="e.g. hand-crafted blue macrame bracelet"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Background Texture [Insert Background]
                  </label>
                  <input
                    type="text"
                    value={backgroundSurface}
                    onChange={(e) => setBackgroundSurface(e.target.value)}
                    placeholder="e.g. warm wooden texture, soft neutral linen"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            {/* Prompt 4 Fields */}
            {activeTab === 'brand_identity' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Store Name [Insert Store Name]
                  </label>
                  <input
                    type="text"
                    value={brandStoreName}
                    onChange={(e) => setBrandStoreName(e.target.value)}
                    placeholder="Artisan Haven"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 mb-1">
                    Brand Focus [Insert Focus]
                  </label>
                  <input
                    type="text"
                    value={brandFocus}
                    onChange={(e) => setBrandFocus(e.target.value)}
                    placeholder="e.g. long-lasting, handcrafted minimalist leather goods, and versatile daily wear"
                    className="w-full p-2.5 bg-white border border-black/10 text-[#2C2C2C] focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#5A3E2B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isLoading ? 'Generating with Gemini AI...' : 'Generate Copy & Strategy'}</span>
            </button>
          </div>

          {/* Right Column: AI Output View (7 cols) */}
          <div className="lg:col-span-7 bg-white/60 p-6 sm:p-8 border border-black/10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-serif italic font-bold text-sm text-[#2C2C2C]">Generated E-Commerce Copy</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-black hover:bg-[#5A3E2B] text-white text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown rendered text container */}
            <div className="p-5 bg-[#E8E4DF]/40 border border-black/10 font-sans text-xs text-[#2C2C2C] leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-normal">
              {generatedOutput}
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-black/40 font-bold">
              <span>Optimized for Artisan Haven Atelier & Philippine E-Commerce</span>
              <span className="text-[#5A3E2B]">Gemini 3.7 Flash Model</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
