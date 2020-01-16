// Massiiv ussi lülidega, kus "pea" on massiivi lõpus ja "saba" selle alguses
let snake = [
  [6, 6],
  [7, 6],
  [8, 6]
];

// Alguse liikumise suund ("LEFT", "RIGHT", "UP", "DOWN")
let direction = "RIGHT";

// Joonistame ümbritseva kasti.
// boardWidth: number, mitu klotsi on X teljel
// boardHeight: number, mitu klotsi on Y teljel
for (let i = 0; i < boardWidth; i++) {
  // ülemine joon
  setBlock(i, 0, "red");
  // alumine joon
  setBlock(i, boardHeight - 1, "red");
}
for (let i = 0; i < boardHeight; i++) {
  // vasak joon
  setBlock(0, i, "red");
  // parem joon
  setBlock(boardWidth - 1, i, "red");
}

// Funktsioon uue juurvilja lisamiseks
function addFruit() {
  let x, y;
  while (true) {
    // Otsime nii kaua, kuni leiame sellise X ja Y koordinaadi,
    // mis on parasjagu mängulaual vabad
    x = random(boardWidth); // juhuslik number vahemikus 0...(boardWidth-1)
    y = random(boardHeight); // juhuslik number vahemikus 0...(boardHeight-1)
    if (!getBlock(x, y)) {
      // leidsime vaba koha!
      break;
    }
  }
  // juurviljaks on lihtsalt rohelist värvi blokk
  setBlock(x, y, "green");
}

// Mida teha kui vajutatakse klahvile
handleKeyPress(function(key) {
  // Kontrollime, et mis klahvi vajutati ja määrame vastava suuna
  switch (key) {
    case "Escape":
      stop(); // stop() peatab mängu
      break;
    case "ArrowUp":
    case "KeyW":
      // väldi vastassuunda keeramist mis tähendaks kohest mängu lõppu
      if (direction !== "DOWN") {
        direction = "UP";
      }
      break;
    case "ArrowDown":
    case "KeyS":
      if (direction !== "UP") {
        direction = "DOWN";
      }
      break;
    case "ArrowLeft":
    case "KeyA":
      if (direction !== "RIGHT") {
        direction = "LEFT";
      }
      break;
    case "ArrowRight":
    case "KeyD":
      if (direction !== "LEFT") {
        direction = "RIGHT";
      }
      break;
  }
  return;
});

// Mida teha, kui toimub mängu uue seisu arvutamine.
// Esimene parameeter on kiirus (millisekundid seisu arvutamise vahel).
// Teine on funktsioon, mis pannakse käima seisu arvutamiseks
setGameLoop(200, function() {
  // Leiame ussi pea X ja Y koordinaadid
  let [x, y] = snake[snake.length - 1];

  // Kontrollime hetke suunda ja arvutame järgmise koordinaadi
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

  // Kontrollime kas eeldatud positsioonil pole juurvili
  if (getBlock(x, y) === "green") {
    // Leidsime juurvilja!
    // Vana süüakse ära, nii et on vaja lisada uus.
    addFruit();
  }
  // Kontrollime et kas koordinaat pole juba täidetud
  else if (getBlock(x, y)) {
    // Kui koordinaadil on juba blokk olemas, siis on mäng läbi
    alert("Game over!");
    stop(); // stop() peatab mängu
    return;
  } else {
    // Kustuta saba viimane lüli
    let lastPos = snake.shift();
    clearBlock(lastPos[0], lastPos[1]); // tühjendab bloki sisu
  }

  // Lisame ussi pea uue lüli
  snake.push([x, y]);

  // Täidame arvutatud koordinaadi
  setBlock(x, y);
  return;
});

// Mängu algus. Lisame ussi lülid lehele
for (let i = 0; i < snake.length; i++) {
  setBlock(snake[i][0], snake[i][1]);
}

addFruit();
