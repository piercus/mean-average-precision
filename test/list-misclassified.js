const test = require('ava');
const listMisclassified = require('../lib/list-misclassified.js');

test('basic example', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: 'car',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image1.jpg',
		confidence: 0.9,
		label: 'car',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		confidence: 0.7,
		left: 32,
		top: 39,
		right: 452,
		bottom: 92
	}, {
		filename: 'image1.jpg',
		confidence: 0.5,
		label: 'car',
		left: 541,
		top: 42,
		right: 621,
		bottom: 94
	}];

	const res = listMisclassified({
		groundTruths,
		predictions
	});

	t.deepEqual(res, [{
		filename: 'image1.jpg',
		confidence: 0.5,
		label: 'car',
		left: 541,
		top: 42,
		match: false,
		right: 621,
		bottom: 94
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		confidence: 0.7,
		left: 32,
		match: false,
		top: 39,
		right: 452,
		bottom: 92
	}]);
});

test('test case: if perLabel defined should return object with all misclassified object and an array of misclassified per labels ', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: 'car',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image1.jpg',
		confidence: 0.9,
		label: 'car',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		confidence: 0.7,
		left: 32,
		top: 39,
		right: 452,
		bottom: 92
	}, {
		filename: 'image1.jpg',
		confidence: 0.5,
		label: 'car',
		left: 541,
		top: 42,
		right: 621,
		bottom: 94
	}];

	const res = listMisclassified({
		groundTruths,
		predictions,
		perLabel: true
	});

	t.true(Array.isArray(res.perLabel));
	t.true(res.perLabel.length === 2);
	t.true(res.perLabel[0].label === 'car');
	t.true(res.perLabel[1].label === 'pedestrian');
	t.deepEqual(res.misclassified, [{
		filename: 'image1.jpg',
		confidence: 0.5,
		label: 'car',
		left: 541,
		top: 42,
		match: false,
		right: 621,
		bottom: 94
	}, {
		filename: 'image1.jpg',
		label: 'pedestrian',
		confidence: 0.7,
		left: 32,
		match: false,
		top: 39,
		right: 452,
		bottom: 92
	}]);
});
