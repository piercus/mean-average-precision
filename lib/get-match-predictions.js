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
* @param {Number} [threshold] when using dist you should use threshold
* @param {DistFn} [dist]
* @returns {Array.<MatchLabelPrediction>}
*/

module.exports = function ({
	groundTruthsLabel,
	predictionsLabel,
	iouThreshold = 0.5,
	threshold,
	dist
}) {
	if (typeof (dist) === 'function' && typeof (threshold) !== 'number') {
		throw (new TypeError('dist and threshold must be defined together'));
	}
	let thresholdDist;
	if (typeof (dist) === 'function') {
		thresholdDist = threshold;
	} else {
		thresholdDist = 1 - iouThreshold;
	}
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
					let value;
					if (typeof (dist) === 'function') {
						value = dist(p, g);
					} else {
						value = 1 - iou(p, g);
					}
					if (value <= thresholdDist) {
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
