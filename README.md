# node-red-contrib-insteon-lan

Nodes to control x10 and lamplinc modules with the insteon hub 
you need to enter the hubs ip,port,username,password into the nodes config page

# Nodes
x10 control      :Send commands to x10 modules thru hub <br/>
lampling control :Send commands to lamplinc modules thru hub<br/>
get buffer       :Read the buffer of the hub (can be used for detecting button presses on the miniremote)<br/>

## x10 Example

```json

[{"id":"242d432.d2174bc","type":"X10-control","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"user","hubpass":"pass","x":610,"y":380,"wires":[["c056af8.5bfbf5","966c9ab2.7f0518"]]},{"id":"cc6ad5d0.da8498","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"housecode\":\"b\",\"unitcode\":\"9\",\"command\":\"OFF\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":410,"y":380,"wires":[["242d432.d2174bc","6c142a3d.cf64f4"]]}]

```

## lamplinc Example

```json

[{"id":"ba2e0013.310b7","type":"Lamplinc-control","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"Althalos","hubpass":"BUZAS1XZ","x":400,"y":180,"wires":[["417c0bf3.5ccb14","11f72ab8.909b25"]]},{"id":"59bf7ba3.a0ecd4","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":210,"y":180,"wires":[["ba2e0013.310b7"]]}]

```

## miniremote Example

```json
[{"id":"e8230ccc.0ea3f","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":170,"y":280,"wires":[["4aa016ea.2e2908"]]},{"id":"4aa016ea.2e2908","type":"Get-buffer","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"Althalos","hubpass":"BUZAS1XZ","x":330,"y":260,"wires":[["a94a3e85.0eb6b"]]},{"id":"ed08274.75b12d8","type":"delay","z":"f8c97fa4.80721","name":"","pauseType":"delay","timeout":"2","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":500,"y":320,"wires":[["4aa016ea.2e2908"]]},{"id":"a94a3e85.0eb6b","type":"function","z":"f8c97fa4.80721","name":"","func":"//the buffer formating is \"message type \tremote id\t\tbutton id\t\tCMD1\tCMD2\"\n//0250 is the message type sent from the remote\nvar remoteid=\"2E7A10\"//on the back of the remote\nvar messagelength=22\nvar start=0;\nvar string=msg.payload\nvar loop=true\nvar message=\"\"\nvar mcount=0\nvar newmsg\n\nwhile(loop){\n    var foundat=string.indexOf(\"0250\",start)\n    start=foundat+1\n    if(foundat+messagelength<=string.length&&foundat!=-1){//if found message type\n        message=string.substr(foundat, messagelength)\n        if(message.indexOf(remoteid,4)==4){//if the next thing is remote id \n            if(message.indexOf(\"00000\",10)==10){//button id starts with 00000\n                var button=parseInt(message.charAt(15))\n                var command=commandlookup(parseInt(message.charAt(18)+message.charAt(19)))\n                var newmsg={\"button\":button,\"command\":command}\n            }\n        }\n    }else{\n        loop=false\n        node.send([{payload:newmsg},null])\n    }\n}\n\nfunction commandlookup(command){\n    var out=\"\"\n    switch(command){\n        case 11:\n            out=\"on\"\n        break;\n        case 13:\n            out=\"off\"\n        break;\n        case 15:\n            out=\"bright\"\n        break;\n        case 16:\n            out=\"dim\"\n        break;        \n    }    \n    return out\n}\nreturn [null,{payload:\"done\"}];\n\n\n\n","outputs":2,"noerr":0,"x":530,"y":260,"wires":[["257131c1.71bd3e"],["ed08274.75b12d8"]]},{"id":"a2e22fbe.506fd","type":"comment","z":"f8c97fa4.80721","name":"enter remote id in the function node","info":"","x":500,"y":200,"wires":[]},{"id":"257131c1.71bd3e","type":"switch","z":"f8c97fa4.80721","name":"","property":"payload.button","propertyType":"msg","rules":[{"t":"eq","v":"1","vt":"num"},{"t":"eq","v":"2","vt":"num"},{"t":"eq","v":"3","vt":"num"},{"t":"eq","v":"4","vt":"num"}],"checkall":"true","repair":false,"outputs":4,"x":670,"y":260,"wires":[["1d228ed.8217771"],["4375fc49.8a83e4"],["4df862d1.4b36bc"],["caf48d89.2733f"]]},{"id":"caf48d89.2733f","type":"rbe","z":"f8c97fa4.80721","name":"","func":"rbe","gap":"","start":"","inout":"out","property":"payload.command","x":830,"y":320,"wires":[["86ce743b.56f838"]]},{"id":"4df862d1.4b36bc","type":"rbe","z":"f8c97fa4.80721","name":"","func":"rbe","gap":"","start":"","inout":"out","property":"payload.command","x":830,"y":260,"wires":[["f15d93e8.6051e"]]},{"id":"4375fc49.8a83e4","type":"rbe","z":"f8c97fa4.80721","name":"","func":"rbe","gap":"","start":"","inout":"out","property":"payload.command","x":830,"y":200,"wires":[["6afd4968.24bf88"]]},{"id":"1d228ed.8217771","type":"rbe","z":"f8c97fa4.80721","name":"","func":"rbe","gap":"","start":"","inout":"out","property":"payload.command","x":830,"y":140,"wires":[["6f880f94.4063d"]]},{"id":"6f880f94.4063d","type":"debug","z":"f8c97fa4.80721","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":970,"y":140,"wires":[]},{"id":"6afd4968.24bf88","type":"debug","z":"f8c97fa4.80721","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":970,"y":200,"wires":[]},{"id":"f15d93e8.6051e","type":"debug","z":"f8c97fa4.80721","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":970,"y":260,"wires":[]},{"id":"86ce743b.56f838","type":"debug","z":"f8c97fa4.80721","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":970,"y":320,"wires":[]}]
```
