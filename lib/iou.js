/**
* Calculate intersection
* @param {Rect} p1
* @param {Rect} p2
* @returns {Rect}
*/
const overlap = function (p1, p2) {
	if (p1.right < p2.left || p2.right < p1.left || p1.bottom < p2.top || p2.bottom < p1.top) {
		return null;
	}

	return {
		left: (p1.left > p2.left ? p1.left : p2.left),
		right: (p1.right < p2.right ? p1.right : p2.right),
		top: (p1.top > p2.top ? p1.top : p2.top),
		bottom: (p1.bottom < p2.bottom ? p1.bottom : p2.bottom)
	};
};

/**
* Check rect is well defined
* @param {Rect} p
* @throws Error
* @returns {null}
*/
const sanityRectCheck = function (p) {
	const numbers = [p.left, p.right, p.top, p.left];
	numbers.forEach(n => {
		if (typeof (n) !== 'number' || isNaN(n)) {
			throw (new TypeError(`sanitization issue with ${JSON.stringify(p)} \n it should be {left: <number>, top:<number>, right: <number>, bottom: <number>}`));
		}
	});

	if (p.left > p.right) {
		throw (new Error(`left should be < right ${JSON.stringify(p)}`));
	}
	if (p.top > p.bottom) {
		throw (new Error(`top should be < bottom ${JSON.stringify(p)}`));
	}
};

/**
* This file calcultae the IoU value = intersection of unions
* Calculate (area of overlap)/(area of union)
* @param {Rect} p
* @returns {number}
*/
const area = function (p) {
	sanityRectCheck(p);
	return (p.right - p.left) * (p.bottom - p.top);
};

/**
* This file calcultae the IoU value = intersection of unions
* Calculate (area of overlap)/(area of union)
* @param {Prediction} p1
* @param {Prediction} p2
* @returns {number}
*/

module.exports = function (p1, p2) {
	sanityRectCheck(p1);
	sanityRectCheck(p2);
	const intersect = overlap(p1, p2);
	if (!intersect) {
		return 0;
	}
	const overlapArea = area(intersect);
	const unionArea = area(p1) + area(p2) - overlapArea;
	return overlapArea / unionArea;
};
