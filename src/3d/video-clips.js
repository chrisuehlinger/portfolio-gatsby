import * as THREE from 'three';
import Clip from './clip';

const ENTIRE_SCENE = 0, GLITCH_SCENE = 1, DIM_SCENE = 2;

export default class VideoClips {
  constructor(state, scene, cameraGroup, loadingManager) {
    this.scene = scene;
    this.cameraGroup = cameraGroup;
    this.loadingManager = loadingManager;

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);

    this.oldClips = [];

    this.initScene();
    this.state = {};
    this.update(state);
  }

  initScene() {
    this.clipGroup = new THREE.Group();
    this.cameraGroup.add(this.clipGroup);
    this.clipGroup.position.set(-2.5,0,0);
    this.clipGroupTargetRotation = 0;
    this.clipGroupTargetQuaternion = new THREE.Quaternion();
  }

  update(newState) {
    let prevState = this.state;
    this.state = newState;

    let hasNewShow = (!prevState.currentVideo && newState.currentVideo) || (prevState.currentVideo && newState.currentVideo && prevState.currentVideo.id !== this.state.currentVideo.id)
    let shouldRemoveCurrentClip = this.clip && (hasNewShow || (prevState.currentVideo && !newState.currentVideo));
    if((shouldRemoveCurrentClip || hasNewShow) && this.clipGroup.quaternion.angleTo(this.clipGroupTargetQuaternion) < Math.PI/2) {
      this.clipGroupTargetRotation += Math.PI;
      this.clipGroupTargetQuaternion.setFromEuler(new THREE.Euler(0, this.clipGroupTargetRotation, 0));
    }
    if(shouldRemoveCurrentClip){
      console.log('MARKING FOR REMOVAL');
      this.clip.material.transparent = true;
      this.oldClips.push(this.clip);
      this.clip = null;
    }
    if (hasNewShow) {
      console.log('NEW CLIP!', this.state.currentVideo.id);
      this.clip = new Clip(this.state.currentVideo);
      this.clipGroup.add(this.clip.mesh);
      this.clip.mesh.rotateY(this.clipGroupTargetRotation);
    }
  }

  render({ timeDelta, timeElapsed }){
    if(this.clip) {
      let x = 0.25 * Math.sin(timeElapsed/3);
      let y = this.clipGroupTargetRotation + 0.25 * Math.sin(timeElapsed/5);
      this.clip.mesh.rotation.set(x,y,0);
    }
    let clipScale = (window.innerWidth > 768) ? window.innerWidth / 1800 : window.innerWidth / 720; ;
    this.clipGroup.scale.set(clipScale, clipScale, clipScale)
    this.clipGroup.position.x = (window.innerWidth > 768) ? -3.84*clipScale : 0;
    this.clipGroup.quaternion.slerp(this.clipGroupTargetQuaternion, 3*timeDelta);
    this.oldClips.map(oldClip => {
      oldClip.material.opacity *= (1-timeDelta);
    })

    this.oldClips = this.oldClips.filter(oldClip => {
      // console.log('OLD CLIP', oldClip.material.opacity )
      if(oldClip.material.opacity > 0.05) {
        return true;
      } else {
        this.clipGroup.remove(oldClip.mesh);
        oldClip.destroy();
        return false;
      }
    })

  }
}