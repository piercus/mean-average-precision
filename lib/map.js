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
* @typedef {Object} PerLabelMAP
* @property {Number} mAP
* @property {Object} aps
* @property {String} aps.label
* @property {Number} aps.ap
*/

/**
* @typedef {Prediction} ConfidencePrediction
* @property confidence
*/
/**
* @callback DistFn
* @param {ConfidencePrediction} b
* @param {Prediction} a
* @returns {Number}
*/
/**
* @param {Array.<Prediction>} opts.groundTruths
* @param {Array.<ConfidencePrediction>} opts.predictions
* @param {Number} [iouThreshold = 0.5]
* @param {Number} [threshold] when using dist you should use threshold
* @param {DistFn} [dist]
* @param {Boolean} [perLabel = false]
* @returns {(Number|PerLabelMAP)} mAP
*/

module.exports = function ({
	groundTruths,
	predictions,
	iouThreshold,
	threshold,
	dist,
	perLabel = false
}) {
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

		return {label: l, ap: ap({groundTruthsLabel, predictionsLabel, iouThreshold, threshold, dist})};
	});

	const l = aps.length;
	const mAP = aps.reduce((a, b) => a + b.ap, 0) / l;
	if (perLabel) {
		return {mAP, aps};
	}
	return mAP;
};
