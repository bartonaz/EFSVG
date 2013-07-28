var E = function(doc){

	// Main public object
	var e = {
		version: "1.0.0",
		ns: "http://www.w3.org/2000/svg",
		nsLink: "http://www.w3.org/1999/xlink",
		svgVer: "1.1",
		doc: doc,
		log: true
	};

	/////////////////
	// PUBLIC METHODS
	/////////////////
	e.el = function(input) {
		console.log(typeof input);
		// Managing simple initializer with type
		if (typeof input === "string") {
			input = input.toLowerCase();
			var el = createDOMel(input);
			if(!isTypeEcorrect(input)) return;
			var props = {};
			props["EFtype"] = input;
			setPropsE(el,props);		// Sets all default properties + specified type
			setSVGAccessors(el);
			return el;
		} else if(typeof input === "object") {
			// Creating the simple obkect first if the object passed to initializer
			var props = input;
			if(!isTypeEcorrect(props["EFtype"])) return;
			var el = e.el(props["EFtype"]);
			// delete props.type;
			setPropsE(el,props);
		}
		if(e.log) console.log("Wrong input in el(): '"+input+"'");
	};

	// Returns the id of SVG type (from typeSVG) of the element based on its type and properties
	e.tagId = function(el) {
		var tagNames = typeSVG;
		var tagId = -1;
		if(!el.hasOwnProperty("EFtype")) {
			if(e.log) console.warn("Object has no <type> property assigned. Is it EFSVG object?");
		}
		// Deciding on the SVG type to be used
		switch(el["EFtype"]) {
			case "rect": 
				tagId = 2;		// rect
				break;
			case "ellipse": 
				tagId = 3;		// ellipse
				break;
			case "line":
				tagId = 1;		// path
				break;
		}
		if(tagId>=0) return tagId;
		if(e.log) console.log("Failed to identify SVG type <tagName> for object: "+el.toString() + " of type: "+el["EFtype"]);
	}

	// Returns name of SVG type of the element based on its type and properties
	e.tagName = function(el) {
		var tagId = e.tagId(el);
		if(tagId<0 || tagId>typeSVG.length) {
			if(e.log) console.warn("Wrong tagId in <tagName> function: "+tagId+" for object of type: "+el["EFtype"]);
			return null;
		}
		return typeSVG[tagId];
	}

	//////////////////
	// PRIVATE METHODS
	//////////////////


	// All possible types of the E element
	var typesE = ["rect","ellipse","line"];

	// All possible types of the SVG element
	var typeSVG = ["line","path","rect","ellipse","circle","text","textPath","image","linearGradient","radialGradient"];

	// Checks whether the type is available
	var isTypeEcorrect = function(type){
		if(typesE.indexOf(type) !== -1) return true;
		if(e.log) console.warn("Wrong type of the EF element: '"+type+"'");
		return false;
	};

	// All possible properties of the E element (with default values)
	var propsE = {
		// Geometry
		"EFtype":"rect",						// Type of the element
		"EFx":10,								// Array of X coordinates of each point (default: single value)
		"EFy":0,								// Array of Y coordinates of each point (default: single value)
		"EFfactor":1,							// Factor of attraction of each point (1-straight lines, <1-arcs)
		"EFxO":0,								// X coordinate of the origin point (from which the sector to both ends of the curve is drawn)
		"EFyO":0,								// Y coordinate of the origin point (from which the sector to both ends of the cruve is drawn)
		"EFsector":false,						// Whether the sector from the origin to both ends of the line should be drawn
		"EFstart":0,							// Point of the start of the shape drawing
		"EFend":1,								// Point of the end of the shape drawing
		"EFtoShape":{},							// Shape to which the shape transformation should progress
		"EFtoProgress":0						// Progress of the shape transformation
	};

	// Availability of all properties for the SVG element [Order as in propsSVG array]
	var attrAvailSVG = [
		[0,0,0,0,0,0,0,0,0, 1,1,1,1,0,0,0, 1,0, 1,1,1,1,1,1,0,0, 1,1],			// LINE
		[0,0,0,0,0,0,0,0,0, 0,0,0,0,0,1,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],			// PATH
		[0,1,1,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],			// RECT
		[0,1,1,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],			// ELLIPSE
		[1,0,0,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],			// CIRCLE
		[0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,0, 1,1,1,1,1,1,1,1, 1,1],			// TEXT
		[0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,1, 1,1,1,1,1,1,1,1, 1,1],			// TEXTPATH
		[0,0,0,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,1, 0,0,0,0,0,0,0,0, 1,1]			// IMAGE
	];

	// All possible properties of the SVG element
	var attrSVG = [
	// Geometry (Areas)
	"r",
	"rx",
	"ry",
	"cx",
	"cy",
	"x",
	"y",
	"width",
	"height",
	// Geometry (Lines)
	"x1",
	"y1",
	"x2",
	"y2",
	"points",
	"d",
	"text",
	// Geometry (All)
	"transform",
	"xlink:href",
	// Style (Inner)
	"stroke",
	"stroke-width",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-opacity",
	"fill",
	"fill-opacity",
	// Style (Outer)
	"opacity",
	"filter"
	];

	// Creates true SVG element in the DOM
	var createDOMel = function(name) {
		var el = doc.createElementNS(this.ns, name);
		return el;
	};

	// Sets all properties of the E element
	var setPropsE = function(el,props) {
		// Adding all properties if they haven't been added yet
		if(!el.hasOwnProperty(propsE[0])) {
			// Setting properties
			for(key in propsE){
				el[key] = propsE[key];
			}
			// Setting all SVG attributes of the object of given <type>

		}
		// Setting proper values to the specified properties
		for(key in props) {
			if(!propsE.hasOwnProperty(key)) {		// Skipping incompatinle properties
				if(e.log) console.warn("Wrong property name '"+key+"' for object of type '"+el["EFtype"]+"'");
				continue;
			}
			// Setting the value
			el[key] = props[key];
		}
	};

	// Sets all attributes of the object depending on its <type> property
	var setAttrSVG = function(el) {
		if(!el.hasOwnProperty["EFtype"]) {
			if(e.log) console.warn("Trying to set SVG attributes to the object of undefined type: "+el.toString());
		}
		var type = el["EFtype"];
	}

	// Sets all accessors to the attributes of the SVG element
	var setSVGAccessors = function(el) {

	};

	// Sets all SVG attributes to the object of given <type>
	var setSVGAttributes = function(el) {
		var typeId = typesE.indexOf(el["tagName"]);
		var attributes = attrAvailSVG[typeId];
		var id = attrSVG.length-1;
		do {
			if(!attributes[id]) continue;		// Skipping obsolete attributes for the type
			var attrName = attrSVG[id];
		} while (id--)
	}



	return e;

}(document);
