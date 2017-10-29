var React = require('react')
var styled = require('styled-components').default;;
var narrowScreen = require('./media').narrowScreen;

var SettingsContainer = styled.div`
  box-sizing: border-box;
  padding: .75em;
  position: absolute;
  width: 36%;
  background-color: inherit;
  right: 0;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;

  p {
    color: #fff;
  }

  div:last-child > p:last-child {
    margin-bottom: 0;
  }

  @media ${narrowScreen} {
    ${/* Safari only fix to ensure Settings menu is full width */ ''}
    _::-webkit-:not(:root:root), .Settings {
      width: 100%;
    }
  }
`;

var Setting = styled.div`
  td:first-child {
    text-align: right;
  }
`;

var CheckboxSetting = styled(Setting)`

`;

var SettingsStore = require('./stores/SettingsStore')

var Settings = React.createClass({
  componentDidMount() {
    this.settingsContainer.focus()
  },

  onChange(e) {
    var el = e.target
    if (el.type === 'checkbox') {
      SettingsStore[el.name] = el.checked
    }
    else if (el.type === 'number' && el.value) {
      SettingsStore[el.name] = el.value
    }
    this.forceUpdate()
    SettingsStore.save()
  },

  onClick(e) {
    e.stopPropagation()
  },

  render() {
    return <SettingsContainer innerRef={(container) => (this.settingsContainer = container)} tabIndex="-1" onClick={this.onClick}>
      <form onChange={this.onChange}>
        <CheckboxSetting>
          <label htmlFor="autoCollapse">
            <input type="checkbox" name="autoCollapse" id="autoCollapse" checked={SettingsStore.autoCollapse}/> auto collapse
          </label>
          <p>Automatically collapse comment threads without new comments on page load.</p>
        </CheckboxSetting>
        <CheckboxSetting>
          <label htmlFor="replyLinks">
            <input type="checkbox" name="replyLinks" id="replyLinks" checked={SettingsStore.replyLinks}/> show reply links
          </label>
          <p>Show "reply" links to Hacker News</p>
        </CheckboxSetting>
        <CheckboxSetting>
          <label htmlFor="offlineMode">
            <input type="checkbox" name="offlineMode" id="offlineMode" checked={SettingsStore.offlineMode}/> Offline Mode
          </label>
          <p>Cache comments and content offline.</p>
        </CheckboxSetting>
        <CheckboxSetting>
          <label htmlFor="showDead">
            <input type="checkbox" name="showDead" id="showDead" checked={SettingsStore.showDead}/> show dead
          </label>
          <p>Show items flagged as dead.</p>
        </CheckboxSetting>
        <CheckboxSetting>
          <label htmlFor="showDeleted">
            <input type="checkbox" name="showDeleted" id="showDeleted" checked={SettingsStore.showDeleted}/> show deleted
          </label>
          <p>Show comments flagged as deleted in threads.</p>
        </CheckboxSetting>
        <Setting>
          <table>
            <tbody>
              <tr>
                <td><label htmlFor="titleFontSize">title font size:</label></td>
                <td><input type="number" min="13.333" step="1" name="titleFontSize" id="titleFontSize" value={SettingsStore.titleFontSize}/></td>
              </tr>
              <tr>
                <td><label htmlFor="listSpacing">list spacing:</label></td>
                <td><input type="number" min="0" name="listSpacing" id="listSpacing" value={SettingsStore.listSpacing}/></td>
              </tr>
            </tbody>
          </table>
        </Setting>
      </form>
    </SettingsContainer>
  }
})

module.exports = Settings
