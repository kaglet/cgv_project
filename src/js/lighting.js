import * as THREE from 'three'
import * as objects from './objects.js'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
objects.scene.add(ambientLight);

// Add lighting (point light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
objects.scene.add(directionalLight);
directionalLight.castShadow = true;
//directionalLight.position.set(-30, 50, 0);
// adjust for the angle it will strike 0, 0, 0 at if it was the sun
directionalLight.position.set(-200, 400, 60);
// You can adjust the edges of the shadow camera to capture a wider area where shadows are rendered
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
objects.scene.add(directionalLightHelper);

// The object that casts a shadow has an implicit shadow camera setup
// Different light types have different camera types
const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
objects.scene.add(directionalLightShadowHelper);

