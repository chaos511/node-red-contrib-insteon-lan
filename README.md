# node-red-contrib-insteon-lan

Nodes to control x10 and lamplinc modules and recieve x10 commands using the insteon hub 
you need to enter the hubs ip,port,username,password into the nodes config page

# Nodes
<br/>
## x10 control<br/>	
--Send commands to x10 modules thru hub <br/>
<br/>
<br/>
## x10 receive<br/>
--Receive x10 commands from x10 remotes<br/>
<br/>
<br/>
## mini remote receive<br/>	
--lampling control -Send commands to lamplinc modules thru hub<br/>
<br/>
<br/>
## get buffer<br/>
--Read current buffer from the hub <br/>
<br/>
<br/>
## clear buffer<br/>
--clears the buffer <br/>


## x10 send Example

```json
[{"id":"9ea63598.acd238","type":"X10-control","z":"d4e44002.60188","name":"","hub":"","x":530,"y":300,"wires":[[]]},{"id":"20f56fae.47b1d","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"housecode\":\"a\",\"unitcode\":\"11\",\"command\":\"on\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":270,"y":260,"wires":[["9ea63598.acd238"]]},{"id":"6897c682.752f08","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"housecode\":\"a\",\"unitcode\":\"11\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":270,"y":300,"wires":[["9ea63598.acd238"]]}]
```

## x10 recieve Example

```json
[{"id":"385324bf.78f9ec","type":"X10-receive","z":"d4e44002.60188","name":"","hub":"","x":270,"y":440,"wires":[["f7adb13.df5b75"]]},{"id":"f7adb13.df5b75","type":"debug","z":"d4e44002.60188","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":530,"y":440,"wires":[]}]
```

## lamplinc Example

```json
[{"id":"cd46381c.64e998","type":"Lamplinc-control","z":"d4e44002.60188","name":"","hub":"","x":550,"y":200,"wires":[[]]},{"id":"fecd195a.5bad18","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"on\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":270,"y":160,"wires":[["cd46381c.64e998"]]},{"id":"88c5e77.0641318","type":"inject","z":"d4e44002.60188","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":270,"y":200,"wires":[["cd46381c.64e998"]]}]
```

## miniremote Example

```json
[{"id":"a278e772.c73ab8","type":"Mini-remote-receive","z":"d4e44002.60188","name":"","remoteid":"","hub":"","x":300,"y":380,"wires":[["3f9c84f0.bc774c"]]},{"id":"3f9c84f0.bc774c","type":"debug","z":"d4e44002.60188","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":530,"y":380,"wires":[]}]
```
