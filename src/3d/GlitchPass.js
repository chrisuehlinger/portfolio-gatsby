/**
 * @author alteredq / http://alteredqualia.com/
 * @author uehreka / https://chrisuehlinger.com
 */

import {
	DataTexture,
	FloatType,
	MathUtils,
	RGBFormat,
	LuminanceFormat,
	ShaderMaterial,
	UniformsUtils
} from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { DigitalGlitch } from "three/examples/jsm/shaders/DigitalGlitch.js";

class GlitchPass extends Pass {

	constructor(dt_size = 64, onStart = function () { }, onStop = function () { }) {
		super();

		const shader = DigitalGlitch;
		this.uniforms = UniformsUtils.clone(shader.uniforms);

		this.uniforms["tDisp"].value = this.generateHeightmap(dt_size);

		this.onStart = onStart;
		this.onStop = onStop;

		this.material = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		});

		this.fsQuad = new Pass.FullScreenQuad(this.material);

		this.goWild = true;
		this.curF = 0;
		this.generateTrigger();
		this.isGlitching = false;
	}

	render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {

		if (renderer.capabilities.isWebGL2 === false) this.uniforms['tDisp'].value.format = LuminanceFormat;

		this.uniforms["tDiffuse"].value = readBuffer.texture;
		this.uniforms['seed'].value = Math.random();//default seeding
		this.uniforms['byp'].value = 0;

		if (this.curF % this.randX == 0 || this.goWild == true) {

			this.uniforms['amount'].value = Math.random() / 30;
			this.uniforms['angle'].value = MathUtils.randFloat(- Math.PI, Math.PI);
			this.uniforms['seed_x'].value = MathUtils.randFloat(- 1, 1);
			this.uniforms['seed_y'].value = MathUtils.randFloat(- 1, 1);
			this.uniforms['distortion_x'].value = MathUtils.randFloat(0, 1);
			this.uniforms['distortion_y'].value = MathUtils.randFloat(0, 1);
			this.curF = 0;

			this.generateTrigger();
			this.start();


			this.uniforms['amount'].value = Math.random() / 9000;
			this.uniforms['angle'].value = MathUtils.randFloat(- Math.PI, Math.PI) / 2;
			this.uniforms['distortion_x'].value = MathUtils.randFloat(0, 0.05);
			this.uniforms['distortion_y'].value = MathUtils.randFloat(0, 0.05);
			this.uniforms['seed_x'].value = MathUtils.randFloat(- 0.5, 0.5);
			this.uniforms['seed_y'].value = MathUtils.randFloat(- 0.5, 0.5);

		} else if (this.curF % this.randX < this.randX / 2) {

			this.uniforms['amount'].value = Math.random() / 9000;
			this.uniforms['angle'].value = MathUtils.randFloat(- Math.PI, Math.PI) / 2;
			this.uniforms['distortion_x'].value = MathUtils.randFloat(0, 0.05);
			this.uniforms['distortion_y'].value = MathUtils.randFloat(0, 0.05);
			this.uniforms['seed_x'].value = MathUtils.randFloat(- 0.5, 0.5);
			this.uniforms['seed_y'].value = MathUtils.randFloat(- 0.5, 0.5);

		} else if (this.goWild == false) {
			this.stop();

			this.uniforms['byp'].value = 1;

		}

		this.curF++;

		if (this.renderToScreen) {

			renderer.setRenderTarget(null);
			this.fsQuad.render(renderer);

		} else {

			renderer.setRenderTarget(writeBuffer);
			if (this.clear) renderer.clear();
			this.fsQuad.render(renderer);

		}

	}

	generateTrigger() {

		this.randX = MathUtils.randInt(90, 180);

	}

	start() {
		if (!this.isGlitching) {
			this.isGlitching = true;
			this.onStart();
		}
	}

	stop() {
		if (this.isGlitching) {
			this.isGlitching = false;
			this.onStop();
		}
	}

	generateHeightmap(dt_size) {

		var data_arr = new Float32Array(dt_size * dt_size * 3);
		var length = dt_size * dt_size;

		for (var i = 0; i < length; i++) {

			var val = MathUtils.randFloat(0, 1);
			data_arr[i * 3 + 0] = val;
			data_arr[i * 3 + 1] = val;
			data_arr[i * 3 + 2] = val;

		}

		return new DataTexture(data_arr, dt_size, dt_size, RGBFormat, FloatType);
	}

}

export { GlitchPass };
