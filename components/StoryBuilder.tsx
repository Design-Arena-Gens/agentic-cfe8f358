"use client";

import { useState } from 'react';
import { generateStory, type Story } from '../lib/generator';
import { jsPDF } from 'jspdf';
import { useAppStore } from '../lib/store';

export function StoryBuilder() {
  const [title, setTitle] = useState('The Rainbow in the School');
  const [setting, setSetting] = useState('classroom');
  const [characters, setCharacters] = useState('Aarav, Meera, Teacher');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [grade, setGrade] = useState<1|2|3|4|5>(3);
  const [story, setStory] = useState<Story | null>(null);
  const setLastStory = useAppStore(s => s.setLastStory);
  const addSection = useAppStore(s => s.addSection);

  const onBuild = () => {
    const story = generateStory({
      grade,
      language,
      title,
      setting,
      characters: characters.split(',').map(s=>s.trim()).filter(Boolean),
      theme: 'kindness'
    });
    setStory(story);
    setLastStory(story);
  };

  const exportPDF = () => {
    if (!story) return;
    const doc = new jsPDF({ unit: 'pt', format: 'A4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Cover
    doc.setFillColor('#6366f1');
    doc.rect(0, 0, w, h * 0.35, 'F');
    doc.setTextColor('#111827');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(story.title, 40, h * 0.45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(story.summary, 40, h * 0.45 + 28, { maxWidth: w - 80 });

    story.scenes.forEach((scene, idx) => {
      if (idx > 0) doc.addPage();
      const yStart = 80;
      // Scene banner
      doc.setFillColor('#e0e7ff');
      doc.roundedRect(40, yStart, w - 80, 80, 10, 10, 'F');
      doc.setTextColor('#4338ca');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(`${scene.emoji} Scene ${scene.id}`, 60, yStart + 50);

      // Captions
      doc.setTextColor('#111827');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text(scene.caption, 40, yStart + 120, { maxWidth: w - 80 });
      doc.text(scene.visual, 40, yStart + 160, { maxWidth: w - 80 });

      // Decorative box
      doc.setDrawColor('#6366f1');
      doc.setLineWidth(2);
      doc.roundedRect(40, h - 180, w - 80, 100, 12, 12);
      doc.setFont('helvetica', 'italic');
      doc.text('Kids can draw this scene here!', 60, h - 120);
    });

    doc.save(`${story.title.replace(/\s+/g,'_')}.pdf`);
  };

  const addStoryToEbook = () => {
    if (!story) return;
    addSection({ title: `Story ? ${story.title}`, content: `${story.summary}\n\n` + story.scenes.map(s=>`Scene ${s.id}: ${s.caption}\n${s.visual}`).join('\n\n') });
  };

  return (
    <div className="space-y-6">
      <div className="prose-card">
        <h3 className="font-semibold mb-3">Story Setup</h3>
        <div className="grid md:grid-cols-5 gap-3">
          <input className="input md:col-span-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
          <input className="input" value={setting} onChange={e=>setSetting(e.target.value)} placeholder="Setting" />
          <input className="input md:col-span-2" value={characters} onChange={e=>setCharacters(e.target.value)} placeholder="Characters (comma-separated)" />
          <select className="select" value={grade} onChange={e=>setGrade(parseInt(e.target.value) as 1|2|3|4|5)}>
            {[1,2,3,4,5].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <select className="select" value={language} onChange={e=>setLanguage(e.target.value as 'English'|'Hindi')}>
            {['English','Hindi'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="btn btn-primary" onClick={onBuild}>Build Story</button>
          <button className="btn btn-ghost" onClick={exportPDF} disabled={!story}>Export PDF</button>
          <button className="btn btn-ghost" onClick={addStoryToEbook} disabled={!story}>Add to Ebook</button>
        </div>
      </div>

      {story && (
        <div className="grid md:grid-cols-2 gap-4">
          {story.scenes.map(scene => (
            <div key={scene.id} className="prose-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-white" />
              <div className="relative">
                <div className="text-3xl">{scene.emoji}</div>
                <div className="text-xs text-gray-500">Scene {scene.id}</div>
                <div className="font-semibold mt-2">{scene.caption}</div>
                <div className="text-sm text-gray-700 mt-1">{scene.visual}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
