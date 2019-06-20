module.exports = function(RED) {
    function miniremotereceiveNode(config) {
    	RED.nodes.createNode(this,config);
        config.hub = RED.nodes.getNode(config.hub);
	var remoteid=config.remoteid
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
	var done=0
	function resethttpr(){
		httpr = new XMLHttpRequest()
		httpr.onreadystatechange = function(){
			if(this.status==200){
				if(done==0){
					done=1
					decode(httpr.responseText.replace("<response><BS>","" ).replace("</BS></response>",""))
					node.status({fill:"green",shape:"ring",text:"complete"})
					httpr.abort()
				}
				clearTimeout(timeoutval)
			}
			if(this.status==401){
				done=401
				node.send({payload:"Unauthorized"})
				node.status({fill:"red",shape:"ring",text:"Error Unauthorized "})
				clearTimeout(timeoutval)
			}
		}
	}
	resethttpr()
	function resetclearhttpr(){
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
		done=0
		httpr.open("GET",url)
		httpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		httpr.send()
		timeoutval=setTimeout(timeout,3000)
	}
	function clearbuffer(){
		clearhttpr.open("GET","http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/1?XB=M=1")
		clearhttpr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass))
		clearhttpr.send()
		cleartimeoutval=setTimeout(clearbuffertimeout,3000)
	}
	function timeout(){
		node.send({payload:"timeout"})
		node.status({fill:"red",shape:"ring",text:"Error connecting to hub"})
		resethttpr()
		setTimeout(getbuffer,1000)
	}
	function clearbuffertimeout(){
		node.send({payload:"clear timeout"})
		node.status({fill:"red",shape:"ring",text:"Error connecting to hub"})
		resetclearhttpr()
		setTimeout(clearbuffer,1000)
	}
	function decode(buffer){
		resethttpr()
		resetclearhttpr()
		//the buffer formating is "message type remote id button id CMD1 CMD2"
		//0250 is the message type sent from the remote
		var messagelength=22
		var start=0;
		var loop=true
		var message=""
		var mcount=0
		var newmsg
		while(loop){
			var foundat=buffer.indexOf("0250",start)
			start=foundat+1
			if(foundat+messagelength<=buffer.length&&foundat!=-1){//if found message type
				message=buffer.substr(foundat, messagelength)
				if(message.indexOf(remoteid,4)==4){//if the next thing is remote id
					if(message.indexOf("00000",10)==10){//button id starts with 00000
						var button=parseInt(message.charAt(15))
						var command=commandlookup(parseInt(message.charAt(18)+message.charAt(19)),parseInt(message.charAt(20)+message.charAt(21)))
						var newmsg={"button":button,"command":command}
					}
				}
			}else{
				loop=false
				if(newmsg!=null){
					clearbuffer()
					node.send([{payload:newmsg},null])
				}
				setTimeout(getbuffer,500)
			}
		}
		function commandlookup(cmd1,cmd2){
			var out=""
			// node.warn(cmd2)
			switch(cmd1){
				case 11:
					out="on"
				break;
				case 13:
					out="off"
				break;
				case 17:
					if(cmd2==0){
						out="dim"
					}
					if(cmd2==1){
						out="bright"
					}
				break;
				case 18:
					out="stop"
				break;
			}    
			return out
		}
		return [null,{payload:"done"}];
	}
	getbuffer()
    }
    RED.nodes.registerType("Mini-remote-receive",miniremotereceiveNode);
}
