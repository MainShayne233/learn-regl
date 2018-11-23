/* eslint import/no-extraneous-dependencies: "off" */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import ReglCanvas from '../src/ReglCanvas';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    flex: 0.2,
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
  uniform vec2 rotation;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    vec2 rotated_position = vec2(
      position.x * rotation.y + position.y * rotation.x,
      position.y * rotation.y - position.x * rotation.x
    );
    fcolor = color;
    gl_Position = vec4(scale * rotated_position, 0, 1);
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
      rotation: regl.prop('rotation'),
    },

    count: 3,
  }),

  getProps: getProps,
});

const height = 500;
const width = 500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      rotation: { x: 0, y: 1 },
    };
  }
  render() {
    return (
      <div style={styles.container}>
        <form style={styles.form}>
          <div>
            <label>
              Rotation X:
              <input
                type="range"
                step="0.01"
                min={-2}
                max={2}
                value={this.state.rotation.x}
                onChange={({ target }) => {
                  this.setState({
                    ...this.state,
                    rotation: {
                      ...this.state.rotation,
                      x: parseFloat(target.value),
                    },
                  });
                }}
              />
              {this.state.rotation.x}
            </label>
          </div>

          <div>
            <label>
              Rotation Y:
              <input
                type="range"
                step="0.01"
                min={-1}
                max={1}
                value={this.state.rotation.y}
                onChange={({ target }) => {
                  this.setState({
                    ...this.state,
                    rotation: {
                      ...this.state.rotation,
                      y: parseFloat(target.value),
                    },
                  });
                }}
              />
              {this.state.rotation.y}
            </label>
          </div>

          <div>
            <label>
              Scale
              <input
                type="range"
                step="0.01"
                min={0}
                max={2}
                value={this.state.scale}
                onChange={({ target }) => {
                  this.setState({
                    ...this.state,
                    scale: parseFloat(target.value),
                  });
                }}
              />
              {this.state.scale}
            </label>
          </div>
        </form>

        <ReglCanvas
          height={height}
          width={width}
          commands={[
            clearCommand,
            drawTriangleCommand(() => ({
              scale: this.state.scale,
              rotation: [this.state.rotation.x, this.state.rotation.y],
            })),
          ]}
        />
      </div>
    );
  }
}

export default hot(module)(App);
