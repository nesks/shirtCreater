import React, {useState} from 'react'
import { AnimatePresence} from 'framer-motion'
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store'
import { motion } from 'framer-motion';
import { reader} from '../config/helpers';
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import {fadeAnimation, slideAnimation} from '../config/motion';
import {AiPicker, ColorPicker, CustomButton, Tab, FilePicker, PersonPicker} from '../components'
import { Color } from 'three';

const Costumizer = () => {

  const snap = useSnapshot(state);
  const [file,setFile] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })
  const generateTabContent = () => {
      switch(activeEditorTab){
        case "colorpicker":
          return <ColorPicker />
        case "filepicker":
          return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
          handleActiveFilterTab={handleActiveFilterTab}
          />
        case "aipicker":
          return <AiPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
            handleActiveFilterTab={handleActiveFilterTab}
          />
          case "personpicker":
            return <PersonPicker
            />
        default:
          return null
      }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt")
      try{
          setGeneratingImg(true);
          const backendUrl = config.backendUrl+"v1/dalle"
          const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              prompt,
            })
          });

          const data = await response.json();
          if(data && data.message){
            alert(data.message);
          }
          handleDecals(type, `data:image/png;base64,${data.photo}`)
      }catch(error){
        alert(error)
      }finally{
        setGeneratingImg(false);
        setActiveEditorTab('')
      }
  }

  const handleDecals = (type, result) =>{
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if(!activeFilterTab[decalType.FilterTabs]){
      handleActiveFilterTab(decalType.FilterTabs)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch(tabName){
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    
    setActiveFilterTab(prevState =>{
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
    .then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    })
  } 
  
  return (
      <AnimatePresence>
        {!snap.intro && (
          <>
          <motion.div
          key="custom"
          className='absolute top-0 left-0 z-10' 
          {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab)=>(
                  <Tab
                  key={tab.name}
                  tab={tab}
                  handleClick={()=> setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
          className='absolute z-10 top-5 right-5'
          {...fadeAnimation}
          >
            <CustomButton 
              type='filled'
              title='Voltar'
              handleClick={()=> state.intro = true}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>
          <motion.div
          className='filtertabs-container'
          {...slideAnimation('up')}
          >
                {FilterTabs.map((tab)=>(
                  <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={()=> handleActiveFilterTab(tab.name)}
                  />
                ))}
          </motion.div>
          </>
        )}
      </AnimatePresence>
  )
}

export default Costumizer
