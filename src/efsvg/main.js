/**
 * @module EFSVG
 */

var EFSVG;
if (!EFSVG) EFSVG = {};

/**
 * Main global functionality for creating the SVG element with necessary properties and attributes
 * @class Main
 * @static
 */
EFSVG.Main = (function(doc, U){

    "use strict";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // FRAMEWORK INFO //////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Public instance of the class
    var E = {

        /**
         * Stable version of the framework
         * @property {String} version
         */
        version: "1.0.0",
        
        /**
         * Namespace used for the objects created by the framework
         * @property {String} ns
         * @public
         */
        svgNS: "http://www.w3.org/2000/svg",

        /**
         * Namespace used for the anchors attached to the objects, created by the framework
         * @property {String} svgNSLink
         * @public
         */
        svgNSLink: "http://www.w3.org/1999/xlink",
        
        /**
         * Version of SVG used for the created objects
         * @property {String} svgVer
         * @public
         */
        svgVer: "1.1",

        efObjName: "EFSVG",

        /**
         * Flag to toggle debug logging
         * @property {Boolean} log
         * @public
         */
        log: true

    };


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // INTERNAL PROPERTIES  /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * All possible types of the EF element
     * @property {Array} efTypes
     */
    var efTypes = ["rect","ellipse","line"];

    /**
     * All possible types (tags) of the SVG element
     * @property {Array} svgTypes
     */
    var svgTypes = ["line","path","rect","ellipse","circle","text","textPath","image","linearGradient","radialGradient"];

    /**
     * List of all possible properties with their default values
     * @property {Object} efProps
     */
    var efProps = {
        // Geometry
        "EFtype":"rect",            // Type of the element
        "EFtag":"",                 // Tag of SVG element that should be used (If empty, object not yet completely initialized)
        "EFx":10,                   // Array of X coordinates of each point (default: single value)
        "EFy":0,                    // Array of Y coordinates of each point (default: single value)
        "EFfactor":1,               // Factor of attraction of each point (1-straight lines, <1-arcs)
        "EFxO":0,                   // X coordinate of the origin point (from which the sector to both ends of the curve is drawn)
        "EFyO":0,                   // Y coordinate of the origin point (from which the sector to both ends of the cruve is drawn)
        "EFsector":false,           // Whether the sector from the origin to both ends of the line should be drawn
        "EFstart":0,                // Point of the start of the shape drawing
        "EFend":1,                  // Point of the end of the shape drawing
        "EFtoShape":{},             // Shape to which the shape transformation should progress
        "EFtoProgress":0            // Progress of the shape transformation
    };

    /**
     * Availability of all properties for the SVG element [Order as in svgAttrAll array]
     * @property {Array} svgAttrAvailMap
     */
    var svgAttrAvailMap = [
        [0,0,0,0,0,0,0,0,0, 1,1,1,1,0,0,0, 1,0, 1,1,1,1,1,1,0,0, 1,1],          // LINE
        [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,1,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],          // PATH
        [0,1,1,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],          // RECT
        [0,1,1,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],          // ELLIPSE
        [1,0,0,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1, 1,1],          // CIRCLE
        [0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,0, 1,1,1,1,1,1,1,1, 1,1],          // TEXT
        [0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,1, 1,1,1,1,1,1,1,1, 1,1],          // TEXTPATH
        [0,0,0,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,1, 0,0,0,0,0,0,0,0, 1,1]           // IMAGE
    ];

    /**
     * All possible properties of the SVG element that can be used
     * @property {Array} svgAttrAll
     */
    var svgAttrAll = [
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


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // INTERNAL METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates an EF element with specified type += set of properties
     * @method el
     * @param  {String|Object} input
     * @return {Object} DOM element with added EF properties
     * @public
     */
    function el(input) {
        // Setting type and properties of the object that will be created
        var type = "";
        var props = {};
        var tag = "";
        // Getting type if only type was provided to initializer
        if (typeof input === "string") {
            type = input.toLowerCase();
            tag = type;
            props["EFtype"] = type;
            props["EFtag"] = tag;

        } 
        // Getting type from the input object and setting additional provided properties
        else if (typeof input === "object") {
            // Creating the simple object first if the object passed to initializer
            props = input;
            type = props["EFtype"];
            tag = props["EFtag"];
        } else {
            if (E.log) console.warn("Wrong input in el(): '"+input+"'");
            return;
        }
        if (!isTypeEFcorrect(type)) return;
        var el = U.Dom.createDOMel(tag, E.svgNS);
        el.EFprops = {};
        setPropsEF(el,props);
        el = updatedSVGtype(el);
        setSVGAttributes(el);
        
        return el;      
    };

    E.el = el;

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Calculates id of SVG type (from svgTypes) of the EF object based on its type and properties
     * @method tagId
     * @param  {Object} el EF object
     * @return {Integer} Id of the tag (in tagId)
     * @method tagId
     */
    function tagId(el) {
        var tagNames = svgTypes;
        var tagId = -1;
        if (!el.hasOwnProperty("EFtype")) {
            if (E.log) console.warn("Object has no <type> property assigned. Is it EFSVG object?");
        }
        // Deciding on the SVG type to be used
        switch(el["EFtype"]) {
            case "rect": 
                tagId = 2;      // rect
                break;
            case "ellipse": 
                tagId = 3;      // ellipse
                break;
            case "line":
                tagId = 1;      // path
                break;
        }
        if (tagId>=0) return tagId;
        if (E.log) console.warn("Failed to identify SVG type <tagName> for object: "+el.toString() + " of type: "+el["EFtype"]);
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Returns name of SVG type of the element based on its type and properties
     * @method tagName
     * @param  {Object} el
     * @return {String} name of the tag
     * @public
     */
    function tagName(el) {
        var tagId_ = tagId(el);
        if (tagId_<0 || tagId_>svgTypes.length) {
            if (E.log) console.warn("Wrong tagId in <tagName> function: "+tagId_+" for object of type: "+el["EFtype"]);
            return null;
        }
        return svgTypes[tagId_];
    };

    E.tagName = tagName;

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Checks whether the type is available
     * @method isTypeEFcorrect
     * @param  {String} type - type that object should have
     * @return {Bool} true is type is acceptable
     */
    function isTypeEFcorrect(type) {
        if (efTypes.indexOf(type) !== -1) return true;
        if (E.log) console.warn("Wrong type of the EF element: '"+type+"'");
        return false;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Sets all properties of the EF element (including accessor functions)
     * @method
     * @param  {Object} el EF object
     * @param  {Object} props Object with values of the properties to be set
     */
    var setPropsEF = function(el,props) {
        var allEFproperties = efProps;
        // Adding all properties if they haven't been added yet
        if (!el.hasOwnProperty(allEFproperties[0])) {
            // Creating object with all property definitions
            var propDefinitions = {};
            U.Gen.forEachIn(allEFproperties, function (propName) {
                propDefinitions[propName] = {
                    get: function () { console.log("Getting property: <"+propName+">"); return this.EFprops[propName]; },
                    set: function (value) { console.log("Setting property: <"+propName+"> to value: "+value); this.EFprops[propName] = value; }
                }
            });
            if (E.log) console.log("Setting the list of properties: "+Object.keys(propDefinitions));
            Object.defineProperties(el,propDefinitions);
            // return;
            for (var key in allEFproperties){
                el[key] = allEFproperties[key];
            }
        }
        if(E.log) console.log("Setting the values to properties");
        // Setting proper values to the specified properties
        for (var propName in props) {
            // Skipping icompatible properties
            if (!allEFproperties.hasOwnProperty(propName)) {
                if (E.log) console.warn("Wrong property name '"+propName+"' for object of type '"+el["EFtype"]+"'");
                continue;
            }
            // Setting the value
            console.log("Set property <"+propName+"> to value: "+el[propName]);
            // el[propName] = props[propName];
        }
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Reads all properties of the EF object
     * @method
     * @param  {Object} el EF object
     * @return {Object} Object that contains values of all the properties of the EF object
     */
    var getPropsEF = function(el) {
        if (!el) return;
        var props = efProps;
        for (var key in props) {
            props[key] = el[key];
        }
        return props;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Replaces the object by a new one with correct tagName if needed (if tagName differs from EFtag)
     * @method updatedSVGtype
     * @param  {Object} el EF object
     * @return {Object} New EF object pointing to new DOM element with updated tag
     */
    function updatedSVGtype(el) {
        if (!el.hasOwnProperty("EFtype")) {
            if (E.log) console.warn("Trying to update SVG type of the object of undefined type: "+el.toString());
        }
        var tagName_0 = el["tagName"];
        var tagName_1 = tagName(el);
        if (tagName_0 === tagName_1) return el;
        // Replacing the SVG element by the new one with the same visual representation
        if (E.log) console.log("Tag of object with type: "+el["EFtype"]+" has to be changed from <"+tagName_0+"> to <"+tagName_1+">");
        var props = getPropsEF(el);
        props["EFtag"] = tagName_1;
        var newEl = E.el(props);
        return newEl;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Sets all accessors to the properties of the EF element
     * @method setEFAccessor
     * @param  {Object}      el   EF element
     * @param  {Object}      prop List of properties for which the accessor should be set
     */
    function setEFAccessor(el, prop) {
        if (ut.typeOf(el[prop]) === "object") return;        // Skipping properties that are not simple values
        if (E.log) console.log("Setting accessor <"+prop+"> to the EF object with type: <"+el["EFtype"]+">");
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Is called whenever any of the EF object's properties is changed
     * @method propTrigger
     * @param  {Object}    el       EF object
     * @param  {String}    propName Name of the property that has changed
     */
    function propTrigger(el, name, value) {
        if (E.log) console.log("Triggered change of property <"+name+"> with value <"+value+"> in element: "+el);
        // Stopping if the EF object initialization has not finished (No tag set)
        if (!el.hasOwnProperty("EFtag")) {
            el[name] = value;
            return;
        }
        // el[name] = value;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Sets all SVG attributes to the object of given <type>
     * @method setSVGAttributes
     * @param  {[type]}         el [description]
     */
    function setSVGAttributes(el) {
        var typeId = svgTypes.indexOf(el["tagName"]);
        var attributes = svgAttrAvailMap[typeId];

        var id = svgAttrAll.length-1;
        do {
            var attrName = svgAttrAll[id];
            var attrNodeName = "AN"+attrName;       // AttributeNode<node name>

            if (!attributes[id]) {
                // Removing the attribute if it is obsolete for the current type
                if (el.hasOwnProperty(attrNodeName)) {
                    delete el[attrNodeName];
                }
                continue;       // Skipping obsolete attributes for the type
            }
            if (el.hasOwnProperty(attrNodeName)) continue;   // Skipping if the object already has pointer to this attribute
            var node = document.createAttribute(attrName);
            el.setAttributeNode(node);
            // console.log("Setting attribute: "+attrName+" and nodeName: "+attrNodeName);
            el[attrNodeName] = el.getAttributeNode(attrName);
        } while (id--);
    };

    return E;

}(document, JSUTILS));
