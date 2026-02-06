// B"H
import React from 'react';
import { 
    createBiologyComponent, 
    createInteractionComponent, 
    createAnimationComponent, 
    createWindEmitterComponent,
    createFluidEmitterComponent
} from '../types/components.js';

// Local creators for components not exported directly or needing defaults
const _createPhys = () => ({ mass: 1.0, isStatic: false, friction: 0.5, collider: 'box', velocity: {x:0,y:0,z:0} });
const _createInner = () => ({ hasInnerWorld: true, innerSceneId: null, triggerDistance: 2.0, autoGenerate: true });

export const ComponentEditors = ({ object, update, addComponent }) => {
    return (
        <div className="space-y-4">
            
            {/* PHYSICS */}
            {object.components?.physics ? (
                <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-orange-400 mb-2">PHYSICS</div>
                    <div className="flex space-x-2">
                        <div className="w-1/2">
                            <label className="text-[10px] text-gray-500">Mass</label>
                            <input type="number" value={object.components.physics.mass} onChange={e => update('components.physics.mass', e.target.value)} className="w-full bg-[#111] border border-[#333] p-1" />
                        </div>
                        <div className="w-1/2 flex items-end pb-1">
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="checkbox" checked={object.components.physics.isStatic} onChange={e => update('components.physics.isStatic', e.target.checked)} />
                                <span className="text-gray-300">Static</span>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <button onClick={() => addComponent('physics', _createPhys)} className="w-full py-1 bg-orange-900/30 text-orange-400 border border-orange-900 hover:bg-orange-900/50">+ PHYSICS</button>
            )}

            {/* ANIMATION */}
            {object.components?.animation ? (
                 <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-pink-400 mb-2">ANIMATION</div>
                    <div className="space-y-2">
                        <div>
                            <label className="text-[9px] text-gray-500">State</label>
                            <select 
                                value={object.components.animation.state}
                                onChange={e => update('components.animation.state', e.target.value)}
                                className="w-full bg-[#111] border border-[#333] p-1 text-xs"
                            >
                                <option value="idle">Idle</option>
                                <option value="walk">Walk</option>
                                <option value="wave">Wave</option>
                                <option value="use_item">Use Item</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-2/3">
                                <label className="text-[9px] text-gray-500">Expression</label>
                                <select 
                                    value={object.components.animation.facialExpression}
                                    onChange={e => update('components.animation.facialExpression', e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] p-1 text-xs"
                                >
                                    <option value="neutral">Neutral</option>
                                    <option value="happy">Happy</option>
                                    <option value="angry">Angry</option>
                                    <option value="surprised">Surprised</option>
                                </select>
                            </div>
                            <div className="w-1/3 flex items-end">
                                 <label className="flex items-center text-[9px] text-gray-500 cursor-pointer">
                                    <input type="checkbox" checked={object.components.animation.blinkState > 0} onChange={e => update('components.animation.blinkState', e.target.checked ? 1.0 : 0.0)} className="mr-1"/> Blink
                                </label>
                            </div>
                        </div>
                    </div>
                 </div>
            ) : (
                 <button onClick={() => addComponent('animation', createAnimationComponent)} className="w-full py-1 bg-pink-900/30 text-pink-400 border border-pink-900 hover:bg-pink-900/50">+ ANIMATION</button>
            )}

            {/* INTERACTION */}
            {object.components?.interaction ? (
                <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-yellow-400 mb-2">INTERACTION</div>
                    <div className="flex flex-col space-y-1">
                        <label className="flex items-center space-x-2 text-[10px] cursor-pointer">
                            <input type="checkbox" checked={object.components.interaction.isBlowing} onChange={e => update('components.interaction.isBlowing', e.target.checked)} />
                            <span>Blowing Air (Wind)</span>
                        </label>
                        <label className="flex items-center space-x-2 text-[10px] cursor-pointer">
                            <input type="checkbox" checked={object.components.interaction.isUsing} onChange={e => update('components.interaction.isUsing', e.target.checked)} />
                            <span>Using Held Item</span>
                        </label>
                        <div className="mt-1">
                            <label className="text-[9px] text-gray-500">Holding Object ID</label>
                            <input value={object.components.interaction.holding || ''} onChange={e => update('components.interaction.holding', e.target.value)} className="w-full bg-[#111] border border-[#333] p-1" placeholder="None" />
                        </div>
                    </div>
                </div>
            ) : (
                <button onClick={() => addComponent('interaction', createInteractionComponent)} className="w-full py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-900 hover:bg-yellow-900/50">+ INTERACTION</button>
            )}

            {/* ELEMENTAL EMITTERS (Wind/Fluid) */}
            <div className="border-t border-[#333] pt-2">
                <div className="text-[10px] font-bold text-cyan-400 mb-2">ELEMENTAL FORCES</div>
                
                {object.components?.windEmitter ? (
                    <div className="mb-2 bg-[#111] p-1 border border-cyan-900/50">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-cyan-300">Wind</span>
                            <input type="checkbox" checked={object.components.windEmitter.active} onChange={e => update('components.windEmitter.active', e.target.checked)} />
                        </div>
                        <div className="flex space-x-1">
                            <input type="number" value={object.components.windEmitter.strength} onChange={e => update('components.windEmitter.strength', e.target.value)} className="w-1/2 bg-black border border-[#333] p-1 text-[9px]" placeholder="Strength" />
                            <input type="number" value={object.components.windEmitter.radius} onChange={e => update('components.windEmitter.radius', e.target.value)} className="w-1/2 bg-black border border-[#333] p-1 text-[9px]" placeholder="Radius" />
                        </div>
                    </div>
                ) : (
                    <button onClick={() => addComponent('windEmitter', createWindEmitterComponent)} className="w-full mb-1 py-1 bg-cyan-900/20 text-cyan-500 border border-cyan-900/50 text-[9px]">+ WIND EMITTER</button>
                )}

                {object.components?.fluidEmitter ? (
                    <div className="bg-[#111] p-1 border border-blue-900/50">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] text-blue-300">Fluid Source</span>
                            <input type="checkbox" checked={object.components.fluidEmitter.active} onChange={e => update('components.fluidEmitter.active', e.target.checked)} />
                        </div>
                    </div>
                ) : (
                    <button onClick={() => addComponent('fluidEmitter', createFluidEmitterComponent)} className="w-full py-1 bg-blue-900/20 text-blue-500 border border-blue-900/50 text-[9px]">+ FLUID SOURCE</button>
                )}
            </div>

            {/* BIOLOGY */}
            {object.components?.biology ? (
                <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-green-400 mb-2 flex justify-between">
                        <span>BIOLOGY</span>
                        <span className="text-gray-500">ATP: {Math.floor(object.components.biology.energy)}</span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500">DNA Sequence</label>
                        <input 
                            value={object.components.biology.dna} 
                            onChange={e => update('components.biology.dna', e.target.value.toUpperCase())}
                            className="w-full bg-[#051105] text-green-500 font-mono border border-green-900 p-1 tracking-widest text-[10px]" 
                        />
                    </div>
                </div>
            ) : (
                <button onClick={() => addComponent('biology', createBiologyComponent)} className="w-full py-1 bg-green-900/30 text-green-400 border border-green-900 hover:bg-green-900/50">+ BIOLOGY</button>
            )}

            {/* INNER WORLD */}
            {object.components?.innerWorld ? (
                <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-purple-400 mb-2">INNER WORLD</div>
                    <label className="text-[10px] text-gray-500">Trigger Dist</label>
                    <input type="number" value={object.components.innerWorld.triggerDistance} onChange={e => update('components.innerWorld.triggerDistance', e.target.value)} className="w-full bg-[#111] border border-[#333] p-1" />
                    <label className="flex items-center space-x-2 mt-1 cursor-pointer">
                        <input type="checkbox" checked={object.components.innerWorld.autoGenerate} onChange={e => update('components.innerWorld.autoGenerate', e.target.checked)} />
                        <span className="text-[10px]">Auto-Generate</span>
                    </label>
                </div>
            ) : (
                <button onClick={() => addComponent('innerWorld', _createInner)} className="w-full py-1 bg-purple-900/30 text-purple-400 border border-purple-900 hover:bg-purple-900/50">+ INNER WORLD</button>
            )}

            {/* LOGIC SCRIPTS */}
            {object.components?.logic && (
                <div className="border-t border-[#333] pt-2">
                    <div className="text-[10px] font-bold text-cyan-400 mb-2">LOGIC & SCRIPTS</div>
                    {object.components.logic.scripts?.map((s, i) => (
                        <div key={i} className="bg-[#1a1a1a] p-1 mb-1 border border-[#333] text-[9px] flex justify-between">
                            <span>{s.trigger} &rarr; {s.action}</span>
                            <span className="text-gray-600">#{i}</span>
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-1 mt-2">
                        <button 
                            onClick={() => {
                                const scripts = object.components.logic.scripts || [];
                                update('components.logic.scripts', [...scripts, {trigger:'tick', action:'pulsate', params:{speed:5, amount:0.1}}]);
                            }}
                            className="py-1 bg-cyan-900/30 text-cyan-400 border border-cyan-900 text-[8px]"
                        >
                            + PULSATE
                        </button>
                        <button 
                            onClick={() => {
                                const scripts = object.components.logic.scripts || [];
                                update('components.logic.scripts', [...scripts, {trigger:'tick', action:'explode', params:{}}]);
                            }}
                            className="py-1 bg-red-900/30 text-red-400 border border-red-900 text-[8px]"
                        >
                            + EXPLODE (Tick)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};