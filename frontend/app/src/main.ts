const titles = [
  'Click to start',
  'Thank you',
  'For being',
  'in my life.',
];

const images = [
  '/static/myimage.png', // intro image
  '/static/Screenshot_20251019_134140_Chrome.jpg',
  '/static/Screenshot_20251019_134126_Chrome.jpg',
  '/static/Screenshot_20251019_134153_Chrome.jpg',
];

let current = 0;
let userNameGlobal = '';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('nameInput') as HTMLInputElement | null;
  const button = document.getElementById('submitButton') as HTMLButtonElement | null;

  if (!input || !button) return;

  button.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) {
      alert('Please enter your name first!');
      return;
    }

    userNameGlobal = name;

    // Clear intro and create main app container
    document.body.innerHTML = '<div id="app"></div>';

    // Render first image
    current = 0;
    render();

    // Wait for user click to start music + animation
    document.addEventListener(
      'click',
      () => {
        playTwiceSeamless('/static/background.mp3');

        // Cycle only through the last 3 images
        let index = 1; // start from second image
        setInterval(() => {
          current = index;
          render();
          index++;
          if (index > 3) index = 1; // loop between 1–3
        }, 500);
      },
      { once: true }
    );
  });
});

// Render function
function render(): void {
  const container = document.querySelector<HTMLDivElement>('#app');
  if (!container) return;

  container.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:linear-gradient(135deg, #00035B 0%, #006400 100%);
      font-family:'Roboto',Arial,sans-serif;
    ">
      <div style="
        background:linear-gradient(135deg, #00035B 0%, #006400 100%);
        padding:2.5rem 3rem;
        border-radius:0px;
        box-shadow:0 8px 40px rgba(0,0,0,0.08);
        text-align:center;
        max-width:380px;
      ">
        <h1 style="
          margin:0 0 1rem 0;
          font-size:2rem;
          font-weight:700;
          color:#FFFFFF;
        ">${titles[current]}</h1>

        <img
          src="${images[current]}"
          alt="Main Image"
          style="
            width:220px;
            border-radius:2px;
            margin-bottom:1.2rem;
          "
        />

        <p style="color:#e0e0e0;font-size:0.95rem;">
          Enjoy the show, <strong>${userNameGlobal}</strong>!
        </p>
      </div>
    </div>
  `;
}

// Music function
async function playTwiceSeamless(url: string) {
  const ctx = new AudioContext();
  const resp = await fetch(url);
  const arrayBuf = await resp.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arrayBuf);

  const src1 = ctx.createBufferSource();
  src1.buffer = buffer;
  src1.connect(ctx.destination);
  src1.start(0);

  const src2 = ctx.createBufferSource();
  src2.buffer = buffer;
  src2.connect(ctx.destination);
  src2.start(buffer.duration);

  const gain = ctx.createGain();
  src2.connect(gain).connect(ctx.destination);
  gain.gain.setValueAtTime(1, buffer.duration * 2 - 2);
  gain.gain.linearRampToValueAtTime(0, buffer.duration * 2);
}
