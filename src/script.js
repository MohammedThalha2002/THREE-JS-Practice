import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

let cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const scene = new THREE.Scene()
const canvas = document.querySelector('.webgl')

const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 'red' })

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

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

