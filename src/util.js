module.exports.fix = x => Math.round(x * 1000) / 1000;

module.exports.mod = (x,s) => x < 0 ? -(Math.floor(x / s) * s - x) : x % s; // Cause js has a stupid modulus operator
