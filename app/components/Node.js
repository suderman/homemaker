var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var N0deList = require('app/components/NodeList');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var N0de = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || { item: {}, nodes: [], allNodes: [], actions: [], responders: [] };
  },

  render: function() {

    var { nodes, allNodes, actions, responders, isNew } = this.state;
    allNodes.unshift({ id: 0, name: '(none)' });
    var node = this.state.item;
    console.log(nodes)

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };

    var backHref = (node.node_id) ? `/homemaker/nodes/${node.node_id}` : '/homemaker/nodes';
    var backText = (node.node_id) ? 'Back to Node' : 'Back to Nodes';
    var backButton = <Button href={backHref} onClick={this.go}>{backText}</Button>;

    // <Glyphicon glyph="folder-cog"/>
    var header = (
      <h4>
        {backButton}
        <strong><Glyphicon glyph="folder-open"/>{node.name}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="node">
        <Panel header={header}>
          <form className="form-horizontal">
            <InputSelect name="node_id" label="Parent Node" value={node.node} options={allNodes} {...input}/>
            <Input type="text" name="name" label="Name" value={node.name} {...input}/>
            <Input type="text" name="status" label="Status" value={node.status} {...input}/>
            // <InputSelect name="status_responder_id" label="Status Responder" value={node.status_responder_id} options={responders} {...input}/>
            // <InputSelect name="last_action_id" label="Last Action" value={node.last_action_id} options={actions} {...input}/>
          </form>
          {(isNew) || <Button bsStyle="danger" href="/homemaker/node" onClick={this.removeItem}>Delete</Button>}
        </Panel>
        {(isNew) || <N0deList nodeId={node.id} nodes={nodes} />}
      </div>
    );

  }
});

module.exports = N0de;
