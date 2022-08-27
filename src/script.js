import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'
import { DirectionalLightHelper, PCFShadowMap } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObjects = {
    envMapIntensity : 5
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//UpdateEnvironmentMaps 
const updateEnvironmentMap = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMapIntensity = debugObjects.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg',
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/models/House/Portfolio_room.glb',
    (gltf) => {
        // gltf.scene.scale.set(10,10,10)
        scene.add(gltf.scene)
        gltf.scene.rotation.y = Math.PI * 0.5
        updateEnvironmentMap()
    },
    (error) => {
        console.log('error')
    }
    )

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(-10,12,5)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 20
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.camera.scale.set(2,2,2)
directionalLight.shadow.mapSize.set(1024,1024)
scene.add(directionalLight)

const directionalHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
gui.add(directionalLight.position, 'x').min(-20).max(20).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-20).max(20).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-20).max(20).step(0.001).name('lightZ')
gui.add(debugObjects, 'envMapIntensity').min(0).max(10).name("EnvMapIntensity").onFinishChange(updateEnvironmentMap)

// const axisHelper = new THREE.AxesHelper(10)
// scene.add(axisHelper)

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
camera.position.set(0, 2, 40)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()