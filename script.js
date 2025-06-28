
document.addEventListener("DOMContentLoaded", function () {
    const data = JSON.parse(localStorage.getItem("trades") || "[]");
    const container = document.getElementById("entries");

    if (!data.length) {
        container.innerHTML = "<p>尚無交易紀錄。</p>";
        return;
    }

    data.forEach(trade => {
        const div = document.createElement("div");
        div.className = "entry";
        const directionDisplay = trade.direction === "買進" ? "🟩 買入開多" : "🟥 賣出開空";
        div.innerHTML = `
            <div>📅 ${trade.time}</div>
            <div>商品：${trade.symbol}</div>
            <div>方向：${directionDisplay}</div>
            <div>進場價：${trade.entry} 出場價：${trade.exit}</div>
            <div>損益：${trade.pl} USDT</div>
            <div>標籤：${(trade.tags || []).join(", ")}</div>
            <div>備註：${trade.note}</div>
        `;
        container.appendChild(div);
    });
});
