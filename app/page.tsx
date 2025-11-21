'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ChickenScene = dynamic(() => import('./components/ChickenScene'), {
  ssr: false,
  loading: () => <div className="loading">Loading Gourmet Experience...</div>
})

export default function Home() {
  return (
    <main style={{ width: '100%', height: '100vh' }}>
      <div className="title">
        <h1>GOURMET FRIED CHICKEN</h1>
        <p>Hyper-Realistic Hero Gallery</p>
      </div>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <ChickenScene />
      </Suspense>
    </main>
  )
}
