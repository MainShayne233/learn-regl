import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reglInitializer from 'regl';

const initializeRegl = (element, { commands, getAsyncProps }) => {
  const regl = reglInitializer(element);
  const initializedCommands = commands.map((command) => command(regl));

  getAsyncProps(regl).then((asyncProps) => {
    regl.frame(() => {
      initializedCommands.forEach(({ func, getProps }) => {
        func(getProps(asyncProps));
      });
    });
  });
};

class ReglCanvas extends Component {
  componentDidMount() {
    const { commands, getAsyncProps } = this.props;

    initializeRegl(this.canvasNode, { commands, getAsyncProps });
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
  getAsyncProps: PropTypes.func,
};

ReglCanvas.defaultProps = {
  commands: [],
  getAsyncProps: () => new Promise((res) => res()),
};

export default ReglCanvas;
