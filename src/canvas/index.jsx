import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
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
        <Environment files="/potsdamer_platz_1k.hdr" background />
        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Canvas>
    </div>
  );
};

export default CanvasModel;
