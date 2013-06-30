E.log = true;
var svg = document.getElementById("svg");
var c1 = E.el("circle");

var c0 = document.getElementById("c0");


Object.defineProperty(c0, "Er1",{
	get: function(){return this.getAttribute("r");},
	set: function(v){this.setAttribute("r",v);}
});

c0.ErNode = c0.getAttributeNode("r");

Object.defineProperty(c0, "Er2",{
	get: function(){return this.ErNode.nodeValue;},
	set: function(v){this.ErNode.nodeValue = v;}
});