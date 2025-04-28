import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color: '#437823',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './t-shirt.svg',
    fullDecal: './t-shirt.svg',

});

export default state;