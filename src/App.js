var React = require('react')
var Link = require('react-router/lib/Link')

var Settings = require('./Settings')

var StoryStore = require('./stores/StoryStore')
var UpdatesStore = require('./stores/UpdatesStore')
var SettingsStore = require('./stores/SettingsStore')

var styled = require('styled-components').default;
var injectGlobal = require('styled-components').injectGlobal;

var iPhone5 = require('./media').iPhone5;
var narrowScreen = require('./media').narrowScreen;

injectGlobal`
  body {
    background-color: #fff;
    margin: 0;
  }
  form {
    margin: 0;
  }
  img {
    vertical-align: text-bottom;
  }
  pre {
    white-space: pre-wrap;
  }
`;

var StyledApp = styled.div`
`;

var AppWrap = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 8px auto;
  color: #000;
  background-color: #f5f5f5;
  font-size: 13.3333px;
  font-family: Verdana, Geneva, sans-serif;

  @media ${narrowScreen} {
    width: 100%;
    margin: 0px auto;
  }
`;

var AppHeader = styled.div`
  color: #00d8ff;
  background-color: #222;
  padding: 6px;
  line-height: 18px;
  vertical-align: middle;
  position: relative;

  img {
    border: 1px solid #00d8ff;
    margin-right: .25em;
  }

  a {
    color: inherit;
    text-decoration: none;

    &.active {
      color: #fff;
    }
  }
`;

var AppContent = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

var AppFooter = styled.div`
  margin-top: 1em;
  border-top: 1px solid #e7e7e7;
  text-align: center;
  color: #333;
  padding: 6px 0;

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

var HomeLinkIcon = styled(Link)`
`;

var HomeLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  color: #00d8ff !important;
  margin-right: .75em;

  &.active {
    color: #fff !important;
  }

  @media ${narrowScreen} {
    display: none;
  }
`;

var AppSettings = styled.a`
  position: absolute;
  top: 6px;
  right: 10px;
  cursor: pointer;

  @media ${iPhone5} {
    display: none;
  }
`;

var App = React.createClass({
  getInitialState() {
    return {
      showSettings: false,
      showChildren: false,
      prebootHTML: this.props.params.prebootHTML
    }
  },

  componentWillMount() {
    SettingsStore.load()
    StoryStore.loadSession()
    UpdatesStore.loadSession()
    if (typeof window === 'undefined') return
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentDidMount() {
    // Empty the prebooted HTML and hydrate using live results from Firebase
    this.setState({ prebootHTML: '', showChildren: true })
  },

  componentWillUnmount() {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  /**
   * Give stores a chance to persist data to sessionStorage in case this is a
   * refresh or an external link in the same tab.
   */
  handleBeforeUnload() {
    StoryStore.saveSession()
    UpdatesStore.saveSession()
  },

  toggleSettings(e) {
    e.preventDefault()
    this.setState({showSettings: !this.state.showSettings})
  },

  render() {
    return <StyledApp onClick={this.state.showSettings && this.toggleSettings}>
      <AppWrap>
        <AppHeader>
          <HomeLinkIcon to="/news"><img src="img/logo.png" width="16" height="16" alt="" /></HomeLinkIcon>{' '}
          <HomeLink to="/news" activeClassName="active">React HN</HomeLink>{' '}
          <Link to="/newest" activeClassName="active">new</Link>{' | '}
          <Link to="/newcomments" activeClassName="active">comments</Link> {' | '}
          <Link to="/show" activeClassName="active">show</Link>{' | '}
          <Link to="/ask" activeClassName="active">ask</Link>{' | '}
          <Link to="/jobs" activeClassName="active">jobs</Link>
          <AppSettings tabIndex="0" onClick={this.toggleSettings} onKeyPress={this.toggleSettings}>
            {this.state.showSettings ? 'hide settings' : 'settings'}
          </AppSettings>
          {this.state.showSettings && <Settings key="settings"/>}
        </AppHeader>
        <AppContent>
          <div dangerouslySetInnerHTML={{ __html: this.state.prebootHTML }}/>
          {this.state.showChildren ? this.props.children : ''}
        </AppContent>
        <AppFooter>
          <a href="https://github.com/insin/react-hn">insin/react-hn</a>
        </AppFooter>
      </AppWrap>
    </StyledApp>
  }
})

module.exports = App
