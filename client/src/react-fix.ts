
// This file MUST be imported before any React imports
// It ensures only one copy of React exists in the application

import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore - Force global React instance
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDOM;
}

export default React;
