import {
  INCREMENT,
  ENTER_ZONE,
  EXIT_ZONE,
  PLAY_VIDEO,
  STOP_VIDEO,
  SET_LOADING_INDICATOR,
  SET_MUTE
} from './actions';

const initialState = {
  count: 0,
  zone: null,
  zoneHistory: [],
  currentShow: null,
  currentVideo: null,
  isLoaded: false,
  isMuted: true
};

const reducer = (state = initialState, action) => {
  console.log('ACTION', action);
  const nextState = Object.assign({}, state);

  switch (action.type) {
    case INCREMENT: {
      nextState.count = state.count + 1;
      return nextState;
    }
    case ENTER_ZONE: {
      nextState.zone = action.zone;
      nextState.zoneHistory = [...state.zoneHistory, action.zone];
      return nextState;
    }
    case EXIT_ZONE: {
      nextState.zoneHistory = state.zoneHistory.filter(zone => zone !== action.zone);
      nextState.zone = nextState.zoneHistory.length ? nextState.zoneHistory[nextState.zoneHistory.length - 1] : state.zone;
      return nextState;
    }
    case PLAY_VIDEO: {
      nextState.currentVideo = action.video;
      return nextState;
    }
    case STOP_VIDEO: {
      if(state.currentVideo && state.currentVideo.id === action.video.id) {
        nextState.currentVideo = null;
      }
      return nextState;
    }
    case SET_LOADING_INDICATOR: {
      nextState.isLoaded = action.isLoaded;
      return nextState;
    }
    case SET_MUTE: {
      nextState.isMuted = action.isMuted;
      return nextState;
    }
    default: {
      return state;
    }
  }
}

export default reducer;