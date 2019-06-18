# node-red-contrib-insteon-lan

Nodes to control x10 modules from the insteon hub 
you need to enter the hubs ip,port,username,password into the nodes config page

i will add insteon lamplinc modules 

## Example

```json

[{"id":"242d432.d2174bc","type":"X10-control","z":"f8c97fa4.80721","name":"","hubip":"192.168.1.24","hubport":"25105","hubuser":"user","hubpass":"pass","x":610,"y":380,"wires":[["c056af8.5bfbf5","966c9ab2.7f0518"]]},{"id":"cc6ad5d0.da8498","type":"inject","z":"f8c97fa4.80721","name":"","topic":"","payload":"{\"housecode\":\"b\",\"unitcode\":\"9\",\"command\":\"OFF\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":410,"y":380,"wires":[["242d432.d2174bc","6c142a3d.cf64f4"]]}]

```
