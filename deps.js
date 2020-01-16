(() => {
  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");

  const pixel = 20;
  const width = 640;
  const height = 480;
  const lineWidth = Math.round(width / pixel);
  const lineHeight = Math.round(height / pixel);

  const canvasElm = document.getElementById("board");
  canvasElm.width = width + 1;
  canvasElm.height = height + 1;

  const canvas = canvasElm.getContext("2d");

  let filledMap = new Map();

  function setBlock(x, y, color) {
    x = Math.round(Number(x) || 0);
    y = Math.round(Number(y) || 0);

    if (x < 0 || y < 0 || x >= lineWidth || y >= lineHeight) {
      // out of bounds
      console.log("out of bounds", x, y);
      return false;
    }

    color = color || "#ccc";

    canvas.fillStyle = color;
    canvas.fillRect(x * pixel + 1, y * pixel + 1, pixel - 1, pixel - 1);

    writeText(x, y, [`${x < 10 ? " " : ""}${x}`, `${y < 10 ? " " : ""}${y}`]);

    if (!filledMap.has(x)) {
      filledMap.set(x, new Map());
    }

    if (color === "#fff") {
      filledMap.get(x).delete(y);
    } else {
      filledMap.get(x).set(y, color);
    }
  }

  function clearBlock(x, y) {
    x = Math.round(Number(x) || 0);
    y = Math.round(Number(y) || 0);
    setBlock(x, y, "#fff");
  }

  function getBlock(x, y) {
    x = Math.round(Number(x) || 0);
    y = Math.round(Number(y) || 0);
    return filledMap.has(x) && filledMap.get(x).has(y)
      ? filledMap.get(x).get(y)
      : false;
  }

  function writeText(x, y, text, color) {
    x = Math.round(Number(x) || 0);
    y = Math.round(Number(y) || 0);
    if (x < 0 || y < 0 || x >= lineWidth || y >= lineHeight) {
      // out of bounds
      console.log("out of bounds", x, y);
      return false;
    }
    canvas.fillStyle = color || "#666";
    canvas.font = "6px monospace";
    canvas.textBaseline = "top";

    [].concat(text || []).forEach((line, i) => {
      canvas.fillText(line, x * pixel + 9, y * pixel + 3 + i * 8);
    });
  }

  function drawLine(x1, y1, x2, y2, color) {
    canvas.beginPath();
    canvas.moveTo(x1, y1);
    canvas.lineTo(x2, y2);
    canvas.lineWidth = 1;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  let currentLoopCb = false;
  let gameLoopTtl = 1000;
  let keyPressCb = false;
  let looping = false;
  let loopTimer = false;
  let started = false;

  function clear() {
    canvas.fillStyle = "#fff";
    canvas.fillRect(0, 0, width + 1, height + 1);

    clearTimeout(loopTimer);

    looping = false;
    keyPressCb = false;
    currentLoopCb = false;
    gameLoopTtl = 1000;
    started = false;

    filledMap = new Map();

    looping = false;
    loopTimer = false;

    for (let i = 0; i <= lineHeight; i++) {
      drawLine(0, i * pixel, width + 1, i * pixel + 1, "#eee");
    }

    for (let i = 0; i <= lineWidth; i++) {
      drawLine(i * pixel, 0, i * pixel + 1, height + 1, "#eee");
    }

    for (let x = 0; x < lineWidth; x++) {
      for (let y = 0; y < lineHeight; y++) {
        writeText(x, y, [
          `${x < 10 ? " " : ""}${x}`,
          `${y < 10 ? " " : ""}${y}`
        ]);
      }
    }

    document.getElementById("status").textContent = "No";
  }

  let processLoop = () => {
    clearTimeout(loopTimer);
    if (!looping) {
      return;
    }
    try {
      if (typeof currentLoopCb === "function") {
        currentLoopCb();
      }
    } catch (err) {
      console.error(err);
    }
    if (!looping) {
      return;
    }
    loopTimer = setTimeout(() => processLoop(), gameLoopTtl);
  };

  let stop = () => {
    clearTimeout(loopTimer);
    looping = false;
    document.getElementById("status").textContent = "No";
  };

  let start = () => {
    clearTimeout(loopTimer);
    clear();
    if (!started) {
      let code = editor.getValue();
      started = true;
      try {
        let run = new Function(code);
        setTimeout(() => {
          try {
            run();
          } catch (err) {
            alert(err);
            stop();
          }
        });
      } catch (err) {
        alert(err);
        return;
      }
    }

    document.getElementById("status").textContent = "Yes";
    looping = true;
    loopTimer = setTimeout(() => processLoop(), gameLoopTtl);
  };

  let setGameLoop = (ttl, cb) => {
    currentLoopCb = cb;
    gameLoopTtl = ttl;
  };

  let handleKeyPress = cb => {
    keyPressCb = cb;
  };

  let random = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  document.body.addEventListener("keydown", e => {
    if (e.target.type === "textarea") {
      return;
    }
    e.preventDefault();
    document.getElementById("key").textContent = e.code;
    if (typeof keyPressCb === "function") {
      keyPressCb(e.code);
    }
  });

  document.getElementById("start").addEventListener("click", () => {
    start();
  });

  document.getElementById("stop").addEventListener("click", () => {
    stop();
  });

  document.getElementById("clear").addEventListener("click", () => {
    clear();
  });

  clear();

  window.handleKeyPress = handleKeyPress;
  window.setGameLoop = setGameLoop;
  window.setBlock = setBlock;
  window.getBlock = getBlock;
  window.clearBlock = clearBlock;
  window.start = start;
  window.stop = stop;
  window.boardWidth = lineWidth;
  window.boardHeight = lineHeight;
  window.random = random;

  fetch("examples/examples.json")
    .then(response => {
      return response.json();
    })
    .then(examples => {
      let listElm = document.getElementById("list");
      listElm.innerHTML = '<option value=""> ––– Vali näidis ––– </option>';
      examples.scripts.forEach(script => {
        let optionElm = document.createElement("option");
        optionElm.setAttribute("value", script.script);
        optionElm.textContent = script.name;
        if (script.default) {
          optionElm.selected = true;
        }
        listElm.appendChild(optionElm);
      });

      let updating = false;
      let updateScript = () => {
        let script = listElm.value;
        loadScript(script);
      };

      let loadScript = script => {
        if (updating) {
          return;
        }
        updating = true;

        if (!script) {
          editor.setValue(
            "// Kirjuta oma skript siia või vali listist näidis\n"
          );
          updating = false;
          return;
        }

        fetch("examples/" + script)
          .then(response => {
            return response.text();
          })
          .then(example => {
            updating = false;
            editor.setValue(example);
          })
          .catch(err => {
            editor.setValue(err.message);
            updating = false;
          });
      };

      listElm.addEventListener("change", updateScript);
      listElm.addEventListener("click", updateScript);

      updateScript();
    });
})();
