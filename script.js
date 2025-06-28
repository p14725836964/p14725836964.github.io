
function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function save() {
  alert("✅ 交易紀錄已儲存！(模擬功能)");
}
