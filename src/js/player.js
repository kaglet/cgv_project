
import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as script from './script.js'
import * as objects from './objects.js';
import * as camera from './camera.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import woodTextureImage from '../img/woodenfloor.jpg'; // Make sure the path to your wood texture image is correct
import walltextureImage from '../img/wall.jpg'; // Make sure the path to your wood texture image is correct
import ceilingtextureImage from '../img/Ceiling.jpg';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const prevTime = performance.now();
export const controls = new PointerLockControls( camera.currentCamera, document.body );
let raycaster=objects.raycaster;

let velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;


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
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-5.0, -0.25, -5.0);
    this._acceleration = new THREE.Vector3(100, 1, 100.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    this._animations = {};
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();
  }

  _LoadModels() {


    const loader = new FBXLoader();

    loader.load('ALEX.fbx', (fbx) => {
      fbx.position.y=-30;
      fbx.rotation.y=10;
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

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

      loader.load('Walking.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('WalkingBackwards.fbx', (a) => { _OnLoad('back', a); });
      loader.load('Idle.fbx', (a) => { _OnLoad('idle', a); });
      loader.load('WalkLeft.fbx', (a) => { _OnLoad('left', a); });
      loader.load('WalkRight.fbx', (a) => { _OnLoad('right', a); });
    });
  }

 Update(timeInSeconds) {
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

     // Character model
     const controlObject = this._target;
     // FP camera
     const cameraObject = this._params.camera;

     // Get the camera's direction
     const cameraDirection = new THREE.Vector3();
     cameraObject.getWorldDirection(cameraDirection);
     cameraDirection.y = 0; // Set the camera's vertical (Y-axis) component to 0

     const acc = this._acceleration.clone();

     // Calculate movement direction based on camera's direction
     const moveDirection = new THREE.Vector3();
     moveDirection.copy(cameraDirection);

     // Separate vector for left and right movement
     const strafeDirection = new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x);

     // Where movement is done
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
 }

};

class BasicCharacterControllerInput {
  constructor() {
    this._Init();
  }

  _Init() {

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);


        //code that allows the screen to follow mouse
        const blocker = document.getElementById( 'blocker' );
        const instructions = document.getElementById( 'instructions' );

        document.addEventListener( 'click', function () {
            controls.lock();
        } );

        controls.addEventListener( 'lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        } );

        controls.addEventListener( 'unlock', function () {
            blocker.style.display = 'block';
            instructions.style.display = '';
        } );

        objects.scene.add(controls.getObject());

  }
//key press listeners
  _onKeyDown(event) {
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
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        moveForward=false;
        break;
      case 65: // a
        moveLeft = false;
        break;
      case 83: // s
        moveBackward=false;
        break;
      case 68: // d
        moveRight = false;
        break;


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

  Enter() {}
  Exit() {}
  Update() {}
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
    if (moveForward ) {

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
    if ( moveBackward) {

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
    if (moveLeft ) {

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
    if (moveRight ) {

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
    if(moveBackward){
       this._parent.SetState('back');
    }
    if(moveRight){
       this._parent.SetState('right');
    }
    if(moveLeft){
       this._parent.SetState('left');
    }
  }
};


export var _controls;

export function _LoadAnimatedModel() {
    const params = {
      camera: camera.currentCamera,
      scene: objects.scene,
    }
    _controls = new BasicCharacterController(params);



  }
