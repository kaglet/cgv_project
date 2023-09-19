import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Tool for debug
const gui = new dat.GUI();
import woodTextureImage from './woodenfloor.jpg'; // Make sure the path to your wood texture image is correct
import walltextureImage from './brickwall.jpg'; // Make sure the path to your wood texture image is correct
import ceilingtextureImage from './Ceiling.jpg';
console.log(ceilingtextureImage);

// Create canvas in html doc for rendering.
const canvas = document.querySelector('canvas.webgl');

// Initialize a 3.js scene.
const scene = new THREE.Scene();

// Create a perspective camera with properties (field of view, aspect ratio, near and far clipping planes).
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Set initial camera position.
camera.position.set(0, 5, 10);

// Create a WebGL renderer and set its size to match the window's dimensions.
// Append the renderer's DOM element to the HTML body.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the geometry and material for a floor tile.
// Create a group to hold the floor tiles.
// Create a grid of tiles with gaps between them, and add a click event listener to each tile. The color of each tile changes to blue when clicked.
const tileGeometry = new THREE.PlaneGeometry(5, 5); // 1x1 square
const tileMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Default white color

// Define tile size and gap size
const tileSize = 5 // Adjust the size of each tile
const gapSize = 0.2 // Adjust the size of the gap


const floorContainer = new THREE.Group()
const textureLoader = new THREE.TextureLoader()
const woodTexture = textureLoader.load(woodTextureImage)


//const tileMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
// Duplicate tiles to create the floor with gaps
const numRows = 10;
const numCols = 10;
const tiles = [];

function changeTileColorOnClick(tile) {
  const changedTileColor = new THREE.Color(255,164.7,0);
  tile.material.color.copy(changedTileColor);
  const tileLight = new THREE.PointLight(changedTileColor, 1, 2) // Create a point light with tile color
  tileLight.position.copy(tile.position) // Position the light at the tile's position
  scene.add(tileLight)
}

for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const tileClone = new THREE.Mesh(tileGeometry, tileMaterial.clone());
      const xOffset = (i - numRows / 2) * (tileSize + gapSize);
      const yOffset = (j - numCols / 2) * (tileSize + gapSize);
      tileClone.position.set(xOffset, yOffset, 0);
  
      // Add click event listener to each tile
      tileClone.addEventListener('click', () => {
        changeTileColorOnClick(tileClone);
      });
  
      floorContainer.add(tileClone);
      tiles.push(tileClone);
    }
  }



// Rotate the floor by -90 degrees around the x-axis.
// Translate the floor by (-29.9, -10, -10) units.
const rotationAngle = Math.PI / 2; 
floorContainer.rotation.set(-rotationAngle, 0, 0);

const translationVector = new THREE.Vector3(0, -29.9, -10); 
floorContainer.position.copy(translationVector);
scene.add(floorContainer);

// Create room walls using a BoxGeometry and a gray MeshBasicMaterial. These walls are added to the scene.
const roomGeometry = new THREE.BoxGeometry(70, 60, 80)
const roomMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.BackSide }) // Gray color for the room
const room = new THREE.Mesh(roomGeometry, roomMaterial)
scene.add(room)


// Add ceiling texture (inside the room cube)
const ceilingTexture = textureLoader.load(ceilingtextureImage); // Load your ceiling texture image
const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture });
const ceilingGeometry = new THREE.PlaneGeometry(70, 79.9);
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.set(0,29.99 , 0); // Adjust the position to be above the room cube
ceiling.rotation.x = Math.PI / 2; // Rotate 90 degrees along the X-axis
scene.add(ceiling);
//const ceilingTexture = textureLoader.load(ceilingtextureImage); // Load your ceiling texture image
//const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });
//const ceilingGeometry = new THREE.PlaneGeometry(12, 12);
const floorWidth = numRows * (tileSize + gapSize);
const floorHeight = numCols * (tileSize + gapSize);
const floorGeometry = new THREE.PlaneGeometry(70, 79.9);
const floorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
floor.position.set(0, -29.99, 0); // Set the floor position to be just below the tiles
scene.add(floor);
// Add lighting (point light)
const directionalLight = new THREE.PointLight(0xffffff,1);
directionalLight.position.set(0, 22, 0); // Adjust the position as needed

const target = new THREE.Object3D();
target.position.copy(floorContainer.position); // Adjust the target's position as needed


directionalLight.target = target;

scene.add(directionalLight);
//scene.add(target);

//Bulb
const bulbGeometry = new THREE.SphereGeometry(5, 16, 16);
const bulbMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffffee, // Emissive color to make it glow
  emissiveIntensity: 2, // Intensity of the glow
});


const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulb.position.copy(directionalLight.position); // Position the bulb at the same position as the light

// Add the bulb to the scene
scene.add(bulb);





// Initialize OrbitControls to allow the user to interactively control the camera.
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Start a render loop that continuously updates the scene and camera using requestAnimationFrame.
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// Set up raycasting to detect mouse clicks on the tiles.
// When a click event occurs, the code calculates the intersection point between the ray and the tiles and triggers a click event on the first intersected tile.
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', (event) => {
  // Calculate mouse coordinates in normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Get a list of objects intersected by the raycaster
  const intersects = raycaster.intersectObjects(tiles);

  // If there are intersections, trigger the click event on the first object (tile) in the list
  if (intersects.length > 0) {
    intersects[0].object.dispatchEvent({ type: 'click' });
  }
});

animate()