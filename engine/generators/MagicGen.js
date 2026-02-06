// B"H
import { SpellFXGen } from './fx/SpellFXGen.js';
import { HighMagicGen } from './fantasy/HighMagicGen.js';

export const MagicGen = {
    createPortalRing: SpellFXGen.createMagicCircle,
    createEnergyBeam: HighMagicGen.createCrystalSpire,
    createShieldHex: SpellFXGen.createChaosOrb
};
