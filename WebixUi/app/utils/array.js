/**
 * Singleton class provide helpful method relate to array.
 *
 * Created by Phuttipong on 17/6/2559.
 */
var arrayPrototype = Array.prototype;
var supportsSplice = (function () {
    var array = [],
        lengthBefore,
        j = 20;

    if (!array.splice) {
        return false;
    }

    // This detects a bug in IE8 splice method: 
    // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/ 

    while (j--) {
        array.push("A");
    }

    array.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F");

    lengthBefore = array.length; //41 
    array.splice(13, 0, "XXX"); // add one element 

    if (lengthBefore + 1 !== array.length) {
        return false;
    }
    // end IE8 bug 

    return true;
}());
var supportsIndexOf = 'indexOf' in arrayPrototype;
var slice = arrayPrototype.slice;

var fixArrayIndex = function (array, index) {
    return (index < 0) ? Math.max(0, array.length + index)
        : Math.min(array.length, index);
};

var replaceSim = function (array, index, removeCount, insert) {
    var add = insert ? insert.length : 0,
        length = array.length,
        pos = fixArrayIndex(array, index);

    // we try to use Array.push when we can for efficiency...
    if (pos === length) {
        if (add) {
            array.push.apply(array, insert);
        }
    } else {
        var remove = Math.min(removeCount, length - pos),
            tailOldPos = pos + remove,
            tailNewPos = tailOldPos + add - remove,
            tailCount = length - tailOldPos,
            lengthAfterRemove = length - remove,
            i;

        if (tailNewPos < tailOldPos) { // case A
            for (i = 0; i < tailCount; ++i) {
                array[tailNewPos + i] = array[tailOldPos + i];
            }
        } else if (tailNewPos > tailOldPos) { // case B
            for (i = tailCount; i--;) {
                array[tailNewPos + i] = array[tailOldPos + i];
            }
        } // else, add == remove (nothing to do)

        if (add && pos === lengthAfterRemove) {
            array.length = lengthAfterRemove; // truncate array
            array.push.apply(array, insert);
        } else {
            array.length = lengthAfterRemove + add; // reserves space
            for (i = 0; i < add; ++i) {
                array[pos + i] = insert[i];
            }
        }
    }

    return array;
};

var eraseSim = function (array, index, removeCount) {
    return replaceSim(array, index, removeCount);
};

var eraseNative = function (array, index, removeCount) {
    array.splice(index, removeCount);
    return array;
};

//noinspection JSValidateJSDoc,JSCommentMatchesSignature
module.exports = {

    /**
     * Get the index of the provided `item` in the given `array`, a supplement for the
     * missing arrayPrototype.indexOf in Internet Explorer.
     *
     * @param {Array} array The array to check.
     * @param {Object} item The item to find.
     * @param {Number} from (Optional) The index at which to begin the search.
     * @return {Number} The index of item in the array (or -1 if it is not found).
     */
    indexOf: supportsIndexOf ? function (array, item, from) {
        return arrayPrototype.indexOf.call(array, item, from);
    } : function (array, item, from) {
        var i, length = array.length;

        for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Returns a new array with unique items.
     *
     * @param {Array} array
     * @return {Array} results
     */
    unique: function (array) {
        var clone = [],
            i = 0,
            ln = array.length,
            item;

        for (; i < ln; i++) {
            item = array[i];

            if (this.indexOf(clone, item) === -1) {
                clone.push(item);
            }
        }

        return clone;
    },

    /**
     * Removes items from an array. This is functionally equivalent to the splice method
     * of Array, but works around bugs in IE8's splice method and does not copy the
     * removed elements in order to return them (because very often they are ignored).
     *
     * @param {Array} array The Array on which to replace.
     * @param {Number} index The index in the array at which to operate.
     * @param {Number} removeCount The number of items to remove at index.
     * @return {Array} The array passed.
     * @method
     */
    erase: supportsSplice ? eraseNative : eraseSim,

    /**
     * Returns a shallow copy of a part of an array. This is equivalent to the native
     * call `Array.prototype.slice.call(array, begin, end)`. This is often used when "array"
     * is "arguments" since the arguments object does not supply a slice method but can
     * be the context object to `Array.prototype.slice`.
     *
     * @param {Array} array The array (or arguments object).
     * @param {Number} begin The index at which to begin. Negative values are offsets from
     * the end of the array.
     * @param {Number} end The index at which to end. The copied items do not include
     * end. Negative values are offsets from the end of the array. If end is omitted,
     * all items up to the end of the array are copied.
     * @return {Array} The copied piece of the array.
     * @method slice
     */
    // Note: IE8 will return [] on slice.call(x, undefined).
    slice: ([1, 2].slice(1, window.undefined).length ?
            function (array, begin, end) {
                return slice.call(array, begin, end);
            } :
            function (array, begin, end) {
                // see http://jsperf.com/slice-fix
                if (typeof begin === 'undefined') {
                    return slice.call(array);
                }
                if (typeof end === 'undefined') {
                    return slice.call(array, begin);
                }
                return slice.call(array, begin, end);
            }
    ),

    /**
     * Merge multiple arrays into one with unique items that exist in all of the arrays.
     *
     * @param {Array} array1
     * @param {Array} array2
     * @param {Array} etc
     * @return {Array} intersect
     */
    intersect: function () {
        var intersection = [],
            arrays = slice.call(arguments),
            arraysLength,
            array,
            arrayLength,
            minArray,
            minArrayIndex,
            minArrayCandidate,
            minArrayLength,
            element,
            elementCandidate,
            elementCount,
            i, j, k;

        if (!arrays.length) {
            return intersection;
        }

        // Find the smallest array
        arraysLength = arrays.length;
        for (i = minArrayIndex = 0; i < arraysLength; i++) {
            minArrayCandidate = arrays[i];
            if (!minArray || minArrayCandidate.length < minArray.length) {
                minArray = minArrayCandidate;
                minArrayIndex = i;
            }
        }

        minArray = this.unique(minArray);
        this.erase(arrays, minArrayIndex, 1);

        // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
        // an item in the small array, we're likely to find it before reaching the end
        // of the inner loop and can terminate the search early.
        minArrayLength = minArray.length;
        arraysLength = arrays.length;
        for (i = 0; i < minArrayLength; i++) {
            element = minArray[i];
            elementCount = 0;

            for (j = 0; j < arraysLength; j++) {
                array = arrays[j];
                arrayLength = array.length;
                for (k = 0; k < arrayLength; k++) {
                    elementCandidate = array[k];
                    if (element === elementCandidate) {
                        elementCount++;
                        break;
                    }
                }
            }

            if (elementCount === arraysLength) {
                intersection.push(element);
            }
        }

        return intersection;
    },

    /**
     * Perform a set difference A-B by subtracting all items in array B from array A.
     *
     * @param {Array} arrayA
     * @param {Array} arrayB
     * @return {Array} difference
     */
    difference: function (arrayA, arrayB) {
        var clone = slice.call(arrayA),
            ln = clone.length,
            i, j, lnB;

        for (i = 0, lnB = arrayB.length; i < lnB; i++) {
            for (j = 0; j < ln; j++) {
                if (clone[j] === arrayB[i]) {
                    this.erase(clone, j, 1);
                    j--;
                    ln--;
                }
            }
        }

        return clone;
    }
};


