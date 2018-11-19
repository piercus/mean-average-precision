const iou = require('./iou');
/**
* @typedef {Rect} LabelPrediction
* @property {string} filename
*/
/**
* @typedef {LabelPrediction} ConfidenceLabelPrediction
* @property confidence
*/

/**
* compute the AP (average precision) of a list of predictions agains a groundTruth
* @param {Array.<LabelPrediction>} opts.groundTruthsLabel
* @param {Array.<ConfidenceLabelPrediction>} opts.predictionsLabel
* @returns {number}
*/

module.exports = function ({
	groundTruthsLabel,
	predictionsLabel
}) {
	if (groundTruthsLabel.length === 0 || predictionsLabel.length === 0) {
		return 0;
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
					const valueIoU = iou(p, g);
					if (valueIoU > 0.5) {
						g.match = p;
						p.match = g;
					}
				}
			});
		});
	});

	let cumulativeTp = 0;
	let numberInCumulativ = 0;

	const sortedPreds = predictionsLabel.sort((a, b) => {
		return b.confidence - a.confidence;
	});

	const curve = sortedPreds.map(p => {
		cumulativeTp += p.match ? 1 : 0;
		numberInCumulativ += 1;
		return {
			precision: cumulativeTp / numberInCumulativ,
			recall: cumulativeTp / groundTruthsLabel.length
		};
	});

	const smooth = [{
		precision: Math.max(...curve.map(({precision}) => precision)),
		recall: 0
	}].concat(curve.map((value, index) => {
		const {recall} = value;
		return {
			precision: Math.max(...curve.slice(index).map(({precision}) => precision)),
			recall
		};
	}));

	// Exact area calculation is not inline with http://homepages.inf.ed.ac.uk/ckiw/postscript/ijcv_voc09.pdf
	//
	// let previousRecall = 0;
	// for (let i = 0; i < smooth.length; i++) {
	// 	const {precision, recall} = smooth[i];
	// 	area += precision * (recall - previousRecall);
	// 	previousRecall = recall;
	// }

	// we are using 11 bars calculation instead

	const origin = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
	const eleven = origin.length;
	let area = 0;

	let currentJ = 0;
	for (let i = 0; i < eleven; i++) {
		while (smooth[currentJ] && smooth[currentJ].recall < origin[i]) {
			currentJ++;
		}
		if (smooth[currentJ]) {
			area += Number(smooth[currentJ].precision) / eleven;
		}
	}

	return area;
};
