const calculateMap = require('./calculate-map');
const getMatchPredictionsByLabel = require('./get-match-predictions-by-label');

/**
* @typedef {Rect} Prediction
* @property {string} filename
* @property {string} label
*/
/**
* @typedef {Object} Rect
* @property {number} left
* @property {number} top
* @property {number} right
* @property {number} bottom
*/

/**
* @typedef {Object} PerLabelMAP
* @property {Number} mAP
* @property {Object} aps
* @property {String} aps.label
* @property {Number} aps.ap
*/

/**
* @typedef {Prediction} ConfidencePrediction
* @property confidence
*/
/**
* @callback DistFn
* @param {ConfidencePrediction} b
* @param {Prediction} a
* @returns {Number}
*/
/**
* @param {Array.<Prediction>} opts.groundTruths
* @param {Array.<ConfidencePrediction>} opts.predictions
* @param {Number} [iouThreshold = 0.5]
* @param {Number} [threshold] when using dist you should use threshold
* @param {DistFn} [dist]
* @param {Boolean} [perLabel = false]
* @returns {(Number|PerLabelMAP)} mAP
*/

module.exports = function (opts) {
	const {
		perLabel = false
	} = opts;

	const matchPredictionsByLabel = getMatchPredictionsByLabel(opts);

	return calculateMap(matchPredictionsByLabel, perLabel);
};
