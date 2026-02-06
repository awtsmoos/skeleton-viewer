// B"H
import { createProject, createLayer } from '../../types/project.js';
import { createScene, createObject, createKeyframeTrack } from '../../types/objects.js';


export const XMLParser = {
    toXML: (project) => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Project title="${project.title}">\n`;
        
        project.scenes.forEach(scene => {
            xml += `  <Scene id="${scene.id}" name="${scene.name}">\n`;
            xml += `    <Environment skyColor="${v3Str(scene.environment?.skyColor || [0,0,0])}" />\n`;
            
            scene.objects.forEach(obj => {
                xml += `    <Object id="${obj.id}" type="${obj.type}" name="${obj.name}">\n`;
                xml += `      <Transform p="${v3ObjStr(obj.transform.position)}" r="${v3ObjStr(obj.transform.rotation)}" s="${v3ObjStr(obj.transform.scale)}" />\n`;
                xml += `      <Material type="${obj.material.type}" color="${v3Str(obj.material.color)}" />\n`;
                
                // Timeline / Tracks
                if (obj.timeline && obj.timeline.length > 0) {
                    xml += `      <Timeline>\n`;
                    obj.timeline.forEach(track => {
                        xml += `        <Track path="${track.path}">\n`;
                        track.keys.forEach(k => {
                            xml += `          <Key time="${k.time}" val="${k.value}" ease="${k.ease || 'linear'}" />\n`;
                        });
                        xml += `        </Track>\n`;
                    });
                    xml += `      </Timeline>\n`;
                }

                // Components
                const compKeys = Object.keys(obj.components).filter(k => obj.components[k]);
                if (compKeys.length > 0) {
                    xml += `      <Components>\n`;
                    compKeys.forEach(k => {
                        const c = obj.components[k];
                        if (k === 'physics') xml += `        <Physics mass="${c.mass}" static="${c.isStatic}" />\n`;
                        if (k === 'biology' && c) xml += `        <Biology dna="${c.dna}" />\n`;
                        if (k === 'animation' && c.active) xml += `        <Animation state="${c.state}" />\n`;
                    });
                    xml += `      </Components>\n`;
                }
                
                xml += `    </Object>\n`;
            });
            
            xml += `  </Scene>\n`;
        });
        
        xml += `</Project>`;
        return xml;
    },

    parsePartial: (partialXml) => {
        // 1. Sanitize: Remove incomplete tags at the very end
        // e.g., "<Objec" -> ""
        let clean = partialXml.replace(/<[^>]*$/, '');
        
        // 2. Auto-close hierarchy to make valid XML for DOMParser
        // We count open tags vs closed tags (roughly) or just brute-force append closers
        // Brute force is safer for visualization:
        if (!clean.includes('</Scene>')) clean += '</Scene>';
        if (!clean.includes('</Project>')) clean += '</Project>';
        
        try {
            return XMLParser.fromXML(clean);
        } catch(e) {
            // If partial parsing fails, return null (wait for more data)
            return null;
        }
    },

    fromXML: (xmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "text/xml");
        
        // Check for parser errors
        const parseError = doc.querySelector('parsererror');
        if (parseError) throw new Error("XML Parsing Failed");

        const projectNode = doc.querySelector('Project');
        if (!projectNode) throw new Error("Invalid XML: Missing <Project> root.");

        const project = createProject();
        project.title = projectNode.getAttribute('title') || "New Reality";
        project.scenes = [];
        project.composition = [];

        const sceneNodes = doc.querySelectorAll('Scene');
        sceneNodes.forEach(sNode => {
            const id = sNode.getAttribute('id') || `scene_${Date.now()}`;
            const scene = createScene(id);
            scene.name = sNode.getAttribute('name') || "Generated Scene";
            
            // Environment
            const envNode = sNode.querySelector('Environment');
            if (envNode) {
                scene.environment.skyColor = parseV3(envNode.getAttribute('skyColor'));
            }

            // Objects
            const objNodes = sNode.querySelectorAll('Object');
            objNodes.forEach(oNode => {
                const oId = oNode.getAttribute('id');
                const type = oNode.getAttribute('type');
                const name = oNode.getAttribute('name');
                const obj = createObject(oId, type, name);

                // Transform
                const tNode = oNode.querySelector('Transform');
                if (tNode) {
                    obj.transform.position = parseV3Obj(tNode.getAttribute('p'));
                    obj.transform.rotation = parseV3Obj(tNode.getAttribute('r'));
                    obj.transform.scale = parseV3Obj(tNode.getAttribute('s'));
                }

                // Material
                const mNode = oNode.querySelector('Material');
                if (mNode) {
                    obj.material.type = mNode.getAttribute('type') || 'standard';
                    obj.material.color = parseV3(mNode.getAttribute('color'));
                }

                // Timeline / Tracks
                const tlNode = oNode.querySelector('Timeline');
                if (tlNode) {
                    const tracks = tlNode.querySelectorAll('Track');
                    tracks.forEach(tr => {
                        const path = tr.getAttribute('path');
                        const track = createKeyframeTrack(path);
                        const keys = tr.querySelectorAll('Key');
                        keys.forEach(k => {
                            track.keys.push({
                                time: parseFloat(k.getAttribute('time')),
                                value: parseFloat(k.getAttribute('val')),
                                ease: k.getAttribute('ease') || 'linear'
                            });
                        });
                        obj.timeline.push(track);
                    });
                }

                // Components
                const compNode = oNode.querySelector('Components');
                if (compNode) {
                    const physNode = compNode.querySelector('Physics');
                    if (physNode) {
                        obj.components.physics.mass = parseFloat(physNode.getAttribute('mass') || 1);
                        obj.components.physics.isStatic = physNode.getAttribute('static') === 'true';
                    }
                    const bioNode = compNode.querySelector('Biology');
                    if (bioNode && obj.components.biology) {
                        obj.components.biology.dna = bioNode.getAttribute('dna');
                    }
                }
                
                scene.objects.push(obj);
            });

            project.scenes.push(scene);
            project.composition.push(createLayer(id, 'normal'));
        });

        // Set active scene to first
        if (project.scenes.length > 0) project.activeSceneId = project.scenes[0].id;

        return project;
    }
};

// Helpers
function v3Str(arr) {
    if (!arr) return "1 1 1";
    return `${arr[0].toFixed(2)} ${arr[1].toFixed(2)} ${arr[2].toFixed(2)}`;
}
function v3ObjStr(obj) {
    if (!obj) return "0 0 0";
    return `${obj.x.toFixed(2)} ${obj.y.toFixed(2)} ${obj.z.toFixed(2)}`;
}
function parseV3(str) {
    if(!str) return [1,1,1];
    const p = str.trim().split(/\s+/).map(parseFloat);
    return [p[0]||0, p[1]||0, p[2]||0];
}
function parseV3Obj(str) {
    if(!str) return {x:0,y:0,z:0};
    const p = str.trim().split(/\s+/).map(parseFloat);
    return {x:p[0]||0, y:p[1]||0, z:p[2]||0};
}