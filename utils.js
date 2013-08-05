var UT = (function(){
	var u = {};

//------------------------------------------------------------------------------------------------------------------------------
	// Shortcut for the <for> loop
	u.forEachIn = function(array, callback) {
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

//------------------------------------------------------------------------------------------------------------------------------
		// Shortcut for the <for> loop that returns an array of results from each call of the loop
	u.resForEachIn = function(array, callback) {
		if(!array || !callback) return;
		var result = [];
		forEachIn(array, function (element) {
			result.push(callback(element));
		});
		return result;
	};

//------------------------------------------------------------------------------------------------------------------------------
	// Checks the real type of the variable
	u.typeOf = function(value) {
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

//------------------------------------------------------------------------------------------------------------------------------
	// Checks whether the variable is an Array
	u.isArray = function(variable) {
	    // Trying ECMAScript 5 built-in method
	    if(Array.isArray) {
	    	return Array.isArray(variable);
	    }
	    // Trying instanceOf (CAUTION: works only if the <variable> is from the same frame/window as the function call)
	    return variable instanceof Array;
	};

//------------------------------------------------------------------------------------------------------------------------------


	return u;
}());