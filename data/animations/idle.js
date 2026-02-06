
// B"H
/**
 * The Animation of Stillness: Idle (Muscle-Driven).
 * Even in the quietest moments, the vessel lives. This scroll describes not the movement of bones,
 * but the subtle chorus of muscle activations that create the rhythm of breath and the unwavering
 * strength of posture, a constant testament to the life force within.
 */
export default {
  name: "idle",
  duration: 4.0,
  loop: true,
  keyframes: {
    // Postural muscles for subtle sway and balance
    "erector_spinae": [
      { "time": 0.0, "activation": 0.15 },
      { "time": 1.0, "activation": 0.18 },
      { "time": 2.0, "activation": 0.15 },
      { "time": 3.0, "activation": 0.12 },
      { "time": 4.0, "activation": 0.15 }
    ],
    // Breathing simulation via intercostal/diaphragm approximation
    "serratus_anterior": [
      { "time": 0.0, "activation": 0.0 }, 
      { "time": 2.0, "activation": 0.2 }, 
      { "time": 4.0, "activation": 0.0 }
    ],
    "external_oblique": [
      { "time": 0.0, "activation": 0.1 }, 
      { "time": 2.0, "activation": 0.25 }, 
      { "time": 4.0, "activation": 0.1 }
    ],
    // Slight tension in neck and shoulders
    "trapezius": [
        { "time": 0.0, "activation": 0.1 },
        { "time": 2.0, "activation": 0.12 },
        { "time": 4.0, "activation": 0.1 }
    ],
    // Very low-level arm muscle tension to prevent "dead" arms
    "deltoid": [
        { "time": 0.0, "activation": 0.02 }
    ]
  },
  blendShapes: {
    "blink": { "interval": [2.5, 5.0], "duration": 0.15 },
    "expression": "neutral"
  }
}
