'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'
import ChickenWithSauce from './ChickenWithSauce'

export default function ChickenScene() {
  const [scene, setScene] = useState<'tartar' | 'truffle'>('tartar')

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={scene === 'tartar' ? ['#FFE84D'] : ['#F5E6D3']} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />

        <ChickenWithSauce variant={scene} />

        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        <Environment preset="studio" />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
        />

        <fog attach="fog" args={scene === 'tartar' ? ['#FFE84D', 10, 20] : ['#F5E6D3', 10, 20]} />
      </Canvas>

      <div className="controls">
        <button
          className={`control-btn ${scene === 'tartar' ? 'active' : ''}`}
          onClick={() => setScene('tartar')}
        >
          Tartar Sauce
        </button>
        <button
          className={`control-btn ${scene === 'truffle' ? 'active' : ''}`}
          onClick={() => setScene('truffle')}
        >
          Truffle Sauce
        </button>
      </div>
    </>
  )
}
