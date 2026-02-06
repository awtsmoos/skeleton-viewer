// B"H
import React, { useState, useRef } from 'react';

export const AudioStudio = ({ project, setProject, activeSceneId }) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const [ttsText, setTtsText] = useState("");
    const [selectedVoice, setSelectedVoice] = useState(null);
    
    // NATIVE WEB SPEECH VOICES
    const [voices, setVoices] = useState([]);
    
    React.useEffect(() => {
        const loadVoices = () => {
            const vs = window.speechSynthesis.getVoices();
            setVoices(vs);
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            const chunks = [];
            
            mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                addAudioTrack("Recording", url, "voice");
            };
            
            mediaRecorder.current.start();
            setRecording(true);
        } catch(e) {
            console.error("Mic denied", e);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) mediaRecorder.current.stop();
        setRecording(false);
    };

    const generateTTS = () => {
        if (!ttsText) return;
        
        // Native
        const u = new SpeechSynthesisUtterance(ttsText);
        if (selectedVoice) u.voice = selectedVoice;
        
        // Note: WebSpeech API doesn't easily give Blob. 
        // We simulate it by just storing the data to play later, 
        // OR we use a MediaStreamDestination hack to record the synthesis.
        // For this demo, we will add a 'text' track marker.
        
        addAudioTrack(`TTS: ${ttsText.substring(0,10)}...`, null, "tts", { text: ttsText, voiceURI: selectedVoice?.voiceURI });
        
        window.speechSynthesis.speak(u);
    };

    const addAudioTrack = (name, src, type, extraData = {}) => {
        setProject(prev => ({
            ...prev,
            scenes: prev.scenes.map(s => {
                if (s.id !== activeSceneId) return s;
                return {
                    ...s,
                    audioTracks: [
                        ...(s.audioTracks || []),
                        {
                            id: Date.now().toString(),
                            name,
                            src,
                            type,
                            start: 0,
                            duration: 5, // Default
                            ...extraData
                        }
                    ]
                };
            })
        }));
    };

    return (
        <div className="w-64 bg-[#111] border-r border-[#333] flex flex-col p-2 text-xs">
            <div className="font-bold text-gray-500 mb-2 uppercase">Omni-Voice Studio</div>
            
            {/* API KEYS */}
            <div className="mb-4 space-y-2 border-b border-[#333] pb-2">
                <input placeholder="ElevenLabs Key" className="w-full bg-[#222] border border-[#333] p-1" 
                    onChange={e => setProject(p => ({...p, apiKeys: {...p.apiKeys, elevenLabs: e.target.value}}))}
                    value={project.apiKeys?.elevenLabs || ''}
                />
                <input placeholder="OpenAI Key" className="w-full bg-[#222] border border-[#333] p-1" 
                     onChange={e => setProject(p => ({...p, apiKeys: {...p.apiKeys, openAI: e.target.value}}))}
                     value={project.apiKeys?.openAI || ''}
                />
            </div>

            {/* RECORDER */}
            <div className="mb-4">
                <button 
                    onClick={recording ? stopRecording : startRecording}
                    className={`w-full p-2 rounded font-bold ${recording ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}
                >
                    {recording ? 'STOP RECORDING' : 'RECORD MIC'}
                </button>
            </div>

            {/* TTS */}
            <div className="flex flex-col space-y-2">
                <textarea 
                    value={ttsText} onChange={e => setTtsText(e.target.value)}
                    placeholder="Enter dialogue..."
                    className="bg-[#222] text-white p-1 h-20"
                />
                <select className="bg-[#222] p-1" onChange={e => setSelectedVoice(voices.find(v => v.name === e.target.value))}>
                    <option value="">Native Voice...</option>
                    {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
                <button onClick={generateTTS} className="bg-blue-600 p-1 rounded">GENERATE SPEECH</button>
            </div>
            
            {/* TRACK LIST */}
            <div className="mt-4 flex-1 overflow-y-auto">
                <div className="font-bold mb-1">Scene Tracks</div>
                {project.scenes.find(s => s.id === activeSceneId)?.audioTracks?.map(t => (
                    <div key={t.id} className="bg-[#222] p-1 mb-1 flex justify-between">
                        <span>{t.name}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{t.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
