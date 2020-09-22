const test = require('ava');
const ap = require('../lib/ap.js');

// Example inspired from https://medium.com/@jonathan_hui/map-mean-average-precision-for-object-detection-45c121a31173

test('5 apples example', t => {
	const groundTruthsLabel = [{
		filename: 'apple1.jpg',
		x: 22,
		y: 34
	}, {
		filename: 'apple1.jpg',
		x: 252,
		y: 34
	}, {
		filename: 'apple1.jpg',
		x: 152,
		y: 165
	}];

	const predictionsLabel = [{
		filename: 'apple1.jpg',
		x: 22,
		y: 34
	}, {
		filename: 'apple1.jpg',
		x: 252,
		y: 34
	}, {
		filename: 'apple1.jpg',
		x: 154,
		y: 165
	}];

	const res = ap({
		groundTruthsLabel,
		predictionsLabel,
		threshold: 1,
		dist: (a, b) => Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)))
	});

	t.is(Math.round(res * 10000) / 10000, 0.6364);
});
