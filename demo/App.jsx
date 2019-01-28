/* eslint import/no-extraneous-dependencies: "off" */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import resl from 'resl';
import ReglCanvas from '../src/ReglCanvas';
import mat4 from 'gl-mat4';

const getTexture = (regl) =>
  new Promise((res) => {
    resl({
      manifest: {
        texture: {
          type: 'image',
          src: 'demo/peppers.png',
          parser: (data) =>
            regl.texture({
              data: data,
              mag: 'linear',
              min: 'linear',
            }),
        },
      },
      onDone: ({ texture }) => {
        res(texture);
      },
    });
  });

const cubePosition = [
  [-0.5, +0.5, +0.5],
  [+0.5, +0.5, +0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5], // positive z face.
  [+0.5, +0.5, +0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5], // positive x face
  [+0.5, +0.5, -0.5],
  [-0.5, +0.5, -0.5],
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5], // negative z face
  [-0.5, +0.5, -0.5],
  [-0.5, +0.5, +0.5],
  [-0.5, -0.5, +0.5],
  [-0.5, -0.5, -0.5], // negative x face.
  [-0.5, +0.5, -0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, +0.5, +0.5],
  [-0.5, +0.5, +0.5], // top face
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5], // bottom face
];

const computeCubePosition = (timeValues, { length, width, depth }) => {
  const [computedLength, computedWidth, computedDepth] = [
    length,
    width,
    depth,
  ].map((dim) => dim / 10);

  return [
    [-computedWidth, +computedDepth, +computedLength],
    [+computedWidth, +computedDepth, +computedLength],
    [+computedWidth, -computedDepth, +computedLength],
    [-computedWidth, -computedDepth, +computedLength], // positive z face.
    [+computedWidth, +computedDepth, +computedLength],
    [+computedWidth, +computedDepth, -computedLength],
    [+computedWidth, -computedDepth, -computedLength],
    [+computedWidth, -computedDepth, +computedLength], // positive x face
    [+computedWidth, +computedDepth, -computedLength],
    [-computedWidth, +computedDepth, -computedLength],
    [-computedWidth, -computedDepth, -computedLength],
    [+computedWidth, -computedDepth, -computedLength], // negative z face
    [-computedWidth, +computedDepth, -computedLength],
    [-computedWidth, +computedDepth, +computedLength],
    [-computedWidth, -computedDepth, +computedLength],
    [-computedWidth, -computedDepth, -computedLength], // negative x face.
    [-computedWidth, +computedDepth, -computedLength],
    [+computedWidth, +computedDepth, -computedLength],
    [+computedWidth, +computedDepth, +computedLength],
    [-computedWidth, +computedDepth, +computedLength], // top face
    [-computedWidth, -computedDepth, -computedLength],
    [+computedWidth, -computedDepth, -computedLength],
    [+computedWidth, -computedDepth, +computedLength],
    [-computedWidth, -computedDepth, +computedLength],
  ];
};

const cubeUv = [
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // positive z face.
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // positive x face.
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // negative z face.
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // negative x face.
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // top face
  [0.0, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.0, 1.0], // bottom face
];

const cubeElements = [
  [2, 1, 0],
  [2, 0, 3], // positive z face.
  [6, 5, 4],
  [6, 4, 7], // positive x face.
  [10, 9, 8],
  [10, 8, 11], // negative z face.
  [14, 13, 12],
  [14, 12, 15], // negative x face.
  [18, 17, 16],
  [18, 16, 19], // top face.
  [20, 21, 22],
  [23, 20, 22], // bottom face
];

const drawCube = (getProps) => (regl) => ({
  func: regl({
    frag: `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D tex;
  void main () {
    gl_FragColor = texture2D(tex,vUv);
  }`,
    vert: `
  precision mediump float;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  uniform mat4 projection, view;
  void main() {
    vUv = uv;
    gl_Position = projection * view * vec4(position, 1);
  }`,
    attributes: {
      position: computeCubePosition,
      uv: cubeUv,
    },
    elements: cubeElements,
    uniforms: {
      view: (timeValues, { rotation }) => {
        const t = rotation;
        return mat4.lookAt(
          [],
          [5 * Math.cos(t), 2.5 * Math.sin(t), 5 * Math.sin(t)],
          [0, 0.0, 0],
          [0, 1, 0],
        );
      },
      projection: ({ viewportWidth, viewportHeight }) =>
        mat4.perspective(
          [],
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          10,
        ),
      tex: regl.prop('texture'),
    },
  }),
  getProps,
});

const clearCommand = (getProps) => (regl) => ({
  func: regl.clear,
  getProps,
});

const getAsyncProps = (regl) =>
  new Promise((res) => {
    getTexture(regl).then((texture) => res({ texture }));
  });

const height = 500;
const width = 500;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 7,
      width: 5.5,
      depth: 1.25,
      rotation: 0.5,
    };
  }
  render() {
    return (
      <div>
        <div>
          {['length', 'width', 'depth'].map((dimension) => (
            <div key={dimension}>
              <label>{dimension}</label>
              <input
                type="range"
                min={1}
                max={12}
                step={0.25}
                value={`${this.state[dimension]}`}
                onChange={({ target }) =>
                  this.setState({
                    ...this.state,
                    [dimension]: parseFloat(target.value),
                  })
                }
              />
              <span>{this.state[dimension]}</span>
            </div>
          ))}
          <div>
            <label>rotation</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={`${this.state.rotation}`}
              onChange={({ target }) =>
                this.setState({
                  ...this.state,
                  rotation: parseFloat(target.value),
                })
              }
            />
            <span>{this.state.rotation}</span>
          </div>
        </div>
        <ReglCanvas
          height={height}
          width={width}
          getAsyncProps={getAsyncProps}
          commands={[
            clearCommand(() => ({
              color: [0, 0, 0, 255],
              depth: 1,
            })),
            drawCube(({ texture }) => ({
              texture,
              rotation: this.state.rotation,
              length: this.state.length,
              width: this.state.width,
              depth: this.state.depth,
            })),
          ]}
        />
      </div>
    );
  }
}

export default hot(module)(App);
