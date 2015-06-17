function calcSpins(J, B, T, prevSpins) {
	var totalSpin = 0;
	var spins = prevSpins;
	var top, right, bottom, left;
	var M, B_eff, tmp, P_up;

	for (var i = 0; i < spins.length; ++i) {
		for (var j = 0; j < spins.length; ++j) {
			top = (j - 1 < 0) ? (spins.length - 1) : (j - 1);
			right = (i + 1 >= spins.length) ? 0 : (i + 1);
			bottom = (j + 1 >= spins.length) ? 0 : (j + 1);
			left = (i - 1 < 0) ? (spins.length - 1) : (i - 1);

			M = prevSpins[i][top] + prevSpins[right][j] + prevSpins[i][bottom] + prevSpins[left][j];
			B_eff = J * M + B;

      if (T === 0) {
        P_up = 1;
      }
      else {
        tmp = Math.exp(B_eff / T);
        P_up = tmp / (tmp + Math.pow(tmp, -1));
      }

			if (Math.floor(Math.random() + P_up) >= 1) {
				spins[i][j] = 1;
			} else {
				spins[i][j] = -1;
			}

			totalSpin += spins[i][j];
		}
	}

	postMessage([
		spins,
		Math.abs(totalSpin), // M
		Math.abs(totalSpin) / (spins.length * spins.length) // P
	]);
}

onmessage = function(e) {
	calcSpins(e.data[0], e.data[1], e.data[2], e.data[3]);
};
