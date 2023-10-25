import * as THREE from 'three'
import * as objects from './objects.js'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
objects.scene.add(ambientLight);

// Add lighting (directional light)
const directionalLight = new THREE.SpotLight(0xFFFFFF, 1.3);

directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 100;
directionalLight.shadow.camera.far = 4000;
objects.scene.add(directionalLight);


// Adjust the position of the light
const targetObject = new THREE.Object3D();
targetObject.position.set(50, 0, 0);
objects.scene.add(targetObject);
directionalLight.position.set(100, 800, 700);

directionalLight.target = targetObject;

directionalLight.angle = 0.5;
// Configure the shadow map size and camera near/far
const lighHelper=new THREE.SpotLightHelper(directionalLight);
objects.scene.add(lighHelper);
var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
objects.scene.add( helper );