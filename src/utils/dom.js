/**
 * @module JSUTILS
 */

var JSUTILS;
if (!JSUTILS) JSUTILS = {};

/**
 * Javascript utilities for working with DOM
 * @class Dom
 */
JSUTILS.Dom = (function (J,doc) {
    
    "use strict";

    // Public instance of the class
    var U = {

        /**
         * Flag to toggle debug logging
         * @property {Boolean} log
         */
        log: true

    };

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Creates an SVG element in the DOM uwing specified tag
<<<<<<< HEAD
     * @method createDomEl
=======
     * @method createDOMel
>>>>>>> f493ae73694108fd243a729d84676336de14cb23
     * @param  {String} tag Tag that should be used for the SVG element
     * @param  {String} ns  Namespace to be used for a DOM element to be created
     * @return {Object} DOM element in the svg namespace
     */
<<<<<<< HEAD
    var createDomEl = function(tag, ns) {
        if (U.log) console.log("[createDomEl] Creating a DOM element with tag: "+tag);
=======
    var createDOMel = function(tag, ns) {
        if (U.log) console.log("Creating a DOM element with tag: "+tag);
>>>>>>> f493ae73694108fd243a729d84676336de14cb23
        var el = doc.createElementNS(ns, tag);
        return el;
    };

<<<<<<< HEAD
    U.createDomEl = createDomEl;

//------------------------------------------------------------------------------------------------------------------------------
    
    var replaceDomEl = function(el1, el2) {
        if (!J.Gen.isDomElement(el1) || !J.Gen.isDomElement(el2) ) {
            if (U.log) console.warn("[replaceDomEl] One of the elements is not an Object");
            return false;
        }
        var parent = el1.parentNode;
        if(!parent) return;     // Stopping if the initial element is not in the document

        parent.replaceChild(el1, el2);      // Replacing the element in the DOM structure
        return true;
    };

    U.replaceDomEl = replaceDomEl;
=======
    U.createDOMel = createDOMel;
>>>>>>> f493ae73694108fd243a729d84676336de14cb23

//------------------------------------------------------------------------------------------------------------------------------

    return U;
}(JSUTILS, document || this))