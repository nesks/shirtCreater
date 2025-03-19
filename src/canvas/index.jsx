import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import {downloadCanvasToImage} from '../config/helpers';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  const canvasRef = useRef(); // Referência para o Canvas

  return (
    <div className="relative w-full h-full">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 0], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }} // Permite capturar a imagem
        className="w-full max-w-full h-full transition-all ease-in"
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Canvas>
      <button
        onClick={downloadCanvasToImage}
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Capturar Imagem
      </button>
    </div>
  );
};

export default CanvasModel;
