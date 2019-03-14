const iou = require('./iou');

/**
* @typedef {MatchLabelPrediction} ConfidenceLabelPrediction
* @property {Boolean} match
*/

/**
* compute the AP (average precision) of a list of predictions agains a groundTruth
* @param {Array.<LabelPrediction>} opts.groundTruthsLabel
* @param {Array.<ConfidenceLabelPrediction>} opts.predictionsLabel
* @param {Number} [opts.iouThreshold = 0.5]
* @returns {Array.<MatchLabelPrediction>}
*/

module.exports = function ({
	groundTruthsLabel,
	predictionsLabel,
	iouThreshold = 0.5
}) {
	const filenames = groundTruthsLabel.map(({filename}) => filename).concat(predictionsLabel.map(({filename}) => filename));
	const uniqueFilenames = filenames.filter((f, index) => filenames.indexOf(f) === index);

	uniqueFilenames.forEach(f => {
		const groundTruthsLabelFilename = groundTruthsLabel.filter(({filename}) => filename === f);// We copy it
		const predictionsLabelFilename = predictionsLabel.filter(({filename}) => filename === f);
		predictionsLabelFilename.sort((a, b) => {
			return b.confidence - a.confidence;
		}).forEach(p => {
			groundTruthsLabelFilename.forEach(g => {
				if (!g.match && !p.match) {
					const valueIoU = iou(p, g);
					if (valueIoU > iouThreshold) {
						g.match = p;
						p.match = g;
					}
				}
			});
		});
	});

	const sortedPreds = predictionsLabel.sort((a, b) => {
		return b.confidence - a.confidence;
	});

	return sortedPreds;
};
