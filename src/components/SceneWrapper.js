import React from 'react'
import BackgroundScene from '../3d/background-scene';
import {
  setLoadingIndicator
} from '../state/actions';

export default class SceneWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.sceneDidLoad = this.sceneDidLoad.bind(this);
  }

  updateScene(){
  }

  componentDidMount(){
    const { reducerState } = this.props;
    this.scene = new BackgroundScene(this.refs.backgroundCanvas, reducerState, this.sceneDidLoad);
  }

  componentDidUpdate(){
    if(this.scene) {
      const { reducerState } = this.props;
      this.scene.updateScene(reducerState);
    }
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