import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reglInitializer from 'regl';

const initializeRegl = (element, { commands }) => {
  const regl = reglInitializer(element);
  const initializedCommands = commands.map((command) => command(regl));

  regl.frame(() => {
    initializedCommands.forEach(({ func, getProps }) => {
      func(getProps());
    });
  });
};

class ReglCanvas extends Component {
  componentDidMount() {
    const { commands } = this.props;

    initializeRegl(this.canvasNode, { commands });
  }

  render() {
    const { height, width } = this.props;
    return (
      <canvas
        ref={(element) => {
          this.canvasNode = element;
        }}
        height={height}
        width={width}
      />
    );
  }
}

ReglCanvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  commands: PropTypes.arrayOf(PropTypes.func),
};

ReglCanvas.defaultProps = {
  commands: [],
};

export default ReglCanvas;
