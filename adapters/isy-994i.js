var _ = require('underscore');
var Promise = require('bluebird');
var xml2js = Promise.promisify(require('xml2js').parseString);
// var jsdom = Promise.promisify(require('jsdom').env);

// Adapter Gateway
var gateway = require('./adapter').addGateway('ISY-994i', {
  protocol: 'http',
  port:     '80',
  // path:     '/rest',
  path:     '/',

  response: function(response) {
    // xml2js(text).then(function(json) {
    //   console.log("json: " + JSON.stringify(json));
    // }).catch(function(error) {
    //   console.log("text: " + text);
    // });
    return "This: " + response;
  }

}); 

// Adapter Responder
gateway.addResponder('ISY-994i Insteon', {

  address_options: null,
  address_options_lookup: '/rest/nodes',
  command_options_lookup: null,
  status_lookup: '/rest/status/ADDRESS',

  addresses: function(gateway) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?><programs><program id="0001" status="true" folder="true"><name>My Programs</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0006" parentId="0001" status="true" folder="true"><name>wall-remote</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0014" parentId="0001" status="true" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Garage Close</name><lastRunTime>2014/11/17  9:08:16 AM</lastRunTime><lastFinishTime>2014/11/17  9:08:16 AM</lastFinishTime></program><program id="0013" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Garage Open</name><lastRunTime>2014/11/17  9:08:16 AM</lastRunTime><lastFinishTime>2014/11/17  9:08:16 AM</lastFinishTime></program>';
    xml += '<program id="0002" parentId="0001" status="true" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Query All</name><lastRunTime>2014/11/17  3:00:00 AM</lastRunTime><lastFinishTime>2014/11/17  3:00:00 AM</lastFinishTime><nextScheduledRunTime>2014/11/18  3:00:00 AM</nextScheduledRunTime></program><program id="0012" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>CC Remote A</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0010" parentId="0001" status="false" folder="false" enabled="false" runAtStartup="false" running="idle"><name>Morning</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime><nextScheduledRunTime>2014/11/18  7:00:00 AM</nextScheduledRunTime></program><program id="0003" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Test</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0004" parentId="0001" status="false" folder="false" enabled="false" runAtStartup="false" running="idle"><name>Turn off LCD</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program></programs>';

    var message = "/rest/nodes";
    return gateway.send(message).then(function(res) {
      return xml2js(res.body);
    }).then(function(xml) {
      return xml;
    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/nodes/" + address.replace(/\./g, '%20') + "/cmd/" + command;
  }
});

// Adapter Responder
gateway.addResponder('ISY-994i Program', {

  address_options: null,
  address_options_lookup: '/rest/programs',
  command_options_lookup: null,
  status_lookup: '/rest/programs/ADDRESS',

  addresses: function(gateway) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?><programs><program id="0001" status="true" folder="true"><name>My Programs</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0006" parentId="0001" status="true" folder="true"><name>wall-remote</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0014" parentId="0001" status="true" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Garage Close</name><lastRunTime>2014/11/17  9:08:16 AM</lastRunTime><lastFinishTime>2014/11/17  9:08:16 AM</lastFinishTime></program><program id="0013" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Garage Open</name><lastRunTime>2014/11/17  9:08:16 AM</lastRunTime><lastFinishTime>2014/11/17  9:08:16 AM</lastFinishTime></program>';
    xml += '<program id="0002" parentId="0001" status="true" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Query All</name><lastRunTime>2014/11/17  3:00:00 AM</lastRunTime><lastFinishTime>2014/11/17  3:00:00 AM</lastFinishTime><nextScheduledRunTime>2014/11/18  3:00:00 AM</nextScheduledRunTime></program><program id="0012" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>CC Remote A</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0010" parentId="0001" status="false" folder="false" enabled="false" runAtStartup="false" running="idle"><name>Morning</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime><nextScheduledRunTime>2014/11/18  7:00:00 AM</nextScheduledRunTime></program><program id="0003" parentId="0001" status="false" folder="false" enabled="true" runAtStartup="false" running="idle"><name>Test</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program><program id="0004" parentId="0001" status="false" folder="false" enabled="false" runAtStartup="false" running="idle"><name>Turn off LCD</name><lastRunTime></lastRunTime><lastFinishTime></lastFinishTime></program></programs>';

    var message = "/rest/programs";
    return gateway.send(message).then(function(res) {
      return xml2js(res.body);
    }).then(function(xml) {
      return xml;
    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/programs/" + address + "/" + command;
  }
});

// Adapter Responder
gateway.addResponder('ISY-994i Networking', {

  addresses: function(gateway) {
    return Promise.resolve({
      'Wake-on-LAN': 'wol',
      'Network Resource': 'resources'
    });
  },

  commands: function(gateway, address) {
    var message = "/rest/networking/" + address;
    return gateway.send(message).then(function(response) {
      return response;
    }).catch(function(error) {
      return {};
    });
  },

  message: function(command, address) {
    return "/rest/networking/" + address + "/" + command;
  }
});

// Export adapter
module.exports = gateway;
