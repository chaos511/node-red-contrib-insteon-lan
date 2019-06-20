module.exports = function(RED) {
    function clearbufferNode(config) {
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

        node.on('input', function(msg) {
		var btoa = require('btoa'); 
		var httpr = new XMLHttpRequest()

		url="http:\/\/"+user+":"+pass+"@"+ip+":"+port+"/1?XB=M=1"

		node.status({fill:"yellow",shape:"ring",text:"Connecting"})
		var done=0
		msg.debug={"url":url}
		httpr.onreadystatechange = function(){
			if(this.status==200){
				if(done==0){
					done=1
					node.send({payload:httpr.responseText.replace("<response><BS>","").replace("</BS></response>","")})
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
				node.send({payload:"timeout",debug:url})
				httpr.abort()
			}
		}, 3000);



        });
    }

    RED.nodes.registerType("Clear-buffer",clearbufferNode);
}
