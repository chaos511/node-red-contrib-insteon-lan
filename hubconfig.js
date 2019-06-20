module.exports = function(RED) {
    function HubconfigNode(n) {
        RED.nodes.createNode(this,n);
        this.ip 	= n.ip;
        this.port 	= n.port;
	this.username	= n.username;
	this.password	= n.password;
    }
    RED.nodes.registerType("hub-config",HubconfigNode);
}
