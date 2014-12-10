var React = require('react');
var Input = require('react-bootstrap/Input');

var GatewayTypeInput = React.createClass({

  getInitialState: function() {
    return { value: this.props.value || null };
  },

  getValue: function() {
    return this.refs['input'].getValue();
  },

  render: function() {
    var { label, options, ...other } = this.props;

    // Handler for gateway type select box
    var value = this.state.value;
    var handleChange = function(e) {
      this.setState({
        value: this.getValue()
      });
    }.bind(this);

    return (
      <Input {...other} type="select" ref="input" label={label} value={value} onChange={handleChange}>
        {options.map(function(type) {
          return <option key={type} value={type}>{type}</option>
        })}
      </Input>
    );
  }
});

module.exports = GatewayTypeInput;
