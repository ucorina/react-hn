import React from 'react';
import { MemoryRouter } from 'react-router';
import { addDecorator } from '@storybook/react';

import { storiesOf } from '@storybook/react';

import Spinner from '../src/Spinner';
import App from '../src/App';
import Settings from '../src/Settings';

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