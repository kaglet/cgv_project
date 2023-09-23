import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

export const canvas = document.querySelector('canvas.webgl');
// Initialize a 3.js scene.
export const scene = new THREE.Scene();
export const boxGeo = new THREE.BoxGeometry(2, 2, 2);

export const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
export const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);