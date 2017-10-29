var React = require('react')
var Link = require('react-router/lib/Link')

import styled from 'styled-components';

var StyledPaginator = styled.div`
  margin-left: 3em;
  padding: .5em 0;

  a {
    font-weight: bold;
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

var NextPage = styled.span``;
var PreviousPage = styled.span``;

var Paginator = React.createClass({
  _onClick(e) {
    setTimeout(function() { window.scrollTo(0, 0) }, 0)
  },

  render() {
    if (this.props.page === 1 && !this.props.hasNext) { return null }
    return <StyledPaginator>
      {this.props.page > 1 && <PreviousPage>
        <Link to={{pathname: `/${this.props.route}`, query: {page: this.props.page - 1}}} onClick={this._onClick}>Prev</Link>
      </PreviousPage>}
      {this.props.page > 1 && this.props.hasNext && ' | '}
      {this.props.hasNext && <NextPage>
        <Link to={{pathname: `/${this.props.route}`, query: {page: this.props.page + 1}}} onClick={this._onClick}>More</Link>
      </NextPage>}
    </StyledPaginator>
  }
})

module.exports = Paginator
