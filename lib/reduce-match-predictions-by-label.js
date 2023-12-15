/**
* @param {MatchPredictionsByLabel} matchPredictionsByLabelA
* @param {MatchPredictionsByLabel} matchPredictionsByLabelB
* @returns {MatchPredictionsByLabel}
*/

module.exports = function (matchPredictionsByLabelA, matchPredictionsByLabelB) {
	const res = {};
	const labels = Object.keys(matchPredictionsByLabelA).concat(Object.keys(matchPredictionsByLabelB));
	const uniqueLabels = labels.filter((l, index) => labels.indexOf(l) === index);

	uniqueLabels.forEach(l => {
		const matchPredictionsA = matchPredictionsByLabelA[l] ? matchPredictionsByLabelA[l].matchPredictions : [];
		const matchPredictionsB = matchPredictionsByLabelB[l] ? matchPredictionsByLabelB[l].matchPredictions : [];
		const matchPredictions = matchPredictionsA.concat(matchPredictionsB);
		matchPredictions.sort((a, b) => {
			return b.confidence - a.confidence;
		});
		const groundTruthLength = (
			matchPredictionsByLabelA[l] ? matchPredictionsByLabelA[l].groundTruthLength : 0
		) + (
			matchPredictionsByLabelB[l] ? matchPredictionsByLabelB[l].groundTruthLength : 0
		);

		res[l] = {
			groundTruthLength,
			matchPredictions
		};
	});

	return res;
};
