"use client";

import { jsPDF } from 'jspdf';
import { useAppStore } from '../lib/store';
import { useState } from 'react';

export function EbookMaker() {
  const { sections, ebookAuthor, ebookTitle, removeSection, setEbookMeta } = useAppStore();
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(ebookAuthor);
  const [freeTitle, setFreeTitle] = useState('My Page');
  const [freeContent, setFreeContent] = useState('Write anything here?');
  const addSection = useAppStore(s => s.addSection);
  const clearSections = useAppStore(s => s.clearSections);

  const onAddFree = () => {
    if (!freeTitle.trim() || !freeContent.trim()) return;
    addSection({ title: freeTitle.trim(), content: freeContent.trim() });
  };

  const onSaveMeta = () => setEbookMeta(title, author);

  const buildPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'A4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Cover
    doc.setFillColor('#6366f1');
    doc.rect(0, 0, w, h * 0.35, 'F');
    doc.setTextColor('#111827');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text(title || 'Class Ebook', 40, h * 0.45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Author: ${author || 'Teacher'}`, 40, h * 0.45 + 28);

    // Sections
    sections.forEach((s, idx) => {
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#111827');
      doc.text(s.title, 40, 80, { maxWidth: w - 80 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.text(s.content, 40, 120, { maxWidth: w - 80 });
    });

    const filename = (title || 'ebook').replace(/\s+/g, '_') + '.pdf';
    doc.save(filename);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="prose-card space-y-3 md:col-span-1">
        <h3 className="font-semibold">Ebook Meta</h3>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input className="input" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author / Class" />
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={onSaveMeta}>Save</button>
          <button className="btn btn-primary" onClick={buildPDF} disabled={!sections.length}>Export PDF</button>
        </div>

        <h3 className="font-semibold mt-6">Add Custom Page</h3>
        <input className="input" value={freeTitle} onChange={e=>setFreeTitle(e.target.value)} placeholder="Page title" />
        <textarea className="textarea" value={freeContent} onChange={e=>setFreeContent(e.target.value)} />
        <button className="btn btn-ghost" onClick={onAddFree}>Add Page</button>

        <div className="pt-4">
          <button className="btn btn-ghost" onClick={clearSections} disabled={!sections.length}>Clear All Pages</button>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="prose-card">
          <h3 className="font-semibold mb-3">Pages ({sections.length})</h3>
          {!sections.length && <p className="text-sm text-gray-500">No pages yet. Add content from generators or create a custom page.</p>}
          <div className="space-y-3">
            {sections.map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{Math.min(200, s.content.length)} chars</div>
                  </div>
                  <button className="btn btn-ghost" onClick={()=>removeSection(i)}>Remove</button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 mt-2 max-h-48 overflow-auto">{s.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
