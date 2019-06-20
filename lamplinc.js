module.exports = function(RED) {
    function lamplinccontrolNode(config) {
    RED.nodes.createNode(this,config);
	var port=config.hubport
	var ip=config.hubip
	var user=config.hubuser
	var pass=config.hubpass



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa'); 
var httpr = new XMLHttpRequest()


        var node = this;
        node.on('input', function(msg) {
		node.status({fill:"red",shape:"ring",text:"Input error"})

		if(msg.payload.deviceid==null){
			node.error("deviceid is null/undefined")
			return
		}
		if(msg.payload.brightness==null){
			node.error("brightness is null/undefined")
			return
		}
		if(msg.payload.command==null){
			node.error("command is null/undefined")
			return
		}
		if(msg.payload.deviceid.length!=6){
			node.error("deviceid length != 6")
			return
		}

		var brightnessnum=parseInt(msg.payload.brightness)

		if(brightnessnum<0 || brightnessnum>255){
			node.error("brightness not 0-255")
			return
		}
		var brightnessval=brightnessnum.toString(16).toUpperCase()
		if(brightnessval.length==1){
			brightnessval="0"+brightnessval
		}
		switch(msg.payload.command.toUpperCase()){
			case "ON":
				commandval="11"
			break;
			case "OFF":
				commandval="13"
			break;
			case "ONFAST":
				commandval="12"
			break;
			case "OFFFAST":
				commandval="14"
			break;
			case "BEEP":
				commandva="30";
			break;
			default:
				node.error("command not ON,OFF,onfast,offfast,BEEP")
				break
			break;
		}

		var url="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/3?0262"+msg.payload.deviceid+"0F"+commandval+""+brightnessval+"=I=3"
		//var url=""		
		node.status({fill:"yellow",shape:"ring",text:"Connecting"})
		var done=0
		msg.debug={"url":url}
		httpr.onreadystatechange = function(){
			if(this.status==200){
				if(done==0){
					done=1
					node.send(msg)
					node.status({fill:"green",shape:"ring",text:"complete"})
				}
			}
			if(this.status==401){
				done=401
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
			}
		}



		httpr.open("GET",url)
		httpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		httpr.send()

		setTimeout(function(){
			if(done==0){
    				node.status({fill:"red", shape:"ring", text:"Error connecting to hub"});
				done=-1
				node.send({payload:"timeout"})
				httpr.abort()
			}
		}, 3000);



        });
    }

    RED.nodes.registerType("Lamplinc-control",lamplinccontrolNode);
}
