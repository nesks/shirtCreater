import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color: '#437823',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',

});

export default state;