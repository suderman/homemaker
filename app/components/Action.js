var _ = require('lodash');
var util = require('app/lib/util');
var React = require('react');
var InputSelect = require('app/components/InputSelect');
var ButtonConfirm = require('app/components/ButtonConfirm');
var { Panel, Input, Label, Button, Glyphicon } = require('react-bootstrap');

var init = { item: { id: 0, name: '/', node_id: 0, node: {}, command: '', feedback: ''  }, nodeTree: [], allNodes: [], commands: [], responders: [], isNew: false };

var Action = React.createClass({
  mixins: [require('app/components/mixins/route')],

  getInitialState: function() {
    return this.props.state || init;
  },

  render: function() {
    var component = this;

    var action = this.state.item || init.item,
        node = this.state.item.node || init.item.node,
        commands = this.state.commands || init.commands,
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

    var chooser = {
      labelClassName:   "col-sm-2",
      wrapperClassName: "col-sm-10",

      options: commands,
      defaultValue: 'chooser',

      onChange: function(event) {
        var command = util.parseJSON(event.target.value);
        console.log(command);
        if (!command.error) {
          var item = _.clone(component.state.item);
          item.command = command.command;
          item.feedback = command.feedback;
          component.setState({ item:item });
          item = null;
        }
      },

      onFocus:  this.cacheItem,
      onBlur:   this.saveItem
    };

    var path = [action.name || ''];
    var foundNode = { node_id: _.parseInt(action.node_id) };
    while(foundNode.node_id != 0) {
      foundNode = _.find(allNodes, {id: _.parseInt(foundNode.node_id)}) || { name: '/', node_id: 0 };
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
            <InputSelect name="responder_id" label="Responder" data-update="true" value={action.responder_id} options={responders} {...input}/>
            <InputSelect name="chooser" label="Chooser" data-update="true" {...chooser}/>
            <Input type="textarea" name="command" label="Command" value={action.command} {...input}/>
            <Input type="text" name="feedback" label="Feedback" value={action.feedback} {...input}/>
          </form>
          {(isNew) || <ButtonConfirm href={backHref} onClick={this.removeItem} confirm="Confirm Delete">Delete</ButtonConfirm>}
        </Panel>
      </div>
    );

  }
});

module.exports = Action;
