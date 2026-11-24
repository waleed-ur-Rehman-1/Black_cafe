// All prices stored as integer paisa (1 PKR = 100 paisa)
const toPaisa = (pkr) => Math.round(Number(pkr) * 100);
const toPkr = (paisa) => Number((paisa / 100).toFixed(2));
module.exports = { toPaisa, toPkr };