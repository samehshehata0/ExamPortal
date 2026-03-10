const userData = JSON.parse(localStorage.getItem("ep_user_data") || "{}");
const fullName =
  `${userData.firstName || "Student"} ${userData.lastName || ""}`.trim();
document.getElementById("navNm").textContent = fullName;
document.getElementById("navAv").textContent =
  (userData.firstName?.[0] || "") + (userData.lastName?.[0] || "");

function Answer(text, isCorrect) {
  this.text = text;
  this.isCorrect = isCorrect;
  this.getText = function () {
    return this.text;
  };
  this.check = function () {
    return this.isCorrect;
  };
}

function Question(text, answers, category, difficulty) {
  this.text = text;
  this.answers = answers;
  this.category = category;
  this.difficulty = difficulty;
  this.getCorrectIndex = function () {
    return this.answers.findIndex((a) => a.isCorrect);
  };
  this.getOptions = function () {
    return this.answers.map((a) => a.getText());
  };
  this.checkAnswer = function (idx) {
    return this.answers[idx] && this.answers[idx].check();
  };
}

const BANK = [
  new Question(
    "Which ES6 feature allows extracting values from arrays or objects into distinct variables?",
    [
      new Answer("Spread Operator", false),
      new Answer("Destructuring Assignment", true),
      new Answer("Template Literals", false),
      new Answer("Arrow Functions", false),
    ],
    "JavaScript",
    "medium",
  ),
  new Question(
    "What does the HTML5 `<canvas>` element primarily provide?",
    [
      new Answer("Video playback container", false),
      new Answer("A bitmap drawing surface controlled via JS", true),
      new Answer("Inline SVG rendering", false),
      new Answer("WebGL exclusively", false),
    ],
    "HTML5",
    "easy",
  ),
  new Question(
    "Which CSS property controls how flex items wrap onto multiple lines?",
    [
      new Answer("flex-direction", false),
      new Answer("flex-grow", false),
      new Answer("flex-wrap", true),
      new Answer("align-content", false),
    ],
    "CSS3",
    "easy",
  ),
  new Question(
    "What is the output of `console.log(typeof null)` in JavaScript?",
    [
      new Answer('"null"', false),
      new Answer('"undefined"', false),
      new Answer('"object"', true),
      new Answer('"boolean"', false),
    ],
    "JavaScript",
    "hard",
  ),
  new Question(
    "Which Bootstrap 5 utility class applies a top margin of 3 units?",
    [
      new Answer("mt-3", true),
      new Answer("pt-3", false),
      new Answer("ms-3", false),
      new Answer("top-3", false),
    ],
    "Bootstrap",
    "easy",
  ),
  new Question(
    "In CSS Grid, what does the `fr` unit represent?",
    [
      new Answer("Fixed ratio column", false),
      new Answer("A font-relative unit", false),
      new Answer("A proportional fraction of available space", true),
      new Answer("Frame unit for rows", false),
    ],
    "CSS3",
    "medium",
  ),
  new Question(
    "Which JS method resolves when ALL promises in an iterable resolve?",
    [
      new Answer("Promise.any()", false),
      new Answer("Promise.race()", false),
      new Answer("Promise.allSettled()", false),
      new Answer("Promise.all()", true),
    ],
    "JavaScript",
    "medium",
  ),
  new Question(
    "Which HTML5 API enables full-duplex real-time communication between browser and server?",
    [
      new Answer("WebSockets", true),
      new Answer("LocalStorage API", false),
      new Answer("Service Workers", false),
      new Answer("Server-Sent Events", false),
    ],
    "HTML5",
    "medium",
  ),
  new Question(
    "Which Bootstrap 5 component displays sliding/rotating content with navigation controls?",
    [
      new Answer("Modal", false),
      new Answer("Accordion", false),
      new Answer("Carousel", true),
      new Answer("Offcanvas", false),
    ],
    "Bootstrap",
    "easy",
  ),
  new Question(
    "What is the key difference between `==` and `===` in JavaScript?",
    [
      new Answer("No difference; both are identical", false),
      new Answer("== checks value only; === checks value AND type", true),
      new Answer("=== checks value only; == checks type only", false),
      new Answer("== is for numbers; === for strings", false),
    ],
    "JavaScript",
    "hard",
  ),
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let questions = shuffle(BANK);
let cur = 0;
const answers = new Array(questions.length).fill(null);
const marked = new Set();
let timerSec = 20 * 60;
let timerInt = null;
let submitted = false;

function startTimer() {
  timerInt = setInterval(() => {
    if (timerSec <= 0) {
      clearInterval(timerInt);
      autoTimeout();
      return;
    }
    timerSec--;
    const m = String(Math.floor(timerSec / 60)).padStart(2, "0");
    const s = String(timerSec % 60).padStart(2, "0");
    document.getElementById("timerDisp").textContent = `${m}:${s}`;
    document
      .getElementById("timerPill")
      .classList.toggle("danger", timerSec <= 60);
  }, 1000);
}

const L = ["A", "B", "C", "D"];

function render() {
  const q = questions[cur];
  const n = cur + 1;
  document.getElementById("qBadge").textContent =
    `Q ${String(n).padStart(2, "0")} / ${questions.length}`;
  document.getElementById("qnDisp").textContent = n;
  document.getElementById("qCat").textContent = q.category;
  const d = document.getElementById("qDiff");
  d.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
  d.className = "q-diff " + q.difficulty;
  document.getElementById("qTxt").textContent = q.text;
  document
    .getElementById("markBadge")
    .classList.toggle("show", marked.has(cur));
  const mb = document.getElementById("markBtn");
  mb.classList.toggle("on", marked.has(cur));
  mb.innerHTML = marked.has(cur)
    ? '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> Marked'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> Mark';
  const opts = document.getElementById("opts");
  opts.innerHTML = "";
  q.getOptions().forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "opt" + (answers[cur] === i ? " sel" : "");
    div.onclick = () => pick(i);
    div.innerHTML = `<div class="opt-lt">${L[i]}</div><div class="opt-txt">${o}</div><svg class="opt-ico" viewBox="0 0 24 24" fill="none" stroke="${answers[cur] === i ? "var(--accent)" : "currentColor"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    opts.appendChild(div);
  });
  document.getElementById("prevBtn").disabled = cur === 0;
  document.getElementById("nextBtn").disabled = cur === questions.length - 1;
  updateGrid();
  updateProgress();
}

function pick(i) {
  if (submitted) return;
  answers[cur] = i;
  render();
}

function nav(d) {
  const n = cur + d;
  if (n >= 0 && n < questions.length) {
    cur = n;
    render();
  }
}

function toggleMark() {
  if (marked.has(cur)) marked.delete(cur);
  else marked.add(cur);
  render();
  updateMarkList();
}
function buildGrid() {
  const g = document.getElementById("qGrid");
  g.innerHTML = "";
  questions.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "qb";
    b.id = `qb${i}`;
    b.textContent = i + 1;
    b.onclick = () => {
      cur = i;
      render();
    };
    g.appendChild(b);
  });
}

function updateGrid() {
  questions.forEach((_, i) => {
    const b = document.getElementById(`qb${i}`);
    if (!b) return;
    b.className =
      "qb" +
      (i === cur ? " cur" : "") +
      (answers[i] !== null ? " ans" : "") +
      (marked.has(i) ? " mkd" : "");
  });
  document.getElementById("sAns").textContent = answers.filter(
    (a) => a !== null,
  ).length;
}

function updateProgress() {
  const done = answers.filter((a) => a !== null).length;
  document.getElementById("progFill").style.width =
    Math.round((done / questions.length) * 100) + "%";
  document.getElementById("progLbl").textContent =
    `${done} / ${questions.length} answered`;
}

function updateMarkList() {
  const ml = document.getElementById("markList");
  document.getElementById("mkCnt").textContent = marked.size;
  if (!marked.size) {
    ml.innerHTML = '<p class="ml-empty">No questions marked yet.</p>';
    return;
  }
  ml.innerHTML = "";
  [...marked]
    .sort((a, b) => a - b)
    .forEach((i) => {
      const d = document.createElement("div");
      d.className = "mi";
      d.onclick = () => {
        cur = i;
        render();
      };
      d.innerHTML = `<div class="mi-n">${i + 1}</div><div class="mi-t">Question ${i + 1}</div>`;
      ml.appendChild(d);
    });
}

function openModal() {
  const done = answers.filter((a) => a !== null).length;
  document.getElementById("mAns").textContent = done;
  document.getElementById("mWarn").textContent = marked.size
    ? ` ${marked.size} marked question(s).`
    : "";
  new bootstrap.Modal(document.getElementById("subModal")).show();
}

function calcResults() {
  let c = 0,
    w = 0,
    s = 0;
  answers.forEach((a, i) => {
    if (a === null) s++;
    else if (questions[i].checkAnswer(a)) c++;
    else w++;
  });
  return { c, w, s, score: Math.round((c / questions.length) * 100) };
}

function buildReview(containerId) {
  const rl = document.getElementById(containerId);
  rl.innerHTML = "";
  questions.forEach((q, i) => {
    const ua = answers[i],
      ci = q.getCorrectIndex();
    const isC = ua === ci,
      isS = ua === null;
    const d = document.createElement("div");
    d.className = "ri";
    let aH = "";
    if (isS)
      aH = `<div class="ra s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Skipped — Correct: ${L[ci]}. ${q.answers[ci].getText()}</div>`;
    else if (isC)
      aH = `<div class="ra c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>${L[ua]}. ${q.answers[ua].getText()}</div>`;
    else
      aH = `<div class="ra w"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Your answer: ${L[ua]}. ${q.answers[ua].getText()}</div><div class="ra c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Correct: ${L[ci]}. ${q.answers[ci].getText()}</div>`;
    d.innerHTML = `<div class="ri-q"><strong style="color:var(--muted);font-size:.7rem">Q${i + 1}.</strong> ${q.text}</div>${aH}`;
    rl.appendChild(d);
  });
}

function submitExam() {
  if (submitted) return;
  submitted = true;
  clearInterval(timerInt);
  const m = bootstrap.Modal.getInstance(document.getElementById("subModal"));
  if (m) m.hide();
  const { c, w, s, score } = calcResults();
  const color =
    score >= 80
      ? "var(--success)"
      : score >= 50
        ? "var(--warn)"
        : "var(--danger)";
  let grade, msg;
  if (score >= 90) {
    grade = "Excellent";
    msg = "Outstanding! You mastered this exam.";
  } else if (score >= 80) {
    grade = "Great job";
    msg = "Well done — solid understanding!";
  } else if (score >= 70) {
    grade = "Good work";
    msg = "Good effort — keep reviewing.";
  } else if (score >= 50) {
    grade = "You passed";
    msg = "Passed! But there's room to improve.";
  } else {
    grade = "Keep studying";
    msg = "Review the material and try again.";
  }
  document.getElementById("grName").textContent = `${grade}, ${fullName}!`;
  document.getElementById("grMsg").textContent = msg;
  document.getElementById("gr_c").textContent = c;
  document.getElementById("gr_w").textContent = w;
  document.getElementById("gr_s").textContent = s;
  document.getElementById("ringPct").textContent = score + "%";
  document.getElementById("ringPct").style.color = color;
  const off = 320 - (320 * score) / 100;
  const rp = document.getElementById("ringP");
  rp.style.stroke = color;
  setTimeout(() => {
    rp.style.strokeDashoffset = off;
  }, 120);
  buildReview("revList");
  document.getElementById("examBody").style.display = "none";
  document.getElementById("grScreen").style.display = "flex";
}

function autoTimeout() {
  if (submitted) return;
  submitted = true;
  const { c, w, s } = calcResults();
  document.getElementById("to_c").textContent = c;
  document.getElementById("to_w").textContent = w;
  document.getElementById("to_s").textContent = s;
  document.getElementById("toName").textContent = `Sorry, ${fullName}!`;
  document.getElementById("examBody").style.display = "none";
  document.getElementById("toScreen").style.display = "flex";
}

function retake() {
  submitted = false;
  questions = shuffle(BANK);
  answers.fill(null);
  marked.clear();
  cur = 0;
  timerSec = 20 * 60;
  document.getElementById("timerDisp").textContent = "20:00";
  document.getElementById("timerPill").classList.remove("danger");
  document.getElementById("toScreen").style.display = "none";
  document.getElementById("grScreen").style.display = "none";
  document.getElementById("examBody").style.display = "flex";
  buildGrid();
  render();
  updateMarkList();
  startTimer();
}

function doLogout() {
  localStorage.removeItem("ep_session");
  window.location.href = "../Pages/login.html";
}

buildGrid();
render();
updateMarkList();
startTimer();
