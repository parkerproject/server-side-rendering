/*eslint-disable import/default */ 
import qs from 'qs';
import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import Inferno from 'inferno';
import open from 'open';
import { renderToString } from 'inferno-server';
import {Provider} from 'inferno-redux';
import { match, RouterContext } from 'inferno-router';
import routes from '../src/routes';
import configureStore from '../src/store/configureStore';
import {getDiscSuccess} from '../src/actions/discActions';
import {fetchDiscs} from '../src/api/DiscApiClient';
import compression from 'compression';

/* eslint-disable no-console */

const port = 3000;
const app = express();

app.use(express.static('dist'));
app.use(compression());

function handleRender(req, res) {
  const renderProps = match(routes, req.originalUrl);
  if (renderProps.redirect) {
    res.redirect(renderProps.redirect);
  } else if (renderProps) {
      
    fetchDiscs().then(discs => {
      // Compile an initial state
      let preloadedState = {};
      
      // Create a new Redux store instance
      const store = configureStore(preloadedState);
      store.dispatch(getDiscSuccess(discs));
      
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      const html = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>);
      console.log(store.getState());

      // Grab the initial state from our Redux store
      const finalState = store.getState();

      // Send the rendered page back to the client
      res.status(200).send(renderFullPage(html, finalState));   
    }).catch(error => { 
        res.status(500).send(error.message);
    });
  } else {
    res.status(404).send('Not found');
  }
}

function renderFullPage(html, preloadedState) {
 return `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Discs Test</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
        </head>
        <body>
          <div id="app">${html}</div>
          <script>
            // WARNING: See the following for Security isues with this approach:
            // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
          </script>
          <script src="/bundle.js"></script>
        </body>
      </html>
      `;
}

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}`);
        console.log('Listening to port 3000...');
    }
});