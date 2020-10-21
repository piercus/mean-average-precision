const test = require('ava');
const {apScore} = require('..');

const tolerance = 1e-3;
test('apScore 4 els', t => {
	const values = [{
		gt: 0,
		confidence: 0.1
	}, {
		gt: 0,
		confidence: 0.4
	}, {
		gt: 1,
		confidence: 0.35
	}, {
		gt: 1,
		confidence: 0.8
	}];
	t.true(Math.abs(apScore(values) - 0.83333333) < tolerance);
});
test('apScore 11 els', t => {
/**
Import numpy as np
from sklearn.metrics import average_precision_score
y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1])
y_scores = np.array([0.1, 0.4, 0.35, 0.8, 0.35, 0.1, 0.6, 0.6, 0.5, 0.2, 0.3])
average_precision_score(y_true, y_scores)
from sklearn.metrics import precision_recall_curve
precision_recall_curve(y_true, y_scores)
(array(
	[
		0.54545455,
		0.55555556,
		0.5       ,
		0.42857143,
		0.4       ,
		0.5       ,
		0.66666667,
		1.        ,
		1.
	]),

	array([
		1.        ,
		0.83333333,
		0.66666667,
		0.5       ,
		0.33333333,
		0.33333333,
		0.33333333,
		0.16666667,
		0.
	]),
			array([
				0.1 ,
				0.2 ,
				0.3 ,
				0.35,
				0.4 ,
				0.5 ,
				0.6 ,
				0.8
			]))
*/

	const values = [{
		gt: 0,
		confidence: 0.1
	}, {
		gt: 0,
		confidence: 0.4
	}, {
		gt: 1,
		confidence: 0.35
	}, {
		gt: 1,
		confidence: 0.8
	}, {
		gt: 0,
		confidence: 0.35
	}, {
		gt: 1,
		confidence: 0.1
	}, {
		gt: 0,
		confidence: 0.6
	}, {
		gt: 1,
		confidence: 0.6
	}, {
		gt: 0,
		confidence: 0.5
	}, {
		gt: 1,
		confidence: 0.2
	}, {
		gt: 1,
		confidence: 0.3
	}];
	const score = apScore(values);
	t.true(Math.abs(score - 0.616041) < tolerance);
});
