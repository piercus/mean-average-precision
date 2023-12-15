const calculateAp = require('./calculate-ap');

/**
* Compute the mAP
* @param {MatchPredictionsByLabel} matchPredictionsByLabel
* @param {Boolean} perLabel
* @returns {Number | PerLabelMAP}
*/
/**
* @typedef {Object} PerLabelMAP
* @property {Number} mAP
* @property {Array.<APDetail>} aps
*/
/**
* @typedef {Object} APDetail
* @property {Number} ap
* @property {String} label
*/
module.exports = function (matchPredictionsByLabel, perLabel = false) {
	const uniqueLabels = Object.keys(matchPredictionsByLabel);

	const aps = {};

	uniqueLabels.forEach(l => {
		aps[l] = {ap: calculateAp(matchPredictionsByLabel[l]), label: l};
	});

	const l = uniqueLabels.length;
	const mAP = Object.values(aps).reduce((a, b) => a + b.ap, 0) / l;

	if (perLabel) {
		return {mAP, aps: Object.values(aps)};
	}
	return mAP;
};
