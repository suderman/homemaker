var _ = require('lodash');
var React = require('react');
var Input = require('react-bootstrap').Input;

var InputSelect = React.createClass({

  getValue: function() {
    return this.refs['input'].getValue();
  },

  render: function() {

    var { label, name, value, options, disabled, onChange, children, ...other } = this.props;
    disabled = (!disabled) ? [] : (!_.isArray(disabled)) ? [disabled] : disabled;
    children = children || null;
    var allOptions = [];

    function makeOptions(options, prefix = '', disableChildren = false) {

      _(options).forEach(function(type) {
        var optionName = type, optionValue = type;

        if (_.isObject(type)) {
          [optionName, optionValue] = [type.name, type.id];
          var childOptions = ((type[children]) && (type[children].length)) ? type[children] : false;
        }
        
        if ((prefix) && (prefix != '/')) optionName = `${prefix} / ${optionName}`;
        var optionDisabled = (disableChildren) ? true : _.contains(disabled, optionValue) ? true : false;

        var attributes = {
          key: optionValue,
          value: optionValue,
          selected: (value == optionValue),
          disabled: optionDisabled
        }

        allOptions.push(<option {...attributes}>{optionName}</option>)

        if (childOptions) makeOptions(childOptions, optionName, optionDisabled);
      }).value();
    }

    // If options is object with keys, make optgroups
    if (_.isPlainObject(options)){
      var optGroups = [];

      _(options).forEach((value, key) => {
        allOptions = [];
        makeOptions(value);
        optGroups.push(<optgroup key={key} label={key}>{_.clone(allOptions)}</optgroup>);
      }).value();

      allOptions = optGroups;

    // If it's an array, skip making optgroups
    } else {
      makeOptions(options);
    }

    return (
      <Input {...other} type="select" ref="input" label={label} name={name} value={value} onChange={onChange}>
        {allOptions}
      </Input>
    );
  }
});

module.exports = InputSelect;
