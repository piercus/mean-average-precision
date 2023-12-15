/**
* @typedef {Object} ApScoreValue
* @property {Boolean} gt
* @property {Number} confidence
*/

const cumsum = function (arr) {
	let cumul = 0;
	const result = [];
	for (let i = 0; i < arr.length; i++) {
		cumul += arr[i];
		result.push(cumul);
	}
	return result;
};

const binaryClfCurve = function (values) {
	const descConfidenceIndices = values
		.map(({confidence}, index) => ({confidence, index}))
		.sort((a, b) => b.confidence - a.confidence)
		.map(({index}) => index);

	const tolerance = 1e-15;
	const tpsBfCumul = descConfidenceIndices.map(i => values[i].gt ? 1 : 0);
	const tpsAll = cumsum(tpsBfCumul);

	const all = descConfidenceIndices
		.slice(1)
		.map((_, i) => {
			return {
				descIndex: i,
				distinct: Math.abs(values[descConfidenceIndices[i]].confidence - values[descConfidenceIndices[i + 1]].confidence) > tolerance
			};
		});

	const distinctConfidenceDescIndices = all
		.filter(({distinct}) => distinct)
		.map(({descIndex}) => descIndex)
		.concat([descConfidenceIndices.length - 1]);

	const tpsThresholds = distinctConfidenceDescIndices.map(descIndex => tpsAll[descIndex]);
	const fpsThresholds = distinctConfidenceDescIndices.map((v, thIndex) => 1 + v - tpsThresholds[thIndex]);

	return {
		tps: tpsThresholds,
		fps: fpsThresholds,
		thresholds: distinctConfidenceDescIndices.map(descIndex => values[descConfidenceIndices[descIndex]].confidence)
	};
};

const precisionRecallCurve = function (values) {
	const {thresholds, tps, fps} = binaryClfCurve(values);
	let precision = tps.map((_, index) => tps[index] / (tps[index] + fps[index]));
	precision = precision.map(p => Number.isNaN(p) ? 0 : p);

	const lastTp = tps[tps.length - 1];
	const recall = tps.map(tp => tp / lastTp);

	// Stop when full recall attained
	// and reverse the outputs so recall is decreasing
	const lastInd = tps.map((value, index) => ({value, index})).filter(({value}) => value === lastTp)[0].index;
	const reverseIndices = new Array(lastInd + 1).fill(0).map((_, i) => lastInd - i);

	return {
		precision: reverseIndices.map(i => precision[i]).concat([1]),
		recall: reverseIndices.map(i => recall[i]).concat([0]),
		thresholds: reverseIndices.map(i => thresholds[i])
	};
};
/**
* Compute average precision (AP) from prediction scores
* inspired from https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html
* @param {Array.<ApScoreValue>} values list of couples boolean/confidence
* @return {Number} the average precision
*/
module.exports = function (values) {
	const {precision, recall} = precisionRecallCurve(values);
	let area = 0;
	for (let i = 0; i < precision.length - 1; i++) {
		area += precision[i] * (recall[i] - recall[i + 1]);
	}
	return area;
};
