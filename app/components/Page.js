var React = require('react');

var Page = React.createClass({ 
  render: function() { 
    return <div>Page - {this.props.name}</div>; 
  } 
});

module.exports = Page;
