import * as THREE from 'three'
import * as objects from './objects.js'

// Add lighting (point light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
objects.scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
// You can adjust the edges of the shadow camera to capture a wider area where shadows are rendered
directionalLight.shadow.camera.bottom = -12;
directionalLight.shadow.camera.top = 12;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
objects.scene.add(directionalLightHelper);

// The object that casts a shadow has an implicit shadow camera setup
// Different light types have different camera types
const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
objects.scene.add(directionalLightShadowHelper);

//Bulb
//  const bulbGeometry = new THREE.SphereGeometry(5, 16, 16);
// const bulbMaterial = new THREE.MeshStandardMaterial({
//   emissive: 0xffffee, // Emissive color to make it glow
//   emissiveIntensity: 3, // Intensity of the glow
// });

// // for some reason this has to be exported to work? Havent figured out why
// export const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
// bulb.position.copy(directionalLight.position); // Position the bulb at the same position as the light

// // Add the bulb to the scene
// objects.scene.add(bulb);
