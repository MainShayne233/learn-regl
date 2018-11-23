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

const App = () => (
  <div style={styles.container}>
    <ReglCanvas
      canvasId="learning-regl-canvas-node"
      height={500}
      width={500}
      color={() => [0, 0.5 * (1.0 + Math.cos(Date.now() * 0.01)), 1, 1]}
    />
  </div>
);

export default hot(module)(App);
