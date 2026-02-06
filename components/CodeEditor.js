// B"H
import React, { useState, useEffect, useRef } from 'react';
import { createProject } from '../types/project.js';
import { XMLParser } from '../engine/core/XMLParser.js';

export const CodeEditor = ({ project, onUpdate, onClose, streamContent, isStreaming }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const textAreaRef = useRef(null);

  // If streaming, update code from stream prop. Else, serialize project to XML.
  useEffect(() => {
    if (isStreaming) {
        setCode(streamContent);
        // Auto-scroll
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    } else {
        // Only set initial state if not streaming (to allow editing)
        if (!streamContent) {
            try {
                setCode(XMLParser.toXML(project));
            } catch(e) {
                console.error("XML Serialize Error", e);
                setCode("<!-- Error serializing project -->");
            }
        }
    }
  }, [project, streamContent, isStreaming]);

  const handleRun = () => {
    try {
      const newProject = XMLParser.fromXML(code);
      onUpdate(newProject);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const loadExample = () => {
      const example = createProject();
      example.scenes[0].objects.push({
          id: 'manual_cube_' + Date.now(), type: 'cube', 
          transform: { position: {x:0,y:2,z:0}, rotation:{x:0,y:45,z:45}, scale:{x:1,y:1,z:1} },
          material: { color: [1, 0.5, 0], type: 'merkabah' },
          components: { physics: { mass: 1, isStatic: false, velocity: {x:0,y:5,z:0} } }
      });
      setCode(XMLParser.toXML(example));
  };

  return (
    <div className="fixed inset-0 bg-[#050505]/95 z-[100] flex flex-col p-4 font-mono text-xs backdrop-blur-sm">
       <div className="flex justify-between items-center mb-2 border-b border-[#333] pb-2">
          <div className="flex items-center space-x-4">
              <span className={`font-bold text-lg ${isStreaming ? 'text-blue-400 animate-pulse' : 'text-green-500'}`}>
                  {isStreaming ? 'RECEIVING TRANSMISSION...' : 'SOURCE MATRIX'}
              </span>
              <span className="text-gray-500">Divine XML Protocol</span>
          </div>
          <div className="flex space-x-2">
             {!isStreaming && <button onClick={loadExample} className="text-gray-400 hover:text-white px-2">LOAD TEMPLATE</button>}
             <div className="w-px bg-[#333] h-4 mx-2"></div>
             <button onClick={onClose} className="text-red-500 hover:text-red-400 px-4">
                 {isStreaming ? 'ABORT' : 'CANCEL'}
             </button>
             <button onClick={handleRun} disabled={isStreaming} className={`px-6 py-1 font-bold rounded-sm border ${isStreaming ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-green-700 text-white hover:bg-green-600 border-green-500'}`}>
                 COMPILE & RENDER
             </button>
          </div>
       </div>
       
       {error && (
           <div className="bg-red-900/20 border-l-2 border-red-500 p-2 mb-2 text-red-300">
               ERROR: {error}
           </div>
       )}
       
       <div className="flex-1 relative border border-[#333] bg-[#000]">
           <textarea 
              ref={textAreaRef}
              value={code} 
              onChange={e => { if(!isStreaming) { setCode(e.target.value); setError(null); } }}
              readOnly={isStreaming}
              className={`absolute inset-0 w-full h-full bg-transparent p-4 outline-none resize-none font-mono text-xs leading-relaxed ${isStreaming ? 'text-blue-300' : 'text-green-300'}`}
              spellCheck="false"
           />
       </div>
       <div className="mt-2 text-gray-600 text-[10px] flex justify-between">
           <span>* Native WebGL context will update immediately upon compilation.</span>
           <span>INPUT: XML</span>
       </div>
    </div>
  );
};