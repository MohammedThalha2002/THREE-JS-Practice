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
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
// const pointsGeometry = new THREE.SphereBufferGeometry(1,16,16)
// const pointsMaterial = new THREE.PointsMaterial()
// pointsMaterial.size = 0.02
// pointsMaterial.sizeAttenuation = true
// const points = new THREE.Points(pointsGeometry,pointsMaterial)
// scene.add(points)

const pointsGeometry = new THREE.BufferGeometry()
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i =0; i< count *3; i++){
    positions[i] = (Math.random()-0.5) * 10
    colors[i] = Math.random()
}
pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const pointsMaterial = new THREE.PointsMaterial()
// pointsMaterial.color = new THREE.Color('#ff0937')
pointsMaterial.size = 0.1
pointsMaterial.sizeAttenuation = true
pointsMaterial.alphaMap = particleTexture
pointsMaterial.transparent = true
pointsMaterial.vertexColors = TextTrackCue
pointsMaterial.depthWrite = false
const points = new THREE.Points(pointsGeometry,pointsMaterial)
scene.add(points)

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
    const elapsedTime = clock.getElapsedTime()
    camera.position.x = Math.cos(elapsedTime * 0.5) * 5
    camera.position.z = Math.sin(elapsedTime * 0.5) * 5
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()