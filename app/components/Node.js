var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var N0deList = require('app/components/NodeList');
var ActionList = require('app/components/ActionList');
var ButtonConfirm = require('app/components/ButtonConfirm');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var init = { item: { id: 0, name: '/', node_id: 0 }, nodes: [], nodeTree: [], allNodes: [], actions: [], responders: [], isNew: false };

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
        nodeTree = this.state.nodeTree || init.nodeTree,
        allNodes = this.state.allNodes || init.allNodes;
    var isNew = this.state.isNew || init.isNew;

    var input = {
      onFocus:          this.cacheItem,
      onChange:         this.setItem,
      onBlur:           this.saveItem,
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10"
    };

    var path = [node.name];
    var foundNode = { node_id: node.node_id };
    while(foundNode.node_id != 0) {
      foundNode = _.find(allNodes, {id: foundNode.node_id}) || { name: '/', node_id: 0 };
      path.unshift(foundNode.name);
    }

    var backHref = (node.node_id) ? `/homemaker/nodes/${node.node_id}` : '/homemaker/nodes';
    var backText = (node.node_id) ? 'Back to Node' : 'Back to Nodes';
    var backButton = <Button href={backHref} onClick={this.go}>{backText}</Button>;

    var header = (
      <h4>
        {backButton}
        <strong><Glyphicon glyph="folder-open"/>{path.join(' / ')}</strong>
        <div className="clear"/>
      </h4>
    );

    var nodeList = (isNew) ? ''   : <N0deList nodeId={node.id} nodes={nodes}/>;
    var actionList = (isNew) ? '' : <ActionList nodeId={node.id} actions={actions}/>;

    return (
      <div className="node">
        <Panel header={header}>
          <form className="form-horizontal">
            <InputSelect name="node_id" label="Parent" value={node.node_id} options={nodeTree} children="nodes" disabled={node.id} {...input}/>
            <Input type="text" name="name" label="Name" value={node.name} {...input}/>
            <Input type="text" name="status" label="Status" value={node.status} {...input}/>
            // <InputSelect name="status_responder_id" label="Status Responder" value={node.status_responder_id} options={responders} {...input}/>
            // <InputSelect name="last_action_id" label="Last Action" value={node.last_action_id} options={actions} {...input}/>
          </form>
          {(isNew) || <ButtonConfirm href={backHref} onClick={this.removeItem} confirm="Confirm Delete">Delete</ButtonConfirm>}
        </Panel>
        {(actions.length > nodes.length) ? actionList : nodeList}
        {(actions.length > nodes.length) ? nodeList : actionList}
      </div>
    );

  }
});

module.exports = N0de;
