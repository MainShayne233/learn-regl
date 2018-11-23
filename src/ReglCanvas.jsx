// @flow
import React from 'react';
import PropTypes from 'prop-types';
import reglInitializer from 'regl';

const initializeRegl = (element, { color }) => {
  const regl = reglInitializer(element);

  regl.frame(() => {
    regl.clear({
      color: color(),
    });
  });
};

const ReglCanvas = ({ canvasId, height, width, color }) => (
  <canvas
    id={canvasId}
    ref={(element) => {
      initializeRegl(element, { color });
    }}
    height={height}
    width={width}
  />
);

ReglCanvas.propTypes = {
  canvasId: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  color: PropTypes.func.isRequired,
};

export default ReglCanvas;
