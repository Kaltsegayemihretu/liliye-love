import React, { useState, useEffect } from 'react';
import { FileText, Save, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminContent() {
  const [hero, setHero] = useState({
    mainTitle: "I'LL WAIT FOR YOU TILL THE END OF TIME",
    subTitle1: "I'm serious about us, my love.",
    subTitle2: "Maybe this isn't the end of our story.",
    buttonText: "BEGIN"
  });

  const [letter, setLetter] = useState({
    title: "FOR YOU",
    subtitle: "Tap to open",
    sections: []
  });

  const [finalText, setFinalText] = useState({
    line1: "I DON'T KNOW WHAT THE FUTURE LOOKS LIKE.",
    line2: "But I know what I hope it looks like.",
    highlight: "US.",
    pauseText: "Until then...",
    waitText: "I'll wait.",
    endTimeText: "Till the end of time.",
    buttonText: "CLICK WHEN YOU'RE READY FOR US",
    confirmedText: "I'll take that as your answer."
  });

  const [savedSection, setSavedSection] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.getContent();
        if (data.hero) setHero(data.hero);
        if (data.letter) setLetter(data.letter);
        if (data.final) setFinalText(data.final);
      } catch (err) {
        console.warn('Failed to load content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSave = async (sectionKey, payload) => {
    try {
      await api.updateContent(sectionKey, payload);
      setSavedSection(sectionKey);
      setTimeout(() => setSavedSection(''), 3000);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 font-semibold">Loading Content Editor...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#ff2a75]" />
          Website Content Management
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Edit Hero headlines, Love Letter sections, and Final message text without touching code.
        </p>
      </div>

      {/* 1. HERO SECTION CONTENT */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">Hero Section</h2>
          <button
            onClick={() => handleSave('hero', hero)}
            className="px-4 py-2 rounded-full bg-[#ff2a75] text-white text-xs font-bold shadow-md hover:bg-[#e60067] flex items-center gap-1.5"
          >
            {savedSection === 'hero' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSection === 'hero' ? 'Saved!' : 'Save Hero Text'}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
            <input
              type="text"
              value={hero.mainTitle}
              onChange={(e) => setHero({ ...hero, mainTitle: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle Line 1</label>
              <input
                type="text"
                value={hero.subTitle1}
                onChange={(e) => setHero({ ...hero, subTitle1: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle Line 2 (Handwritten Accent)</label>
              <input
                type="text"
                value={hero.subTitle2}
                onChange={(e) => setHero({ ...hero, subTitle2: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOVE LETTER SECTIONS */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">Love Letter Content</h2>
          <button
            onClick={() => handleSave('letter', letter)}
            className="px-4 py-2 rounded-full bg-[#ff2a75] text-white text-xs font-bold shadow-md hover:bg-[#e60067] flex items-center gap-1.5"
          >
            {savedSection === 'letter' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSection === 'letter' ? 'Saved!' : 'Save Letter'}
          </button>
        </div>

        <div className="space-y-4">
          {letter.sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-[#ffd0e0] space-y-2">
              <input
                type="text"
                value={sec.heading}
                onChange={(e) => {
                  const newSecs = [...letter.sections];
                  newSecs[idx].heading = e.target.value;
                  setLetter({ ...letter, sections: newSecs });
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-[#80003c]"
                placeholder="Section Heading"
              />
              <textarea
                value={sec.content}
                onChange={(e) => {
                  const newSecs = [...letter.sections];
                  newSecs[idx].content = e.target.value;
                  setLetter({ ...letter, sections: newSecs });
                }}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                placeholder="Paragraph content"
              />
              <input
                type="text"
                value={sec.handwrittenNote}
                onChange={(e) => {
                  const newSecs = [...letter.sections];
                  newSecs[idx].handwrittenNote = e.target.value;
                  setLetter({ ...letter, sections: newSecs });
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-handwritten text-[#ff2a75] font-bold"
                placeholder="Handwritten Note"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. FINAL SECTION CONTENT */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">Final Section & Button Text</h2>
          <button
            onClick={() => handleSave('final', finalText)}
            className="px-4 py-2 rounded-full bg-[#ff2a75] text-white text-xs font-bold shadow-md hover:bg-[#e60067] flex items-center gap-1.5"
          >
            {savedSection === 'final' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSection === 'final' ? 'Saved!' : 'Save Final Section'}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Line 1</label>
            <input
              type="text"
              value={finalText.line1}
              onChange={(e) => setFinalText({ ...finalText, line1: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Final Button Text</label>
            <input
              type="text"
              value={finalText.buttonText}
              onChange={(e) => setFinalText({ ...finalText, buttonText: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-extrabold text-rose-600"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
