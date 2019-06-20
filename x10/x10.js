module.exports = function(RED) {
    function X10controlNode(config) {
        RED.nodes.createNode(this,config);
	var port=config.hubport
	var ip=config.hubip
	var user=config.hubuser
	var pass=config.hubpass


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa'); 
var httpr = new XMLHttpRequest()
var httpr2 = new XMLHttpRequest()

	var housecodelookup=['6','E','2','A','1','9','5','D','7','F','3','B','0','8','4','C']
        var node = this;
        node.on('input', function(msg) {
		node.status({fill:"red",shape:"ring",text:"Input error"})

		if(msg.payload.unitcode==null){
			node.error("unitcode is null/undefined")
			return
		}
		if(msg.payload.housecode==null){
			node.error("housecode is null/undefined")
			return
		}
		if(msg.payload.command==null){
			node.error("command is null/undefined")
			return
		}
		if(msg.payload.housecode.length!=1){
			node.error("housecode length != 1")
			return
		}
		if(msg.payload.unitcode.length>2){
			node.error("unitcode >2")
			return
		}
		var housecodenum=msg.payload.housecode.toUpperCase().charCodeAt(0)-65
		if(housecodenum<0 || housecodenum>15){
			node.error("housecode not A-P")
			return
		}
		if(msg.payload.unitcode<1 ||msg.payload.unitcode>16){
			node.error("unitcode not 1-16")
			return
		}
		switch(msg.payload.command.toUpperCase()){
			case "ON":
				commandval="280"
			break;
			case "OFF":
				commandval="380"
			break;
			case "DIM":
				commandval="480"
			break;
			case "BRIGHT":
				commandval="580"
			break;
			case "ALL ON":
				commandval="180"
			break;
			case "ALL OFF":
				commandval="680"
			break;
			default:
				node.error("command not ON,OFF,DIM,BRIGHT,ALL ON,ALL OFF")
				break
			break;
		}

		var unitcodeval=housecodelookup[msg.payload.unitcode-1]
		var housecodeval=housecodelookup[housecodenum]
		var url1="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/3?0263"+housecodeval+""+unitcodeval+"00=I=3"
		var url2="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/3?0263"+housecodeval+""+commandval+"=I=3"
		node.status({fill:"yellow",shape:"ring",text:"Connecting"})
		var done=0
		msg.debug={"url1":url1,"url2":url2}
		httpr.onreadystatechange = function(){
			if(this.status==200){
				if(done==0){
					setTimeout(function(){
						httpr2.open("GET",url2)
						httpr2.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass));
						httpr2.send()
						done=1
					},1000)
				}
			}
			if(this.status==401){
				done=401
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
			}
		}


		httpr2.onreadystatechange = function(){
			if(this.status==200){
				if(done==1){
					done=2
					node.status({fill:"green",shape:"ring",text:"Complete"})
					node.send(msg)
				}
			}
			if(this.status==401){
				done=401
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
			}
		}

		httpr.open("GET",url1)
		httpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		httpr.send()

		setTimeout(function(){
			if(done==0||done==1){
    				node.status({fill:"red", shape:"ring", text:"Error connecting to hub"});
				done=-1
				node.send({payload:"timeout"})
			}
		}, 3000);


    }

    RED.nodes.registerType("X10-control",X10controlNode);
}
