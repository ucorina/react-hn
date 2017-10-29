require('setimmediate')

var React = require('react')
var {render} = require('react-dom')
var Router = require('react-router/lib/Router')
var createHashHistory = require('history/lib/createHashHistory')
var useScroll = require('react-router-scroll/lib/useScroll')
var applyRouterMiddleware = require('react-router/lib/applyRouterMiddleware')
var history = createHashHistory()

var routes = require('./routes')

const ThemeProvider = require('styled-components').ThemeProvider;
const theme = require('./src/theme').theme;

render(
    <ThemeProvider theme={theme}>
        <Router history={history} render={applyRouterMiddleware(useScroll())} routes={routes}/>
    </ThemeProvider>
, document.getElementById('app'))
