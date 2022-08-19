import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
const gui = new dat.GUI()

let cursor = {
    x: 0,
    y: 0
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})
const LoadingManager = new THREE.LoadingManager()
LoadingManager.onStart = () => {
    console.log("Loading Started...")
}
LoadingManager.onError = () => {
    console.log("Error...")
}
LoadingManager.onProgress = () => {
    console.log("Progress...")
}

const textureLoader = new THREE.TextureLoader(LoadingManager)
const colorTexture = textureLoader.load('/textures/door/door.jpg')
const alphatTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const aOTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const scene = new THREE.Scene()
const canvas = document.querySelector('.webgl')

const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
const parameters = {
    color: 0xff0000
}
gui.add(cube.position, 'x', -10, 10, 0.1)
gui.add(cube.position, 'y', -10, 10, 0.1)
gui.add(cube.position, 'z', -10, 10, 0.1)
gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

window.addEventListener('resize', event => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', event => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        canvas.requestFullscreen()
    }
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

let time = Date.now()

function animate() {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()

