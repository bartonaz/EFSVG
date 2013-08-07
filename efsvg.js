
/**
 * Global object that is added to the global scope
 * @module  EFSVG
 * @param  {Object} document (to make it local for the module)
 * @param  {Object} utilities (utils.js)
 * @return {Object} 
 */
var EF = (function(doc, u){

	// Main public object
	var e = {
		version: "1.0.0",
		ns: "http://www.w3.org/2000/svg",
		nsLink: "http://www.w3.org/1999/xlink",
		svgVer: "1.1",
		doc: doc,
		log: true
	};

//------------------------------------------------------------------------------------------------------------------------------

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// PUBLIC METHODS //////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Creates an EF element with specified type += set of properties
	 * @param  {String|Object} input
	 * @return {Object} DOM element with tag corresponding to the type and properties of the EF object
	 */
	var el = function(input) {
		// Setting type and properties of the object that will be created
		var type = "";
		var props = {};
		// Getting type if only type was provided to initializer
		if (typeof input === "string") {
			type = input.toLowerCase();
			tag = type;
			props["EFtype"] = type;
			props["EFtag"] = tag;

		} 
		// Getting type from the input object and setting additional provided properties
		else if(typeof input === "object") {
			// Creating the simple object first if the object passed to initializer
			props = input;
			type = props["EFtype"];
			tag = props["EFtag"];
		} else {
			if(e.log) console.warn("Wrong input in el(): '"+input+"'");
			return;
		}
		if(!isTypeEFcorrect(type)) return;
		// Create DOM instance of the object with the specified type
		var el = createDOMel(tag);
		// Set all default properties + specified type + accessor to each property
		setPropsEF(el,props);
		// Update the SVG type of the object based on its EF object properties
		el = updatedSVGtype(el);
		// Set all attributes for the SVG element based on its EF properties
		setSVGAttributes(el);
		
		return el;		
	};

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Calculates id of SVG type (from typesSVG) of the EF object based on its type and properties
	 * @param  {Object} el - EF object
	 * @return {Integer} id of the tag 
	 * @method tagId
	 */
	var tagId = function(el) {
		var tagNames = typesSVG;
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
		if(e.log) console.warn("Failed to identify SVG type <tagName> for object: "+el.toString() + " of type: "+el["EFtype"]);
	};

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Returns name of SVG type of the element based on its type and properties
	 * @param  {Object} el
	 * @return {String} name of the tag
	 */
	var tagName = function(el) {
		var tagId_ = tagId(el);
		if(tagId_<0 || tagId_>typesSVG.length) {
			if(e.log) console.warn("Wrong tagId in <tagName> function: "+tagId_+" for object of type: "+el["EFtype"]);
			return null;
		}
		return typesSVG[tagId_];
	};

//------------------------------------------------------------------------------------------------------------------------------


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// PRIVATE METHODS  /////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * All possible types of the EF element
	 * @type {Array}
	 */
	var typesEF = ["rect","ellipse","line"];

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * All possible types (tags) of the SVG element
	 * @type {Array}
	 */
	var typesSVG = ["line","path","rect","ellipse","circle","text","textPath","image","linearGradient","radialGradient"];

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Checks whether the type is available
	 * @param  {String} type - type that object should have
	 * @return {Bool} true is type is acceptable
	 */
	var isTypeEFcorrect = function(type){
		if(typesEF.indexOf(type) !== -1) return true;
		if(e.log) console.warn("Wrong type of the EF element: '"+type+"'");
		return false;
	};

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * All possible properties of the EF element (with default values)
	 * @type {Object} list of possible properties with their default values
	 */
	var propsEF = {
		// Geometry
		"EFtype":"rect",			// Type of the element
		"EFtag":"rect",				// Tag of SVG element that should be used
		"EFx":10,					// Array of X coordinates of each point (default: single value)
		"EFy":0,					// Array of Y coordinates of each point (default: single value)
		"EFfactor":1,				// Factor of attraction of each point (1-straight lines, <1-arcs)
		"EFxO":0,					// X coordinate of the origin point (from which the sector to both ends of the curve is drawn)
		"EFyO":0,					// Y coordinate of the origin point (from which the sector to both ends of the cruve is drawn)
		"EFsector":false,			// Whether the sector from the origin to both ends of the line should be drawn
		"EFstart":0,				// Point of the start of the shape drawing
		"EFend":1,					// Point of the end of the shape drawing
		"EFtoShape":{},				// Shape to which the shape transformation should progress
		"EFtoProgress":0			// Progress of the shape transformation
	};

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Availability of all properties for the SVG element [Order as in attrSVG array]
	 * @type {Array} 1 - avalable, 0 - not available
	 */
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

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * All possible properties of the SVG element that can be used
	 * @type {Array}
	 */
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

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Creates true SVG element in the DOM
	 * @param  {String} name - tag that should be used for the SVG element
	 * @return {Object} DOM element of the svg namespace
	 */
	var createDOMel = function(name) {
		if(e.log) console.log("Creating a DOM element of type: "+name);
		var el = doc.createElementNS(this.ns, name);
		return el;
	};

//------------------------------------------------------------------------------------------------------------------------------
	// Sets all properties of the EF element
	var setPropsEF = function(el,props) {
		// Adding all properties if they haven't been added yet
		if(!el.hasOwnProperty(propsEF[0])) {
			// Setting properties
			for(key in propsEF){
				el[key] = propsEF[key];
			}
		}
		// Setting proper values to the specified properties
		for(key in props) {
			if(!propsEF.hasOwnProperty(key)) {		// Skipping incompatinle properties
				if(e.log) console.warn("Wrong property name '"+key+"' for object of type '"+el["EFtype"]+"'");
				continue;
			}
			// Setting the value
			el[key] = props[key];
		}
	};

//------------------------------------------------------------------------------------------------------------------------------

	// Creates object with properties of the EF object
	var getPropsEF = function(el) {
		if(!el) return;
		var props = propsEF;
		for(key in props) {
			props[key] = el[key];
		}
		return props;
	};
//------------------------------------------------------------------------------------------------------------------------------
	// Replaces the object by a new one with correct tagName if needed (tagName differs from EFtag)
	/**
	 * Replaces the object by a new one with correct tagName if needed (tagName differs from EFtag)
	 * @method updatedSVGtype
	 * @param  {[type]}       el
	 * @return {[type]}
	 */
	function updatedSVGtype(el) {
		if(!el.hasOwnProperty("EFtype")) {
			if(e.log) console.warn("Trying to update SVG type of the object of undefined type: "+el.toString());
		}
		var tagName_0 = el["tagName"];
		var tagName_1 = tagName(el);
		if(tagName_0 === tagName_1) return el;
		// Replacing the SVG element by the new one with the same visual representation
		if(e.log) console.log("Tag of object with type: "+el["EFtype"]+" has to be changed from <"+tagName_0+"> to <"+tagName_1+">");
		var props = getPropsEF(el);
		props["EFtag"] = tagName_1;
		var newEl = e.el(props);
		return newEl;
	};

//------------------------------------------------------------------------------------------------------------------------------
	// Sets all accessors to the properties of the EF element
	var setEFAccessor = function(el, prop) {
		if(u.typeOf(el[prop]) === "object") return;		// Skipping properties that are not simple values
		if(e.log) console.log("Setting accessor <"+prop+"> to the EF object with type: <"+el["EFtype"]+">");
	};

//------------------------------------------------------------------------------------------------------------------------------
	// Is called whenever any of the EF object's properties is changed
	var propTrigger = function(el, propName) {
		if(e.log) console.log("Triggered change of property <"+propName+"> in element: "+el);
	};

//------------------------------------------------------------------------------------------------------------------------------
	// Sets all SVG attributes to the object of given <type>
	var setSVGAttributes = function(el) {
		var typeId = typesSVG.indexOf(el["tagName"]);
		var attributes = attrAvailSVG[typeId];

		var id = attrSVG.length-1;
		do {
			var attrName = attrSVG[id];
			var attrNodeName = "AN"+attrName;		// AttributeNode<node name>

			if(!attributes[id]) {
				// Removing the attribute if it is obsolete for the current type
				if(el.hasOwnProperty(attrNodeName)) {
					delete el[attrNodeName];
				}
				continue;		// Skipping obsolete attributes for the type
			}
			if(el.hasOwnProperty(attrNodeName)) continue; 	// Skipping if the object already has pointer to this attribute
			var node = document.createAttribute(attrName);
			el.setAttributeNode(node);
			// console.log("Setting attribute: "+attrName+" and nodeName: "+attrNodeName);
			el[attrNodeName] = el.getAttributeNode(attrName);
		} while (id--);
	};

	////////////////////////////
	// PUBLIC METHODS ASSIGNMENT
	////////////////////////////
	e.el = el;
	e.u = u;
	e.tagId = tagId;
	e.tagName = tagName;
	e.getPropsEF = getPropsEF;


	return e;

}(document, UT));
