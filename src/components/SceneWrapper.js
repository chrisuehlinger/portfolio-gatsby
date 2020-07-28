import React, { useEffect } from 'react'
import BackgroundScene from '../3d/background-scene';
import { useSelector, useDispatch } from 'react-redux'
import {
  setLoadingProgress,
  setLoadingIndicator
} from '../state/actions';

export default class SceneWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.sceneProgress = this.sceneProgress.bind(this);
    this.sceneDidLoad = this.sceneDidLoad.bind(this);
  }

  updateScene(){
  }

  componentDidMount(){
    const { reducerState } = this.props;
    this.scene = new BackgroundScene(this.refs.backgroundCanvas, reducerState, this.sceneProgress, this.sceneDidLoad);
  }

  componentDidUpdate(){
    if(this.scene) {
      const { reducerState } = this.props;
      this.scene.updateScene(reducerState);
    }
  }

  sceneProgress(progress) {
    this.props.dispatch(setLoadingProgress(progress));
  }

  sceneDidLoad() {
    this.props.dispatch(setLoadingIndicator(true));
  }
  
  render() {
    const {
      isLoaded
    } = this.props.reducerState;
    return (
      <>
        <canvas className="background-canvas" ref="backgroundCanvas" style={{opacity: isLoaded ? 1 : 0}}></canvas>
      </>
    );
  }
}