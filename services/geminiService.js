// B"H
/**
 * Gemini Service (Legacy Wrapper): Transformed into a REST-based emissary.
 * Performs the task of generating full movie scripts through raw HTTP calls.
 */

/**
 * Generates a movie script manifest from a user prompt.
 * @param {string} apiKey - The API Key.
 * @param {string} modelName - The model name.
 * @param {string} prompt - The creative input.
 */
export const generateMovieScript = async (apiKey, modelName, prompt) => {
    const key = apiKey || process.env.API_KEY;
    if (!key) throw new Error("API Key is missing from the ritual.");
    
    const model = modelName || 'gemini-3-flash-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const systemInstruction = `
        You are the Divine Creator Engine, a master filmmaker AI.
        Your goal is to generate a JSON manifest for a 3D animated movie based on a user prompt.
        
        CAPABILITIES:
        1. Objects: 'cube', 'sphere', 'pyramid', 'humanoid', 'tree', 'house', 'car', 'plane'.
        2. Weather: 'none', 'rain', 'snow', 'storm'.
        3. Cameras: You MUST animate cameras using keyframes to follow action (pans, zooms).
        4. Animation: Characters MUST move. Use keyframes for position/rotation.
        5. Environment: Set 'backgroundColor' (sky) and 'groundColor'.
        
        REQUIREMENTS:
        - Generate at least 3 distinct scenes.
        - Each scene must be > 5 seconds.
        - Create a coherent story.
        - Use complex composite objects (e.g., if asked for a city, use many 'house' and 'car' objects).
        - Give objects meaningful names.
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "title": "String",
          "scenes": [
            {
              "id": "s1", "name": "Scene Name", "duration": 10,
              "weather": "rain",
              "backgroundColor": [0.1, 0.1, 0.2],
              "groundColor": [0.2, 0.2, 0.2],
              "cameras": [
                 { 
                   "id": "cam1", 
                   "position": {"x":0,"y":5,"z":20}, 
                   "target": {"x":0,"y":0,"z":0},
                   "keyframes": [
                      {"time": 0, "position": {"x":0,"y":5,"z":20}},
                      {"time": 10, "position": {"x":5,"y":5,"z":10}}
                   ]
                 }
              ],
              "objects": [
                {
                   "id": "hero", "type": "humanoid", "color": [1,0,0],
                   "position": {"x":0,"y":0,"z":0},
                   "keyframes": [
                      {"time": 0, "position": {"x":0,"y":0,"z":0}, "rotation": {"x":0,"y":0,"z":0}},
                      {"time": 5, "position": {"x":2,"y":0,"z":0}, "rotation": {"x":0,"y":3.14,"z":0}}
                   ]
                }
              ]
            }
          ]
        }
    `;

    const requestBody = {
        contents: [{ parts: [{ text: `Create a full feature 3D movie about: ${prompt}` }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("The prophecy failed in transmission.");
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return null;
        
        return JSON.parse(text);
    } catch (e) {
        console.error("The prophecy failed:", e);
        throw e;
    }
};
