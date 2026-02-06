
// B"H
import React from 'react';
import { FileSystem } from '../engine/core/FileSystem.js';

export const Header = ({ prompt, setPrompt, apiKey, setApiKey, loading, onGenerate, project, onOpenCode }) => {
  return (
    <div className="h-12 bg-[#111] border-b border-[#333] flex items-center px-4 justify-between shrink-0">
      <div className="font-bold tracking-widest text-blue-500 flex items-center space-x-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">DIVINE ENGINE</span>
          <div className="h-4 w-px bg-[#333] mx-2"></div>
          <button onClick={() => FileSystem.openProject()} className="text-[9px] bg-[#222] px-2 py-1 hover:bg-[#333] text-gray-400">OPEN FS</button>
          <button onClick={() => FileSystem.saveProject(project)} className="text-[9px] bg-[#222] px-2 py-1 hover:bg-[#333] text-gray-400">SAVE FS</button>
          <button onClick={onOpenCode} className="text-[9px] bg-[#1a221a] px-2 py-1 hover:bg-[#2a332a] text-green-400 border border-green-900/50">XML SOURCE</button>
      </div>
      <div className="flex space-x-2 w-1/2">
         <input 
            value={prompt} onChange={e => setPrompt(e.target.value)} 
            placeholder="Describe a reality..." 
            className="flex-1 bg-[#222] border border-[#333] px-2 text-sm focus:border-blue-500 outline-none transition-colors text-gray-200" 
         />
         <input 
            type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} 
            placeholder="API Key" className="w-20 bg-[#222] border border-[#333] px-2 text-sm text-gray-200" 
         />
         <button 
            onClick={onGenerate} disabled={loading} 
            className={`px-4 text-xs font-bold rounded ${loading ? 'bg-purple-800' : 'bg-blue-600 hover:bg-blue-500'}`}
         >
           {loading ? 'FORGING...' : 'CREATE'}
         </button>
      </div>
   </div>
  );
};
