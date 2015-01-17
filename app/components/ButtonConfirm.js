var _ = require('lodash');
var React = require('react');
var { Button } = require('react-bootstrap');

var ButtonConfirm = React.createClass({
  getInitialState: function() { return { confirmed: false } },

  getDefaultProps: function () {
    return {
      href: '#',
      children: 'Submit',
      confirm: 'Confirm Submit',
      onClick: function(e) { e.preventDefault(); e.target.blur(); }
    };
  },

  render: function() {

    var button = this,
        preClick = function(e) { e.preventDefault(); button.setState({ confirmed: true }) },
        postClick = this.props.onClick;

    var text = (this.state.confirmed) ? this.props.confirm : this.props.children;

    var attributes = {
      href: this.props.href,
      onClick: (this.state.confirmed) ? postClick : preClick,
      bsStyle: (this.state.confirmed) ? 'danger' : 'default',
      onBlur: () => button.setState({ confirmed: false })
    }

    return <Button {...attributes}>{text}</Button>;
  }
});

module.exports = ButtonConfirm;
