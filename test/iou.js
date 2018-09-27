const test = require('ava');
const iou = require('../lib/iou.js');

test('basic example 1x1', t => {
	t.is(iou({
		left: 0,
		top: 0,
		right: 2,
		bottom: 2
	}, {
		left: 1,
		top: 1,
		right: 3,
		bottom: 3
	}), 1 / 7);
});
test('basic example 2x1 on 2x2+3x2', t => {
	t.is(iou({
		left: 0,
		top: 0,
		right: 2,
		bottom: 2
	}, {
		left: 0,
		top: 1,
		right: 3,
		bottom: 3
	}), 2 / 8);
});
test('basic example 2x1 on 4x2 + 2x3', t => {
	t.is(iou({
		left: 0,
		top: 0,
		right: 4,
		bottom: 2
	}, {
		left: 0,
		top: 1,
		right: 3,
		bottom: 3
	}), 3 / 11);
});

test('basic example 0x0 on 4x2 + 2x3', t => {
	t.is(iou({
		left: 0,
		top: 0,
		right: 4,
		bottom: 2
	}, {
		left: 4,
		top: 1,
		right: 6,
		bottom: 3
	}), 0);
});

