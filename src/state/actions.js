export const INCREMENT = `INCREMENT`;
export const increment = () => {
  return { type: INCREMENT };
}

export const ENTER_ZONE = `ENTER_ZONE`;
export const enterZone = (zone) => {
  return { type: ENTER_ZONE, zone };
}

export const EXIT_ZONE = `EXIT_ZONE`;
export const exitZone = (zone) => {
  return { type: EXIT_ZONE, zone };
}

export const PLAY_VIDEO = `PLAY_VIDEO`;
export const playVideo = (video) => {
  return { type: PLAY_VIDEO, video };
}

export const STOP_VIDEO = `STOP_VIDEO`;
export const stopVideo = (video) => {
  return { type: STOP_VIDEO, video };
}

export const SET_LOADING_PROGRESS = `SET_LOADING_PROGRESS`;
export const setLoadingProgress = (loadingProgress) => {
  return { type: SET_LOADING_PROGRESS, loadingProgress };
}

export const SET_LOADING_INDICATOR = `SET_LOADING_INDICATOR`;
export const setLoadingIndicator = (isLoaded) => {
  return { type: SET_LOADING_INDICATOR, isLoaded };
}

export const SET_MUTE = `SET_MUTE`;
export const setMute = (isMuted) => {
  return { type: SET_MUTE, isMuted };
}

export const TOGGLE_BORING_MODE = `TOGGLE_BORING_MODE`;
export const toggleBoringMode = (isBoring) => {
  return { type: TOGGLE_BORING_MODE, isBoring };
}