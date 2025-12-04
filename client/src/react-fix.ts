
import React from 'react';

// Ensure single React instance across the application
if (typeof window !== 'undefined') {
  (window as any).React = React;
}
