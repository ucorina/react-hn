var React = require('react')

var SettingsStore = require('./stores/SettingsStore')

var CommentMixin = require('./mixins/CommentMixin')

var StyledCommentModule = require('./StyledComment');
let { StyledComment, CommentContent } = StyledCommentModule;

/**
 * Displays a standalone comment passed as a prop.
 */
var DisplayComment = React.createClass({
  mixins: [CommentMixin],

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      op: {},
      parent: {type: 'comment'}
    }
  },

  componentWillMount() {
    this.fetchAncestors(this.props.comment)
  },

  render() {
    if (this.props.comment.deleted) { return null }
    if (this.props.comment.dead && !SettingsStore.showDead) { return null }

    var comment = this.props.comment

    return <StyledComment level={0} dead={comment.dead}>
      <CommentContent>
        {this.renderCommentMeta(comment, {
          link: true,
          parent: !!this.state.parent.id && !!this.state.op.id && comment.parent !== this.state.op.id,
          op: !!this.state.op.id
        })}
        {this.renderCommentText(comment, {replyLink: false})}
      </CommentContent>
    </StyledComment>
  }
})

module.exports = DisplayComment
