const tilesetImage = document.getElementById('tileset-source');
const canvas = document.querySelector('canvas');
const tilesetContainer = document.querySelector('.tileset-container');
const tilesetSelection = document.querySelector('.tileset-container-selection');

const IMG_SOURCE = 'TileEditorSpritesheet.2x_2.png';
const SIZE_OF_CROP = 32;

let selection = [0, 0];
let currentLayer = 0;
let isMouseDown = false;
let layers = [
  //Bottom
  {
    //Structure is "x-y": ["tileset_x", "tileset_y"]
    //EXAMPLE: "1-1": [3, 4],
  },
  //Middle
  {},
  //Top
  {},
];

function preset() {
  setLayer(0);
}

function getContext() {
  const ctx = canvas.getContext('2d');

  return ctx;
}

function setLayer(newLayer) {
  currentLayer = Number(newLayer);

  oldActivedLayer = document.querySelector('.layer.active');
  if (oldActivedLayer) {
    oldActivedLayer.classList.remove('active');
  }

  document.querySelector(`.layer[tile-layer="${newLayer}"]`).classList.add('active');
}

function updateSelection() {
  tilesetSelection.style.left = selection[0] * SIZE_OF_CROP + 'px';
  tilesetSelection.style.top = selection[1] * SIZE_OF_CROP + 'px';
}

function getCoordinates(event) {
  const { x, y } = event.target.getBoundingClientRect();
  const selectionX = Math.floor(Math.max(event.clientX - x, 0) / SIZE_OF_CROP);
  const selectionY = Math.floor(Math.max(event.clientY - y, 0) / SIZE_OF_CROP);

  return [selectionX, selectionY];
}

function draw() {
  const ctx = getContext();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  layers.forEach((layer) => {
    Object.keys(layer).forEach((key) => {
      const [positionX, posiionY] = key.split('-').map(Number);
      const [tilesheetX, tilesheetY] = layer[key];

      ctx.drawImage(
        tilesetImage,
        tilesheetX * SIZE_OF_CROP,
        tilesheetY * SIZE_OF_CROP,
        SIZE_OF_CROP,
        SIZE_OF_CROP,
        positionX * SIZE_OF_CROP,
        posiionY * SIZE_OF_CROP,
        SIZE_OF_CROP,
        SIZE_OF_CROP
      );
    });
  });
}

function setMouseIsTrue() {
  isMouseDown = true;
}

function setMouseIsFalse() {
  isMouseDown = false;
}

function toggleTile(event) {
  const clicked = getCoordinates(event);
  const key = clicked[0] + '-' + clicked[1];
  if (event.shiftKey) {
    removeTile(key);
  } else {
    addTile(key);
  }

  draw();
}

function addTile(key) {
  layers[currentLayer][key] = selection;
}

function removeTile(key) {
  delete layers[currentLayer][key];
}

function clearCanvas() {
  layers = [{}, {}, {}];
  draw();
}

function exportImage() {
  const data = canvas.toDataURL();

  const image = new Image();
  image.src = data;

  const w = window.open('');
  w.document.write(image.outerHTML);
}

tilesetContainer.addEventListener('mousedown', (e) => {
  selection = getCoordinates(e);
  updateSelection(selection);
});

canvas.addEventListener('mousedown', setMouseIsTrue);
canvas.addEventListener('mouseup', setMouseIsFalse);
canvas.addEventListener('mouseleave', setMouseIsFalse);
canvas.addEventListener('mousedown', toggleTile);
canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    toggleTile(e);
  }
});

tilesetImage.addEventListener('load', function () {
  preset();
  draw();
});

tilesetImage.src = IMG_SOURCE;
