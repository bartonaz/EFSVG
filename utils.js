// Generic utilities

var UT = (function(){
	var u = {};

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Loops through elements of array or object and applies the specified function to it
	 * @method forEachIn
	 * @param  {Array|Object}   array 	Array of object to each of which the function should be applied
	 * @param  {Function} callback	Function to be applied to each element of the array
	 * @return {NA}
	 */
	function forEachIn(array, callback) {
		if(!array || !callback) return;
		// Doing loop for array
		if(isArray(array)) {
			var ELEMENT_ID = array.length-1;
			do {
				callback(array[ELEMENT_ID]);
			} while (ELEMENT_ID--);
			return;
		}
		// Doing loop for object
		for(key in array) {
			callback(key);
		};
	};
	u.forEachIn = forEachIn;

//------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Loops through elements of array or object and puts each result of the function call into output array
	 * @method resForEachIn
	 * @param  {Array|Object}     array  Array of object to each of which the function should be applied
	 * @param  {Function}   callback	Function to be applied to each element of the array
	 * @return {Array} Array of results from each call to each element
	 */
	function resForEachIn(array, callback) {
		if(!array || !callback) return;
		var result = [];
		forEachIn(array, function (element) {
			result.push(callback(element));
		});
		return result;
	};
	u.resForEachIn = resForEachIn;

//------------------------------------------------------------------------------------------------------------------------------
	// Checks the real type of the variable
	function typeOf(value) {
	    var s = typeof value;
	    if (s === 'object') {
	        if (value) {
	            if (value instanceof Array) {
	                s = 'array';
	            }
	        } else {
	            s = 'null';
	        }
	    }
	    return s;
	};
	u.typeOf = typeOf;

//------------------------------------------------------------------------------------------------------------------------------
	// Checks whether the variable is an Array
	function isArray(variable) {
	    // Trying ECMAScript 5 built-in method
	    if(Array.isArray) {
	    	return Array.isArray(variable);
	    }
	    // Trying instanceOf (CAUTION: works only if the <variable> is from the same frame/window as the function call)
	    return variable instanceof Array;
	};
	u.isArray = isArray;

//------------------------------------------------------------------------------------------------------------------------------


	return u;
}());