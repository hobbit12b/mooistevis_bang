const player = document.querySelector('.player');
const illustration = document.querySelector('#regenboog');
const dice = document.querySelector('.dice');
const next = document.querySelector('.next');
const result = document.querySelector('#result');
const positions = {1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
let worried = false;
let rollTimer = null;

function show(value) {
  dice.querySelector('.face').innerHTML = positions[value].map(p =>
    `<span class="pip" style="grid-area:${Math.floor((p-1)/3)+1}/${(p-1)%3+1}" aria-hidden="true"></span>`
  ).join('');
  dice.setAttribute('aria-label', `${value} ${value === 1 ? 'stip' : 'stippen'}. Gooi met 1 tot en met ${dice.dataset.max}.`);
}

function setMode(magic = false) {
  illustration.src = window.regenboogIllustraties[worried ? 'worried' : 'happy'];
  illustration.alt = worried ? 'Angstige Regenboog' : 'Blije Regenboog';
  next.setAttribute('aria-label', worried
    ? 'Verander naar blije Regenboog. De volgende worp is 1 tot en met 3.'
    : 'Verander naar angstige Regenboog. De volgende worp is 1 tot en met 6.');
  if (magic) enchantFish();
}

function enchantFish() {
  const scene = illustration.parentElement;
  scene.getAnimations().forEach(animation => animation.cancel());
  scene.querySelectorAll('.sparkle').forEach(sparkle => sparkle.remove());
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  scene.animate([
    {filter:'brightness(1)', transform:'scale(1)'},
    {filter:'brightness(1.6) drop-shadow(0 0 24px #fff6b5)', transform:'scale(1.045)', offset:0.3},
    {filter:'brightness(1)', transform:'scale(1)'}
  ], {duration:850, easing:'ease-in-out'});
  for (let i = 0; i < 14; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✦';
    sparkle.setAttribute('aria-hidden', 'true');
    const angle = i * Math.PI * 2 / 14;
    sparkle.style.left = `${50 + Math.cos(angle) * 33}%`;
    sparkle.style.top = `${50 + Math.sin(angle) * 32}%`;
    scene.append(sparkle);
    const animation = sparkle.animate([
      {opacity:0, transform:'translate(-50%, -50%) scale(0.2)'},
      {opacity:1, offset:0.3},
      {opacity:0, transform:`translate(calc(-50% + ${Math.cos(angle)*40}px), calc(-50% + ${Math.sin(angle)*40}px)) scale(1.3) rotate(90deg)`}
    ], {duration:900, delay:i%4*45, easing:'ease-out', fill:'both'});
    animation.onfinish = () => sparkle.remove();
  }
}

function roll() {
  if (rollTimer !== null) return;
  const maximum = worried ? 6 : 3;
  dice.dataset.max = maximum;
  player.className = `player ${worried ? 'worried' : 'happy'}`;
  dice.classList.add('rolling');
  result.textContent = '';
  let count = 0;
  rollTimer = setInterval(() => {
    const value = 1 + Math.floor(Math.random() * maximum);
    show(value);
    if (++count === 7) {
      clearInterval(rollTimer);
      rollTimer = null;
      dice.classList.remove('rolling');
      result.textContent = `${value} ${value === 1 ? 'stip' : 'stippen'}`;
    }
  }, 80);
}

dice.addEventListener('click', roll);
document.querySelector('.throw').addEventListener('click', roll);
next.addEventListener('click', () => { worried = !worried; setMode(true); });
setMode();
show(3);
