var _ = require('lodash');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ButtonConfirm = require('app/components/ButtonConfirm');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var init = { item: { id: 0, name: '/', node_id: 0, node: {} }, nodeTree: [], allNodes: [], commands: [], responders: [], isNew: false };

var Action = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || init;
  },

  render: function() {

    var action = this.state.item || init.item,
        node = this.state.item.node || init.item.node,
        commands = this.state.commands || init.nodes,
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

    var path = [action.name || ''];
    var foundNode = { node_id: _.parseInt(action.node_id) };
    while(foundNode.node_id != 0) {
      foundNode = _.find(allNodes, {id: _.parseInt(foundNode.node_id)}) || { name: '/', node_id: 0 };
      console.log(foundNode)
      path.unshift(foundNode.name);
    }

    var backHref = (action.node_id) ? `/homemaker/nodes/${action.node_id}` : '/homemaker/nodes';
    var backText = (action.node_id) ? 'Back to Node' : 'Back to Nodes';
    var backButton = <Button href={backHref} onClick={this.go}>{backText}</Button>;

    var header = (
      <h4>
        {backButton}
        <strong><Glyphicon glyph="cog"/>{path.join(' / ')}</strong>
        <div className="clear"/>
      </h4>
    );

    return (
      <div className="node">
        <Panel header={header}>
          <form className="form-horizontal">
            <InputSelect name="node_id" label="Parent" value={action.node_id} options={nodeTree} children="nodes" disabled={action.id} {...input}/>
            <Input type="text" name="name" label="Name" value={action.name} {...input}/>
            <InputSelect name="responder_id" label="Responder" value={action.responder_id} options={responders} {...input}/>
            // <InputSelect name="last_action_id" label="Last Action" value={node.last_action_id} options={actions} {...input}/>
          </form>
          {(isNew) || <ButtonConfirm href={backHref} onClick={this.removeItem} confirm="Confirm Delete">Delete</ButtonConfirm>}
        </Panel>
      </div>
    );

  }
});

module.exports = Action;
