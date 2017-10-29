import React from 'react';
import { MemoryRouter } from 'react-router';
import { addDecorator } from '@storybook/react';

import { storiesOf } from '@storybook/react';

import Spinner from '../src/Spinner';
import App from '../src/App';
import Settings from '../src/Settings';
import Stories from '../src/Stories';
import { Items, ItemsList, ListItem, ListItemNewComments } from '../src/Items';
import Updates from '../src/Updates';

import UpdatesStore from '../src/stores/UpdatesStore';
UpdatesStore.loadSession();

import '../public/css/style.css';

storiesOf('Spinner', module)
    .add('default', () => <Spinner/>)
    .add('custom size', () => <Spinner size='20'/>)

storiesOf('App', module)
    .add('default', () => (
        <App params={{ prebootHTML: '' }} />
    ))

storiesOf('Settings', module)
    .add('default', () => (
        <Settings key="test"/>
    ))


var Jobs = React.createClass({
    render() {
      return <Stories 
                key={'jobs'} 
                route={'jobs'}
                type={'jobsstories'} 
                limit={100} 
                location={{ query: { page: 1 }}}
                title={'Jobs'}/>
    }
  })
storiesOf('Stories', module)
    .add('default', () => (<Jobs />))

storiesOf('Items', module)
    .add('default', () => <Items><ul><li>One item</li></ul></Items>)
    .add('loading', () => <Items loading><ul><li>One item</li></ul></Items>)

storiesOf('Items list', module)    
    .add('default', () => <ItemsList><li>One item</li></ItemsList>)
    .add('loading', () => <ItemsList loading><li>One item</li></ItemsList>)

storiesOf('List item', module)
    .add('default', () => <ListItem>Hello World</ListItem>)
    .add('loading', () => <ListItem loading>I am loading</ListItem>)
    .add('dead', () => <ListItem dead>I am dead</ListItem>)
    .add('with comments', () => 
        <ListItem>
            Hello world 
            <ListItemNewComments>
                <a href='#'>3 new</a>
            </ListItemNewComments>
        </ListItem>
    )

storiesOf('Updates', module)
    .add('default', () =>  
        <Updates key={'jobs'} type={'jobs'} location={{ query: { page: 1 }}}/>)