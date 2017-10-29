var React = require('react')
var ReactFireMixin = require('reactfire')
var TimeAgo = require('react-timeago').default

var HNService = require('./services/HNService')

var Spinner = require('./Spinner')

var setTitle = require('./utils/setTitle')

// TODO User submissions

// TODO User comments

var styled = require('styled-components').default;

var StyledUserProfile = styled.div`
  padding-left: 1.25em;
  padding-top: 1em;

  h4 {
    margin: 0 0 1em 0;
  }
`;

var UserProfileAbout = styled.div`
`;

var UserProfile = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {user: {}}
  },

  componentWillMount() {
    this.bindAsObject(HNService.userRef(this.props.params.id), 'user')
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.state.user.id !== nextState.user.id) {
      setTitle('Profile: ' + nextState.user.id)
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.unbind('user')
      this.bindAsObject(HNService.userRef(nextProps.params.id), 'user')
    }
  },

  render() {
    var user = this.state.user
    if (!user.id) {
      return <StyledUserProfile loading>
        <h4>{this.props.params.id}</h4>
        <Spinner size="20"/>
      </StyledUserProfile>
    }
    var createdDate = new Date(user.created * 1000)
    return <StyledUserProfile>
      <h4>{user.id}</h4>
      <dl>
        <dt>Created</dt>
        <dd><TimeAgo date={createdDate}/> ({createdDate.toDateString()})</dd>
        <dt>Karma</dt>
        <dd>{user.karma}</dd>
        <dt>Delay</dt>
        <dd>{user.delay}</dd>
        {user.about && <dt>About</dt>}
        {user.about && <dd><UserProfileAbout dangerouslySetInnerHTML={{__html: user.about}}/></dd>}
      </dl>
    </StyledUserProfile>
  }
})

module.exports = UserProfile
