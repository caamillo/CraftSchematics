// Threejs
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// React
import { useState, useEffect, useRef } from "react"

function Editor() {
  const renderer = useRef(new THREE.WebGLRenderer())
  const wrapRender = useRef()
  
  useEffect(() => {
    const { current } = wrapRender
    if (!current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

    renderer.current.setSize( window.innerWidth, window.innerHeight )
    current.appendChild( renderer.current.domElement )

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube )

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.current.domElement)

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.current.render(scene, camera)
    }
    animate()

    return () => {
      controls.dispose()
    }
  }, [ wrapRender ])

  return (
    <>
      <div ref={ wrapRender }></div>
    </>
  )
}

export default Editor
