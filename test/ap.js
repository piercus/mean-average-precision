const test = require('ava');
const ap = require('../lib/ap.js');

// Example inspired from https://medium.com/@jonathan_hui/map-mean-average-precision-for-object-detection-45c121a31173

test('5 apples example', t => {
	const groundTruthsLabel = [{
		filename: 'apple1.jpg',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple2.jpg',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple3.jpg',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple4.jpg',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple5.jpg',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictionsLabel = [{
		filename: 'apple1.jpg',
		left: 22,
		confidence: 1,
		top: 34,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple2.jpg',
		left: 22,
		top: 34,
		confidence: 0.9,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple2.jpg',
		left: 500,
		confidence: 0.8,
		top: 34,
		right: 831,
		bottom: 78
	}, {
		filename: 'apple1.jpg',
		left: 500,
		top: 34,
		confidence: 0.7,
		right: 831,
		bottom: 78
	}, {
		filename: 'apple1.jpg',
		left: 500,
		top: 234,
		confidence: 0.6,
		right: 831,
		bottom: 478
	}, {
		filename: 'apple3.jpg',
		left: 22,
		top: 34,
		confidence: 0.5,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple4.jpg',
		left: 22,
		top: 34,
		confidence: 0.4,
		right: 231,
		bottom: 78
	}, {
		filename: 'apple3.jpg',
		left: 600,
		top: 34,
		confidence: 0.3,
		right: 731,
		bottom: 78
	}, {
		filename: 'apple4.jpg',
		left: 600,
		top: 34,
		confidence: 0.2,
		right: 731,
		bottom: 78
	}, {
		filename: 'apple5.jpg',
		left: 22,
		top: 34,
		confidence: 0.1,
		right: 231,
		bottom: 78
	}];

	const res = ap({
		groundTruthsLabel,
		predictionsLabel
	});

	t.is(Math.round(res * 10000) / 10000, Math.round(((5 * 1.0) + (4 * 0.5714285714285714) + (2 * 0.5)) / 11 * 10000) / 10000);
});

