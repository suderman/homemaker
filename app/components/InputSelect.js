var _ = require('underscore');
var React = require('react');
var Input = require('react-bootstrap/Input');

var InputSelect = React.createClass({

  getValue: function() {
    return this.refs['input'].getValue();
  },

  render: function() {
    var { label, name, value, options, onChange, ...other } = this.props;

    return (
      <Input {...other} type="select" ref="input" label={label} name={name} value={value} onChange={onChange}>
        {options.map(function(type) {
          var optionName = type, optionValue = type;
          if (_.isObject(type)) {
            optionName = type.name;
            optionValue = type.id;
          }
          return <option key={optionValue} value={optionValue} selected={value == optionValue}>{optionName}</option>
        })}
      </Input>
    );
  }
});

module.exports = InputSelect;
