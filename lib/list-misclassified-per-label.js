const getMatchPredictions = require('./get-match-predictions');

/**
* @param {Array.<LabelPrediction>} opts.groundTruthsLabel
* @param {Array.<ConfidenceLabelPrediction>} opts.predictionsLabel
* @param {Number} [opts.iouThreshold = 0.5]
* @returns {Array.<LabelPrediction>}
*/

module.exports = function ({
	groundTruthsLabel,
	predictionsLabel,
	iouThreshold = 0.5
}) {
	return getMatchPredictions({
		groundTruthsLabel,
		predictionsLabel,
		iouThreshold
	}).filter(p => !p.match);
};
