var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Glyphicon } = require('react-bootstrap');

var ActionList = React.createClass({
  mixins: [require('app/components/mixins/go')],

  getDefaultProps: function () {
    return {
      actions: [],
      nodeId: 0,
      confirm: 'Confirm Submit',
      onClick: function(e) { e.preventDefault(); e.target.blur(); }
    };
  },

  render: function() {
    var actions = _(this.props.actions);
    var newPath = '/homemaker/nodes/' + this.props.nodeId + '/actions/new';
    var go = this.go;

    var header = (
      <h4>
        <strong>Actions</strong>
      </h4>
    );

    return (
      <div className="action-list">
        <Panel header={header}>
        <ListGroup>

          {actions.map(function(action) {
            return (
              <ListGroupItem key={action.name + action.id} className="action">
                <a href={'/homemaker/actions/' + action.id} onClick={go}>
                  <Glyphicon glyph="cog"/>
                  <span>{action.name}</span>
                </a>
              </ListGroupItem>
            );
          }).value()}

          <ListGroupItem key='new' className="cog new">
            <a href={newPath} onClick={go}>
              <Glyphicon glyph="plus"/>
              <span>Add New Action</span>
            </a>
          </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = ActionList;
