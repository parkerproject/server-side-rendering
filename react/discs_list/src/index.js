/*eslint-disable import/default */ 
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import {loadDiscs} from './actions/discActions';
import './styles/styles.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);
store.dispatch(loadDiscs());

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('app')
);