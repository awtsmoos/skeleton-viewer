// B"H
export const createVoiceComponent = () => ({
  enabled: true,
  pitch: 1.0,
  volume: 1.0,
  isTalking: false, 
  voiceType: 'native', 
  apiProvider: '', 
  voiceId: '',
  audioSrc: null, 
  transcript: "I exist."
});

export const createLifecycleComponent = () => ({
  stage: 'adult',
  age: 0,
  growthRate: 1.0,
  transitions: {}
});

export const createAnimationComponent = () => ({
  active: true,
  state: 'idle', 
  targetId: null, 
  ikTarget: null, 
  layer: 0,
  facialExpression: 'neutral', 
  blinkState: 0.0, 
  mouthOpen: 0.0
});

export const createMuscleComponent = () => ({
    activation: 0.0, 
    muscleGroup: 'bicep', 
    origin: null, 
    insertion: null 
});

export const createInteractionComponent = () => ({
  holding: null, 
  heldBy: null, 
  attachmentPoint: 'hand_r', 
  isUsing: false, 
  isBlowing: false 
});

export const createFluidEmitterComponent = () => ({
  active: false,
  rate: 5, 
  velocity: 1.0,
  particleType: 'water_drop',
  spread: 0.2
});

export const createWindEmitterComponent = () => ({
  active: false,
  strength: 5.0, 
  radius: 2.0,
  coneAngle: 0.5, 
  type: 'directional' 
});

export const createHeatEmitterComponent = () => ({
  active: true,
  temperature: 100.0, 
  radius: 1.0,
  fuel: 100.0 
});

export const createBiologyComponent = () => ({
  dna: "ACGT", 
  energy: 50.0, 
  maxEnergy: 100.0,
  metabolicRate: 0.1,
  mitochondriaCount: 5,
  telomeres: 10, 
  nutrients: { protein: 0, sugar: 0, pigmentR: 0, pigmentG: 0, pigmentB: 0 },
  neural: { isNeuron: false, signal: 0.0, threshold: 0.8 }
});