function changePage(page) {
  document.getElementById("homePage").style.display = page === 'home' ? 'block' : 'none';
  document.getElementById("addPage").style.display = page === 'add' ? 'block' : 'none';
  document.getElementById("reportPage").style.display = page === 'report' ? 'block' : 'none';
  if (page === 'home') loadJournal();
  if (page === 'report') drawReport();
}

document.getElementById("tradeForm").onsubmit = function(e) {
  e.preventDefault();
  saveToLocal();
};

function saveToLocal() {
  const tradeTime = document.getElementById("tradeTime").value;
  const symbol = document.getElementById("symbol").value;
  const direction = document.querySelector('input[name="direction"]:checked').value;
  const entry = parseFloat(document.getElementById("entryPrice").value);
  const exit = parseFloat(document.getElementById("exitPrice").value);
  const profitLoss = parseFloat(document.getElementById("profitLoss").value);
  const tags = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
  const file = document.getElementById("screenshot").files[0];

  const reader = new FileReader();
  reader.onload = () => {
    const img = reader.result;
    const record = { tradeTime, symbol, direction, entry, exit, profitLoss, tags, img };
    const all = JSON.parse(localStorage.getItem("journal") || "[]");
    all.push(record);
    localStorage.setItem("journal", JSON.stringify(all));
    alert("✅ 交易紀錄已儲存！（模擬功能）");
  };
  if (file) reader.readAsDataURL(file);
  else reader.onload();
}

function loadJournal() {
  const list = document.getElementById("journalList");
  const all = JSON.parse(localStorage.getItem("journal") || "[]");
  if (!all.length) return list.innerHTML = "尚無交易紀錄。";
  list.innerHTML = all.map((r, i) =>
    `<div>
      <b>${r.symbol}</b> ${r.direction}｜${r.entry} → ${r.exit}｜損益：${r.profitLoss}｜標籤：${r.tags.join(', ')}<br>
      ${r.img ? `<img src="${r.img}" />` : ''}
    </div>`
  ).join("<hr>");
}

function drawReport() {
  const ctx = document.getElementById("profitChart");
  const all = JSON.parse(localStorage.getItem("journal") || "[]");
  const labels = all.map(r => r.symbol + " " + r.tradeTime);
  const data = all.map(r => r.profitLoss);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ label: "損益金額", data: data, backgroundColor: "#2980b9" }]
    }
  });
}