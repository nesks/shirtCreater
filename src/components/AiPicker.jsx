import React from 'react'

import CustomButton from './CustomButton'

const AiPicker = ({prompt, setPrompt, generatingImg, handleSubmit}) => {
  return (
    <div className='aipicker-container'>
      <textarea
      placeholder='Crie sua logo ou fundo da camisa com GPT.'
      rows={5}
      value={prompt}
      onChange={(e)=> setPrompt(e.target.value)}
      className='aipicker-textarea'
      />
      <div className='flex flex-wrap gap-3' >
        {generatingImg ? (
          <CustomButton
          type="outline"
          title="Pergunte AI..."
          customStyles="text-xs"
          />
        ):(
          <>
          <CustomButton
          type="outline"
          title="AI Logo"
          handleClick={()=>handleSubmit('logo')}
          customStyles="text-xs"
          />
          <CustomButton
          type="filled"
          title="AI Full"
          handleClick={()=>handleSubmit('full')}
          customStyles="text-xs"
          />
          </>
        )}
      </div>
    </div>
  )
}

export default AiPicker
