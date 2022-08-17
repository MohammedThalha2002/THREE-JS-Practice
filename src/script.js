import * as THREE from 'three'

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

const sizes = {
    width: 800,
    height: 700
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

let time = Date.now()

function animate() {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    camera.position.x = cursor.x * 10
    camera.position.y = -cursor.y * 10
    camera.lookAt(cube.position)

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()

