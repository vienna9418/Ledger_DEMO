
import React, { useState } from 'react';
import { INITIAL_TAGS } from '../constants';

interface TagsScreenProps {
  onBack: () => void;
}

const TagsScreen: React.FC<TagsScreenProps> = ({ onBack }) => {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [search, setSearch] = useState('');

  const filteredTags = tags.filter(t => t.name.includes(search));

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center text-primary font-medium"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
          <span>返回</span>
        </button>
        <h1 className="text-lg font-semibold">管理标签</h1>
        <button onClick={onBack} className="text-primary font-medium">完成</button>
      </header>

      <main className="max-w-md mx-auto w-full px-4 py-6 overflow-y-auto hide-scrollbar">
        {/* Search */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl">search</span>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder-slate-400 dark:placeholder-slate-500 transition-all" 
            placeholder="搜索标签" 
            type="text"
          />
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <button className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">add</span>
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">创建新标签</span>
            </div>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
          </button>
        </div>

        {/* All Tags List */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">所有标签</h2>
            <span className="text-xs text-slate-400">共 {tags.length} 个</span>
          </div>
          <div className="space-y-1">
            {filteredTags.map(tag => (
              <div 
                key={tag.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-lg">#</span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{tag.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{tag.count} 条记录</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Tags */}
        <section className="mb-8 pb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">为你推荐</h2>
          <div className="flex flex-wrap gap-2">
            {['健身', '阅读', '交通', '房租'].map(rec => (
              <button 
                key={rec}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                + {rec}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TagsScreen;
