// B"H
import { MagicGen } from '../MagicGen.js';
import { MerkabahGen } from '../kabbalah/MerkabahGen.js';
import { LetterGen } from '../kabbalah/LetterGen.js';

export const MysticGen = {
    createMerkabah: MerkabahGen.create,
    createAleph: LetterGen.createAleph,
    createPortal: MagicGen.createPortalRing,
    createBeam: MagicGen.createEnergyBeam
};
