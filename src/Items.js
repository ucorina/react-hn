import styled from 'styled-components';

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

export {
    Items,
    ItemsList,
    ListItem,
    ListItemNewComments
}