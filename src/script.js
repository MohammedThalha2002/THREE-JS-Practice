import * as THREE from 'three'

const scene = new THREE.Scene()
const canvas = document.querySelector('.webgl')

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red' })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const sizes = {
    width: 600,
    height: 400
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

function animate() {
    requ