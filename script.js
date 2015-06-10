var numElectronsInput = document.getElementById('num-electrons-input');
var startBtn = document.getElementById('start-btn');
var stopBtn = document.getElementById('stop-btn');
var spins;
var totalSpin = 0;
var simulation;

function changeNumElectrons() {
	document.getElementById('num-electrons-label').innerHTML = numElectronsInput.value;
}

function initSpins() {
	var numElectrons = numElectronsInput.value;
	spins = new Array(numElectrons);

	for (var i=0; i < numElectrons; ++i) {
		spins[i] = new Array(numElectrons);

		for (var j=0; j < numElectrons; ++j) {
			if (Math.round(Math.random()) === 0) {
				spins[i][j] = -1;
			}
			else {
				spins[i][j] = 1;
			}
		}
	}

	return spins;
}

function drawCanvas() {
	var canvas = document.getElementById('canvas');
	var numElectrons = numElectronsInput.value;
	var padding = 5;
	var size = (canvas.offsetWidth - 10 - padding * (numElectrons - 1)) / numElectrons;

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i=0; i < spins.length; ++i) {
			for (var j=0; j < spins.length; ++j) {
				if (spins[i][j] === -1) {
					ctx.fillStyle = '#000';
				}
				else {
					ctx.fillStyle = '#DDD';
				}

				ctx.fillRect(i * (size + padding), j * (size + padding), size, size);
			}
		}
	}
}

function calcSpins() {
	var prevSpins = spins;
	var J = document.getElementById('J').value;
	var B = document.getElementById('B').value;
	var T = document.getElementById('T').value;

	for (var i=0; i < spins.length; ++i) {
		for (var j=0; j < spins.length; ++j) {
			var top = j - 1;
			var right = i + 1;
			var bottom = j + 1;
			var left = i - 1;

			if (top < 0) {
				top = spins.length - 1;
			}

			if (right >= spins.length) {
				right = 0;
			}

			if (bottom >= spins.length) {
				bottom = 0;
			}

			if (left < 0) {
				left = spins.length - 1;
			}

			var M = prevSpins[i][top] + prevSpins[right][j] + prevSpins[i][bottom] + prevSpins[left][j];
			var B_eff = J * M + B;
			var tmp = Math.exp(B_eff / T);
			var pUp = tmp / (tmp + Math.pow(tmp, -1));

			if (Math.floor(Math.random() + pUp) >= 1) {
				spins[i][j] = 1;
			}
			else {
				spins[i][j] = -1;
			}

			totalSpin += spins[i][j];

		}
	}

	drawCanvas();
}

function startSim() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	simulation = setInterval(function() { calcSpins(); }, 500);
}

function stopSim() {
	startBtn.disabled = false;
	stopBtn.disabled = true;
	clearInterval(simulation);
}

window.onload = function() {
	initSpins();
	drawCanvas();
	changeNumElectrons();
};
