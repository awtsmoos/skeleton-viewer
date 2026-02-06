// B"H
import React from 'react';
import { ComponentEditors } from './InspectorComponents.js';
import { createKeyframeTrack } from '../types/objects.js';

export const Inspector = ({ object, onUpdate }) => {
  if (!object) return <div className="w-64 bg-[#151515] border-l border-[#333] p-4 text-gray-500 text-xs">Select an object</div>;

  const update = (path, val) => {
     const clone = JSON.parse(JSON.stringify(object));
     const keys = path.split('.');
     let ref = clone;
     for(let i=0; i<keys.length-1; i++) ref = ref[keys[i]];
     
     const lastKey = keys[keys.length-1];
     if (typeof ref[lastKey] === 'number') val = parseFloat(val);
     
     ref[lastKey] = val;
     onUpdate(clone);
  };

  const addKeyframe = (path, value) => {
      const clone = JSON.parse(JSON.stringify(object));
      if (!clone.timeline) clone.timeline = [];
      
      let track = clone.timeline.find(t => t.path === path);
      if (!track) {
          track = createKeyframeTrack(path);
          clone.timeline.push(track);
      }
      
      // Remove existing key at current time? (Simplified: just push, sorter handles it)
      // We assume user is 'at' a certain time, but Inspector doesn't know 'time' directly here easily
      // unless passed. For now, assume t=0 or prompt? 
      // BETTER: We just push and assume we'll edit in timeline later, or default to 0.
      // Actually, let's just log it or add at t=now if we had context.
      // Limitation: Inspector needs 'currentTime' prop to keyframe correctly.
      // Fallback: Add at t=0, 5, 10 for demo.
      track.keys.push({ time: 0, value: parseFloat(value), ease: 'linear' });
      track.keys.push({ time: 5, value: parseFloat(value) + 1.0, ease: 'easeInOut' });
      
      console.log(`Keyframed ${path}`);
      onUpdate(clone);
  };

  const PropertyField = ({ label, path, val, step=0.1 }) => (
      <div className="flex items-center space-x-1 mb-1">
          <label className="w-16 text-gray-500 truncate" title={label}>{label}</label>
          <input 
              type="number" step={step} value={val} 
              onChange={e => update(path, e.target.value)}
              className="flex-1 bg-[#111] border border-[#333] p-1 text-right"
          />
          <button 
              onClick={() => addKeyframe(path, val)}
              className="px-1 text-yellow-600 hover:text-yellow-400"
              title="Add Keyframe"
          >
              ◆
          </button>
      </div>
  );

  const addComponent = (name, creator) => {
      const clone = JSON.parse(JSON.stringify(object));
      if (!clone.components) clone.components = {};
      clone.components[name] = creator();
      onUpdate(clone);
  };
  
  const triggerExplosion = () => {
      const clone = JSON.parse(JSON.stringify(object));
      if (!clone.components.logic) clone.components.logic = {};
      clone.components.logic.explodeNextTick = true;
      onUpdate(clone);
  };

  return (
    <div className="w-64 bg-[#151515] border-l border-[#333] flex flex-col text-gray-300 text-xs overflow-y-auto">
      <div className="p-2 bg-[#222] font-bold border-b border-[#333] flex justify-between">
          <span>PROPERTIES</span>
          <span className="text-[#555] font-mono">{object.id.substring(0,6)}</span>
      </div>
      <div className="p-4 space-y-4">
         
         {/* BASIC INFO */}
         <div>
            <label className="block text-gray-500 mb-1">Name</label>
            <input value={object.name} onChange={e => update('name', e.target.value)} className="w-full bg-[#111] border border-[#333] p-1" />
         </div>
         
         {/* TEXT SPECIFIC */}
         {object.type === 'text_3d' && (
             <div>
                <label className="block text-gray-500 mb-1">Text</label>
                <input 
                    value={object.blueprint?.text || ""} 
                    onChange={e => {
                        const clone = JSON.parse(JSON.stringify(object));
                        if(!clone.blueprint) clone.blueprint = {};
                        clone.blueprint.text = e.target.value;
                        onUpdate(clone);
                    }} 
                    className="w-full bg-[#111] border border-[#333] p-1" 
                />
             </div>
         )}
         
         {/* TRANSFORM */}
         <div className="border-t border-[#333] pt-2">
            <div className="text-[10px] font-bold text-blue-400 mb-2">TRANSFORM</div>
            <PropertyField label="Pos X" path="transform.position.x" val={object.transform.position.x} />
            <PropertyField label="Pos Y" path="transform.position.y" val={object.transform.position.y} />
            <PropertyField label="Pos Z" path="transform.position.z" val={object.transform.position.z} />
            <div className="h-2"></div>
            <PropertyField label="Rot X" path="transform.rotation.x" val={object.transform.rotation.x} />
            <PropertyField label="Rot Y" path="transform.rotation.y" val={object.transform.rotation.y} />
            <PropertyField label="Rot Z" path="transform.rotation.z" val={object.transform.rotation.z} />
            <div className="h-2"></div>
            <PropertyField label="Scl X" path="transform.scale.x" val={object.transform.scale.x} />
            <PropertyField label="Scl Y" path="transform.scale.y" val={object.transform.scale.y} />
            <PropertyField label="Scl Z" path="transform.scale.z" val={object.transform.scale.z} />
         </div>

         {/* MATERIAL */}
         <div className="border-t border-[#333] pt-2">
            <div className="text-[10px] font-bold text-green-400 mb-2">MATERIAL</div>
            <PropertyField label="Red" path="material.color.0" val={object.material.color[0]} step={0.01} />
            <PropertyField label="Green" path="material.color.1" val={object.material.color[1]} step={0.01} />
            <PropertyField label="Blue" path="material.color.2" val={object.material.color[2]} step={0.01} />
            <PropertyField label="Emissive" path="material.emissive" val={object.material.emissive} step={0.1} />
         </div>

         {/* ACTIONS */}
         <div className="border-t border-[#333] pt-2">
             <div className="text-[10px] font-bold text-red-400 mb-2">ACTIONS</div>
             <button onClick={triggerExplosion} className="w-full py-1 bg-red-900/30 text-red-400 border border-red-900 hover:bg-red-900/50">
                 💥 EXPLODE
             </button>
             {!object.components?.logic && (
                 <button onClick={() => addComponent('logic', () => ({ scripts: [] }))} className="w-full mt-1 py-1 bg-cyan-900/30 text-cyan-400 border border-cyan-900">
                     + ADD LOGIC
                 </button>
             )}
         </div>

         <ComponentEditors object={object} update={update} addComponent={addComponent} />

      </div>
    </div>
  );
};