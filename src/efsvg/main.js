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
        
        /**
         * Name of the property object that will contain all EF properties of the element
         * @property {String} efName
         * @public
         */
        efName: "EFSVG",

        /**
         * Prefix added to the names of the attribute nodes
         * @property {String} nodePrefix
         * @public
         */
        nodePrefix: "AN",

        /**
         * Prefix added to the names of the EFSVG properties
         * @property {String} propPrefix
         * @public
         */
        propPrefix: "EF",

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
        "type":"rect",            // Type of the element (Not animatable)
        "tag":"",                 // Tag of SVG element that should be used (If empty, object not yet completely initialized) (Not animatable)
        "x":20,                   // Array of X coordinates of each point (default: single value) (Animatable if a single value)
        "y":10,                   // Array of Y coordinates of each point (default: single value) (Animatable if a single value)
        "factor":1,               // Factor of attraction of each point (1-straight lines, <1-arcs) (Animatable)
        "xO":0,                   // X coordinate of the origin point (from which the sector to both ends of the curve is drawn) (Animatable)
        "yO":0,                   // Y coordinate of the origin point (from which the sector to both ends of the cruve is drawn) (Animatable)
        "sector":false,           // Whether the sector from the origin to both ends of the line should be drawn (Not animatable)
        "start":0,                // Point of the start of the shape drawing (Animatable)
        "end":1,                  // Point of the end of the shape drawing (Animatable)
        "toShape":{},             // Shape to which the shape transformation should progress (Not animatable)
        "toProgress":0,           // Progress of the shape transformation (Animatable)
        "stroke":"#000",          // Colour of the stroke line (Animatable)
        "stroke-opacity":"1",     // Opacity of the stroke line (Animatable)
        "stroke-width":"1",       // Width of the stroke line (Animatable)
        "stroke-dasharray":"",    // Dash-array (Not animatable)
        "stroke-dashoffset":"",   // Dash-offset (Animatable)
        "stroke-linecap":"",      // Shape of line endings (Not animatable)
        "stroke-linejoin":"",     // Shape of line joinings (Not animatable)
        "stroke-offset":0,        // Offset of the stroke line (Animatable)
        "fill":"",                // Colour of the fill (or name of the <use> gradient object) (Animatable if colour)
        "fill-opacity":"1",       // Opacity of the fill colour (Animatable)
        "opacity":"1",            // Opacity of the whole element (Animatable)
        "id":""                   // Id of the element
    };

    /**
     * Availability of all properties for the SVG element [Order as in svgAttrAll array]
     * @property {Array} svgAttrAvailMap
     */
    var svgAttrAvailMap = [
        [0,0,0,0,0,0,0,0,0, 1,1,1,1,0,0,0, 1,0, 1,1,1,1,1,1,1,0,0, 1,1],          // LINE
        [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,1,0, 1,0, 1,1,1,1,1,1,1,1,1, 1,1],          // PATH
        [0,1,1,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1,1, 1,1],          // RECT
        [0,1,1,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1,1, 1,1],          // ELLIPSE
        [1,0,0,1,1,0,0,0,0, 0,0,0,0,0,0,0, 1,0, 1,1,1,1,1,1,1,1,1, 1,1],          // CIRCLE
        [0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,0, 1,1,1,1,1,0,1,1,1, 1,1],          // TEXT
        [0,0,0,0,0,1,1,0,0, 0,0,0,0,0,0,1, 1,1, 1,1,1,1,1,0,1,1,1, 1,1],          // TEXTPATH
        [0,0,0,0,0,1,1,1,1, 0,0,0,0,0,0,0, 1,1, 0,0,0,0,0,0,0,0,0, 1,1],          // IMAGE
        [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0, 0,0]           // LINEAR GRADIENT
        [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0, 0,0, 0,0,0,0,0,0,0,0,0, 0,0]           // RADIAL GRADIENT
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
        "stroke-linejoin",
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
    function el(input, id) {
        // Setting type and properties of the object that will be created
        var type = "";
        var props = {};
        var tag = "";
        var elId = "";
        // Getting type if only type was provided to initializer
        if (typeof input === "string") {
            type = input.toLowerCase();
            tag = type;
            props.type = type;

            if (!id) {
                if(E.log) console.warn("No id given for the EFSVG element of type: "+type);
                return undefined;
            }
            props.id = id;
        } 
        // Getting type from the input object and setting additional provided properties
        else if (typeof input === "object") {
            // Creating the simple object first if the object passed to initializer
            props = input;
            type = props.type;
            tag = props.tag;
            if (!props.id) {
                if(E.log) console.warn("No id given for the EFSVG element of type: "+type);
                return undefined;
            }
        } else {
            if (E.log) console.warn("[el] Wrong input in el(): '"+input+"'");
            return;
        }
        if (!isTypeEFcorrect(type)) return;
        var el = U.Dom.createDomEl(tag, E.svgNS);
        el.id = props.id;
        el[E.efName] = {};        // Setting object that will contain real values of all the properties

        setPropsEF(el,props);
        el = updateTagEl(el);
        el[E.efName].tag = el.tagName;
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
        var pObj = el[E.efName];
        var tagId = -1;
        if (!el.hasOwnProperty(E.propPrefix+"type")) {
            if (E.log) console.warn("[tagId] Object has no <type> property assigned. Is it EFSVG object?");
        }
        // Deciding on the SVG tag to be used
        // If a fragment of the shape has to be drawn
        // if (el[])
        // If simple shape has to be drawn
        switch(el[E.propPrefix+"type"]) {
            case "rect": 
                tagId = 2;      // rect
                break;
            case "ellipse": 
                tagId = 3;      // ellipse
                if (pObj["y"] < 0) {
                    tagId = 4;  // circle
                    break;
                }
                break;
            case "line":
                tagId = 1;      // path
                break;
        }
        if (tagId>=0) return tagId;
        if (E.log) console.warn("[tagId] Failed to identify SVG type <tagName> for object: "+el.toString() + " of type: "+el[E.propPrefix+"type"]);
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
            if (E.log) console.warn("[tagName] Wrong tagId in <tagName> function: "+tagId_+" for object of type: "+el[E.propPrefix+"type"]);
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
        if (E.log) console.warn("[isTypeEFcorrect] Wrong type of the EF element: '"+type+"'");
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
        var pObj = el[E.efName];
        // Adding all properties if they haven't been added yet
        if (!pObj.hasOwnProperty(allEFproperties[0])) {
            // Creating object with all property definitions
            var propDefinitions = {};
            U.Gen.forEachIn(allEFproperties, function (propName) {
                propDefinitions[E.propPrefix+propName] = {
                    get: function () {return this[E.efName][propName]; },
                    set: function (value) { if (propTrigger(el, propName, value)) this[E.efName][propName] = value; }
                }
            });
            if (E.log) console.log("[setPropsEF] Setting the list of properties: "+Object.keys(propDefinitions));
            // Adding all properties with the default values
            for (var key in allEFproperties){
                pObj[key] = allEFproperties[key];
            }
            // Actually defining the properties that use an accessor function
            Object.defineProperties(el,propDefinitions);
        }
        if(E.log) console.log("[setPropsEF] Setting the values to properties");
        // Setting proper values to the specified properties
        for (var propName in props) {
            // Skipping icompatible properties
            if (!allEFproperties.hasOwnProperty(propName)) {
                if (E.log) console.warn("[setPropsEF] Wrong property name '"+propName+"' for object of type '"+pObj["type"]+"'");
                continue;
            }
            // Skipping EFtag
            if(propName === "tag") continue;
            // Setting the value
            console.log("[setPropsEF] Set property <"+propName+"> to value: "+props[propName]);
            el[E.propPrefix+propName] = props[propName];
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
            props[key] = el[E.propPrefix+key];
        }
        return props;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Replaces the object by a new one with correct tagName if needed (if tagName differs from EFtag)
     * @method updateTagEl
     * @param  {Object} el EF object
     * @return {Object} New EF object pointing to new DOM element with updated tag
     */
    function updateTagEl(el) {
        var pObj = el[E.efName];
        if (!pObj.hasOwnProperty("type")) {
            if (E.log) console.warn("[updateTagEl] Trying to update SVG type of the object of undefined type: "+el.toString());
        }
        var tagName_0 = el["tagName"];
        var tagName_1 = tagName(el);
        if (tagName_0 === tagName_1) return el;
        
        // Replacing the SVG element by the new one with the same visual representation
        if (E.log) console.log("[updateTagEl] Updating SVG element from <"+tagName_0+"> to <"+tagName_1+">");
        pObj.tag = tagName_1;      // Updating the tag value
        var newEl = E.el(pObj);

        el.id = "";
        U.Dom.replaceDomEl(el, newEl);      // Replacing the DOM element
        el = newEl;

        return el;
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
        if (E.log) console.log("[setEFAccessor] Setting accessor <"+prop+"> to the EF object with type: <"+el[E.propPrefix+"type"]+">");
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Is called whenever any of the EF object's properties is changed
     * @method propTrigger
     * @param  {Object}    el       EF object
     * @param  {String}    propName Name of the property that has changed
     */
    function propTrigger(el, name, value) {
        if (E.log) console.log("[propTrigger] Triggered change of property <"+name+"> with value <"+value+"> in element: "+el);
        var pObj = el[E.efName];
        if(!pObj) {
            if(E.log) console.log("[propTrigger] No EF properties found in object of tag: "+el.tagName);
            return false;
        }
        // Stopping if object is not yet fully initialized
        if (! pObj.tag) return true;
        // Setting value directly to the attribute node if this is a styling property
        var subName = name.substring(0,6);
        if (subName === "stroke" || subName === "fill" || subName === "opacit" || subName === "id") {
            el[E.nodePrefix+name].value = value;
            return true;
        }
        
        // Performing further checks if object is completely initialized
        if (E.log) console.log("[propTrigger]   Doing additional work...");

        if (pObj.type === "ellipse") {
            if (name === "y" || name === "x") {
                pObj[name] = value;
                el = updateTagEl(el);
            }
        }

        return true;
    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Sets all SVG attributes to the object of given <type>
     * @method setSVGAttributes
     * @param  {Object}         el [description]
     */
    function setSVGAttributes(el) {
        var typeId = svgTypes.indexOf(el["tagName"]);
        var attributes = svgAttrAvailMap[typeId];

        var id = svgAttrAll.length-1;
        do {
            var attrName = svgAttrAll[id];
            var attrNodeName = E.nodePrefix+attrName;       // AttributeNode<node name>

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
