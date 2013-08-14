/**
 * Module for creating and manipulation of SVG elements with synchronizeable higher order properties
 * @module EFSVG
 * @main EFSVG
 */

var EFSVG;
if (!EFSVG) EFSVG = {};


/**
 * Module level properties and methods
 * @class EFSVG
 */
(function(E, J) {

	// List of properties from the Main class to be copied directly to the Module
	var childList = [ "version", "el", "svgNS", "svgNSLink", "svgVer" ];
	// Setting Main class properties as public module properties
	J.Gen.forEachIn(childList, function (prop) {
		E[prop] = E.Main[prop];
	} );
}(EFSVG, JSUTILS) );