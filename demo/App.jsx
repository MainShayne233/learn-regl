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

const drawTriangleCommand = (getProps) => (regl) => ({
  func: regl({
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
    gl_FragColor = vec4(sqrt(fcolor), 1);
  }
    `,

    attributes: {
      position: [[1, 0], [0, 1], [-1, -1]],

      color: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    },

    uniforms: {
      scale: regl.prop('scale'),
    },

    count: 3,
  }),

  getProps,
});

const color = () => [0, 0, 0, 1];
const depth = () => 1;
const height = 500;
const width = 500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { scale: 1 };
  }

  render() {
    return (
      <div style={styles.container}>
        <ReglCanvas
          height={height}
          width={width}
          color={color}
          depth={depth}
          commands={[
            clearCommand,
            drawTriangleCommand(() => ({
              scale: this.state.scale,
            })),
          ]}
        />
        <label>
          Scale
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={this.state.scale}
            onChange={({ target }) => {
              this.setState({ scale: parseFloat(target.value) });
            }}
          />
        </label>
      </div>
    );
  }
}
export default hot(module)(App);
