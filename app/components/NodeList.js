var _ = require('lodash');
var React = require('react');
var { Panel, ListGroup, ListGroupItem, Glyphicon } = require('react-bootstrap');

var N0deList = React.createClass({
  mixins: [require('app/components/mixins/go')],

  render: function() {
    var nodes = _(this.props.nodes);
    var newPath = '/homemaker/nodes/' + this.props.nodeId + '/nodes/new';
    var go = this.go;

    var header = (
      <h4>
        <strong>Nodes</strong>
      </h4>
    );

    return (
      <div className="node-list">
        <Panel header={header}>
        <ListGroup>

          {nodes.map(function(node) {
            return (
              <ListGroupItem key={node.name + node.id} className="node">
                <a href={'/homemaker/nodes/' + node.id} onClick={go}>
                  <Glyphicon glyph="folder-open"/>
                  <span>{node.name}</span>
                </a>
              </ListGroupItem>
            );
          }).value()}

          <ListGroupItem key='new' className="node new">
            <a href={newPath} onClick={go}>
              <Glyphicon glyph="plus"/>
              <span>Add New Node</span>
            </a>
          </ListGroupItem>

        </ListGroup>
        </Panel>
      </div>
    );
  }
});

module.exports = N0deList;
