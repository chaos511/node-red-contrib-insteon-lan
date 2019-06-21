module.exports = function(RED) {
    function x10receiveNode(config) {
    	RED.nodes.createNode(this,config);
        config.hub = RED.nodes.getNode(config.hub);
        if(config.hub){
                var port=config.hub.port
                var ip=config.hub.ip
                var user=config.hub.username
                var pass=config.hub.password
        }
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var node = this;
	var btoa = require('btoa');
	var timeoutval
	var cleartimeoutval
	var httpr = new XMLHttpRequest()
	var clearhttpr = new XMLHttpRequest()
	url="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/buffstatus.xml"
	var timeoutvalid=0
	function onchange(){
		if(this.status==200){
			timeoutvalid=0
			node.status({fill:"green",shape:"ring",text:"complete"})
//			node.send({payload:"got buffer"})
			clearTimeout(timeoutval)
			resetclearhttpr()
			decode(httpr.responseText.replace("<response><BS>","" ).replace("</BS></response>",""))
			httpr.abort()
			resethttpr()
			setTimeout(getbuffer,500)
		}
		if(this.status==401){
			timeoutvalid=0
			node.send({payload:"Unauthorized"})
			node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
			clearTimeout(timeoutval)
			httpr.abort()
			}
	}
	function resethttpr(){
		httpr = new XMLHttpRequest()
		httpr.onreadystatechange =onchange
	}
	resethttpr()
	function resetclearhttpr(){
		clearhttpr= null
		clearhttpr = new XMLHttpRequest()
		clearhttpr.onreadystatechange = function(){
			if(this.status==200){
				clearhttpr.abort()
				clearTimeout(cleartimeoutval)
			}
			if(this.status==401){
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
				clearTimeout(cleartimeoutval)
			}
		}
	}
	function getbuffer(){
//		node.send({payload:"request buffer"})
		timeoutvalid=1
		timeoutval=setTimeout(timeout,4000)
		httpr.open("GET",url)
		httpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		httpr.send()
	}
	function clearbuffer(){
		clearhttpr.open("GET","http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/1?XB=M=1")
		clearhttpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		clearhttpr.send()
		cleartimeoutval=setTimeout(clearbuffertimeout,4000)
	}
	function timeout(){
		if(timeoutvalid==1){
			node.send({payload:"timeout"})
			node.status({fill:"red",shape:"ring",text:"Error connecting to hub"})
			resethttpr()
			setTimeout(getbuffer,1500)
		}
	}
	function clearbuffertimeout(){
		node.send({payload:"clear timeout"})
		node.status({fill:"red",shape:"ring",text:"Error connecting to hub"})
		resetclearhttpr()
		setTimeout(clearbuffer,1500)
	}
	function decode(buffer){
		var messagelength=8
		var start=0;
		var loop=true
		var message=""
		var mcount=0
		var newmsg
		var housecodelookup=['M','E','C','K','O','G','A','I','N','F','D','L','P','H','B','J']
		var unitcodelookup=["13","5","3","11","15","7","1","9","14","6","4","12","16","8","2","10"]
		var housecode
		var command
		var unitcode=-1
		var send=-1
		while(loop){
			var foundat=buffer.indexOf("0252",start)
			start=foundat+1
			if(foundat+messagelength<=buffer.length&&foundat!=-1){//if found message type
				message=buffer.substr(foundat, messagelength)
				if(message.charAt(6)=='0'&&message.charAt(7)=='0'){//set unit
						housecode=housecodelookup[parseInt("0x"+message.charAt(4))]
						unitcode=unitcodelookup[parseInt("0x"+message.charAt(5))]
						send=0
				}
				if(message.charAt(6)=='8'&&message.charAt(7)=='0'&&housecode==housecodelookup[parseInt("0x"+message.charAt(4))]&&send!=-1){//command
						command=commandlookup(parseInt(message.charAt(5)))
						send=1
				}
			}else{
				loop=false
				if(send==1){
					var newmsg={"housecode":housecode,"unitcode":unitcode,"command":command}
					node.send({payload:newmsg})
					clearbuffer()
				}
			}
		}
		function commandlookup(cmd){
			var out=""
			switch(cmd){
				case 1:
					out="all on"
				break;
				case 2:
					out="on"
				break;
				case 3:
					out="off"
				break;
				case 4:
					out="dim"
				break;
				case 5:
					out="bright"
				break;
				case 6:
					out="all off"
				break;
			}
			return out
		}
	}
	getbuffer()
    }
    RED.nodes.registerType("X10-receive",x10receiveNode);
}
