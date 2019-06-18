# node-red-contrib-insteon-lan

Nodes to control x10 and lamplinc modules with the insteon hub 
you need to enter the hubs ip,port,username,password into the nodes config page



## x10 Example

```json

[{"id":"242d432.d2174bc","type":"X10-control","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"user","hubpass":"pass","x":610,"y":380,"wires":[["c056af8.5bfbf5","966c9ab2.7f0518"]]},{"id":"cc6ad5d0.da8498","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"housecode\":\"b\",\"unitcode\":\"9\",\"command\":\"OFF\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":410,"y":380,"wires":[["242d432.d2174bc","6c142a3d.cf64f4"]]}]

```

## lamplinc Example

```json

[{"id":"ba2e0013.310b7","type":"Lamplinc-control","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"Althalos","hubpass":"BUZAS1XZ","x":400,"y":180,"wires":[["417c0bf3.5ccb14","11f72ab8.909b25"]]},{"id":"59bf7ba3.a0ecd4","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"deviceid\":\"2E3AE9\",\"brightness\":\"255\",\"command\":\"off\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":210,"y":180,"wires":[["ba2e0013.310b7"]]}]

```
