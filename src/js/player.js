import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as script from './script.js'
import * as objects from './objects.js';
import * as camera from './camera.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import woodTextureImage from '../img/woodenfloor.jpg'; // Make sure the path to your wood texture image is correct
import walltextureImage from '../img/wall.jpg';
import ceilingtextureImage from '../img/Ceiling.jpg';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const prevTime = performance.now();
export const controls = new PointerLockControls(camera.currentCamera, document.body);
let raycaster = objects.raycaster;

//const moveForwardSoundPlaying = false; // Add a flag to track if the sound is already playing


const listener = new THREE.AudioListener();
//camera.add( listener );
const moveSound = new THREE.Audio(listener);
const moveSoundLoader = new THREE.AudioLoader();
moveSoundLoader.load('Audio/footsteps-dirt-gravel-6823.mp3', function (buffer) {
  moveSound.setBuffer(buffer);
  moveSound.setLoop( true );
  moveSound.setVolume(1); // Set the volume as needed
});

let velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
export var paused = false;
let _lastTimestamp=0;
export let playerBody;
export let characterModel = null;
let height;
// export let playerPhysMat = new CANNON.Material();


function getLastTimestamp() {
  return _lastTimestamp;
}

// Define a setter method
function setLastTimestamp(value) {
  _lastTimestamp = value;
}

// Export the getter and setter
export { getLastTimestamp, setLastTimestamp };


class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};


class BasicCharacterController {
  constructor(params) {

//    params.world.gravity.set(0, -9.81, 0);

    // Create a Cannon.js body for the player character
    let playerPhysMat = new CANNON.Material();
    playerPhysMat.friction = 1000;
    playerBody = new CANNON.Body({
      mass: 100, // Adjust the mass as needed
      //     shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)),
      position: new CANNON.Vec3(125, 5, 125),
      material: playerPhysMat
    });

    // Add the body to the Cannon.js world
    params.world.addBody(playerBody);

    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-5.0, -0.25, -5.0);
    this._acceleration = new THREE.Vector3(100, 1, 100);
    this._velocity = new THREE.Vector3(0, 0, 0);

    this._animations = {};
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();

    // playerBody.addEventListener('collide', (event) => {
    //   console.log("collide")
    //   // Handle collisions here

    //   // Access the other body involved in the collision
    //   const otherBody = event.body;

    //   // Check if the collision involves a specific type of object
    //   // You might want to check the type or some property of the other body
    //   if (otherBody.userData && otherBody.userData.type === 'obstacle') {
    //     // If it's an obstacle, prevent the player from moving further in that direction
    //     // For example, if you want to prevent movement in the X direction:
    //     playerBody.velocity.x = 0;
    //     playerBody.velocity.z = 0;
    //     playerBody.velocity.y = 0;

    //     // You can do the same for other axes (e.g., playerBody.velocity.y or playerBody.velocity.z)
    //   }
    // });
    let onMaze = false;
    playerBody.addEventListener('collide', (event) => {
      const otherBody = event.body;

      if (otherBody.collisionFilterGroup === 2 && !onMaze) {
        onMaze = true;

        // Calculate the vector from player to otherBody's center
        const offset = new CANNON.Vec3();
        otherBody.position.vsub(playerBody.position, offset);

        // Normalize the offset vector to get the direction
        offset.normalize();

        // Scale the direction vector by 5 units (or any desired distance)
        offset.scale(1);

        // Update player's position (x and z) accordingly
        playerBody.position.x -= offset.x;
        playerBody.position.z -= offset.z;

        // Calculate the desired Y position for the player
        const desiredY = otherBody.position.y + height + 1; // Adjust as needed

        // Adjust the player's Y position (Cannon.js)
        playerBody.position.y = desiredY;
      } else if (otherBody.collisionFilterGroup === 1) {
        onMaze = false;
      }
    });


  }

  _LoadModels() {


    const loader = new FBXLoader();

    loader.load('./alex/ALEX.fbx', (fbx) => {
      characterModel = fbx;
      //fbx.position.y=-30;
      // fbx.rotation.y=10;
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      // accurate hitbox for the player
      const boundingBox = new THREE.Box3().setFromObject(characterModel);
      const width = boundingBox.max.x - boundingBox.min.x;
      height = boundingBox.max.y - boundingBox.min.y;
      const depth = boundingBox.max.z - boundingBox.min.z;

      const playerShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

      playerBody.addShape(playerShape);


      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);

        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);

      loader.load('./alex/Walking.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('./alex/WalkingBackwards.fbx', (a) => { _OnLoad('back', a); });
      loader.load('./alex/Idle.fbx', (a) => { _OnLoad('idle', a); });
      loader.load('./alex/WalkLeft.fbx', (a) => { _OnLoad('left', a); });
      loader.load('./alex/WalkRight.fbx', (a) => { _OnLoad('right', a); });
    });
  }

  Update(timeInSeconds) {
    let savedCharacterOrientation = new THREE.Quaternion();
    const controlObject = this._target;
    const cameraObject = this._params.camera;
    const cameraDirection = new THREE.Vector3();
    if (!characterModel) {
      return;
    }


    if (camera.currentCamera === camera.camera) {
      controlObject.quaternion.copy(savedCharacterOrientation);

      if (!this._target) {
        return;
      }

      this._stateMachine.Update(timeInSeconds, this._input);

      velocity = this._velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
          Math.abs(frameDecceleration.z), Math.abs(velocity.z)
      );

      velocity.add(frameDecceleration);



      // Get the camera's direction

      cameraObject.getWorldDirection(cameraDirection);
      //cameraDirection.y = controlObject.y; // Set the camera's vertical (Y-axis) component to 0

      const acc = this._acceleration.clone();

      // Calculate movement direction based on camera's direction
      const moveDirection = new THREE.Vector3();
      moveDirection.copy(cameraDirection);
      moveDirection.y=(0);
      // Separate vector for left and right movement
      const strafeDirection = new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x);

      // Where movement is done

      if (!moveForward){
        velocity.z -= 0.0046*acc.z * timeInSeconds;
      }
      if (moveForward) {
        velocity.z += acc.z * timeInSeconds;
      }
      if (moveBackward) {
        velocity.z -= acc.z * timeInSeconds;
      }
      if (moveRight) {
        velocity.x -= acc.x * timeInSeconds;
      }
      if (moveLeft) {
        velocity.x += acc.x * timeInSeconds;
      }

//    if (!moveForward){
//        velocity.z = 0;
//        velocity.x = 0;
//    }
      // Apply movement direction to character's position
      controlObject.position.add(moveDirection.normalize().multiplyScalar(velocity.z * timeInSeconds));
      controlObject.position.add(strafeDirection.normalize().multiplyScalar(velocity.x * timeInSeconds));


      // Rotate the character to face the camera's direction
      controlObject.rotation.y = Math.atan2(cameraDirection.x, cameraDirection.z);

      // Update camera's position to match the character's position
      cameraObject.position.copy(controlObject.position);
      // Set the camera's vertical position (Y-axis) to maintain it above the character's head

      cameraObject.position.y += 20;
      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
    } else if (camera.currentCamera === camera.topDownCamera) {
      savedCharacterOrientation.copy(controlObject.quaternion);
      if (!this._target) {
        return;
      }

      this._stateMachine.Update(timeInSeconds, this._input);

      const velocity = this._velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
          Math.abs(frameDecceleration.z), Math.abs(velocity.z));

      velocity.add(frameDecceleration);


      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.quaternion.clone();

      const acc = this._acceleration.clone();

      if (moveForward) {
        velocity.z += acc.z * timeInSeconds;
      }
      if (moveBackward) {
        velocity.z -= acc.z * timeInSeconds;
      }
      if (moveLeft) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * (this._acceleration.y * 0.5));
        _R.multiply(_Q);
      }
      if (moveRight) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * (this._acceleration.y * 0.5));
        _R.multiply(_Q);
      }

      controlObject.quaternion.copy(_R);

      //const oldPosition = new THREE.Vector3();
      //oldPosition.copy(controlObject.position);

      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();

      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();

      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);

      controlObject.position.add(forward);
      controlObject.position.add(sideways);
      const targetRotation = controlObject.rotation.clone();
      cameraObject.rotation.copy(targetRotation);
      //oldPosition.copy(controlObject.position);

      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
    }


    playerBody.velocity.y += this._params.world.gravity.y * timeInSeconds;
    playerBody.position.copy(controlObject.position);
    playerBody.quaternion.copy(controlObject.quaternion);
  }

};

class BasicCharacterControllerInput {
  //const  moveForwardSoundPlaying = false;
  constructor() {
    this._Init();
  }

  _Init() {

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);


    //code that allows the screen to follow mouse
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');
    const pausedScreen = document.getElementById('paused-screen');

    document.addEventListener('click', function () {
      controls.lock();
    });


    controls.addEventListener('lock', function () {
      paused=false;
      _lastTimestamp=performance.now;
      instructions.style.display = 'none';
      blocker.style.display = 'none';
      pausedScreen.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
      paused=true;
      pausedScreen.style.display = 'block';
      blocker.style.display = 'block';
      instructions.style.display = '';
      moveForward=false;
      moveBackward=false;
      moveRight=false;
      moveLeft=false;
    });

    objects.scene.add(controls.getObject());

  }
  // const moveForwardSoundPlaying = false; // Add a flag to track if the sound is already playing


  //key press listeners
  moveForwardSoundPlaying = false ;

  _onKeyDown(event) {
    if (!paused) {
    // Play the sound for all directions
      switch (event.keyCode) {
        case 87: // w
          moveForward = true;
          break;
        case 65: // a
          moveLeft = true;
          break;
        case 83: // s
          moveBackward = true;
          break;
        case 68: // d
          moveRight = true;
          break;
      }
      if (moveForward || moveBackward || moveRight || moveLeft) {
        moveSound.play();
      } else {
        moveSound.stop();
      }
    }
  };

  _onKeyUp(event) {
    //moveSound.stop();
    //this._checkAndPlayMoveSound();
    switch (event.keyCode) {
      case 87: // w
        moveForward = false;
       // Stop the move sound

        // this.moveForwardSoundPlaying = false;
        break;
      case 65: // a
        moveLeft = false;
       // moveSound.stop();
        break;
      case 83: // s
        moveBackward = false;
       // moveSound.stop();
        break;
      case 68: // d
        moveRight = false;
       // moveSound.stop();
        break;
    }
    if (moveForward || moveBackward || moveRight || moveLeft) {
      moveSound.play();
    } else {
      moveSound.stop();
    }
  }
};



class FiniteStateMachine {
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
};


class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('back', BackState);
    this._AddState('left', LeftState);
    this._AddState('right', RightState);

  }
};


class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() { }
  Exit() { }
  Update() { }
};





class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;


      curAction.time = 0.0;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);


      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveForward) {

      return;
    }

    this._parent.SetState('idle');
  }
};

class BackState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'back';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['back'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;


      curAction.time = 0.0;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);


      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveBackward) {

      return;
    }

    this._parent.SetState('idle');
  }
};

class LeftState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'left';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['left'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;


      curAction.time = 0.0;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);


      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveLeft) {

      return;
    }

    this._parent.SetState('idle');
  }
};

class RightState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'right';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['right'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;


      curAction.time = 0.0;
      curAction.setEffectiveTimeScale(1.0);
      curAction.setEffectiveWeight(1.0);


      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveRight) {

      return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(_, input) {
    if (moveForward) {
      this._parent.SetState('walk');
    }
    if (moveBackward) {
      this._parent.SetState('back');
    }
    if (moveRight) {
      this._parent.SetState('right');
    }
    if (moveLeft) {
      this._parent.SetState('left');
    }
  }
};


export var _controls;

export function _LoadAnimatedModel() {
  const params = {
    camera: camera.currentCamera,
    scene: objects.scene,
    world: objects.world,
  }
  _controls = new BasicCharacterController(params);



}

export function animate_objects() {
  if (characterModel && playerBody) {
    characterModel.position.copy(playerBody.position);
    characterModel.position.y-=2;
  }
}