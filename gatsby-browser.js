import Stats from 'stats.js';
import wrapWithProvider from "./src/wrap-with-provider"
export const wrapRootElement = wrapWithProvider

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
stats.dom.style.top = 'auto';
stats.dom.style.bottom = 0;

const ramStats = new Stats();
ramStats.showPanel(2);
document.body.appendChild( ramStats.dom );
ramStats.dom.style.top = 'auto';
ramStats.dom.style.bottom = 0;
ramStats.dom.style.left = '80px'

function animate() {
	stats.update();
	ramStats.update();
	requestAnimationFrame( animate );
}

requestAnimationFrame( animate );