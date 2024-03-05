import skin from '../skins/0.png';
import skin2 from '../skins/1.png';
import skin3 from '../skins/2.png';
import skin4 from '../skins/3.png';
import skin5 from '../skins/4.png';
import skin6 from '../skins/5.png';
import skin8 from '../skins/7.png';
import skin9 from '../skins/8.png';
import skin10 from '../skins/9.png';
import skin11 from '../skins/10.png';
import skin12 from '../skins/11.png';
import skin13 from '../skins/12.png';
import skin14 from '../skins/13.png';
import skin15 from '../skins/14.png';
import skin16 from '../skins/15.png';

import mask from '../skins/0_mask.png';
import mask2 from '../skins/1_mask.png';
import mask3 from '../skins/2_mask.png';
import mask4 from '../skins/3_mask.png';
import mask5 from '../skins/4_mask.png'
import mask6 from '../skins/5_mask.png'
import mask7 from '../skins/7_mask.png'
import mask8 from '../skins/8_mask.png'
import mask9 from '../skins/9_mask.png'
import mask10 from '../skins/10_mask.png'
import mask11 from '../skins/11_mask.png'
import mask12 from '../skins/12_mask.png'
import mask13 from '../skins/13_mask.png'
import mask14 from '../skins/14_mask.png'
import mask15 from '../skins/16_mask.png'

const skins = [skin, skin2, skin3, skin4, skin5, skin6, skin8, skin9, skin10, skin11, skin12, skin13, skin14, skin15, skin16]; 
const masks = [mask, mask2, mask3, mask4, mask5, mask6, mask7, mask8, mask9, mask10, mask11, mask12, mask13, mask14, mask15];

export const getRandomSkinAndMask = () => {
  const randomIndex = Math.floor(Math.random() * skins.length);
  return { skin: skins[randomIndex], mask: masks[randomIndex] };
};

