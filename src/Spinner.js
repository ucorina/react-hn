var React = require('react')
import styled, { keyframes } from 'styled-components';

/* From https://github.com/tobiasahlin/SpinKit */
var StyledSpinner = styled.div`
   width: ${props => ((Number(props.size) + Number(props.spacing)) * 3)}px;
`;

const bouncedelay = keyframes`
  0%, 80%, 100% { transform: scale(0.0); } 
  40% { transform: scale(1.0); }
`;

var Bounce = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  marginRight: ${props => props.spacing}px;
  background-color: #666;
  border-radius: 100%;
  display: inline-block;
  animation: ${bouncedelay} 1.4s infinite ease-in-out;
  /* Prevent first frame from flickering when animation starts */
  animation-fill-mode: both;
`;
var Bounce1 = Bounce.extend`
  animation-delay: -0.32s;
`;
var Bounce2 = Bounce.extend`
  animation-delay: -0.16s;
`;
var Bounce3 = Bounce.extend`
`;

// TODO Implement GIF-based fallback for IE9 and another non-animating browsers
//      See https://github.com/tobiasahlin/SpinKit for how-to
var Spinner = React.createClass({
  getDefaultProps() {
    return {size: 6, spacing: 2}
  },

  render() {
    return <StyledSpinner>
      <Bounce1/>
      <Bounce2/>
      <Bounce3/>
    </StyledSpinner>
  }
})

module.exports = Spinner
