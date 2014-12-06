var React = require('react');
var Bobble = require('./bobble');

var Hero = React.createClass({
  render: function() {
    return (
      <div>
        <h2>How reactionary!</h2>
        <p>Sweeeeet!!!!! {this.props.name}</p>
        <Bobble/>
      </div>
    );
  }
});
                                                                                   
module.exports = Hero;
