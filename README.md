homemaker
========

API maker for my home automation devices.

### Usage

The idea is to issue home automation commands to devices like iTach WF2IR, 
ISY-994i, or desktop computers with HTTP GET requests, in a unified way. 

The structure of the requests can be designed in a hierachy that
resembles the home's actual layout, instead of the confusing mess that
results when mixing difference device APIs.

#### For example:

`http://api.homeserver.com/bedroom/lamp`  <-- returns current status 
`http://api.homeserver.com/bedroom/lamp/on` <-- turns on lamp
`http://api.homeserver.com/den/screen/down`  <-- lowers screen
`http://api.homeserver.com/macpro/wake` <-- wake up my desktop

### Supported Hardware/Software

 - ISY-994i (Insteon devices)
 - iTach (infrared)
 - Keyboard Maestro for OS X
 - Remote Mapper for OS X
 - HTTP Server (generic)

### To Do:

 - Still a work-in-progress.
