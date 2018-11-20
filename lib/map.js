const ap = require('./ap');

/**
* @typedef {Rect} Prediction
* @property {string} filename
* @property {string} label
*/
/**
* @typedef {Object} Rect
* @property {number} left
* @property {number} top
* @property {number} right
* @property {number} bottom
*/

/**
* @typedef {Prediction} ConfidencePrediction
* @property confidence
*/

/**
* @param {Array.<Prediction>} opts.groundTruths
* @param {Array.<ConfidencePrediction>} opts.predictions
* @param {Number} [opts.iouThreshold = 0.5]
*/

module.exports = function ({
	groundTruths,
	predictions,
	iouThreshold = 0.5} = {}) {
		
	if (!Array.isArray(groundTruths)) {
		throw (new TypeError('groundTruths must be an array'));
	}
	if (!Array.isArray(predictions)) {
		throw (new TypeError('predictions must be an array'));
	}

	const labels = groundTruths.map(({label}) => label).concat(predictions.map(({label}) => label));
	const uniqueLabels = labels.filter((l, index) => labels.indexOf(l) === index);

	const aps = uniqueLabels.map(l => {
		const groundTruthsLabel = groundTruths.filter(({label}) => label === l).map(o => Object.assign({}, o, {match: false}));
		const predictionsLabel = predictions.filter(({label}) => label === l).map(o => Object.assign({}, o, {match: false}));

		return ap({groundTruthsLabel, predictionsLabel, iouThreshold});
	});

	const l = aps.length;
	return aps.reduce((a, b) => a + b, 0) / l;
};
