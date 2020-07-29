import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from './GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import seedrandom from 'seedrandom';
import baseVertShader from 'raw-loader!./glsl/base-vert.glsl'
import glitchFragShader from 'raw-loader!./glsl/glitch-frag.glsl'
import rippleFragShader from 'raw-loader!./glsl/ripple-frag.glsl'
import Asteroids from './asteroids';
import VideoClips from './video-clips';

THREE.Cache.enabled = true;
const ENTIRE_SCENE = 0, GLITCH_SCENE = 1, DIM_SCENE = 2;

export default class BackgroundScene {
  constructor(canvas, state, onProgress, onLoad) {
    this.canvas = canvas;
    this.state = state;

    this.onProgress = onProgress || function() {};
    this.onLoad = onLoad || function() {};
    
    let globalSeed = Math.round(Math.random()*1e9);
    console.log('GLOBAL SEED', globalSeed);
    this.rng = seedrandom(globalSeed);

    this.onResize = this.onResize.bind(this);
    this.updateScene = this.updateScene.bind(this);
    this.darkenNonGlitched = this.darkenNonGlitched.bind(this);
    this.restoreMaterial = this.restoreMaterial.bind(this);
    this.render = this.render.bind(this);

    this.initScene(canvas);
  }
  
  initScene(canvas) {
    console.log('INIT')
    this.loadingManager = new THREE.LoadingManager();

    this.glitchLayer = new THREE.Layers();
    this.glitchLayer.set( GLITCH_SCENE );

    this.darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
    this.materials = {};

    this.renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
    // this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.physicallyCorrectLights = true;
    
    this.scene = new THREE.Scene();
    let skyboxRes = 2048;
    this.skybox = new THREE.CubeTextureLoader(this.loadingManager).setPath(`https://cdn.chrisuehlinger.com/3d/skybox/${skyboxRes}/`).load([
      'right.png', 'left.png',
      'top.png', 'bottom.png',
      'front.png', 'back.png'
    ]);
    this.blackSkybox = new THREE.Color(0x000000);
    this.scene.background = this.skybox;
    
    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 200 );
    this.camera.position.set( 0, 0, 10 );
    this.camera.lookAt( 0, 0, 0 );
    this.cameraGroup.add(this.camera);

    this.renderScene = new RenderPass( this.scene, this.camera );

    this.glitchPass = new GlitchPass();

    this.glitchComposer = new EffectComposer( this.renderer );
    this.glitchComposer.renderToScreen = false;
    this.glitchComposer.addPass( this.renderScene );
    this.glitchComposer.addPass( this.glitchPass );

    this.combinePass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          glitchTexture: { value: this.glitchComposer.renderTarget2.texture }
        },
        vertexShader: baseVertShader,
        fragmentShader: glitchFragShader,
        defines: {}
      }), "baseTexture"
    );
    this.combinePass.needsSwap = true;

    this.timeUniform = { value: 0 };
    this.aboutIntensityUniform = { value: 0 };

    this.refactionPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          time: this.timeUniform,
          intensity: this.aboutIntensityUniform
        },
        vertexShader: baseVertShader,
        fragmentShader: rippleFragShader,
        defines: {}
      }), "baseTexture"
    );
    // this.refactionPass.needsSwap = true;
    
    // this.filmPass = new FilmPass( 10.975, 1, window.innerHeight, false );
    this.filmPass = new FilmPass( 0.5 , 0.5, window.innerHeight, false );

    this.finalComposer = new EffectComposer( this.renderer );
    this.finalComposer.addPass( this.renderScene );
    this.finalComposer.addPass( this.combinePass );
    this.finalComposer.addPass( this.refactionPass );
    this.finalComposer.addPass( this.filmPass );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('resize', this.onResize);

    this.asteroids = new Asteroids(this.state, this.scene, this.cameraGroup, this.loadingManager);
    this.videoClips = new VideoClips(this.state, this.scene, this.cameraGroup, this.loadingManager);
    
    this.ambientLight = new THREE.AmbientLight( 0x909090, 0.1 );
    this.ambientLight.layers.enable( DIM_SCENE )
    this.ambientLight.layers.enable( GLITCH_SCENE )
    this.scene.add( this.ambientLight );
    
    // for ( let i = 0; i < 5; i ++ ) {
    //   let color = new THREE.Color();
    //   color.setHSL( this.rng(), 0.75, this.rng() * 0.2 + 0.6 );

    //   let light = new THREE.PointLight( color, 2.5);
    //   light.position.x = this.rng() * 10 - 5;
    //   light.position.y = this.rng() * 10 - 5;
    //   light.position.z = this.rng() * 10 - 5;
    //   light.layers.enable( GLITCH_SCENE);
    //   light.layers.enable( DIM_SCENE );
    //   this.scene.add(light);
    // }

    this.clock = new THREE.Clock();

    this.loadingManager.onProgress = ( url, itemsLoaded, itemsTotal) => {
      console.log( 'PROGRESS Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
      this.onProgress(Math.round(100*itemsLoaded/itemsTotal));
    }

    this.loadingManager.onLoad = () => {
      this.onLoad();
      this.rAF = requestAnimationFrame(this.render);
    }

  }

  onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );

    this.glitchComposer.setSize( width, height );
    this.finalComposer.setSize( width, height );
  }

  updateScene(newState) {
    let prevState = this.state;
    this.state = newState;
    this.asteroids.update(newState);
    this.videoClips.update(newState);
  }

  render() {
    this.rAF = requestAnimationFrame(this.render);
    let timeDelta = this.clock.getDelta();
    let timeElapsed = this.clock.getElapsedTime();
    this.timeUniform.value = timeElapsed;

    this.asteroids.render({ timeDelta, timeElapsed });

    if(this.state.zone === 'ABOUT') {
      this.aboutIntensityUniform.value += (1-this.aboutIntensityUniform.value)*timeDelta;
    } else {
      this.aboutIntensityUniform.value -= this.aboutIntensityUniform.value*timeDelta;
    }

    this.videoClips.render({ timeDelta, timeElapsed });

    // Uncomment to do a straight render
    // this.camera.layers.set( DIM_SCENE );
    // this.renderer.render( this.scene, this.camera );

    // render scene with glitch
    this.renderGlitch( true );

    // render the entire scene, then render glitch scene on top
    this.camera.layers.set( DIM_SCENE );
    this.scene.background = this.skybox;
    this.finalComposer.render();
    this.scene.background = this.blackSkybox;
    this.camera.layers.set( ENTIRE_SCENE );
  }

  darkenNonGlitched( obj ) {
    if ( obj.isMesh && this.glitchLayer.test( obj.layers ) === false ) {
      this.materials[ obj.uuid ] = obj.material;
      obj.material = this.darkMaterial;
    }
  }

  restoreMaterial( obj ) {
    if ( this.materials[ obj.uuid ] ) {
      obj.material = this.materials[ obj.uuid ];
      delete this.materials[ obj.uuid ];
    }
  }

  renderGlitch( mask ) {
    if ( mask === true ) {
      this.scene.traverse(this.darkenNonGlitched);
      this.glitchComposer.render();
      this.scene.traverse(this.restoreMaterial);
    } else {
      this.camera.layers.set( GLITCH_SCENE );
      this.glitchComposer.render();
      this.camera.layers.set( ENTIRE_SCENE );
    }
  }
}