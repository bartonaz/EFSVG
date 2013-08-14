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
    var createDOMel = function(tag, ns) {
        if (U.log) console.log("Creating a DOM element with tag: "+tag);
        var el = doc.createElementNS(ns, tag);
        return el;
    };

    U.createDOMel = createDOMel;

//------------------------------------------------------------------------------------------------------------------------------

    return U;
}(JSUTILS, document || this))