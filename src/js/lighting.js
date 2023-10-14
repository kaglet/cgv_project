import * as THREE from 'three'
import * as objects from './objects.js'
import * as player from './player.js';

// Add lighting (point light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
objects.scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
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

