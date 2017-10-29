var React = require('react')

var SettingsStore = require('./stores/SettingsStore')
var UpdatesStore = require('./stores/UpdatesStore')

var DisplayListItem = require('./DisplayListItem')
var DisplayComment = require('./DisplayComment')
var Paginator = require('./Paginator')
var Spinner = require('./Spinner')

var PageNumberMixin = require('./mixins/PageNumberMixin')

var {ITEMS_PER_PAGE} = require('./utils/constants')
var pageCalc = require('./utils/pageCalc')
var setTitle = require('./utils/setTitle')

import { ItemsList } from './Items';

import styled from 'styled-components';

var StyledUpdates = styled.div`
  ${props => props.loading ? 'padding: 1em 1.25em 0 1.25em': ''}
  ${props => props.loading ? 'margin-bottom: 1em;': ''}
`;

var CommentUpdates = styled(StyledUpdates)`
  margin-bottom: .75em;
`;

var ItemUpdates = styled(StyledUpdates)`

`;


function filterDead(item) {
  return !item.dead
}

function filterUpdates(updates) {
  if (!SettingsStore.showDead) {
    return {
      comments: updates.comments.filter(filterDead),
      stories: updates.stories.filter(filterDead)
    }
  }
  return updates
}

var Updates = React.createClass({
  mixins: [PageNumberMixin],

  getInitialState() {
    return filterUpdates(UpdatesStore.getUpdates())
  },

  componentWillMount() {
    this.setTitle(this.props.type)
    UpdatesStore.start()
    UpdatesStore.on('updates', this.handleUpdates)
  },

  componentWillUnmount() {
    UpdatesStore.off('updates', this.handleUpdates)
    UpdatesStore.stop()
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setTitle(nextProps.type)
    }
  },

  setTitle(type) {
    setTitle('New ' + (type === 'comments' ? 'Comments' : 'Links'))
  },

  handleUpdates(updates) {
    if (!this.isMounted()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Skipping update of ' + this.props.type + ' as the Updates component is not mounted')
      }
      return
    }
    this.setState(filterUpdates(updates))
  },

  render() {
    var items = (this.props.type === 'comments' ? this.state.comments : this.state.stories)
    if (items.length === 0) {
      return <StyledUpdates loading><Spinner size="20"/></StyledUpdates>
    }

    var page = pageCalc(this.getPageNumber(), ITEMS_PER_PAGE, items.length)

    if (this.props.type === 'comments') {
      return <CommentUpdates>
        {items.slice(page.startIndex, page.endIndex).map(function(comment) {
          return <DisplayComment key={comment.id} id={comment.id} comment={comment}/>
        })}
        <Paginator route="newcomments" page={page.pageNum} hasNext={page.hasNext}/>
      </CommentUpdates>
    }
    else {
      return <ItemUpdates>
        <ItemsList start={page.startIndex + 1}>
          {items.slice(page.startIndex, page.endIndex).map(function(item) {
            return <DisplayListItem key={item.id} item={item}/>
          })}
        </ItemsList>
        <Paginator route="newest" page={page.pageNum} hasNext={page.hasNext}/>
      </ItemUpdates>
    }
  }
})

module.exports = Updates
