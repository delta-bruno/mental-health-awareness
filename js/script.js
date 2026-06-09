const themeKey = 'mindcare-theme';
const journalKey = 'mindcare-entries';
const quotes = {
  sad: [
    'It is okay to feel low today — kindness to yourself can make the day lighter.',
    'You are stronger than you know, and every small step counts.',
    'Even on hard days, your heart is still brave and growing.',
    'Rest when you need to. Healing is not a race.',
    'You are seen, you are valid, and help is possible.'
  ],
  motivation: [
    'One small choice toward care can change your whole day.',
    'Your courage is in every effort you make, even the quiet ones.',
    'Today is another chance to grow with calm and kindness.',
    'Progress comes from the steps you take, not from rushing.',
    'You are capable of more than you think, one moment at a time.'
  ],
  bible: [
    'Psalm 34:18 — The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    'Isaiah 41:10 — Do not fear, for I am with you; do not be dismayed, for I am your God.',
    'Philippians 4:6-7 — Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.',
    'Matthew 11:28 — Come to me, all you who are weary and burdened, and I will give you rest.',
    'Psalm 23:4 — Even though I walk through the darkest valley, I will fear no evil, for you are with me.'
  ]
};

const supportReplies = {
  sad: [
    'I hear you. It can help to take things slowly and be gentle with yourself.',
    'When sadness arrives, small acts of care can remind you that you are important.',
    'A trusted friend or helpful routine may make this moment feel a bit lighter.'
  ],
  stressed: [
    'Taking a few deep breaths can help settle your body and mind.',
    'Breaking your next step into something smaller can reduce pressure.',
    'You can pause and reconnect with what feels calm right now.'
  ],
  anxious: [
    'Focus on what is in front of you and allow your breath to become even.',
    'Grounding in the present moment can help your worry feel more manageable.',
    'You are safe here, and it is okay to take care of yourself gently.'
  ],
  lonely: [
    'It can feel difficult to be alone. Reaching out to someone you trust can help.',
    'You are not forgotten, even when life feels quiet or heavy.',
    'Kind words to yourself are a meaningful part of healing.'
  ],
  tired: [
    'When you’re tired, resting is an important act of self-care.',
    'A short pause, a gentle drink of water, or a quiet moment can help restore energy.',
    'Your needs matter, and taking a break is okay.'
  ],
  overwhelmed: [
    'Focus on one small thing you can control right now.',
    'Try breathing slowly and naming a few things you can sense around you.',
    'You are allowed to take breaks and set boundaries for your own calm.'
  ],
  worried: [
    'Worry can feel heavy, but grounding yourself with a few breaths can make it easier.',
    'Talk through what is on your mind with someone who listens supportively.',
    'You are doing the best you can in this moment.'
  ]
};

const crisisKeywords = ['suicide', 'self-harm', 'hurt myself', 'kill myself', 'die', 'end it', 'no way out'];

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(themeKey, theme);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function loadTheme() {
  const storedTheme = localStorage.getItem(themeKey) || 'light';
  setTheme(storedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function redirectMood() {
  const select = document.getElementById('moodSelect');
  if (select && select.value) {
    window.location.href = select.value;
  }
}

function randomFromArray(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateRandomQuote(elementId, sourceArray) {
  const element = document.getElementById(elementId);
  if (!element || !sourceArray || !sourceArray.length) return;
  element.textContent = randomFromArray(sourceArray);
}

function startBreathing() {
  const text = document.getElementById('breathingText');
  if (!text) return;
  text.textContent = 'Breathe in...';

  setTimeout(() => {
    text.textContent = 'Hold...';
  }, 4000);

  setTimeout(() => {
    text.textContent = 'Breathe out...';
  }, 8000);

  setTimeout(() => {
    text.textContent = 'Repeat as often as needed.';
  }, 12000);
}

function appendChatMessage(role, message) {
  const chatWindow = document.getElementById('chatWindow');
  if (!chatWindow) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-message ${role}`;
  bubble.innerHTML = `<strong>${role === 'user' ? 'You' : 'MindCare Bot'}:</strong> <span>${message}</span>`;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createChatReply(text) {
  const lower = text.toLowerCase();
  if (crisisKeywords.some(keyword => lower.includes(keyword))) {
    return 'I am concerned about your safety. Please contact local emergency services, a trusted adult, family member, counselor, or mental health professional immediately.';
  }

  for (const key of Object.keys(supportReplies)) {
    if (lower.includes(key)) {
      return randomFromArray(supportReplies[key]);
    }
  }

  return 'Thank you for sharing. I am here with empathy and support — what else would you like me to hear?';
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;
  const message = input.value.trim();
  appendChatMessage('user', message);
  setTimeout(() => {
    appendChatMessage('bot', createChatReply(message));
  }, 550);
  input.value = '';
}

function getJournalEntries() {
  const raw = localStorage.getItem(journalKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function saveJournalEntries(entries) {
  localStorage.setItem(journalKey, JSON.stringify(entries));
}

function renderJournalEntries() {
  const container = document.getElementById('journalEntries');
  if (!container) return;
  const entries = getJournalEntries();
  container.innerHTML = entries.length ? '' : '<p class="muted-text">No entries yet. Write a reflection and save it to see it appear here.</p>';

  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'journal-entry';
    card.innerHTML = `
      <p>${entry.text}</p>
      <div class="entry-meta">
        <span>${entry.date}</span>
        <button type="button" onclick="deleteJournalEntry(${entry.id})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function saveJournalEntry(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('journalInput');
  if (!input || !input.value.trim()) return;

  const entries = getJournalEntries();
  entries.unshift({
    id: Date.now(),
    date: new Date().toLocaleString(),
    text: input.value.trim()
  });
  saveJournalEntries(entries);
  input.value = '';
  renderJournalEntries();
}

function deleteJournalEntry(id) {
  const entries = getJournalEntries().filter(entry => entry.id !== id);
  saveJournalEntries(entries);
  renderJournalEntries();
}

function initPage() {
  loadTheme();
  generateRandomQuote('sadQuote', quotes.sad);
  generateRandomQuote('motivateQuote', quotes.motivation);
  generateRandomQuote('studyQuote', quotes.motivation);
  generateRandomQuote('dailyVerse', quotes.bible);

  const chatForm = document.getElementById('chatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
    appendChatMessage('bot', 'Hello — I’m here to listen. How can I support you today?');
  }

  const journalForm = document.getElementById('journalForm');
  if (journalForm) {
    journalForm.addEventListener('submit', saveJournalEntry);
    renderJournalEntries();
  }
}

window.addEventListener('DOMContentLoaded', initPage);
