import React from 'react';
import { Map, ArrowRight, ExternalLink } from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (view: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Store & Catalog',
      links: [
        { name: 'Full Handcrafted Catalog', action: () => onNavigate('store') },
        { name: 'Wallets & Cardholders', action: () => onNavigate('store') },
        { name: 'Macrame Bracelets & Cords', action: () => onNavigate('store') },
        { name: 'Leather Bags & Totes', action: () => onNavigate('store') },
        { name: 'Keychains & Straps', action: () => onNavigate('store') },
      ]
    },
    {
      title: 'Artisans & Seller Portal',
      links: [
        { name: 'Artisan Seller Dashboard', action: () => onNavigate('seller-dashboard') },
        { name: 'List a New Product', action: () => onNavigate('seller-dashboard') },
        { name: 'Sales History & GCash Payouts', action: () => onNavigate('seller-dashboard') },
        { name: 'AI Copywriting Studio', action: () => onNavigate('copywriter') },
      ]
    },
    {
      title: 'Buyer Services',
      links: [
        { name: 'Buyer Order History & Receipts', action: () => onNavigate('buyer-dashboard') },
        { name: 'Verified Star Reviews System', action: () => onNavigate('store') },
        { name: 'PayMongo GCash Payment Gateway', action: () => onNavigate('store') },
        { name: 'AI Artisan Concierge Chatbot', action: () => onNavigate('store') },
      ]
    },
    {
      title: 'Company & Documentation',
      links: [
        { name: 'About Artisan Haven Heritage', action: () => onNavigate('about') },
        { name: 'Workshop Contacts & Manila Studio', action: () => onNavigate('contacts') },
        { name: 'Vercel Deployment Guide', action: () => onNavigate('docs') },
        { name: 'PayMongo Webhooks & Setup Guide', action: () => onNavigate('docs') },
      ]
    }
  ];

  return (
    <div className="py-16 bg-[#FAF8F5] text-left min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#E7E2D9] pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-widest">
            <Map className="w-4 h-4" />
            <span>Architecture & Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            Artisan Haven Sitemap
          </h1>
          <p className="text-xs text-stone-600">
            Complete index of pages, artisan tools, payment gateways, and configuration resources.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((sec, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-4">
              <h2 className="font-serif-display font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
                {sec.title}
              </h2>
              <ul className="space-y-2.5 text-xs text-stone-600">
                {sec.links.map((lnk, j) => (
                  <li key={j}>
                    <button
                      onClick={lnk.action}
                      className="hover:text-[#92400E] hover:underline flex items-center gap-1.5 text-left transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{lnk.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
