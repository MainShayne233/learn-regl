/* eslint import/no-extraneous-dependencies: "off" */
import React from 'react';
import { hot } from 'react-hot-loader';
import ReglCanvas from '../src/ReglCanvas';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
};

const clearCommand = (regl) => () => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
  });
};

const drawTriangleCommand = (regl) =>
  regl({
    vert: `
  precision mediump float;
  uniform float scale;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    gl_Position = vec4(scale * position, 0, 1);
  }
    `,

    frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(fcolor, 1);
  }
    `,

    attributes: {
      position: [[1, 0], [0, 1], [-1, -1]],

      color: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    },

    uniforms: {
      scale: 0.25,
    },

    count: 3,
  });

const commands = [clearCommand, drawTriangleCommand];
const color = () => [0, 0, 0, 1];
const depth = () => 1;
const height = 500;
const width = 500;

const App = () => (
  <div style={styles.container}>
    <ReglCanvas
      canvasId="learning-regl-canvas-node"
      height={height}
      width={width}
      color={color}
      depth={depth}
      commands={commands}
    />
  </div>
);

export default hot(module)(App);
