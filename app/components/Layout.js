var React = require('react');
var { Row, Grid } = require('react-bootstrap');
var Navigation = require('app/components/Navigation');

var Layout = React.createClass({

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
