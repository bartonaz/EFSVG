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
     * @method createDOMel
     * @param  {String} tag Tag that should be used for the SVG element
     * @param  {String} ns  Namespace to be used for a DOM element to be created
     * @return {Object} DOM element in the svg namespace
     */
    var createDomEl = function(tag, ns) {
        if (U.log) console.log("[createDomEl] Creating a DOM element with tag: "+tag);

        var el = doc.createElementNS(ns, tag);
        return el;
    };

    U.createDomEl = createDomEl;

//------------------------------------------------------------------------------------------------------------------------------
    
    var replaceDomEl = function(el1, el2) {
        if (!J.Gen.isDomElement(el1) || !J.Gen.isDomElement(el2) ) {
            if (U.log) console.warn("[replaceDomEl] One of the elements is not an Object");
            return false;
        }
        console.log("Replacing element:");
        console.dir(el1);
        console.log("       by element:");
        console.dir(el2);
        var parent = el1.parentNode;
        console.log("Parent:");
        console.dir(parent);
        if(!parent) return;     // Stopping if the initial element is not in the document

        parent.replaceChild(el2, el1);      // Replacing the element in the DOM structure

        console.log("New parent:");
        console.dir(parent);

        el1 = el2;

        return true;
    };

    U.replaceDomEl = replaceDomEl;

//------------------------------------------------------------------------------------------------------------------------------

    return U;
}(JSUTILS, document || this))