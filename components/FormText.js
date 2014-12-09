var React = require('react');

var FormText = React.createClass({

  handleChange: function(event) {
    console.log(event.target);
  },

  render: function() {

    var { name, type, label, ...other } = this.props;
    label = this.props.label || this.props.name;
    type = this.props.type || 'text';

    return (
      <label className={name}>
        <span>{label}</span>
        <input {...other} ref="input" type={type} name={name} onChange={this.handleChange} />
      </label>
    );
  }
});

module.exports = FormText;
