// B"H
export const MODELS = [
  { id: 'gemini-2.5-flash-latest', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash' },
];

export const DEFAULT_VS = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uNormalMatrix;

  varying highp vec3 vLighting;
  varying highp vec3 vNormal;
  varying highp vec4 vPos;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vPos = aVertexPosition;
    
    // Ambient light
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.35);
    
    // Sun
    highp vec3 dirLightColor1 = vec3(1.0, 0.95, 0.8);
    highp vec3 dirVector1 = normalize(vec3(0.5, 0.8, 0.5));
    
    // Fill
    highp vec3 dirLightColor2 = vec3(0.2, 0.2, 0.4);
    highp vec3 dirVector2 = normalize(vec3(-0.5, 0.2, -1.0));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    vNormal = transformedNormal.xyz;

    highp float directional1 = max(dot(transformedNormal.xyz, dirVector1), 0.0);
    highp float directional2 = max(dot(transformedNormal.xyz, dirVector2), 0.0);
    
    vLighting = ambientLight + (dirLightColor1 * directional1) + (dirLightColor2 * directional2);
  }
`;

export const DEFAULT_FS = `
  varying highp vec3 vLighting;
  varying highp vec3 vNormal;
  varying highp vec4 vPos;
  
  uniform highp vec3 uColor;
  uniform highp float uTime;
  uniform highp float uFlash; // For lightning

  void main(void) {
    highp vec3 finalColor = uColor * vLighting;
    
    // Lightning flash addition
    if (uFlash > 0.0) {
       finalColor += vec3(uFlash * 0.8);
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
