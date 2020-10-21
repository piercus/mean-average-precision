[![Build Status](https://travis-ci.org/piercus/mean-average-precision.svg?branch=master)](https://travis-ci.org/piercus/mean-average-precision)

# mean-average-precision

For explanation about mAP, please read https://github.com/Cartucho/mAP

## install

```
npm install mean-average-precision
```

## prediction format

For bounding box mAP, every prediction/ground truth objects should look like 

```javascript
{
	label: "car",
	filename: "image1.jpg",
	left: 22,
	top: 34,
	confidence: 0.9, // only for predictions
	right: 231,
	bottom: 78,
}
```

## Basic Example

### Simple average precision score

```javascript
mAP.apScore( [{
		gt: 0, 
		confidence: 0.1
	},{
		gt: 0, 
		confidence: 0.4
	},{
		gt: 1, 
		confidence: 0.35
	},{
		gt: 1,
		confidence: 0.8
}]);
// => 0.833333
```

### Mean average precision on bounding box predictions vs groundtruth

By default, it will compute the AP[iou=0.5]

```javascript
const mAP = require('mean-average-precision')

const groundTruths = [{
			filename: "image1.jpg",
			label: "car",
			left: 22,
			top: 34,
			right: 231,
			bottom: 78,
		},{
			filename: "image1.jpg",
			label: "pedestrian",
			left: 22,
			top: 34,
			right: 231,
			bottom: 78,
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
	
	
mAP({
	groundTruths,
	predictions
});
```

## Set `iouThreshold`

```javascript
// IoU Threshold default value is 0.5
// you can change it using iouThreshold

mAP({
	groundTruths,
	predictions,
	iouThreshold: 0.6
});
```
## List misclassified predictions

```javascript
// You can have more information 
// on which predictions are considered as
// misclassified by doing

mAP.listMisclassified({
	groundTruths,
	predictions,
	iouThreshold: 0.6
});
```
## IoU

```javascript
// You can use the IoU function directly using

mAP.iou({
	left: 22,
	top: 34,
	bottom: 38,
	right: 30
},{
	left: 21,
	top: 32,
	bottom: 40,
	right: 32
});
```

## Other distance metrics

You can use mean-average-precision implementation with other distance metrics by using

```javascript
// You can run it with for example an euclidian distance

mAP({
	groundTruths,
	predictions,
	dist: (pred, groundTruth) => Math.sqrt(((pred.x - groundTruth.x) * (pred.x - groundTruth.x)) + ((pred.y - groundTruth.y) * (pred.y - groundTruth.y))),
	threshold: 10
});
```

