const container = document.getElementById('questionContainer');
const searchBox = document.getElementById('searchBox');
const clearBtn = document.getElementById('clearBtn');

let questions = [];

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    renderQuestions(questions);
  });

function renderQuestions(data) {
  container.innerHTML = '';
  data.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';

    const question = document.createElement('div');
    question.className = 'question';
    question.textContent = `${idx + 1}. ${item.question}`;

    const answer = document.createElement('div');
    answer.className = 'answer';
    answer.innerHTML = item.answer;

    card.appendChild(question);
    card.appendChild(answer);
    container.appendChild(card);

    card.addEventListener('click', () => toggleCard(card));
  });
  Prism.highlightAll();
}

function toggleCard(card) {
  const active = document.querySelector('.card.active');
  if (active && active !== card) collapseCard(active);

  if (card.classList.contains('active')) collapseCard(card);
  else expandCard(card);
}

function expandCard(card) {
  const answer = card.querySelector('.answer');
  card.classList.add('active');
  answer.style.maxHeight = answer.scrollHeight + 'px';
  answer.addEventListener('transitionend', () => {
    answer.style.maxHeight = 'none';
  }, { once: true });
}

function collapseCard(card) {
  const answer = card.querySelector('.answer');
  answer.style.maxHeight = answer.scrollHeight + 'px';
  requestAnimationFrame(() => {
    answer.style.maxHeight = '0';
    card.classList.remove('active');
  });
}

// Search + clear button logic
searchBox.addEventListener('input', e => {
  const term = e.target.value.toLowerCase().trim();

  if (term) {
    clearBtn.classList.add('visible');
    const filtered = questions.filter(q =>
      q.question.toLowerCase().includes(term)
    );
    renderQuestions(filtered);
  } else {
    clearBtn.classList.remove('visible');
    renderQuestions(questions);
  }
});

clearBtn.addEventListener('click', () => {
  searchBox.value = '';
  clearBtn.classList.remove('visible');
  renderQuestions(questions);
});
