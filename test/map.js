const test = require('ava');
const mAP = require('..');

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

	const res = mAP({
		groundTruths,
		predictions
	});

	t.is(Math.round(res * 10000) / 10000, 0.5);
});

test('test case: same filename and label for prediction and groundTruth', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: '4_whi_bla',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image1.jpg',
		confidence: 1,
		label: '4_whi_bla',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}];
	const res = mAP({
		groundTruths,
		predictions
	});

	t.true(Math.round(res * 10000) / 10000 >= 0);
	t.true(Math.round(res * 10000) / 10000 <= 1);
});

test('test case: same filename and different labels for prediction and groundTruth', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: '4_whi_bla',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image1.jpg',
		confidence: 1,
		label: '4_bla_whi',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}];
	const res = mAP({
		groundTruths,
		predictions
	});

	t.is(res, 0);
});

test('test case: filename and label are different between prediction and groundTruth', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: '4_whi_bla',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image2.jpg',
		confidence: 1,
		label: '4_bla_whi',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}];
	const res = mAP({
		groundTruths,
		predictions
	});

	t.is(res, 0);
});

test('test case: different filenames and and same label between prediction and groundTruth', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: '4_whi_bla',
		left: 22,
		top: 34,
		right: 231,
		bottom: 78
	}];

	const predictions = [{
		filename: 'image2.jpg',
		confidence: 1,
		label: '4_whi_bla',
		left: 25,
		top: 38,
		right: 201,
		bottom: 90
	}];
	const res = mAP({
		groundTruths,
		predictions
	});

	t.is(res, 0);
});

test('test case: if iouThreshold defined ', t => {
	const groundTruths = [{
		filename: 'image1.jpg',
		label: 'car',
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
	}];

	const iouThreshold = 0.6;
	const res = mAP({
		groundTruths,
		predictions,
		iouThreshold
	});
	t.true(res >= 0);
	t.true(res <= 1);
});
