"use client";

import { useState } from 'react';
import { generateContentBundle, type Language, type Grade, type Subject } from '../lib/generator';
import { useAppStore } from '../lib/store';

const subjects: Subject[] = ['English', 'Math', 'EVS', 'Hindi', 'Art'];

export function ContentForm() {
  const [topic, setTopic] = useState('Good Habits');
  const [grade, setGrade] = useState<Grade>(3);
  const [subject, setSubject] = useState<Subject>('English');
  const [language, setLanguage] = useState<Language>('English');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{lessonPlan?: string; worksheet?: string; poem?: string}>({});
  const addSection = useAppStore(s => s.addSection);

  const onGenerate = async () => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 200));
    const out = generateContentBundle({ grade, subject, topic, language });
    setResult(out);
    setBusy(false);
  };

  const addToEbook = (title: string, content?: string) => {
    if (!content) return;
    addSection({ title, content });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="prose-card md:col-span-1">
        <h3 className="font-semibold mb-3">Setup</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Topic</label>
            <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Grade</label>
            <select className="select" value={grade} onChange={e=>setGrade(parseInt(e.target.value) as Grade)}>
              {[1,2,3,4,5].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <select className="select" value={subject} onChange={e=>setSubject(e.target.value as Subject)}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Language</label>
            <select className="select" value={language} onChange={e=>setLanguage(e.target.value as Language)}>
              {['English','Hindi'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn btn-primary w-full" onClick={onGenerate} disabled={busy}>{busy ? 'Generating?' : 'Generate'}</button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="prose-card">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">Lesson Plan</h3>
            <button className="btn btn-ghost" onClick={()=>addToEbook(`Lesson Plan ? ${topic}`, result.lessonPlan)}>Add to Ebook</button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2">{result.lessonPlan || 'Click Generate to create a lesson plan.'}</pre>
        </div>

        <div className="prose-card">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">Worksheet</h3>
            <button className="btn btn-ghost" onClick={()=>addToEbook(`Worksheet ? ${topic}`, result.worksheet)}>Add to Ebook</button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2">{result.worksheet || 'Click Generate to create a worksheet.'}</pre>
        </div>

        <div className="prose-card">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">Poem / Rhyme</h3>
            <button className="btn btn-ghost" onClick={()=>addToEbook(`Poem ? ${topic}`, result.poem)}>Add to Ebook</button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2">{result.poem || 'Click Generate to create a short poem.'}</pre>
        </div>
      </div>
    </div>
  );
}
