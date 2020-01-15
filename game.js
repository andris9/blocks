// alguse koordinaadid
let x = 6;
let y = 6;

// alguse liikumise suund
let direction = "RIGHT";

// täidame alguse ruud, siit hakkab uss kasvama
fillRect(x, y);

// mida teha kui vajutatakse klahvile
handleKeyPress(function(key) {
  // kontrollime, et mis klahvi vajutati ja määrame vastava suuna
  switch (key) {
    case "ArrowUp":
      direction = "UP";
      break;
    case "ArrowDown":
      direction = "DOWN";
      break;
    case "ArrowLeft":
      direction = "LEFT";
      break;
    case "ArrowRight":
      direction = "RIGHT";
      break;
  }
  return;
});

// mida teha, kui toimub mängu uue seisu arvutamine
// esimene parameeter on kiirus
// teine on funktsioon, mis pannakse käima seisu arvutamiseks
setGameLoop(100, function() {
  // kontrollime hetke suunda ja arvutame järgmise koordinaadi
  switch (direction) {
    case "UP":
      y = y - 1;
      break;
    case "DOWN":
      y = y + 1;
      break;
    case "LEFT":
      x = x - 1;
      break;
    case "RIGHT":
      x = x + 1;
      break;
  }

  // kontrollime et kas koordinaat pole juba täidetud
  if (isFilled(x, y) === true) {
    // kui koordinaadil on juba piksel, siis on mäng läbi
    alert("Game over!");
    stop();
    return;
  }

  // täidame arvutatud koordinaadi
  fillRect(x, y);
  return;
});
