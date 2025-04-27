import { MeshTransmissionMaterial } from '@react-three/drei'
import React from 'react'
import state from '../store'
import { useSnapshot } from 'valtio'
import {getContrastingColor} from '../config/helpers';

const CustomButton = ({type, title, customStyles, handleClick}) => {
    const snap = useSnapshot(state)
    const generateStyle = (type) => {
        if(type === 'filled'){
            return {
                backgroundColor: snap.color,
                color: getContrastingColor(snap.color)
            }
        }else if(type === "outline"){
          return {
            borderWidth: `1px`,
            borderColor: snap.color,
            color: snap.color
          }
        } else if(type === "input"){
          return {
            borderWidth: `1px`,
            borderColor: snap.color,
            color: snap.color,
          }
        }
    }
  return type == "input"? 
  (
          <>
            <input id='file-upload'
            type='file'
            accept="image/*"
            onChange={handleClick}
            className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
            style={generateStyle(type)}
            />
            <label htmlFor='file-upload'
            className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
            style={generateStyle(type)}>
                {title}
            </label>
          </>
  )
  : (
    <button
    className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
    style={generateStyle(type)}
    onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton
