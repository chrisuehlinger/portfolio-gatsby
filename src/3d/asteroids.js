import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import seedrandom from 'seedrandom';
import { number } from 'prop-types';

const ENTIRE_SCENE = 0, GLITCH_SCENE = 1, DIM_SCENE = 2;

const AsteroidState = {
  OUT: `OUT`,
  ENTERING: ``,
  IN: `IN`,
  EXITING: `EXITING`,
};

function setupAsteroidGlitch(asteroidObject, i, totalAsteroids, rng) {
  asteroidObject.glitchTimeout = setTimeout(function startGlitch() {
    if(asteroidObject.state === AsteroidState.IN) {
      asteroidObject.asteroid.layers.enable(GLITCH_SCENE);
      asteroidObject.asteroid.layers.disable(DIM_SCENE);
    }
    setTimeout(function stopGlitch() {
      if(asteroidObject.state === AsteroidState.IN) {
        asteroidObject.asteroid.layers.disable(GLITCH_SCENE);
        asteroidObject.asteroid.layers.enable(DIM_SCENE);
      }
      setTimeout(startGlitch, totalAsteroids*1.5*1000);
    }, 1*1000);
  }, i*rng()*3*1000);
}

function enterAsteroid(asteroidObject, i, scene,) {
  if(!scene.getObjectById(asteroidObject.asteroid.id)) {
    clearTimeout(asteroidObject.timeout);
    asteroidObject.state = AsteroidState.ENTERING;
    asteroidObject.timeout = setTimeout(function startGlitch() {
      scene.add(asteroidObject.asteroid);
      asteroidObject.asteroid.layers.enable(GLITCH_SCENE);
      asteroidObject.asteroid.layers.disable(DIM_SCENE);
      asteroidObject.timeout = setTimeout(function stopGlitch() {
        asteroidObject.asteroid.layers.disable(GLITCH_SCENE);
        asteroidObject.asteroid.layers.enable(DIM_SCENE);
        asteroidObject.state = AsteroidState.IN;
      }, 0.5*1000);
    }, i*Math.random()*100);
  } else {
    asteroidObject.state = AsteroidState.IN;
  }
}

function exitAsteroid(asteroidObject, i, scene,) {
  if(scene.getObjectById(asteroidObject.asteroid.id)) {
    clearTimeout(asteroidObject.timeout);
    asteroidObject.state = AsteroidState.EXITING;
    asteroidObject.timeout = setTimeout(function startGlitch() {
      asteroidObject.asteroid.layers.enable(GLITCH_SCENE);
      asteroidObject.asteroid.layers.disable(DIM_SCENE);
      asteroidObject.timeout = setTimeout(function stopGlitch() {
        asteroidObject.asteroid.layers.disable(GLITCH_SCENE);
        asteroidObject.asteroid.layers.enable(DIM_SCENE);
        asteroidObject.state = AsteroidState.OUT;
        scene.remove(asteroidObject.asteroid);
      }, 0.5*1000);
    }, i*Math.random()*100);
  } else {
    asteroidObject.state = AsteroidState.OUT;
  }
}

export default class Asteroids {
  constructor(state, scene, cameraGroup, loadingManager) {
    this.state = state;
    this.scene = scene;
    this.cameraGroup = cameraGroup;
    this.loadingManager = loadingManager;
    
    let asteroidSeed = Math.round(Math.random()*1e9);
    console.log('ASTEROID SEED', asteroidSeed);
    this.rng = seedrandom(asteroidSeed);

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    this.initScene();
  }

  initScene() {

    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    var onError = function (e) { console.error('UHOH', e)};

    this.asteroids = [];
    let asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.7
    })
    var loader = new FBXLoader(this.loadingManager);
    loader.setPath(`https://cdn.chrisuehlinger.com/3d/asteroids/`).load(`asteroids.fbx`, ( object ) => {
      object.traverse(child => {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      let asteroidObjects = [...object.children[0].children];
      this.asteroids = [];
      for (let i=0; i < asteroidObjects.length; i++){
        let asteroid = asteroidObjects[i];
        asteroid.material.dispose();
        asteroid.material = asteroidMaterial;
        let randFactor = 8;
        let vector = new THREE.Vector3()
        let shortestDistance = Infinity;
        do {
          let x = 1.25*randFactor*(this.rng()-0.5),
            y = randFactor*(this.rng()-0.5),
            z = 1.25*randFactor*(this.rng()-0.5);
          vector.set(x,y,z);
          shortestDistance = this.asteroids.reduce((acc, {asteroid}) => Math.min(acc, vector.distanceTo(asteroid.position)), Infinity);
          // console.log('SHORTEST', shortestDistance)
        } while(shortestDistance < 3);

        asteroid.position.copy(vector);
        let scaleFactor = 0.25;
        asteroid.scale.set(scaleFactor,scaleFactor,scaleFactor);
        // this.scene.add(asteroid);
        // asteroid.layers.enable( DIM_SCENE );
        let rotationSpeed = (this.rng() - 0.5)*2;
        rotationSpeed += Math.sign(rotationSpeed) * 0.1;
        asteroid.rotation.set(2*Math.PI*this.rng(),2*Math.PI*this.rng(),2*Math.PI*this.rng())
        let asteroidObject = {
          asteroid,
          rotationAxis: ['rotateX', 'rotateY', 'rotateZ'][Math.round(this.rng()*2)],
          rotationSpeed,
          defaultRotation: [],
          state: AsteroidState.OUT,
          timeout: null
        };
        this.asteroids.push(asteroidObject);
        setupAsteroidGlitch(asteroidObject, i, asteroidObjects.length, this.rng);
      }
    }, onProgress, onError );

    this.lights = [];
    this.lightsOn = false;
    for ( let i = 0; i < 5; i ++ ) {
      let color = new THREE.Color();
      color.setHSL( this.rng(), 0.75, this.rng() * 0.2 + 0.6 );

      let light = new THREE.PointLight( color, 2.5);
      light.position.x = this.rng() * 10 - 5;
      light.position.y = this.rng() * 10 - 5;
      light.position.z = this.rng() * 10 - 5;
      light.layers.enable( GLITCH_SCENE);
      light.layers.enable( DIM_SCENE );
      this.lights.push(light);
    }
  }

  update(newState) {
    let prevState = this.state;
    this.state = newState;
    // console.log('UPDATE ASTEROIDS', this.state);
  }

  render({ timeDelta, timeElapsed }){
    if(this.state.zone === 'INTRO') {
      this.asteroids.map((a, i) => {
        if(a.state === AsteroidState.OUT || a.state === AsteroidState.EXITING){
          enterAsteroid(a, i, this.scene);
        }
      });
    } else {
      this.asteroids.map((a, i) => {
        if(a.state === AsteroidState.IN || a.state === AsteroidState.ENTERING){
          exitAsteroid(a, i, this.scene);
        }
      });
    }

    const numberIn = this.asteroids.reduce((acc, a) => ((a.state === AsteroidState.IN || a.state === AsteroidState.ENTERING || a.state === AsteroidState.EXITING) ? acc+1 : acc), 0);
    if (numberIn === 0 && this.lightsOn) {
      this.lightsOn = false;
      this.lights.map(light => {
        this.scene.remove(light);
      });
    } else if (numberIn > 0) {
      this.cameraGroup.rotateY((numberIn/this.asteroids.length) * timeDelta/10);
      if(!this.lightsOn) {
        this.lightsOn = true;
        this.lights.map(light => {
          this.scene.add(light);
        });
      }
    }

    this.asteroids.filter(asteroid => asteroid.state !== AsteroidState.OUT).map(({asteroid, rotationAxis, rotationSpeed}) => {
      asteroid[rotationAxis]((timeDelta * rotationSpeed))
    })

    return numberIn;

  }
}