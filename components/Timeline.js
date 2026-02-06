// B"H
import React from 'react';

export const Timeline = ({ duration, time, setTime, isPlaying, setIsPlaying, project }) => {
  // Mock clips if they don't exist, just for visualization of the NLE power
  const activeScene = project?.scenes?.find(s => s.id === project.activeSceneId);
  const audioTracks = activeScene?.audioTracks || [];

  return (
    <div className="h-48 bg-[#111] border-t border-[#333] flex flex-col text-xs select-none">
       {/* Toolbar */}
       <div className="h-8 bg-[#1a1a1a] flex items-center px-2 space-x-2 border-b border-[#333]">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1 rounded font-bold ${isPlaying ? 'bg-yellow-600' : 'bg-green-600'}`}>
             {isPlaying ? '||' : '▶'}
          </button>
          <div className="flex-1"></div>
          <span className="font-mono text-gray-400">{time.toFixed(2)}s / {duration.toFixed(2)}s</span>
       </div>

       {/* Ruler */}
       <div className="h-6 bg-[#222] border-b border-[#333] relative overflow-hidden">
          {[...Array(20)].map((_, i) => (
             <div key={i} className="absolute bottom-0 text-[9px] text-gray-500 border-l border-gray-700 pl-1 h-full" style={{left: `${(i/20)*100}%`}}>
                {(i * (duration/20)).toFixed(1)}s
             </div>
          ))}
          {/* Playhead */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{left: `${(time/duration)*100}%`}}></div>
       </div>

       {/* Tracks Area */}
       <div className="flex-1 overflow-y-auto bg-[#151515] relative p-1 space-y-1">
          {/* Playhead Line extension */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-red-500/50 pointer-events-none z-10" style={{left: `${(time/duration)*100}%`}}></div>

          {/* Video Track */}
          <div className="h-12 bg-[#1a1a1a] border border-[#333] relative rounded overflow-hidden">
               <div className="absolute left-0 top-0 text-[9px] bg-black/50 px-1 text-gray-400">V1: MAIN</div>
               {/* Visual Clips */}
               <div className="absolute top-2 bottom-2 left-0 bg-blue-900/40 border border-blue-500/50 rounded cursor-pointer hover:bg-blue-800/40" style={{width: '30%', left: '0%'}}>
                   <span className="p-1 text-blue-200">Scene Intro</span>
               </div>
               <div className="absolute top-2 bottom-2 bg-blue-900/40 border border-blue-500/50 rounded cursor-pointer hover:bg-blue-800/40" style={{width: '60%', left: '32%'}}>
                   <span className="p-1 text-blue-200">Action Sequence</span>
               </div>
          </div>

          {/* Audio Tracks */}
          {audioTracks.length === 0 && (
             <div className="h-10 bg-[#1a1a1a] border border-[#333] relative rounded flex items-center justify-center text-gray-600">
                No Audio Tracks (Use Audio Studio)
             </div>
          )}
          
          {audioTracks.map((track, i) => (
             <div key={track.id} className="h-10 bg-[#1a1a1a] border border-[#333] relative rounded overflow-hidden">
                 <div className="absolute left-0 top-0 text-[9px] bg-black/50 px-1 text-gray-400">A{i+1}: {track.type}</div>
                 <div 
                    className="absolute top-1 bottom-1 bg-green-900/40 border border-green-500/50 rounded cursor-pointer"
                    style={{
                        left: `${(track.start / duration) * 100}%`,
                        width: `${(track.duration / duration) * 100}%`
                    }}
                 >
                     <span className="px-1 text-green-200 truncate block">{track.name}</span>
                 </div>
             </div>
          ))}

          {/* Scrubber Interaction Layer */}
          <input 
            type="range" min="0" max={duration} step="0.01" 
            value={time} onChange={e => setTime(parseFloat(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-crosshair z-20"
          />
       </div>
    </div>
  );
};
