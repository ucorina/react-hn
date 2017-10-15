import React from 'react';

import { storiesOf } from '@storybook/react';

import Spinner from '../src/Spinner';
import '../public/css/style.css';

storiesOf('Spinner', module)
    .add('simple', () => <Spinner/>)
    .add('custom size', () => <Spinner size='20'/>)
