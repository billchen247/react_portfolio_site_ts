// -----------------------------------------------------------------------------
// main.jsx — the app's entry point.
// Author: Bill Chen
//
// The browser loads index.html, which contains <div id="root"></div> and a
// <script src="/src/main.jsx"> tag. Vite compiles this JSX file into plain
// JavaScript and runs it. Everything you see on the page starts here.
// -----------------------------------------------------------------------------

// `React` is imported because JSX (the HTML-in-JS syntax) compiles into
// React.createElement(...) calls behind the scenes.
import React from 'react';

// `ReactDOM` is the "React on the web" bridge — it knows how to take React
// components and mount them into an actual DOM node in the browser.
import ReactDOM from 'react-dom/client';

// `BrowserRouter` sets up client-side routing using the browser's History API,
// so navigating between pages (e.g. Home → About) never triggers a full reload.
import { BrowserRouter } from 'react-router-dom';

// The top-level App component and the global stylesheet.
import App from './App.jsx';
import './styles/index.css';

// Vite exposes the deploy base path as `import.meta.env.BASE_URL`. It always
// ends with a slash ("/" or "/repo-name/"), but react-router's `basename`
// must NOT end with a slash — so we strip the trailing "/" here. The
// `|| '/'` fallback covers the case where BASE_URL is exactly "/".
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

// createRoot() is the React 18 way of mounting an app. It finds <div id="root">
// in index.html and hands React ownership of everything inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> is a dev-only wrapper. It intentionally double-invokes
  // certain lifecycles so bugs like impure renders or stale effects show up
  // early. It has no effect on the production build.
  <React.StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
