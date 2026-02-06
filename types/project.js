// B"H
import { createScene } from './objects.js';

// LAYERS with COMIC PANEL RECTS
// rect: [x, y, w, h] normalized 0-1
export const createLayer = (sceneId, mode = 'normal', rect = [0,0,1,1]) => ({
    sceneId,
    mode, // 'normal', 'mask_write', 'mask_read', 'add'
    rect,
    active: true
});

export const createProject = () => ({
  title: "Infinite Potential",
  scenes: [createScene('scene_1')],
  activeSceneId: 'scene_1',
  composition: [
      createLayer('scene_1', 'normal', [0,0,1,1]) 
  ], 
  apiKeys: { gemini: '', elevenLabs: '', openAI: '' }
});
