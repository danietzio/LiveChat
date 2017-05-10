import React from 'react';
import ReactDom from 'react-dom';

// import main structure of the file
import Layout from './layouts/layout.js';

ReactDom.render(
  <Layout />,
  document.getElementById("root"),
  () => console.log("Component Redered!!!")
);
