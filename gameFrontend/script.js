 const levels = [
      { letters: ['C', 'A', 'T', 'R', 'O'], words: ['CAT', 'CAR', 'ART', 'TOR', 'ARC'] },
      { letters: ['D', 'E', 'A', 'L', 'S', 'T'], words: ['DEAL', 'LAST', 'SEAL', 'LEAD', 'TEAL'] },
      { letters: ['H', 'O', 'U', 'S', 'E', 'L', 'Y'], words: ['HOUSE', 'SHE', 'HEY', 'SOUL', 'HOLE'] },
    ];

    let currentLevel = 0;
    let tries = 0;
    let guessedWords = [];
    const maxTries = 5;

    const container = document.getElementById("game-container");
    const wordDisplay = document.getElementById("word");
    const status = document.getElementById("status");
    const nextBtn = document.getElementById("next-level");
    const shuffleBtn = document.getElementById("shuffle-btn");
    const wordGrid = document.getElementById("word-grid");

    let selected = [];
    let currentLetters = [];

    function shuffleArray(arr) {
      return arr.map(v => [Math.random(), v]).sort().map(a => a[1]);
    }

    function createWordGrid(words) {
      wordGrid.innerHTML = '';
      words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word-slot';
        for (let i = 0; i < word.length; i++) {
          const box = document.createElement('div');
          box.className = 'letter-box';
          box.textContent = i === 0 || i === word.length - 1 ? word[i] : '_';
          div.appendChild(box);
        }
        wordGrid.appendChild(div);
      });
    }

    function fillCorrectWord(word) {
      [...wordGrid.children].forEach(slot => {
        const guess = [...slot.children].map(e => e.textContent).join('').replace(/_/g, '');
        if (guess.length < word.length) {
          slot.innerHTML = '';
          for (let i = 0; i < word.length; i++) {
            const box = document.createElement('div');
            box.className = 'letter-box';
            box.textContent = word[i];
            slot.appendChild(box);
          }
        }
      });
    }

    function loadLevel(levelIndex) {
      container.innerHTML = '';
      guessedWords = [];
      selected = [];
      tries = 0;
      status.textContent = '';
      wordDisplay.textContent = '';
      nextBtn.style.display = 'none';
      const level = levels[levelIndex];
      currentLetters = [...level.letters];
      createWordGrid(level.words);
      drawLetters();
    }

    function drawLetters() {
      container.innerHTML = '';
      const count = currentLetters.length;
      const angleStep = (2 * Math.PI) / count;

      currentLetters.forEach((letter, i) => {
        const angle = i * angleStep;
        const x = 130 + 100 * Math.cos(angle);
        const y = 130 + 100 * Math.sin(angle);

        const div = document.createElement('div');
        div.className = 'letter';
        div.textContent = letter;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.dataset.index = i;

        div.onclick = () => {
          if (!selected.includes(i)) {
            selected.push(i);
            updateWord();
          }
        };

        container.appendChild(div);
      });
    }

    function updateWord() {
      const level = levels[currentLevel];
      const word = selected.map(i => currentLetters[i]).join('');
      wordDisplay.textContent = word;

      if (level.words.includes(word) && !guessedWords.includes(word)) {
        guessedWords.push(word);
        fillCorrectWord(word);
        status.textContent = `✅ You found: ${word}`;
        selected = [];

        if (guessedWords.length >= 4) {
          status.textContent = `🎉 Level ${currentLevel + 1} Completed!`;
          nextBtn.style.display = 'inline-block';
        }
      } else if (word.length > 2 && !level.words.includes(word)) {
        tries++;
        selected = [];
        wordDisplay.textContent = '';
        status.textContent = `❌ Incorrect (${tries}/${maxTries})`;

        if (tries >= maxTries) {
          status.textContent = '💀 You lost! Refresh to try again.';
          disableLetters();
        }
      }
    }

    function disableLetters() {
      const letters = document.querySelectorAll('.letter');
      letters.forEach(btn => {
        btn.onclick = null;
        btn.style.opacity = 0.5;
      });
    }

    nextBtn.onclick = () => {
      currentLevel++;
      if (currentLevel < levels.length) {
        loadLevel(currentLevel);
      } else {
        status.textContent = '🏆 You finished all levels!';
        nextBtn.style.display = 'none';
      }
    };

    shuffleBtn.onclick = () => {
      currentLetters = shuffleArray(currentLetters);
      drawLetters();
    };

    loadLevel(currentLevel);