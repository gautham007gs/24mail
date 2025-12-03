
import React from 'react';
import ReactDOM from 'react-dom';

// Force all React imports to use the same instance
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

export { React, ReactDOM };
