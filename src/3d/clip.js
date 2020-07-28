import * as THREE from 'three';

const ENTIRE_SCENE = 0, GLITCH_SCENE = 1, DIM_SCENE = 2;

export default class Clip {
  constructor({id, width, height, type, image}) {
    console.log('NEW CLIP', id)
    if(type === 'video'){
      this.videoElement = document.getElementById(id);
      this.texture = new THREE.VideoTexture(this.videoElement);
    } else {
      this.texture = new THREE.TextureLoader().load(image.childImageSharp.fluid.src);
    }
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture
    });

    this.geometry = new THREE.PlaneBufferGeometry(width/2, height/2);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.layers.enable(DIM_SCENE);
  }

  destroy() {
    this.videoElement = null;
    this.texture.dispose();
    this.material.dispose();
    this.geometry.dispose();
    this.mesh = null;
  }
}