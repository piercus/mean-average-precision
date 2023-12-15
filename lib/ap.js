const getMatchPredictions = require('./get-match-predictions');
const calculateAp = require('./calculate-ap');
/**
* Compute the AP (average precision) of a list of predictions agains a groundTruth
* @param {Array.<LabelPrediction>} opts.groundTruthsLabel
* @param {Array.<ConfidenceLabelPrediction>} opts.predictionsLabel
* @param {Number} [opts.iouThreshold = 0.5]
* @param {Number} [threshold] when using dist you should use threshold
* @param {DistFn} [dist]
* @returns {number}
*/

module.exports = function ({
	groundTruthsLabel,
	predictionsLabel,
	iouThreshold = 0.5,
	threshold,
	dist
}) {
	const sortedPreds = getMatchPredictions({
		groundTruthsLabel,
		predictionsLabel,
		iouThreshold,
		threshold,
		dist
	});
	return calculateAp({
		matchPredictions: sortedPreds,
		groundTruthLength: groundTruthsLabel.length
	});
};
