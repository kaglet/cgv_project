import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as objects from './objects.js'

// Add lighting (point light)
const directionalLight = new THREE.PointLight(0xffffff,1);
directionalLight.position.set(0, 23, 0); // Adjust the position as needed


objects.scene.add(directionalLight);

//Bulb
 const bulbGeometry = new THREE.SphereGeometry(5, 16, 16);
const bulbMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffffee, // Emissive color to make it glow
  emissiveIntensity: 3, // Intensity of the glow
});

// for some reason this has to be exported to work? Havent figured out why
export const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
bulb.position.copy(directionalLight.position); // Position the bulb at the same position as the light

// Add the bulb to the scene
objects.scene.add(bulb);


//skybox

// const worldGeometry = new THREE.BoxGeometry(70, 60, 80);


// // const worldMaterial = new THREE.MeshStandardMaterial({ map: walltexture, side: THREE.BackSide }) // Gray color for the room
//  const worldMesh = new THREE.Mesh(worldGeometry , worldMaterial )