"use client";

import { useState } from 'react';
import { ContentForm } from '../components/ContentForm';
import { StoryBuilder } from '../components/StoryBuilder';
import { EbookMaker } from '../components/EbookMaker';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'content' | 'stories' | 'ebook'>('content');

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your AI Teaching Companion</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Generate unique creative content, build visual story cards, and export kids-friendly ebooks in English or Hindi.
        </p>
      </section>

      <div className="flex items-center justify-center gap-2" role="tablist">
        <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-full text-sm border ${activeTab==='content' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}`}>Content</button>
        <button onClick={() => setActiveTab('stories')} className={`px-4 py-2 rounded-full text-sm border ${activeTab==='stories' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}`}>Visual Stories</button>
        <button onClick={() => setActiveTab('ebook')} className={`px-4 py-2 rounded-full text-sm border ${activeTab==='ebook' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}`}>Kids Ebook</button>
      </div>

      <div id="content" className={activeTab==='content' ? '' : 'hidden'}>
        <ContentForm />
      </div>

      <div id="stories" className={activeTab==='stories' ? '' : 'hidden'}>
        <StoryBuilder />
      </div>

      <div id="ebook" className={activeTab==='ebook' ? '' : 'hidden'}>
        <EbookMaker />
      </div>
    </div>
  );
}
