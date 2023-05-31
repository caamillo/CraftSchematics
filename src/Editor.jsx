// Threejs
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// React
import { useState, useEffect, useRef } from "react"

const highlightEvent = (e, camera, planeMesh, highlightMesh) => {
  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let intersects;

  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
    highlightMesh.position.set(highlightPos.x, 0, highlightPos.z)
    highlightMesh.material.color.setHex(0xFFFFFF)
  }
}

function Editor() {
  const renderer = useRef(new THREE.WebGLRenderer())
  const wrapRender = useRef()
  
  useEffect(() => {
    const { current } = wrapRender
    if (!current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    renderer.current.setSize( window.innerWidth, window.innerHeight )
    current.appendChild( renderer.current.domElement )

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          visible: false
      })
    )
    planeMesh.rotateX(-Math.PI / 2)
    scene.add(planeMesh)

    const grid = new THREE.GridHelper(20, 20)
    scene.add(grid)

    const highlightMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true
        })
    )

    highlightMesh.rotateX(-Math.PI / 2);
    highlightMesh.position.set(0.5, 0, 0.5);
    scene.add(highlightMesh);

    window.addEventListener('mousemove', (e) => highlightEvent(e, camera, planeMesh, highlightMesh));

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
      window.removeEventListener('mousemove', (e) => highlightEvent(e, camera, planeMesh, highlightMesh))
    }
  }, [ wrapRender ])

  return (
    <>
      <div ref={ wrapRender }></div>
    </>
  )
}

export default Editor
