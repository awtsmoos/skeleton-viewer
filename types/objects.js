// B"H
import { 
    createVoiceComponent, 
    createLifecycleComponent, 
    createBiologyComponent, 
    createAnimationComponent, 
    createMuscleComponent, 
    createInteractionComponent,
    createFluidEmitterComponent,
    createWindEmitterComponent,
    createHeatEmitterComponent
} from './components.js';

export const createVec3 = (x = 0, y = 0, z = 0) => ({ x, y, z });

export const createTransform = () => ({
  position: createVec3(0, 0, 0),
  rotation: createVec3(0, 0, 0),
  scale: createVec3(1, 1, 1)
});

export const createMaterial = () => ({
  type: 'standard', 
  shading: 'pbr', // 'pbr', 'toon', 'flat', 'wireframe'
  color: [1, 1, 1],
  emissive: 0.0,
  roughness: 0.5,
  metalness: 0.0,
  opacity: 1.0,
  data: {} 
});

export const createKeyframeTrack = (path) => ({
    path,
    keys: []
});

export const createObject = (id, type, name) => ({
  id,
  name,
  type, 
  active: true, // The breath of existence; if false, it is not rendered.
  blueprint: {}, 
  transform: createTransform(),
  material: createMaterial(),
  children: [], 
  timeline: [], // Universal Timeline
  components: {
     physics: { mass: 1.0, isStatic: false, friction: 0.5, collider: 'box', velocity: {x:0,y:0,z:0} },
     audio: { enabled: false }, 
     voice: createVoiceComponent(), 
     lifecycle: createLifecycleComponent(),
     biology: type.includes('bio_') || type.includes('creature') || type === 'human_rigged' ? createBiologyComponent() : null, 
     animation: type === 'human_rigged' ? createAnimationComponent() : null,
     muscle: type.includes('muscle') ? createMuscleComponent() : null,
     interaction: createInteractionComponent(), 
     fluidEmitter: type === 'tool_hose' ? createFluidEmitterComponent() : null,
     windEmitter: type === 'tool_fan' || type === 'human_rigged' ? createWindEmitterComponent() : null, 
     heatEmitter: type === 'item_candle' || type === 'elem_fireball' ? createHeatEmitterComponent() : null, 
     appendage: null, 
     innerWorld: { hasInnerWorld: false, innerSceneId: null, triggerDistance: 2.0, autoGenerate: true }, 
     behavior: { type: 'none', params: {} },
     logic: { scripts: [] },
     tags: []
  },
  keyframes: [] // Legacy
});

export const createScene = (id) => ({
  id,
  name: "Epoch " + id,
  duration: 60,
  environment: {
    skyColor: [0,0,0], 
    timeOfDay: 12.0, 
    weather: 'clear',
    physics: { gravity: -9.8, wind: [0,0,0] }
  },
  objects: [],
  cameras: [{
      id: 'cam1',
      transform: { position: {x:0, y:5, z:20}, rotation:{x:0,y:0,z:0}, scale:{x:1,y:1,z:1} },
      target: {x:0,y:0,z:0},
      fov: 60,
      keyframes: []
  }],
  activeCameraId: 'cam1',
  audioTracks: [] 
});