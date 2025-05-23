
import {motion, AnimatePresence} from "framer-motion";
import { useSnapshot } from 'valtio';
import state from '../store';
import {headContainerAnimation, headContentAnimation, headTextAnimation, slideAnimation} from '../config/motion';
import { CustomButton } from "../components";

const Home = () => {
    const snap = useSnapshot(state);

  return (
    <AnimatePresence>
        {snap.intro && (
            <motion.section className='home' {...slideAnimation('left')}>
                <motion.header {...slideAnimation('down')}>
                    <img 
                    src='./t-shirt.svg'
                    alt='logo'
                    className='w-8 h-8 object-contain'
                    />
                </motion.header>
                <motion.div className="home-content" {...headContainerAnimation}>
                    <motion.div {...headTextAnimation}>
                        <h3 className="head-text">
                           Personalize sua camisa
                        </h3>
                    </motion.div>
                    <motion.div {...headTextAnimation}
                    className="flex flex-col gap-5">
                        <p className="max-w-md font-normal text-green-700 text-base"
                        >Sistema de personalização de camisetas em desenvolvimento.</p>
                        <CustomButton 
                        type="filled"
                        title="Começar"
                        handleClick={()=>state.intro = false}
                        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />

                    </motion.div>
                </motion.div>
            </motion.section>
        
        )}
    </AnimatePresence>
  )
}

export default Home
