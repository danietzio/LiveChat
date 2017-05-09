import React from 'react';
import ReactDOM from 'react-dom';

// import components
import Layout from './layouts/layout.js';

// render React components inside of the root div
ReactDOM.render(
    <Layout />,
    document.getElementById("root"),
    function() {
      console.log("root Compnonet rendered!!!");
    }
);
