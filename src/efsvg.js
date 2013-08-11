/**
 * Module for creating and manipulation of SVG elements with synchronizeable higher order properties
 * @module EFSVG
 * @main EFSVG
 */

var EFSVG;
if (!EFSVG) EFSVG = {};

// List of properties from the Main class to be set directly to the Module
var childList = [ "version", "el", "log", "svgNS", "svgNSLink", "svgVer" ];
// Setting Main class properties as public module properties
JSUTILS.Gen.forEachIn(childList, function (prop) {
	EFSVG[prop] = EFSVG.Main[prop];
});