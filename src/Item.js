var React = require('react')
var ReactFireMixin = require('reactfire')
var TimeAgo = require('react-timeago').default

var HNService = require('./services/HNService')
var HNServiceRest = require('./services/HNServiceRest')
var StoryCommentThreadStore = require('./stores/StoryCommentThreadStore')
var ItemStore = require('./stores/ItemStore')

var Comment = require('./Comment')
var PollOption = require('./PollOption')
var Spinner = require('./Spinner')
var ItemMixin = require('./mixins/ItemMixin')

var setTitle = require('./utils/setTitle')

var SettingsStore = require('./stores/SettingsStore')
var ItemKids = require('./Items').ItemKids;

var styled = require('styled-components').default;;

var contentSpacing = {
  padding: '1em 1.25em 0 1.25em',
  marginBottom: '1em'
};

var StyledItem = styled.div.attrs(contentSpacing)`
  padding: ${props => props.loading ? props.padding : ''}
  margin-bottom: ${props => props.loading ? props.marginBottom : ''}
  ${props => props.dead ? '' : ''}
`;

var ItemContent = styled.div.attrs(contentSpacing)`
  padding: ${props => props.padding}
  margin-bottom: ${props => props.marginBottom}
`;

var ItemText = styled.div`
  margin-top: 1em;
`;

var ItemPoll = styled.div`
  margin-top: 1em;
  padding-left: 2.5em;
`;

var Control = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

function timeUnitsAgo(value, unit, suffix) {
  if (value === 1) {
    return unit
  }
  return `${value} ${unit}s`
}

var Item = React.createClass({
  mixins: [ItemMixin, ReactFireMixin],

  getInitialState() {
    return {
      item: ItemStore.getCachedStory(Number(this.props.params.id)) || {}
    }
  },

  componentWillMount() {
    if (SettingsStore.offlineMode) {
      HNServiceRest.itemRef(this.props.params.id).then(function(res) {
        return res.json()
      }).then(function(snapshot) {
        this.replaceState({ item: snapshot })
      }.bind(this))
    }
    else {
      this.bindAsObject(HNService.itemRef(this.props.params.id), 'item')
    }

    if (this.state.item.id) {
      this.threadStore = new StoryCommentThreadStore(this.state.item, this.handleCommentsChanged, {cached: true})
      setTitle(this.state.item.title)
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentWillUnmount() {
    if (this.threadStore) {
      this.threadStore.dispose()
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      // Tear it down...
      this.threadStore.dispose()
      this.threadStore = null
      this.unbind('item')
      // ...and set it up again
      var item = ItemStore.getCachedStory(Number(nextProps.params.id))
      if (item) {
        this.threadStore = new StoryCommentThreadStore(item, this.handleCommentsChanged, {cached: true})
        setTitle(item.title)
      }

      if (SettingsStore.offlineMode) {
        HNServiceRest.itemRef(nextProps.params.id).then(function(res) {
          return res.json()
        }).then(function(snapshot) {
          this.replaceState({ item: snapshot })
        }.bind(this))
      }
      else {
        this.bindAsObject(HNService.itemRef(nextProps.params.id), 'item')
        this.setState({item: item || {}})
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    // Update the title when the item has loaded.
    if (!this.state.item.id && nextState.item.id) {
      setTitle(nextState.item.title)
    }
  },

  componentDidUpdate(prevProps, prevState) {
    // If the state item id changed, an initial or new item must have loaded
    if (prevState.item.id !== this.state.item.id) {
      if (!this.threadStore || this.threadStore.itemId !== this.state.item.id) {
        this.threadStore = new StoryCommentThreadStore(this.state.item, this.handleCommentsChanged, {cached: false})
        setTitle(this.state.item.title)
        this.forceUpdate()
      }
    }
    else if (prevState.item !== this.state.item) {
      // If the item has been updated from Firebase and the initial set
      // of comments is still loading, the number of expected comments might
      // need to be adjusted.
      // This triggers a check for thread load completion, completing it
      // immediately if a cached item had 0 kids and the latest version from
      // Firebase also has 0 kids.
      if (this.threadStore.loading) {
        var kids = (this.state.item.kids ? this.state.item.kids.length : 0)
        var prevKids = (prevState.item.kids ? prevState.item.kids.length : 0)
        var kidDiff = kids - prevKids
        if (kidDiff !== 0) {
          this.threadStore.adjustExpectedComments(kidDiff)
        }
      }
      this.threadStore.itemUpdated(this.state.item)
    }
  },

  /**
   * Ensure the last visit time and comment details get stored for this item if
   * the user refreshes or otherwise navigates off the page.
   */
  handleBeforeUnload() {
    if (this.threadStore) {
      this.threadStore.dispose()
    }
  },

  handleCommentsChanged(payload) {
    this.forceUpdate()
  },

  autoCollapse(e) {
    e.preventDefault()
    this.threadStore.collapseThreadsWithoutNewComments()
  },

  markAsRead(e) {
    e.preventDefault()
    this.threadStore.markAsRead()
    this.forceUpdate()
  },

  render() {
    var state = this.state
    var item = state.item
    var threadStore = this.threadStore
    if (!item.id || !threadStore) { return <StyledItem loa  ding><Spinner size="20"/></StyledItem> }
    return <StyledItem dead={item.dead}>
      <ItemContent>
        {this.renderItemTitle(item)}
        {this.renderItemMeta(item, (threadStore.lastVisit !== null && threadStore.newCommentCount > 0 && <span>{' '}
          (<em>{threadStore.newCommentCount} new</em> in the last <TimeAgo date={threadStore.lastVisit} formatter={timeUnitsAgo}/>{') | '}
          <Control tabIndex="0" onClick={this.autoCollapse} onKeyPress={this.autoCollapse} title="Collapse threads without new comments">
            auto collapse
          </Control>{' | '}
          <Control tabIndex="0" onClick={this.markAsRead} onKeyPress={this.markAsRead}>
            mark as read
          </Control>
        </span>))}
        {item.text && <ItemText>
          <div dangerouslySetInnerHTML={{__html: item.text}}/>
        </ItemText>}
        {item.type === 'poll' && <ItemPoll>
          {item.parts.map(function(id) {
            return <PollOption key={id} id={id}/>
          })}
        </ItemPoll>}
      </ItemContent>
      {item.kids && <ItemKids>
        {item.kids.map(function(id, index) {
          return <Comment key={id} id={id} level={0}
            loadingSpinner={index === 0}
            threadStore={threadStore}
          />
        })}
      </ItemKids>}
    </StyledItem>
  }
})

module.exports = Item
