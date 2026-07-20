import React, { useState, useMemo, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Moon, Sun, X, Copy, Share2, ArrowUpRight } from 'lucide-react';

// Ensure your JSON file exists in this path
import promptsData from './data/prompts.json';

// Fixed category list (removed extra comma)
const categories = ["All", "Nature", "Beach", "Forest", "Rain", "Portrait", "Architecture"];

export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

const filtered = useMemo(() => {
  // 1. Clean the search term (remove extra spaces)
  const query = search.toLowerCase().trim();
  const active = activeCategory.toLowerCase();

  return promptsData.filter(p => {
    // 2. Prepare all searchable data strings
    const title = (p.title || "").toLowerCase();
    const prompt = (p.prompt || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const tags = (p.tags || []).map(t => t.toLowerCase());

    // 3. Global Search Logic: 
    // Does the search term exist in the title, prompt, category, or any tag?
    const matchesSearch = query === "" || 
                          title.includes(query) || 
                          prompt.includes(query) ||
                          category.includes(query) ||
                          tags.some(tag => tag.includes(query));

    // 4. Category Filter Logic:
    // Does the active tab match the category or one of the tags?
    const matchesCat = active === 'all' || 
                       category === active || 
                       tags.includes(active);

    // Both must be true
    return matchesSearch && matchesCat;
  });
}, [search, activeCategory]);

  const breakpointColumns = {
    default: 5,
    1400: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="min-h-screen bg-main-bg text-main-text selection:bg-brand-accent/30 transition-colors duration-500 font-sans">
      <Toaster position="bottom-center" />
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full glass">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* STYLISH TEXT LOGO */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 shadow-lg">
               <div className="w-4 h-4 bg-brand-accent rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                Lumos<span className="text-brand-accent">Media</span>
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-40 ml-0.5">
                Prompt Gallery
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-brand-primary dark:text-brand-accent"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        {/* SEARCH & FILTERS */}
        <section className="max-w-3xl mx-auto mb-16 space-y-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={22} />
            <input 
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-6 bg-main-card border border-main-border rounded-2xl shadow-premium outline-none focus:ring-2 ring-brand-accent/30 text-lg transition-all"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === c 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg' 
                  : 'bg-main-card border-main-border hover:border-brand-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* MASONRY GALLERY */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filtered.map((item) => (
            <motion.div 
              layout 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 group relative cursor-pointer overflow-hidden rounded-[2rem] bg-main-card border border-main-border shadow-sm hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelected(item)}
            >
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">{item.category}</span>
                  <h3 className="text-white text-xl font-bold mb-4">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    View Prompt <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-main-border text-center px-6 mt-12">
        <div className="flex flex-col items-center mb-6">
          <span className="text-2xl font-bold tracking-tighter uppercase font-sans">
            Lumos<span className="text-brand-accent ml-1 italic">Media</span>
          </span>
          <div className="h-0.5 w-12 bg-brand-primary mt-2 rounded-full" />
        </div>
        <p className="opacity-50 max-w-md mx-auto mb-8 font-medium">
          Curating premium AI prompts for creators worldwide.
        </p>
        <div className="flex justify-center gap-8 opacity-40 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-brand-accent transition-colors">Instagram</a>
        </div>
      </footer>

      {/* MODAL DETAIL */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-main-bg rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/10 dark:bg-white/10 rounded-full hover:rotate-90 transition-all text-main-text"
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 h-[300px] md:h-auto overflow-hidden bg-black/10">
                <img src={selected.image} className="w-full h-full object-cover" alt={selected.title} />
              </div>

              <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col justify-center bg-main-card">
                <span className="text-brand-accent font-bold tracking-widest text-xs uppercase mb-2">{selected.category}</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-main-text">{selected.title}</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3 text-main-text">AI PROMPT</label>
                    <div className="bg-main-bg p-6 md:p-8 rounded-3xl border border-main-border text-lg md:text-xl leading-relaxed italic opacity-90 text-main-text">
                      "{selected.prompt || "No prompt provided."}"
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selected.prompt);
                        toast.success('Prompt Copied', { 
                          icon: '✓',
                          style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' } 
                        });
                      }}
                      className="flex-1 h-16 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg"
                    >
                      <Copy size={18} /> Copy Prompt
                    </button>
                    <button 
                      onClick={() => {
                         if (navigator.share) {
                          navigator.share({ title: selected.title, text: selected.prompt, url: window.location.href });
                        }
                      }}
                      className="h-16 w-16 bg-main-bg rounded-2xl flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all border border-main-border text-main-text"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  <div className="pt-6 border-t border-main-border flex flex-wrap gap-2">
                    {(selected.tags || []).map(tag => (
                      <span key={tag} className="px-4 py-1.5 rounded-lg bg-main-bg text-[10px] font-bold uppercase tracking-widest opacity-60 text-main-text">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}