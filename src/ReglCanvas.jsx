// @flow
import React from 'react';
import PropTypes from 'prop-types';
import reglInitializer from 'regl';

const initializeRegl = (element, { commands }) => {
  const regl = reglInitializer(element);
  const initializeCommands = commands.map((command) => command(regl));

  regl.frame(() => {
    initializeCommands.forEach((command) => {
      command();
    });
  });
};

const ReglCanvas = ({ canvasId, height, width, commands }) => (
  <canvas
    id={canvasId}
    ref={(element) => {
      initializeRegl(element, { commands });
    }}
    height={height}
    width={width}
  />
);

ReglCanvas.propTypes = {
  canvasId: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  commands: PropTypes.arrayOf(PropTypes.func),
};

ReglCanvas.defaultProps = {
  commands: [],
};

export default ReglCanvas;
