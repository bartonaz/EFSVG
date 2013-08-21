/**
 * @module JSUTILS
 */

var JSUTILS;
if (!JSUTILS) JSUTILS = {};

/**
 * Generic Javascript utilities
 * @class Gen
 */
JSUTILS.Gen = (function (J) {
    
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
     * Checks whether the variable is Array
     * @method isArray
     * @param  {Mixed}  variable Variable to be checked
     * @return {Boolean} True if variable is Array
     */
    function isArray(variable) {
        // Trying ECMAScript 5 built-in method (Works much faster)
        if (Array.isArray) {
            return Array.isArray(variable);
        }
        // Trying instanceOf (CAUTION: works only if the <variable> is from the same frame/window as the function call)
        return variable instanceof Array;
    };

    U.isArray = isArray;


//------------------------------------------------------------------------------------------------------------------------------

    /**
     * Determines whether the object is of DOM type
     * @method isDomObject
     * @param  {Object}    obj Object to be checked
     * @return {Boolean}       Whether the input object is DOM object
     */
    function isDomObject(obj) {

        if (!obj.nodeType) return false;
        return true;

    };

    U.isDomObject = isDomObject;

//------------------------------------------------------------------------------------------------------------------------------

    /**
     * Determines whether the object is a DOM element
     * @method isDomElement
     * @param  {Object}    obj Object to be checked
     * @return {Boolean}       Whether the input object is DOM element
     */
    function isDomElement(obj) {

        if (!isDomObject(obj)) return false; 
        if (obj.nodeType === 1) return true;
        return false;

    }

    U.isDomElement = isDomElement;

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Checks the real type of the variable (Distinguishes <Array> from <Object>)
     * @method typeOf
     * @param  {Mixed} variable Variable to be checked for its type
     * @return {String} Type of the input variable
     */
    function typeOf(variable) {
        var s = typeof variable;
        if (s === 'object') {
            if (variable) {
                if (isArray(variable)) {
                    s = 'array';
                }
            } else {
                s = 'null';
            }
        }
        return s;
    };

    U.typeOf = typeOf;

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Loops through elements of array or object and applies the specified function to it
     * @method forEachIn
     * @param  {Array|Object}   array   Array of object to each of which the function should be applied
     * @param  {Function} callback  Function to be called on each element of the array
     */
    function forEachIn(array, callback) {
        if (!array || !callback) { return; }
        // Doing loop for array
        if (isArray(array)) {
            var ELEMENT_ID = array.length - 1;
            do {
                callback(array[ELEMENT_ID]);
            } while (ELEMENT_ID--);
            return;
        }
        // Doing loop for object
        for (var key in array) {
            callback(key);
        };
    };

    U.forEachIn = forEachIn;

//------------------------------------------------------------------------------------------------------------------------------
    /**
     * Loops through elements of array or object and puts each result of the function call into output array
     * @method resForEachIn
     * @param  {Array|Object}     array  Array of object to each of which the function should be applied
     * @param  {Function}   callback    Function to be applied to each element of the array
     * @return {Array} Array of results from each call to each element
     */
    function resForEachIn(array, callback) {
        if (!array || !callback) return;
        var result = [];
        forEachIn(array, function (element) {
            result.push(callback(element));
        });
        return result;
    };

    U.resForEachIn = resForEachIn;

//------------------------------------------------------------------------------------------------------------------------------

    return U;

}(JSUTILS))