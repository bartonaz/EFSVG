EFSVG.log = true;
var svg = document.getElementById("svg");
var c1 = EFSVG.el("ellipse");

var c0 = document.getElementById("c0");


Object.defineProperty(c0, "Er1",{
	get: function(){return this.getAttribute("r");},
	set: function(v){this.setAttribute("r",v);}
});

c0.Node1 = c0.getAttributeNode("stroke-dashoffset");
if(c0.Node1 === null) {
	var node = document.createAttribute("stroke-dashoffset");
	c0.setAttributeNode(node);
	c0.Node1 = c0.getAttributeNode("stroke-dashoffset");
}

c0.Node2 = c0.getAttributeNode("stroke-dasharray");
if(c0.Node2 === null) {
	var node = document.createAttribute("stroke-dasharray");
	c0.setAttributeNode(node);
	c0.Node2 = c0.getAttributeNode("stroke-dasharray");
}

Object.defineProperty(c0, "Val1",{
	get: function(){return this.Node1.nodeValue;},
	set: function(v){this.Node1.nodeValue = v;}
});

Object.defineProperty(c0, "Val2",{
	get: function(){return this.Node2.nodeValue;},
	set: function(v){this.Node2.nodeValue = v;}
});

// c0.setAttribute("stroke-dashoffset","9993px");
// c0.setAttribute("stroke-dasharray","9999px");

console.log(Object.keys(c1))

// svg.appendChild(c1);

var c2 = {c: 10, d: 20};
Object.defineProperties(c2,{
	"a": {
		get: function () {return this.c; },
		set: function (value) {this.c = value; }
	},
	"b": {
		get: function () {return this.d; },
		set: function (value) {console.log("Setting the option to value: "+value); this.d = value; }
	}
});

c1.EFx = 250;
c1.id = "c1";
svg.appendChild(c1);