import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { levelAreas } from './objects';
import * as player from './player.js';
import * as effects from './effect.js';
import * as objects from './objects.js';

// Define the first camera (you can customize its parameters)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
camera.position.set(0, -10, 0);

const initialPitch = -Math.PI / 4; // Adjust the pitch angle as needed
camera.rotation.set(initialPitch, 0, 0);

const width = window.innerWidth;
const height = window.innerHeight;

// Define orthographic camera parameters
const zoomFactor = 4; // Adjust this value to zoom in or out
const left = -width / 2 / zoomFactor;
const right = width / 2 / zoomFactor;
const top = height / 2 / zoomFactor;
const bottom = -height / 2 / zoomFactor;
const near = 0.1;
const far = 1100;

// Create an orthographic camera
const topDownCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
//const topDownCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);



// Initialize the current camera to be the default camera
let currentCamera = camera;

document.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        levelAreas.forEach((area, index) => {
            let rangeInX = area.sizeFromBoundingBox.x / 2;
            let rangeInZ = area.sizeFromBoundingBox.z / 2;

            const areaWorldPosition = new THREE.Vector3();
            area.getWorldPosition(areaWorldPosition);

            let inXBounds = areaWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= areaWorldPosition.x + rangeInX;
            let inZBounds = areaWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= areaWorldPosition.z + rangeInZ;
            // box without puzzle 5
            // box with puzzle above that is 4
            // box with puzzle above that is 3
            // box at other end is 0
            if (inXBounds && inZBounds) {
                // this player is then in this square region
                // this square has an index x
                // can set camera based off this square's coordinates or simply from known coordinates from knowing if square 1 needs certain coordinates
                // calculate position of topDownCamera from here

                console.log(index)
                if (index == 0) {
                    topDownCamera.position.set(-180, 1000, -360);
                    topDownCamera.lookAt(-180, 0, -360);
                } else if (index == 3) {
                    topDownCamera.position.set(170, 1000, -360);
                    topDownCamera.lookAt(170, 0, -360);
                } else if (index == 4) {
                    topDownCamera.position.set(170, 1000, -10);
                    topDownCamera.lookAt(170, 0, -10);
                } else if (index == 5) {
                    topDownCamera.position.set(170, 1000, 320);
                    topDownCamera.lookAt(170, 0, 320);
                }
                return;
            }
        });
        // Switch between cameras
        if (currentCamera === camera) {
            currentCamera = topDownCamera;
            objects.scene.fog = null;
        } else {
            currentCamera = camera;
            objects.scene.fog = effects.fog;
        }
    }
});
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( './Audio/BetterBackground.mp3', function( buffer ) {
//     sound.setBuffer( buffer );
//     sound.setLoop( true );
//     sound.setVolume( 0.0 );
//     sound.play();
// });

export { camera, topDownCamera, currentCamera };