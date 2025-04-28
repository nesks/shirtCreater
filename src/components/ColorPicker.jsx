import React from 'react'
import {SketchPicker} from 'react-color'
import { useSnapshot } from 'valtio'
import state from '../store'
import { FaEyeDropper } from 'react-icons/fa' 

import CustomButton from './CustomButton'


const ColorPicker = () => {

  const snap = useSnapshot(state);

  const handleEyedropper = async () => {
    if (!window.EyeDropper) {
      alert("Seu navegador não suporta o conta-gotas.");
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      state.color = result.sRGBHex; // Atualiza o estado com a cor escolhida
    } catch (error) {
      console.error("Erro ao usar o conta-gotas:", error);
    }
  };

  return (
    <div className='absolute left-full ml-3'>
<div className="relative">
  <SketchPicker
    color={snap.color}
    disableAlpha
    onChange={(color) => (state.color = color.hex)}
  />  

  <div className="absolute bottom-1 right-1/12 transform -translate-x-1/2">
    <CustomButton 
      type="filled"
      title={<FaEyeDropper className="w-4 h-4" />}
      handleClick={handleEyedropper}
      customStyles="text-xs"
    />
  </div>
</div>



    </div>
  )
}

export default ColorPicker
