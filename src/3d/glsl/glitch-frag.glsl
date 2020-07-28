uniform sampler2D baseTexture;
uniform sampler2D glitchTexture;

varying vec2 vUv;

void main() {
  vec4 base = texture2D( baseTexture, vUv );

  vec4 bloom = vec4( 1.0 ) * texture2D( glitchTexture, vUv );
  vec4 additive = vec4( 1.0 ) * texture2D( glitchTexture, vUv );
  float avgChannel = ((bloom.r + bloom.g + bloom.b) / 3.0);
  float coefficient = step(0.01, avgChannel);
  gl_FragColor = base * (1.0 - coefficient) + additive * coefficient;

}