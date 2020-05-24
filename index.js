const $scene = document.querySelector('.scene');
const $object = document.querySelector('.object');
const $characters = document.querySelectorAll('.char');
const $shuffle = document.querySelector('#shuffle');

const CHARACTERS = [
  'reimu', 'marisa', 'sanae', 'youmu',
  'sakuya', 'reisen', 'aya', 'chiruno',
];

function shuffleCharacters() {
  const charSet = new Set();
  $characters.forEach(($char) => {
    $char.classList.remove(...CHARACTERS);
    let character;
    do {
      character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    } while (charSet.has(character));
    charSet.add(character);
    $char.classList.add(character);
  });
}

shuffleCharacters();
$shuffle.addEventListener('click', shuffleCharacters);

function adjustCharacterDirection($char, deg, left) {
  let direction;
  deg = ((deg % 360) + 360) % 360;
  if (deg >= 45 && deg < 135) {
    direction = left ? 'down' : 'up';
  } else if (deg >= 135 && deg < 225) {
    direction = left ? 'left' : 'right';
  } else if (deg >= 225 && deg < 315) {
    direction = left ? 'up' : 'down';
  } else {
    direction = left ? 'right' : 'left';
  }

  if (!$char.classList.contains(direction)) {
    $char.classList.remove('up', 'down', 'left', 'right');
    $char.classList.add(direction);
  }
}

let startingOffset;
let startingRotation;

function startDrag(x, y) {
  startingOffset = {x, y};
  const transform = $object.style.transform;
  let mz = /rotateZ\(([0-9.\-]+)deg\)/.exec(transform);
  startingRotation = {
    rotateZ: mz ? Number(mz[1]) : 0,
  };
}

const SENSITIVITY = .3;

function handleDrag(x, y) {
  if (!startingOffset || !startingRotation) return;

  const rotateZ = startingRotation.rotateZ + (startingOffset.x - x) * SENSITIVITY;

  $object.style.transform = `rotateX(60deg) rotateZ(${rotateZ}deg)`;

  $characters.forEach(($char, idx) => {
    $char.style.transform = `translate(50px, 50px) translateZ(48px) rotateZ(${-rotateZ}deg) rotateX(-60deg) scale(2.3)`;
    adjustCharacterDirection($char, rotateZ, idx % 2 === 0);
  });
}

function finishDrag() {
  startingOffset = null;
  startingRotation = null;
}

const mouse = (callback) => ({screenX, screenY}) => callback(screenX, screenY);
$scene.addEventListener('mousedown', mouse(startDrag));
$scene.addEventListener('mousemove', mouse(handleDrag));
$scene.addEventListener('mouseup', finishDrag);

const touch = (callback) => ({touches}) => callback(touches[0].screenX, touches[0].screenY);
$scene.addEventListener('touchstart', touch(startDrag));
$scene.addEventListener('touchmove', touch(handleDrag));
$scene.addEventListener('touchend', finishDrag);
