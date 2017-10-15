var React = require('react')
import styled, { keyframes } from 'styled-components';

/* From https://github.com/tobiasahlin/SpinKit */
var StyledSpinner = styled.div`
`;

const bouncedelay = keyframes`
  0%, 80%, 100% { transform: scale(0.0); } 
  40% { transform: scale(1.0); }
`;

var Bounce = styled.div`
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
    var bounceSize = this.props.size + 'px'
    var bounceStyle = {height: bounceSize, width: bounceSize, marginRight: this.props.spacing + 'px'}
    return <StyledSpinner style={{width: ((Number(this.props.size) + Number(this.props.spacing)) * 3) + 'px'}}>
      <Bounce1 style={bounceStyle}/>
      <Bounce2 style={bounceStyle}/>
      <Bounce3 style={bounceStyle}/>
    </StyledSpinner>
  }
})

module.exports = Spinner
