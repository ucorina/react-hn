var styled = require('styled-components').default;;

const commentSpacing = {
    paddingRight: '1.25em',
    paddingTop: '.65em',
    paddingBottom: '.65em',
    paddingLeft: {
        0: '1.25em',
        1: '3.75em',
        2: '6.25em',
        3: '8.75em',
        4: '11.25em',
        5: '13.75em',
        6: '16.25em',
        7: '18.75em',
        8: '21.25em',
        9: '23.75em',
        10: '26.25em',
        11: '28.75em',
        12: '31.25em',
        13: '33.75em',
        14: '36.25em',
        15: '38.75em'
    }
};

const CommentContent = styled.div`
    padding-right: ${props => commentSpacing.paddingRight};
    padding-top: ${props => commentSpacing.paddingTop};
    padding-bottom: ${props => commentSpacing.paddingBottom};
`;

const CommentText = styled.div`
    a {
        color: #000;

        &:visited {
            color: #666;
        }
    }

    p:last-child, 
    pre:last-child {
        margin-bottom: 0;
    }
`;


const CommentMeta = styled.div`
    color: #666;
    margin-bottom: .5em

    a {
        text-decoration: none;
        color: inherit;

        &:hover {
            text-decoration: underline;
        }
    }

    em {
        font-style: normal;
        background-color: #ffffde;
        color: #000;
    }
`;

const CommentKids = styled.div``;

var propTypes = {
    loading: true,
    isNew: true,
    level: 1,
    collapsed: true,
    deleted: false,
    error: false
};
const StyledComment = styled.div`
  padding-right: ${props => props.loading ? commentSpacing.paddingRight : ''};
  padding-top: ${props => props.loading ? commentSpacing.paddingTop : ''};
  padding-bottom: ${props => props.loading ? commentSpacing.paddingBottom : ''};
  padding-left: ${props => props.loading ? commentSpacing.paddingLeft[props.level] : ''};

  > ${CommentContent} {
    background-color: ${props => props.isNew ? '#ffffde' : ''}
    padding-left: ${props => commentSpacing.paddingLeft[props.level]}

    > ${CommentText} {
        color: ${props => props.dead ? '#ddd !important' : ''}
    }
  } 

  ${CommentText},
  > ${CommentKids} {
    display: ${props => props.collapsed ? 'none' : ''};
  }

  ${CommentMeta} {
      color: ${props => props.error ? '#f33' : ''}
  }

`;

const CommentUser = styled.a`
    font-weight: bold;
`;

const CommentCollapse = styled.span`
    cursor: pointer;
`;

const StyledPermalinkedComment = styled(StyledComment)`
    > ${CommentContent} {
        margin-bottom: 1em;
    }
`;

exports.StyledComment = StyledComment;
exports.CommentContent = CommentContent;
exports.CommentCollapse = CommentCollapse;
exports.CommentMeta = CommentMeta;
exports.CommentKids = CommentKids;
exports.CommentText = CommentText;
exports.CommentUser = CommentUser;
exports.StyledPermalinkedComment = StyledPermalinkedComment;