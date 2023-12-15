/**
* Authors : Samuel Sallaud-Pujade and Pierre Colle
*/
const iou = require('./iou');

const uniq = arr => arr.filter((a, index) => arr.indexOf(a) === index);

/**
* @param  {Array.<Annotation>} predictions consolidated annotation on a specific image
* @param  {Number} threshold
* @param  {Callback>} distFn
* @param  {String>} scoreKey
* @param  {Callback>} mapFn
* @returns {Array.<Annotation>}
*/

const identity = x => x;

const defaultDist = function (a, b) {
	return 1 - iou(a, b);
};

module.exports = function ({dist = defaultDist, threshold, predictions, scoreKey = 'confidence', mapFn = identity}) {
	const removeList = [];

	const mappedList = predictions.map(mapFn);

	const sortedList = mappedList
		.map((a, index) => Object.assign({}, a, {index}))
		.sort((a, b) => b[scoreKey] - a[scoreKey]);
	
	const matrix = sortedList.map((a, indexA) => sortedList.map((b, indexB) => {
		if(indexA >= indexB){
			return false
		}
		if ((a.label !== b.label) || dist(a, b) >= threshold) {
			return false;
		}

		return true;
	}));

	sortedList.forEach((annotation, currentIndex) => {
		matrix[currentIndex].forEach((cell, otherIndex) => {
			if (cell && otherIndex > currentIndex && !removeList.includes(sortedList[currentIndex].index)) {
				removeList.push(sortedList[otherIndex].index);
			}
		});
	});

	return uniq(removeList);
};
