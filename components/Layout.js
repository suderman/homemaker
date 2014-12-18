var React = require('react');
var { Row, Grid } = require('react-bootstrap');
var { Navigation } = require('../components');

var Layout = React.createClass({

  componentDidMount: function() {
    // var title = this.props.params.title || 'Untitled'
    // document.head.getElementsByTagName('title').forEach(function(title) {
    //   title.innerHTML = title;
    // });
  },

  render: function() {

    var { body, route } = this.props;

    return (
      <Grid id="app">
        <Row>
          <Navigation route={route}/>
        </Row>

        <Row id="main">
          {body}
        </Row>
      </Grid>
    );
  }
});

module.exports = Layout;
