var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var N0deList = require('app/components/NodeList');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var init = { item: {}, nodes: [], allNodes: [], actions: [], responders: [], isNew: false };

var N0de = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || init;
  },

  render: function() {

    var node = this.state.item || init.item,
        nodes = this.state.nodes || init.nodes,
        actions = this.state.actions || init.actions,
        responders = this.state.responders || init.responders,
        allNodes = this.state.allNodes || init.allNodes;
    var isNew = this.state.isNew || init.isNew;

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
            <InputSelect name="node_id" label="Parent" value={node.node_id} options={allNodes} children="nodes" disabled={node.id} {...input}/>
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
