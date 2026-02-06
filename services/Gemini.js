// B"H
/**
 * Gemini Service: The Portal to the Divine Mind.
 * Using pure REST API calls (fetch) to transmit and receive data from the celestial models.
 * We bypass the SDK libraries to ensure the path is straight and the footprint is minimal.
 */

/**
 * Generates a universe manifest by streaming chunks of XML from the Gemini Model.
 * @param {string} apiKey - The celestial key to access the model.
 * @param {string} model - The specific emanation of the model (e.g., gemini-3-flash-preview).
 * @param {string} prompt - The creative spark provided by the user.
 * @param {Function} onChunk - A callback to handle each fragment of the manifest as it descends.
 */
export const generateUniverseStream = async (apiKey, model, prompt, onChunk) => {
    if (!apiKey) {
        // This should be handled by the environment variable API_KEY normally,
        // but if passed explicitly, we respect the user's flow.
        apiKey = process.env.API_KEY;
    }
    
    if (!apiKey) throw new Error("Divine Access Key missing.");

    const systemInstruction = `
        You are the DIVINE ENGINE ARCHITECT.
        Convert user prompts into a 3D Scene XML Manifest.
        
        OUTPUT FORMAT (STRICT XML):
        <Project title="...">
          <Scene id="s1" name="...">
            <Environment skyColor="0.1 0.1 0.2" />
            <Object id="unique_id" type="cube" name="Name">
               <Transform p="0 0 0" r="0 0 0" s="1 1 1" />
               <Material type="standard" color="1 0 0" />
               <Timeline>
                  <Track path="transform.position.y">
                     <Key time="0" val="0" ease="easeInOut" />
                     <Key time="2" val="5" ease="easeInOut" />
                  </Track>
               </Timeline>
               <Components>
                  <Physics mass="1" static="false" />
               </Components>
            </Object>
          </Scene>
        </Project>

        AVAILABLE TYPES:
        - Primitives: cube, sphere, plane, pyramid
        - Complex: layout_split_reality, layout_cosmic_library, layout_tunnel, layout_burst
        - Props: book_tome, broken_ruler, chain_strand, scales_justice, black_hole, dna_helix
        - Judaica: hebrew_aleph, hebrew_bet, book_tanya, building_770
        - Nature: animal_lion, animal_elephant, wheat_stalk
        
        RULES:
        1. Do NOT use markdown blocks. Output RAW XML.
        2. Ensure valid closing tags.
        3. Use 'p' for position, 'r' for rotation, 's' for scale (x y z space separated).
        4. For colors use 'r g b' (0-1 float space separated).
        5. GENERATE ANIMATION TRACKS if the prompt implies movement.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ],
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`The Celestial Model rejected the request: ${errData.error?.message || response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        /**
         * The loop of reception: processing the stream as it flows from the source.
         */
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            // The API returns chunks as JSON objects within an array structure.
            // We look for segments that look like complete JSON objects.
            // Note: In stream mode, it might return several JSON objects.
            let firstBracket = buffer.indexOf('{');
            let lastBracket = buffer.lastIndexOf('}');
            
            if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                // This is a simplified streamer for demonstration. 
                // A robust implementation would parse the specific stream format properly.
                try {
                    const chunkStr = buffer.substring(firstBracket, lastBracket + 1);
                    // The Gemini stream is an array of objects. We try to find individual valid JSON objects.
                    // This logic assumes the stream might contain partial segments.
                    const jsonChunks = buffer.split(/,\s*\{/).map((s, i) => {
                        let clean = s.trim();
                        if (i > 0 && !clean.startsWith('{')) clean = '{' + clean;
                        if (clean.startsWith('[')) clean = clean.substring(1);
                        if (clean.endsWith(']')) clean = clean.substring(0, clean.length - 1);
                        return clean;
                    }).filter(s => s.length > 2);

                    for (const jsonStr of jsonChunks) {
                        try {
                            const data = JSON.parse(jsonStr);
                            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                onChunk(text);
                            }
                        } catch (e) {
                            // Fragmentary JSON, wait for more data.
                        }
                    }
                    buffer = buffer.substring(lastBracket + 1);
                } catch (e) {
                    // Buffer not yet a complete JSON unit.
                }
            }
        }
    } catch (e) {
        console.error("Communication with the Divine Mind failed:", e);
        throw e;
    }
};
