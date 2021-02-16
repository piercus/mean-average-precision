const fs = require('fs');
const test = require('ava');
const mAP = require('..');
const nonMaxSuppression = require('../lib/non-max-suppression');

const contentToMapCompatible = function (o) {
	if (typeof (o.consolidated.left) !== 'number' || typeof (o.consolidated.width) !== 'number') {
		throw (new TypeError('left and right should be defined'));
	}

	return {
		left: o.consolidated.left,
		top: o.consolidated.top,
		right: o.consolidated.left + o.consolidated.width,
		bottom: o.consolidated.top + o.consolidated.height,
		confidence: o.consolidated.confidence,
		workers: o.sources.map(s => s.workerIdAndIteration)
	};
};

const uniq = arr => arr.filter((a, index) => arr.indexOf(a) === index);

const annotations = JSON.parse(fs.readFileSync('./test/data/annotations-non-max-suppr.json'));
const annotations2 = JSON.parse(fs.readFileSync('./test/data/annotations-non-max-suppr-triplet.json'));
const annotations3 = JSON.parse(fs.readFileSync('./test/data/annotations-non-max-suppr-triplet-2.json'));

const customDist = ((a, b) => {
	if (uniq(a.workers.concat(b.workers)).length < a.workers.length + b.workers.length) {
		return 1;
	}
	return 1 - mAP.iou(a, b);
});

test.serial('call nonMaxSuppression for bounding boxes', t => {
	const removeList = nonMaxSuppression({
		dist: customDist,
		threshold: 0.25,
		annotations,
		mapFn: contentToMapCompatible
	});
	t.is(removeList.length, 1);
	t.is(removeList[0], 2);
});

test.serial('call nonMaxSuppression for bounding boxes with 3 crossing boxes', t => {
	const removeList = nonMaxSuppression({
		dist: customDist,
		threshold: 0.25,
		annotations: annotations2,
		mapFn: contentToMapCompatible
	});
	t.is(removeList.length, 2);
	t.true(removeList.includes(0));
	t.true(removeList.includes(3));
});

test.serial('call nonMaxSuppression for bounding boxes with 3 crossing boxes but 2 matching pairs', t => {
	const removeList = nonMaxSuppression({
		dist: customDist,
		threshold: 0.25,
		annotations: annotations3,
		mapFn: contentToMapCompatible
	});
	t.is(removeList.length, 2);
	t.true(removeList.includes(0));
	t.true(removeList.includes(3));
});

test.serial('call nonMaxSuppression for bounding boxes with 3 crossing boxes but 2 matching pairs - 2', t => {
	annotations3[2].consolidated.confidence = 0.6;
	const removeList = nonMaxSuppression({
		dist: ((a, b) => 1 - mAP.iou(a, b)),
		threshold: 0.25,
		annotations: annotations3,
		mapFn: contentToMapCompatible
	});
	t.is(removeList.length, 1);
	t.true(removeList.includes(2));
});

test.serial('call nonMaxSuppression for bounding boxes with 3 crossing boxes but 2 matching pairs - 3', t => {
	annotations3[2].consolidated.confidence = 0.82;
	const removeList = nonMaxSuppression({
		dist: ((a, b) => 1 - mAP.iou(a, b)),
		threshold: 0.25,
		annotations: annotations3,
		mapFn: contentToMapCompatible
	});
	t.is(removeList.length, 1);
	t.true(removeList.includes(2));
});
