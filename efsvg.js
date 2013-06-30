var E = function(doc){

	// Main public object
	var e = {
		version: "1.0.0",
		ns: "http://www.w3.org/2000/svg",
		svgVer: "1.1",
		doc: doc,
		log: true
	};

	/////////////////
	// PUBLIC METHODS
	/////////////////
	e.el = function(input){
		console.log(typeof input);
		// Managing simple initializer with type
		if (typeof input === "string") {
			input = input.toLowerCase();
			var el = createDOMel(input);
			if(!isTypeEcorrect(input)) return;
			var props = {};
			props.type = input;
			setPropsE(el)
			setSVGAccessors(el);
			return el;
		} else if(typeof input === "object") {
			var props = input;
			if(!isTypeEcorrect(props.type)) return;
			var el = e.el(props.type);
			delete props.type;
			setPropsE(el,props);
			setSVGAccessors(el);
		}
		if(e.log) console.log("Wrong input in el(): '"+input+"'");
	};

	//////////////////
	// PRIVATE METHODS
	//////////////////


	// All possible types of the E element
	var typesE = ["rect","circle","line"];

	// All possible types of the SVG element
	var typeSVG = ["rect","polyline","polygon","path","ellipse"];

	// Checks whether the type is available
	var isTypeEcorrect = function(type){
		if(typesE.indexOf(type) !== -1) return true;
		if(e.log) console.warn("Wrong type of the E element: '"+type+"'");
		return false;
	};

	// All possible properties of the E element
	var propsE = {
		"Etype":"rect",							// Type of the element
		"Edx":10,								// Size X
		"Edy":10,								// Size Y
		"Epoints":[[0,0],[10,10]],				// Array of the points
		"Efrac":100,							// Fraction starting from the 1-st point that should be drawn
		"Evisible":true							// Whether the object should be visible
	};

	// All possible properties of the SVG element
	var propsSVG = {};

	// Creates true SVG element in the DOM
	var createDOMel = function(name){
		var el = doc.createElementNS(this.ns, name);
		return el;
	};

	// Sets all properties of the E element
	var setPropsE = function(el,props){
		for(key in propsE){
			if(!propsE.hasOwnProperty(key)) {
				if(log) console.warn("Wrong property name '"+key+"'' for object of type '"+el.Etype+"'");
				continue;
			}
			if(el.hasOwnProperty(key)) {
				el[key] = props[key];
			} else el[key] = propsE[key];
		}
	};

	// Sets all accessors to the attributes of the SVG element
	var setSVGAccessors = function(el){

	};


	return e;

}(document);
