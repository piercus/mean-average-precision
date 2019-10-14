const listMisclassifiedPerLabel = require('./list-misclassified-per-label');

/**
* @typedef {Object} PerLabelMisclassified
* @property {Array.<Prediction>} misclassified
* @property {Object} perLabel
* @property {String} perLabel.label
* @property {Array.<Prediction>} perLabel.misclassified
*/

/**
* @param {Array.<Prediction>} opts.groundTruths
* @param {Array.<ConfidencePrediction>} opts.predictions
* @param {Number} [iouThreshold = 0.5]
* @param {Boolean} [perLabel = false]
* @returns {(Array.<Prediction>|PerLabelMisclassified)} misclassified predictions
*/

module.exports = function ({
	groundTruths,
	predictions,
	iouThreshold,
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

		return {label: l, misclassified: listMisclassifiedPerLabel({groundTruthsLabel, predictionsLabel, iouThreshold})};
	});

	const misclassified = aps.reduce((a, b) => a.concat(b.misclassified), []);

	if (perLabel) {
		return {misclassified, perLabel: aps};
	}
	return misclassified;
};
