const listMisclassifiedPerLabel = require('./list-misclassified-per-label');

/**
* @param {Array.<Prediction>} opts.groundTruths
* @param {Array.<ConfidencePrediction>} opts.predictions
* @param {Number} [iouThreshold = 0.5]
* @returns {Array.<Prediction>} misclassified predictions
*/

module.exports = function ({
	groundTruths,
	predictions,
	iouThreshold
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

		return listMisclassifiedPerLabel({groundTruthsLabel, predictionsLabel, iouThreshold});
	});

	return aps.reduce((a, b) => a.concat(b), []);
};
