import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 10) // Adjust camera position

// Create a renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create a floor tile
const tileGeometry = new THREE.PlaneGeometry(1, 1) // 1x1 square
const tileMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }) // Default white color

// Define tile size and gap size
const tileSize = 1.2 // Adjust the size of each tile
const gapSize = 0.01 // Adjust the size of the gap


const floorContainer = new THREE.Group();

// Duplicate tiles to create the floor with gaps
const numRows = 10;
const numCols = 10;
const tiles = [];

for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    const tileClone = new THREE.Mesh(tileGeometry, tileMaterial.clone());
    const xOffset = (i - numRows / 2) * (tileSize + gapSize);
    const yOffset = (j - numCols / 2) * (tileSize + gapSize);
    tileClone.position.set(xOffset, yOffset, 0);
    floorContainer.add(tileClone); // Add tiles to the container
    tiles.push(tileClone);
  }
}

// Function to change tile color and emit light
function changeTileColorAndLight() {
  tiles.forEach((tile) => {
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random())
    tile.material.color.copy(randomColor) // Change tile color
    const tileLight = new THREE.PointLight(randomColor, 1, 2) // Create a point light with tile color
    tileLight.position.copy(tile.position) // Position the light at the tile's position
    scene.add(tileLight)
  })
}

// Start changing tile color and emitting light every 5 seconds
setInterval(changeTileColorAndLight, 5000)

const rotationAngle = Math.PI / 2; // Example: rotate by 45 degrees (in radians)
floorContainer.rotation.set(-rotationAngle, 0, 0);

const translationVector = new THREE.Vector3(0.5, -5.99, -0.5); // Example: move it down by 5 units along the Y-axis
floorContainer.position.copy(translationVector);
scene.add(floorContainer);


// Create room walls
const roomGeometry = new THREE.BoxGeometry(12, 12, 12)
const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.BackSide }) // Gray color for the room
const room = new THREE.Mesh(roomGeometry, roomMaterial)
scene.add(room)

// Add lighting (point light)
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0, 5, 0) // Adjust the position as needed
scene.add(pointLight)

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Render loop
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
