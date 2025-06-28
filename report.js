
document.addEventListener("DOMContentLoaded", function () {
    const raw = JSON.parse(localStorage.getItem("trades") || "[]");
    const rangeSelect = document.getElementById("range");
    rangeSelect.addEventListener("change", () => renderCharts());
    renderCharts();

    function renderCharts() {
        const days = rangeSelect.value === "all" ? Infinity : parseInt(rangeSelect.value);
        const now = new Date();
        const trades = raw.filter(t => {
            if (days === Infinity) return true;
            const tDate = new Date(t.time);
            return (now - tDate) / 86400000 <= days;
        });

        const summary = {
            total: trades.length,
            profit: 0,
            wins: 0,
            losses: 0,
            long: 0,
            short: 0,
            tags: {}
        };

        const plByDate = {};
        trades.forEach(t => {
            const dateStr = new Date(t.time).toISOString().slice(0, 10);
            const pl = parseFloat(t.pl) || 0;
            plByDate[dateStr] = (plByDate[dateStr] || 0) + pl;
            summary.profit += pl;
            if (pl > 0) summary.wins++;
            if (pl < 0) summary.losses++;
            if (t.direction === "買進") summary.long++;
            if (t.direction === "賣出") summary.short++;
            (t.tags || []).forEach(tag => {
                summary.tags[tag] = (summary.tags[tag] || 0) + 1;
            });
        });

        // 更新文字摘要
        document.getElementById("summaryText").innerText = `
總筆數：${summary.total}，總損益：${summary.profit.toFixed(2)} USDT
勝率：${summary.total ? ((summary.wins / summary.total) * 100).toFixed(1) : 0}%
做多：${summary.long} 次，做空：${summary.short} 次
        `.trim();

        // 建立每日損益圖
        const dates = Object.keys(plByDate).sort();
        const plValues = dates.map(d => plByDate[d]);
        drawChart("plChart", "line", dates, plValues, "每日損益", "#2c3e50");

        // 建立方向比例圖
        drawChart("directionChart", "pie", ["買入開多", "賣出開空"], [summary.long, summary.short], "操作方向", ["#27ae60", "#e74c3c"]);

        // 建立標籤統計圖
        const tagNames = Object.keys(summary.tags);
        const tagCounts = tagNames.map(t => summary.tags[t]);
        drawChart("tagChart", "bar", tagNames, tagCounts, "標籤使用次數", "#8e44ad");
    }

    let charts = {};
    function drawChart(id, type, labels, data, label, color) {
        if (charts[id]) charts[id].destroy();
        charts[id] = new Chart(document.getElementById(id), {
            type,
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor: Array.isArray(color) ? color : color,
                    borderColor: "#333",
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: type !== "bar" ? true : false }
                },
                scales: type === "bar" || type === "line" ? {
                    y: { beginAtZero: true }
                } : {}
            }
        });
    }
});
