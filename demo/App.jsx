/* eslint import/no-extraneous-dependencies: "off" */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import ReglCanvas from '../src/ReglCanvas';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
};

const clearCommand = (regl) => ({
  func: regl.clear,
  getProps: () => ({
    color: [0, 0, 0, 1],
    depth: 1,
  }),
});

const drawTriangleCommand = (regl) => ({
  func: regl({
    vert: `
  precision mediump float;
  uniform float tick;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    float scale = cos(0.01 * tick);
    gl_Position = vec4(scale * position, 0, 1);
  }
    `,

    frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(sqrt(fcolor), 1);
  }
    `,

    attributes: {
      position: [[1, 0], [0, 1], [-1, -1]],

      color: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    },

    uniforms: {
      tick: regl.context('tick'),
    },

    count: 3,
  }),

  getProps: () => ({}),
});

const height = 500;
const width = 500;

class App extends Component {
  render() {
    return (
      <div style={styles.container}>
        <ReglCanvas
          height={height}
          width={width}
          commands={[clearCommand, drawTriangleCommand]}
        />
      </div>
    );
  }
}
export default hot(module)(App);
