const styled = require('styled-components');

var Items = styled.div`
    ${props => props.loading ? '' : ''}
`;

var ItemsList = styled.ol`
    padding-left: 3em;
    padding-right: 1.25em;
    margin-top: 1em;
    margin-bottom: .5em;
`;

var ListItem = styled.li`
    margin-bottom: 16px;    
    ${props => props.dead ? '' : ''}
    ${props => props.loading ? 'min-height: 34px;' : ''}
`;

var ListItemNewComments = styled.span`
    a {
        font-weight: bold;
    }
`;

var ItemTitle = styled.div`
    color: #666;
    font-size:18px;

    a {
        text-decoration: none;
        color: #000;

        &:hover {
            text-decoration: underline;
        }

        &:visited {
            color: #666;
        }
    }
`;

var ItemMeta = styled.div`
    color: #666;
    margin-bottom: 1em;

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

var ItemBy = styled.span`
    a {
        font-weight: bold;
    }
`;

var ItemHost = styled.span``;
var ItemScore = styled.span``;
var ItemTime = styled.time``;
var ItemKids = styled.div``;

exports =  {
    Items,
    ItemsList,
    ListItem,
    ListItemNewComments,
    ItemTitle,
    ItemMeta,
    ItemBy,
    ItemHost,
    ItemScore,
    ItemTime,
    ItemKids
}