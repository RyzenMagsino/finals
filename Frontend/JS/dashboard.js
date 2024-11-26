// Bar chart
new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
        labels: ["Classic", "Roasted", "Spicy"],
        datasets: [
            {
                label: "Chicken Flavor",
                backgroundColor: ["#008000", "#ffff00", "#ff0000"],
                data: [2478, 5267, 734]
            }
        ]
    },
    options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Allow chart to adjust its height
        legend: { display: false },
        title: {
            display: true,
            text: 'Predicted World Population (millions) in 2050'
        }
    }
});