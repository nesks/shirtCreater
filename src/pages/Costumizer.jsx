import React, {useState, useEffect} from 'react'
import { AnimatePresence, motion} from 'framer-motion'
import { useSnapshot } from 'valtio';
import {download, logoShirt, stylishShirt} from '../assets';
import config from '../config/config';
import store from '../store'
import {downloadCanvasToImage, reader} from '../config/helpers';
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import {fadeAnimation, slideAnimation} from '../config/motion';
import {AiPicker, ColorPicker, CustomButton, Tab, FilePicker} from '../components'
import state from '../store';
import { Color } from 'three';

const Costumizer = () => {

  const snap = useSnapshot(store);
  const [file,setFile] = useState('')
  const [person,setPerson] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [loading, setLoading] = useState(false);
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
          />
        case "aipicker":
          return <AiPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
          case "personpicker":
            return <FilePicker
            file={person}
            setFile={setPerson}
            readFile={readPerson}
            />
        default:
          return null
      }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt")
      try{
          setGeneratingImg(true);
          const backendUrl = "https://shirtcreaterserver.onrender.com/api/v1/dalle"
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

  const readPerson = async () => {
    const canvas = document.querySelector("canvas");
    const shirt = canvas.toDataURL();
  
    if (!shirt && !person) {
      return alert("Please enter an image");
    }
  
    try {
      // Iniciar o loading
      setLoading(true);
  
      // Lendo a imagem da pessoa
      // const personImage = await reader(person); // Agora aguardamos a leitura
  
      // const backendUrl = "http://localhost:8080/api/v1/fashnai";
      // const response = await fetch(backendUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     person: personImage,
      //     shirt: shirt
      //   })
      // });
  
      // const data = await response.json();
      const data = {id:"53541ca7-3b41-4c5b-af85-5d3de21b6bce"};
      console.log(data);
      let tenteNovamente = false;
      do{
        await setTimeout(async () => {
          tenteNovamente =  await getImageFinalFunction(data.id);
        }, 40000); // 40 segundos,
      }while(tenteNovamente);
  
    } catch (error) {
      alert("Erro ao enviar a imagem: " + error);
    } finally {
      setLoading(false);
    }
  };
  
  // Outra função que você deseja chamar após 40 segundos
  const getImageFinalFunction = async (id) => {

    try {
      // Iniciar o loading
      setLoading(true);

      const backendUrl = `http://localhost:8080/api/v1/fashnai/status?id=${id}`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
  
      const data = await response.json();
      console.log(data);

      if(data && data.status && data.status != "completed"){
        return true;
      }
      alert(data.output);
      return false;
    } catch (error) {
      alert("Erro ao enviar a id da imagem: " + error);
    }
  };
  
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

          {loading && (
            <div className="absolute top-0 left-0 z-20 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="loader">Carregando...</div> 
            </div>
          )}
          </>
        )}
      </AnimatePresence>
  )
}

export default Costumizer
