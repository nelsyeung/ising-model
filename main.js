var numElectronsInput = document.getElementById('num-electrons-input');
var startBtn = document.getElementById('start-btn');
var stopBtn = document.getElementById('stop-btn');
var totalSpinEl = document.getElementById('total-spin');
var polarisationEl = document.getElementById('polarisation');
var spins;
var simWorker;

function changeNumElectrons() {
	document.getElementById('num-electrons-label').innerHTML = numElectronsInput.value;
}

function initSpins() {
	var numElectrons = numElectronsInput.value;
	var totalSpin = 0;
	spins = new Array(numElectrons);

	for (var i = 0; i < numElectrons; ++i) {
		spins[i] = new Array(numElectrons);

		for (var j = 0; j < numElectrons; ++j) {
			if (Math.round(Math.random()) === 0) {
				spins[i][j] = -1;
				totalSpin -= 1;
			} else {
				spins[i][j] = 1;
				totalSpin += 1;
			}
		}
	}

	totalSpinEl.innerHTML = Math.abs(totalSpin);
	polarisationEl.innerHTML = (Math.abs(totalSpin) / (spins.length * spins.length)).toFixed(5);

	stopSim();
}

function drawCanvas() {
	var canvas = document.getElementById('canvas');
	var numElectrons = numElectronsInput.value;
	var padding = 3;
	var size = (canvas.offsetWidth - 10 - padding * (numElectrons - 1)) / numElectrons;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < spins.length; ++i) {
			for (var j = 0; j < spins.length; ++j) {
				if (spins[i][j] === -1) {
					ctx.fillStyle = '#000';
				} else {
					ctx.fillStyle = '#FFF';
				}

				ctx.fillRect(i * (size + padding), j * (size + padding), size, size);
			}
		}
	}
}

function simulate() {
	if (window.Worker) {
		if (typeof(simWorker) !== 'undefined') {
			simWorker.postMessage([
					Number(document.getElementById('J').value),
					Number(document.getElementById('B').value),
					Number(document.getElementById('T').value),
					spins
			]);

			simWorker.onmessage = function(e) {
				spins = e.data[0];
				drawCanvas();
				totalSpinEl.innerHTML = e.data[1].toString();
				polarisationEl.innerHTML = e.data[2].toFixed(5);
				setTimeout(simulate, document.getElementById('time-interval').value * 1000);
			};
		}
	}
	else {
		document.getElementsByTagName('body')[0].innerHTML = 'This simulation requires a newer browser. Your browser does not support Web Workers.';
	}
}

function startSim() {
	startBtn.disabled = true;
	stopBtn.disabled = false;

	if (typeof(simWorker) === 'undefined') {
		simWorker = new Worker('worker.js');
		// simWorker = new Worker('http://s.codepen.io/nelsyeung/pen/RPgoOL.js');
	}

	simulate();
}

function stopSim() {
	startBtn.disabled = false;
	stopBtn.disabled = true;

	if (typeof(simWorker) !== 'undefined') {
		simWorker.terminate();
		simWorker = undefined;
	}
}

window.onload = function() {
	initSpins();
	drawCanvas();
	changeNumElectrons();
	startBtn.disabled = false;
	stopBtn.disabled = true;
};
