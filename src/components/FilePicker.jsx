import React from 'react'

import state from '../store'
import CustomButton from './CustomButton'

const FilePicker = ({file, setFile, readFile, handleActiveFilterTab}) => {

  return (
    <div className='filepicker-container'>
      <div className='flex-1 flex flex-col'>
      <CustomButton 
        type="input"
        title="Carregue uma logo"
        handleClick={(e) => setFile(e.target.files[0])}
        customStyles='text-xs max-h-[30px]'
        />

        <p className='mt-2 text-gray-500 text-xs truncate'>
          {file === '' ? "Nenhum arquivo adicionado. " : file.name}
        </p>

        {file && (
          <img 
            src={URL.createObjectURL(file)}
            alt="visualização da logo"
            className='mt-2 h-24 w-24 object-contain'
          />
        )}

      </div>
      <div className='mt-4 flex flex-wrap gap-3'>
        <CustomButton 
        type="outline"
        title="logo"
        handleClick={()=>{
          readFile('logo')
          state.isLogoTexture ? null : handleActiveFilterTab('logoShirt');
        }}
        customStyles='text-xs'
        />

        <CustomButton 
        type="filled"
        title="Full"
        handleClick={()=>{
          readFile('full')
          state.isFullTexture ? null : handleActiveFilterTab('stylishShirt');

        }}
        customStyles='text-xs'
        />
      </div>
    </div>
  )
}

export default FilePicker
