/**
* Compute the AP (average precision) from a MatchLabelPrediction array
* @param {MatchPredictionAndGTLength} opts
*/

module.exports = function (opts) {
	const {matchPredictions, groundTruthLength} = opts;
	if (groundTruthLength === 0 || matchPredictions.length === 0) {
		return 0;
	}
	let cumulativeTp = 0;
	let numberInCumulativ = 0;

	const curve = matchPredictions.map(p => {
		cumulativeTp += p.match ? 1 : 0;
		numberInCumulativ += 1;
		return {
			precision: cumulativeTp / numberInCumulativ,
			recall: cumulativeTp / groundTruthLength
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
