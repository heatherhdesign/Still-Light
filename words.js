const words = [
  "This moment is enough.",
  "Nothing needs to change right now.",
  "You are allowed to take up space.",
  "There is no rush here.",
  "You can stay for as long as you need.",
  "You don’t have to do anything.",
  "This moment does not require anything from you.",
  "You are still here, and that matters.",
  "What you’re feeling is allowed.",
  "It makes sense that things can feel heavy.",
  "Not everything has to be understood right away.",
  "You can hold this without explaining it.",
  "There is nothing wrong with moving slowly.",
  "Some things don’t need to be put into words.",
  "You don’t have to carry this in a way that makes sense to anyone else.",
  "You are not alone in this moment.",
  "Something in you has brought you here.",
  "You are still standing, even if it feels quiet.",
  "This can simply be a pause.",
  "You don’t have to figure anything out right now.",
  "There is space for you here.",
  "You can stay, or you can leave.",
  "You can look around, or close your eyes.",
  "You can engage, or simply be.",
  "You decide what this moment becomes.",
  "There is no right way to be here.",
  "You are free to move at your own pace.",
  "You don’t have to hold everything all at once.",
  "Some things can remain unfinished.",
  "You can set things down, even briefly.",
  "Not everything needs to be resolved today.",
  "There is room to pause."
];

let container;
let lastWord = "";
let activePositions = [];

function getRandomWord() {
  let selectWord = words[Math.floor(Math.random() * words.length)];

  while (selectWord === lastWord) {
    selectWord = words[Math.floor(Math.random() * words.length)];
  }

  lastWord = selectWord;
  return selectWord;
}

function getPosition(wordWidth, wordHeight) {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const padding = 50;
  const gapX = 90;
  const gapY = 70;

  let bestPosition = null;
  let lowestOverlapScore = Infinity;

  for (let attempts = 0; attempts < 60; attempts++) {
    let x = Math.random() * Math.max(containerWidth - wordWidth - padding, 1);
    let y = Math.random() * Math.max(containerHeight - wordHeight - padding, 1);

    x += padding / 2;
    y += padding / 2;

    let overlapScore = 0;

    activePositions.forEach((pos) => {
      const horizontalOverlap =
        x < pos.x + pos.width + gapX &&
        x + wordWidth + gapX > pos.x;

      const verticalOverlap =
        y < pos.y + pos.height + gapY &&
        y + wordHeight + gapY > pos.y;

      if (horizontalOverlap && verticalOverlap) {
        overlapScore++;
      }
    });

    if (overlapScore === 0) {
      return { x, y };
    }

    if (overlapScore < lowestOverlapScore) {
      lowestOverlapScore = overlapScore;
      bestPosition = { x, y };
    }
  }

  return bestPosition;
}

function createWord() {
  if (!container) return;

  const wordEl = document.createElement("div");
  wordEl.classList.add("floating-word");
  wordEl.innerText = getRandomWord();

  wordEl.style.visibility = "hidden";
  wordEl.style.left = "0px";
  wordEl.style.top = "0px";

  container.appendChild(wordEl);

  const wordRect = wordEl.getBoundingClientRect();
  const position = getPosition(wordRect.width, wordRect.height);

  if (!position) {
    wordEl.remove();
    return;
  }

  wordEl.style.left = `${position.x}px`;
  wordEl.style.top = `${position.y}px`;
  wordEl.style.visibility = "visible";

  const activePosition = {
    x: position.x,
    y: position.y,
    width: wordRect.width,
    height: wordRect.height
  };

  activePositions.push(activePosition);

  setTimeout(() => {
    wordEl.remove();

    activePositions = activePositions.filter((pos) => {
      return pos !== activePosition;
    });
  }, 8500);
}

function startWords() {
  createWord();

  const nextDelay = Math.random() * 3400 + 3200;

  setTimeout(startWords, nextDelay);
}

window.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("word-container");

  if (!container) return;

  setTimeout(startWords, 4800);
});