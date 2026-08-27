import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';

export const Contacts: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Custom Leathercraft & Inquiries');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="py-16 bg-[#FAF8F5] text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#92400E]">
            Get In Touch
          </span>
          <h1 className="text-4xl font-serif-display font-bold text-stone-900">
            Contact Artisan Haven Studio
          </h1>
          <p className="text-sm text-stone-600">
            Have questions about custom leather embossing, bulk orders, GCash payments, or becoming an artisan partner? Reach out to our atelier team.
          </p>
        </div>

        {/* 2-Column Grid: Studio Info vs Message Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="md:col-span-5 space-y-4 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-base text-stone-900">
                Atelier Headquarters
              </h3>

              <div className="space-y-3 text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Artisan Haven Atelier</span>
                    <span>Unit 402, High Street South, Bonifacio Global City, Taguig, Metro Manila, Philippines</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#92400E] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">Email Inquiries</span>
                    <span>concierge@artisan-haven.ph</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#92400E] shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">GCash & Merchant Support</span>
                    <span>+63 917 123 4567 (Mon-Sat, 9AM-6PM PHT)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-2">
              <span className="font-bold block text-xs text-amber-900">
                Custom Leather Monogramming
              </span>
              <p className="text-[11px] leading-relaxed">
                Looking to hot-stamp initials onto a bifold wallet or key valet? Include your requested lettering in the message form!
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm text-xs space-y-5">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Send Us a Message
            </h3>

            {sent && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Maraming salamat! Your message has been sent to our Manila studio. We will reply within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mateo Dela Cruz"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mateo@example.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                >
                  <option>Custom Leathercraft & Inquiries</option>
                  <option>Artisan Seller Partnership & GCash Settlement</option>
                  <option>PayMongo Payment & Order Verification</option>
                  <option>Wholesale & Corporate Gifting</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our handcrafted pieces?"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1917] hover:bg-[#92400E] text-white rounded-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Atelier</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
