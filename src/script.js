import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const parameters = {
    count : 1000,
    size : 0.02,
    radius : 5,
    branches : 3,
}

//Galaxies
let pointsGeometry = null
let pointsMaterial = null
let galaxy = null

const generateGalaxy = () => {
   //Dispose materials
   if(galaxy !== null) {
    pointsGeometry.dispose()
    pointsMaterial.dispose()
    scene.remove(galaxy)
   }

    pointsGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for(let i = 0; i< parameters.count *3; i++){
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        positions[i3 + 0] = radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = 0
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
    pointsMaterial = new THREE.PointsMaterial()
    pointsMaterial.size = parameters.size
    pointsMaterial.sizeAttenuation = true
    pointsMaterial.depthWrite = false
    pointsMaterial.blending = THREE.AdditiveBlending
    galaxy = new THREE.Points(pointsGeometry,pointsMaterial)
    scene.add(galaxy)
}

generateGalaxy()

gui.add(parameters, 'count').max(100000).min(100).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').max(1).min(0.01).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').max(20).min(0).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').max(20).min(2).step(1).onFinishChange(generateGalaxy)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()