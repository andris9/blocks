// See skript ei tee midagi kasulikku, aga näitab
// olemasoleva API kasutamist

// värvib alumise parema ruudu roheliseks
// setBlock(X, Y, [color])
setBlock(boardWidth - 1, boardHeight - 1, "green");

// väljastab alumise parema ruudu värvi
// getBlock(X, Y) -> color | false
console.log(getBlock(boardWidth - 1, boardHeight - 1));

// tühjendab ülemise vasaku ruudu
// clearBlock(X, Y)
clearBlock(0, 0);

// Mida teha kui vajutatakse klahvile
handleKeyPress(function(key) {
  console.log(key);
});

// Mida teha, kui toimub mängu uue seisu arvutamine.
// Esimene parameeter on kiirus (millisekundid seisu arvutamise vahel).
// Teine on funktsioon, mis pannakse käima seisu arvutamiseks
setGameLoop(1000, function() {
  console.log("LOOP");
});
