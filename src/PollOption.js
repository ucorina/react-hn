var React = require('react')
var ReactFireMixin = require('reactfire')

var HNService = require('./services/HNService')

var Spinner = require('./Spinner')

var pluralise = require('./utils/pluralise')

var styled = require('styled-components').default;
var StyledPollOption = styled.div`
  margin-bottom: 10px;
`;
var PollOptionScore = styled.div`
  color: #666;
`;
var PollOptionText = styled.div``;

var PollOption = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {pollopt: {}}
  },

  componentWillMount() {
    this.bindAsObject(HNService.itemRef(this.props.id), 'pollopt')
  },

  render() {
    var pollopt = this.state.pollopt
    if (!pollopt.id) { return <StyledPollOption loading><Spinner size="20"/></StyledPollOption> }
    return <StyledPollOption>
      <PollOptionText>
        {pollopt.text}
      </PollOptionText>
      <PollOptionScore>
        {pollopt.score} point{pluralise(pollopt.score)}
      </PollOptionScore>
    </StyledPollOption>
  }
})

module.exports = PollOption
