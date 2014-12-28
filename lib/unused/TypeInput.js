var React = require('react');
var Input = require('react-bootstrap/Input');

var TypeInput = React.createClass({

  // getInitialState: function() {
  //   return { value: this.props.value || null };
  // },

  getValue: function() {
    return this.refs['input'].getValue();
  },

  render: function() {
    var { label, options, ...other } = this.props;

    var value = this.props.value;

    // Handler for type select box
    // var value = this.state.value;
    // var handleChange = function(e) {
    //   this.setState({
    //     value: this.getValue()
    //   });
    //   // Send new value to owner
    //   this.props.handleChange(value);
    // }.bind(this);

    return (
      <Input {...other} type="select" ref="input" label={label} value={value} onChange={this.props.handleChange}>
        {options.map(function(type) {
          return <option key={type} value={type}>{type}</option>
        })}
      </Input>
    );
  }
});

module.exports = TypeInput;
