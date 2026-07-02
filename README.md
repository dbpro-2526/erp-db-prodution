<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Multi Time Zone Digital Clock</title>
  <style>
    :root{
      --bg:#0f1724; --card:#0b1220; --accent:#06b6d4; --text:#e6eef6;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
      background:linear-gradient(180deg,#051025 0%, #071827 100%);
      color:var(--text);
      min-height:100vh;
      display:flex;
      align-items:flex-start;
      justify-content:center;
      padding:32px;
    }
    .app{
      width:980px;
      max-width:95%;
    }
    header{
      display:flex;
      gap:12px;
      align-items:center;
      margin-bottom:18px;
    }
    h1{margin:0;font-size:20px}
    .controls{
      margin-top:8px;
      display:flex;
      gap:8px;
      align-items:center;
      flex-wrap:wrap;
    }
    select,button,input[type="checkbox"]{font:inherit}
    .panel{
      background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      padding:14px;
      border-radius:10px;
      box-shadow:0 8px 30px rgba(2,6,23,0.6);
    }
    .add-row{display:flex;gap:8px;align-items:center}
    .tz-list{margin-top:18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
    .clock{
      background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      border:1px solid rgba(255,255,255,0.04);
      padding:14px;border-radius:10px;position:relative;
      display:flex;flex-direction:column;gap:10px;
    }
    .time{
      font-weight:700;
      font-size:28px;
      letter-spacing:1px;
      color:var(--text);
      display:flex;gap:8px;align-items:baseline;
    }
    .tz-name{font-size:13px;color:rgba(230,238,246,0.8)}
    .meta{font-size:12px;color:rgba(230,238,246,0.65)}
    .remove{
      position:absolute;right:10px;top:8px;
      background:transparent;border:none;color:rgba(230,238,246,0.6);cursor:pointer;font-size:14px;
    }
    footer{margin-top:14px;font-size:13px;color:rgba(230,238,246,0.6)}
    .small{font-size:12px;color:rgba(230,238,246,0.6)}
    .accent{color:var(--accent)}
    @media (max-width:560px){
      .time{font-size:22px}
    }
  </style>
</head>
<body>
  <div class="app">
    <header>
      <div>
        <h1>Multi Time Zone Digital Clock</h1>
        <div class="small">Shows current time for multiple IANA time zones. Updates every second.</div>
      </div>
    </header>

    <section class="panel">
      <div class="controls add-row">
        <label for="tz-select" class="small">Add time zone:</label>
        <select id="tz-select" aria-label="Time zone select" style="min-width:320px">
          <!-- options populated by JS -->
        </select>
        <button id="add-btn">Add</button>

        <label style="margin-left:auto" class="small">
          <input type="checkbox" id="hour12" checked /> 12-hour
        </label>
      </div>

      <div class="tz-list" id="clocks"></div>

      <footer>
        <div class="small">Tip: Add several zones and click the X to remove a clock. Time zone abbreviations show where supported.</div>
      </footer>
    </section>
  </div>

  <script>
    // Common IANA time zones (you can expand this list)
    const COMMON_TIMEZONES = [
      "UTC",
      "Europe/London",
      "Europe/Paris",
      "Europe/Moscow",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Karachi",
      "Asia/Dhaka",
      "Asia/Jakarta",
      "Asia/Singapore",
      "Asia/Shanghai",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Phoenix",
      "America/Sao_Paulo",
      "Africa/Cairo",
      "Africa/Johannesburg"
    ];

    const tzSelect = document.getElementById('tz-select');
    const addBtn = document.getElementById('add-btn');
    const clocksDiv = document.getElementById('clocks');
    const hour12Checkbox = document.getElementById('hour12');

    // Populate select options
    function populateSelect() {
      COMMON_TIMEZONES.forEach(tz => {
        const opt = document.createElement('option');
        opt.value = tz;
        opt.textContent = tz.replace('_',' ');
        tzSelect.appendChild(opt);
      });
    }

    populateSelect();

    // Maintain a Map of clocks: key = zone, value = element
    const clocks = new Map();

    function createClockElement(timeZone) {
      const el = document.createElement('div');
      el.className = 'clock';
      el.dataset.tz = timeZone;

      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.title = 'Remove';
      remove.innerHTML = '✕';
      remove.addEventListener('click', () => {
        clocks.delete(timeZone);
        el.remove();
      });

      const name = document.createElement('div');
      name.className = 'tz-name';
      name.textContent = timeZone;

      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = '--:--:--';

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = '—';

      el.appendChild(remove);
      el.appendChild(name);
      el.appendChild(time);
      el.appendChild(meta);

      return {el, timeEl: time, metaEl: meta};
    }

    function updateClocks() {
      const now = new Date();
      for (const [tz, obj] of clocks) {
        const opts = {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
          hour12: hour12Checkbox.checked,
          timeZone: tz,
          timeZoneName: 'short'
        };

        // Time string (HH:MM:SS)
        const timeStr = now.toLocaleTimeString([], opts);
        // Date string
        const dateStr = now.toLocaleDateString([], {...opts, hour: undefined, minute: undefined, second: undefined, timeZoneName: undefined});
        // Abbrev / offset (may vary by browser)
        // Use timeZoneName from formatted string
        const tzName = (() => {
          try {
            // use Intl.DateTimeFormat to get parts
            const f = new Intl.DateTimeFormat([], opts);
            const parts = f.formatToParts(now);
            const tzPart = parts.find(p => p.type === 'timeZoneName');
            return tzPart ? tzPart.value : '';
          } catch (e) {
            return '';
          }
        })();

        obj.timeEl.textContent = timeStr;
        obj.metaEl.textContent = `${dateStr}${tzName ? ' • ' + tzName : ''}`;
      }
    }

    // Add button handler
    addBtn.addEventListener('click', () => {
      const tz = tzSelect.value;
      if (!tz) return;
      if (clocks.has(tz)) {
        alert('Time zone already added.');
        return;
      }
      const {el, timeEl, metaEl} = createClockElement(tz);
      clocksDiv.appendChild(el);
      clocks.set(tz, {el, timeEl, metaEl});
      updateClocks();
    });

    // Allow pressing Enter when select has focus to add
    tzSelect.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    // 12/24 toggle updates immediately
    hour12Checkbox.addEventListener('change', updateClocks);

    // Start with a couple of useful zones
    ['UTC','Asia/Kolkata','America/New_York','Europe/London'].forEach(tz => {
      const {el, timeEl, metaEl} = createClockElement(tz);
      clocksDiv.appendChild(el);
      clocks.set(tz, {el, timeEl, metaEl});
    });

    // Update every second
    updateClocks();
    setInterval(updateClocks, 1000);
  </script>
</body>
</html>
