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
    "There is room to pause.",
];
const container = document.getElementById("word-container");

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

  const padding = 70;

  let x;
  let y;
  let attempts = 0;
  let tooClose = true;

  while (tooClose && attempts < 35) {
    x = Math.random() * (containerWidth - wordWidth - padding);
    y = Math.random() * (containerHeight - wordHeight - padding);

    x += padding / 2;
    y += padding / 2;

    tooClose = activePositions.some((pos) => {
      const horizontalOverlap =
        x < pos.x + pos.width + 90 &&
        x + wordWidth + 90 > pos.x;

      const verticalOverlap =
        y < pos.y + pos.height + 70 &&
        y + wordHeight + 70 > pos.y;

      return horizontalOverlap && verticalOverlap;
    });

    attempts++;
  }

  return { x, y };
}

function createWord() {
  if (!container) return;

  const wordEl = document.createElement("div");
  wordEl.classList.add("floating-word");
  wordEl.innerText = getRandomWord();

  // Temporarily place it invisibly so the browser can measure the real size
  wordEl.style.visibility = "hidden";
  wordEl.style.left = "0px";
  wordEl.style.top = "0px";

  container.appendChild(wordEl);

  const wordRect = wordEl.getBoundingClientRect();
  const position = getPosition(wordRect.width, wordRect.height);

  wordEl.style.left = `${position.x}px`;
  wordEl.style.top = `${position.y}px`;
  wordEl.style.visibility = "visible";

  activePositions.push({
    x: position.x,
    y: position.y,
    width: wordRect.width,
    height: wordRect.height
  });

  setTimeout(() => {
    wordEl.remove();

    activePositions = activePositions.filter((pos) => {
      return pos.x !== position.x || pos.y !== position.y;
    });
  }, 8500);
}

function startWords() {
  createWord();

  const nextDelay = Math.random() * 3000 + 2500;

  setTimeout(startWords, nextDelay);
}

// Wait for the entry state to finish before starting the words
setTimeout(startWords, 4800);
