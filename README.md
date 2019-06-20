# node-red-contrib-insteon-lan

Nodes to control x10 and lamplinc modules with the insteon hub 
you need to enter the hubs ip,port,username,password into the nodes config page

# Nodes
x10 control	-Send commands to x10 modules thru hub <br/>
lampling control -Send commands to lamplinc modules thru hub<br/>
get buffer	-Read current buffer from the hub <br/>
clear buffer	-clears the buffer <br/>

## x10 Example

```json

[{"id":"4f8f7694.2c2c88","type":"X10-control","z":"d4e44002.60188","name":"","hubip":"","hubport":"","hubuser":"","hubpass":"","x":370,"y":180,"wires":[[]]},{"id":"6edddf08.05c01","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"housecode\":\"b\",\"unitcode\":\"9\",\"command\":\"OFF\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":170,"y":180,"wires":[["4f8f7694.2c2c88"]]}]
```

## lamplinc Example

```json
[{"id":"721c5288.0e470c","type":"Lamplinc-control","z":"d4e44002.60188","name":"","hubip":"","hubport":"","hubuser":"","hubpass":"","x":390,"y":360,"wires":[[]]},{"id":"e1768803.2da0d8","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":200,"y":360,"wires":[["721c5288.0e470c"]]}]
```

## miniremote Example

```json
[{"id":"e8230ccc.0ea3f","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":170,"y":280,"wires":[["73297d2f.ea98c4"]]},{"id":"73297d2f.ea98c4","type":"Get-buffer","z":"f8c97fa4.80721","name":"","hubip":"","hubport":"25105","hubuser":"","hubpass":"","x":350,"y":260,"wires":[["a94a3e85.0eb6b","6aeaeb83.caa794"]]},{"id":"ed08274.75b12d8","type":"delay","z":"f8c97fa4.80721","name":"","pauseType":"delay","timeout":"1","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":500,"y":320,"wires":[["73297d2f.ea98c4"]]},{"id":"a94a3e85.0eb6b","type":"function","z":"f8c97fa4.80721","name":"","func":"//the buffer formating is \"message type \tremote id\t\tbutton id\t\tCMD1\tCMD2\"\n//0250 is the message type sent from the remote\nvar remoteid=\"2E7A10\"//on the back of the remote\nvar messagelength=22\nvar start=0;\nvar string=msg.payload\nvar loop=true\nvar message=\"\"\nvar mcount=0\nvar newmsg\n\nwhile(loop){\n    var foundat=string.indexOf(\"0250\",start)\n    start=foundat+1\n    if(foundat+messagelength<=string.length&&foundat!=-1){//if found message type\n        message=string.substr(foundat, messagelength)\n        if(message.indexOf(remoteid,4)==4){//if the next thing is remote id \n            if(message.indexOf(\"00000\",10)==10){//button id starts with 00000\n                var button=parseInt(message.charAt(15))\n                var command=commandlookup(parseInt(message.charAt(18)+message.charAt(19)),parseInt(message.charAt(20)+message.charAt(21)))\n                var newmsg={\"button\":button,\"command\":command}\n            }\n        }\n    }else{\n        loop=false\n        node.send([{payload:newmsg},null])\n    }\n}\n\nfunction commandlookup(cmd1,cmd2){\n    var out=\"\"\n    // node.warn(cmd2)\n    switch(cmd1){\n        case 11:\n            out=\"on\"\n        break;\n        case 13:\n            out=\"off\"\n        break;\n        case 17:\n            if(cmd2==0){\n                out=\"dim\"    \n            }\n            if(cmd2==1){\n                out=\"bright\"\n            }\n        break;\n        case 18:\n            out=\"stop\"\n        break;        \n    }    \n    node.warn(out)\n    return out\n}\nreturn [null,{payload:\"done\"}];\n\n\n\n","outputs":2,"noerr":0,"x":530,"y":260,"wires":[["257131c1.71bd3e"],["ed08274.75b12d8"]]},{"id":"257131c1.71bd3e","type":"switch","z":"f8c97fa4.80721","name":"","property":"payload.button","propertyType":"msg","rules":[{"t":"eq","v":"1","vt":"num"},{"t":"eq","v":"2","vt":"num"},{"t":"eq","v":"3","vt":"num"},{"t":"eq","v":"4","vt":"num"}],"checkall":"true","repair":false,"outputs":4,"x":670,"y":260,"wires":[["f15d93e8.6051e","b82be2b.ce6802"],["f15d93e8.6051e","b82be2b.ce6802"],["f15d93e8.6051e","b82be2b.ce6802"],["f15d93e8.6051e","b82be2b.ce6802"]]},{"id":"b82be2b.ce6802","type":"Clear-buffer","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"Althalos","hubpass":"BUZAS1XZ","x":810,"y":140,"wires":[[]]},{"id":"f15d93e8.6051e","type":"debug","z":"f8c97fa4.80721","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":990,"y":220,"wires":[]}]
```
