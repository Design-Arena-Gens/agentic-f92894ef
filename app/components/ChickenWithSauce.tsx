'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ChickenWithSauceProps {
  variant: 'tartar' | 'truffle'
}

export default function ChickenWithSauce({ variant }: ChickenWithSauceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sauceParticlesRef = useRef<THREE.Points>(null)
  const garnishRef = useRef<THREE.Group>(null)

  const { sauceColor, sauceMetalness, garnishColor, garnishCount } = useMemo(() => {
    if (variant === 'tartar') {
      return {
        sauceColor: new THREE.Color('#FFFACD'),
        sauceMetalness: 0.1,
        garnishColor: new THREE.Color('#4A7C59'),
        garnishCount: 80
      }
    } else {
      return {
        sauceColor: new THREE.Color('#FFF8E7'),
        sauceMetalness: 0.2,
        garnishColor: new THREE.Color('#8B7355'),
        garnishCount: 100
      }
    }
  }, [variant])

  const chickenGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.8, 32, 32)
    const positions = geo.attributes.position

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      const noise = Math.sin(x * 5) * Math.cos(y * 5) * Math.sin(z * 5) * 0.15
      positions.setXYZ(i, x * (1 + noise), y * 1.2 * (1 + noise * 0.5), z * (1 + noise))
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  const sauceParticles = useMemo(() => {
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 1.2 + Math.random() * 0.8

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      sizes[i] = Math.random() * 0.15 + 0.05
    }

    return { positions, sizes, count: particleCount }
  }, [])

  const garnishParticles = useMemo(() => {
    const positions = new Float32Array(garnishCount * 3)
    const sizes = new Float32Array(garnishCount)

    for (let i = 0; i < garnishCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 1.5 + Math.random() * 0.5

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      sizes[i] = variant === 'tartar' ? Math.random() * 0.08 + 0.02 : Math.random() * 0.06 + 0.01
    }

    return { positions, sizes }
  }, [variant, garnishCount])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
      groupRef.current.rotation.y = time * 0.1
    }

    if (sauceParticlesRef.current) {
      const positions = sauceParticlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < sauceParticles.count; i++) {
        const i3 = i * 3
        const angle = time * 0.3 + i * 0.1
        const radius = 1.2 + Math.sin(time + i * 0.5) * 0.3

        positions[i3] = radius * Math.sin(angle) * Math.cos(i)
        positions[i3 + 1] = radius * Math.sin(angle) * Math.sin(i)
        positions[i3 + 2] = radius * Math.cos(angle + i * 0.5)
      }

      sauceParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (garnishRef.current) {
      garnishRef.current.rotation.y = time * 0.2
      garnishRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={chickenGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#D4A574"
          roughness={0.4}
          metalness={0.2}
          bumpScale={0.3}
        />
      </mesh>

      <mesh geometry={chickenGeometry} scale={[1.02, 1.02, 1.02]}>
        <meshStandardMaterial
          color="#8B6F47"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      <points ref={sauceParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sauceParticles.count}
            array={sauceParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sauceParticles.count}
            array={sauceParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color={sauceColor}
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={garnishRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={garnishCount}
              array={garnishParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={garnishCount}
              array={garnishParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color={garnishColor}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      </group>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.8
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              Math.sin(angle) * radius
            ]}
            scale={[0.3, 0.6, 0.1]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={sauceColor}
              transparent
              opacity={0.5}
              metalness={sauceMetalness}
              roughness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}
