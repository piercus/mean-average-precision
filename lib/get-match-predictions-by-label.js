const getMatchPredictions = require('./get-match-predictions');
/**
* Compute the
* @param {Array.<LabelPrediction>} opts.groundTruthsLabel
* @param {Array.<ConfidenceLabelPrediction>} opts.predictionsLabel
* @param {Number} [opts.iouThreshold = 0.5]
* @param {Number} [threshold] when using dist you should use threshold
* @param {DistFn} [dist]
* @returns {MatchPredictionsByLabel}
*/

/**
 * @typedef {Object.<String, MatchPredictionAndGTLength>} MatchPredictionsByLabel
 */

/**
 * @typedef {Object} MatchPredictionAndGTLength
 * @property {Array.<MatchLabelPrediction>} matchPredictions
 * @property {Number} groundTruthLength
 */
module.exports = function ({
	groundTruths,
	predictions,
	iouThreshold,
	threshold,
	dist
}) {
	if (!Array.isArray(groundTruths)) {
		throw (new TypeError('groundTruths must be an array'));
	}
	if (!Array.isArray(predictions)) {
		throw (new TypeError('predictions must be an array'));
	}

	const labels = groundTruths.map(({label}) => label).concat(predictions.map(({label}) => label));
	const uniqueLabels = labels.filter((l, index) => labels.indexOf(l) === index);
	const res = {};

	uniqueLabels.forEach(l => {
		const groundTruthsLabel = groundTruths.filter(({label}) => label === l).map(o => Object.assign({}, o, {match: false}));
		const predictionsLabel = predictions.filter(({label}) => label === l).map(o => Object.assign({}, o, {match: false}));

		res[l] = {
			matchPredictions: getMatchPredictions({
				groundTruthsLabel,
				predictionsLabel,
				iouThreshold,
				threshold,
				dist
			}),
			groundTruthLength: groundTruthsLabel.length
		};
	});

	return res;
};
