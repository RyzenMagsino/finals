let prices = {
    classic: 46,
    spicy: 47,
    roasted: 48
};
let quantities = {
    classic: 5,
    spicy: 3,
    roasted: 2
};

function updateOrder() {
    let classicTotal = prices.classic * quantities.classic;
    let spicyTotal = prices.spicy * quantities.spicy;
    let roastedTotal = prices.roasted * quantities.roasted;

    document.getElementById('classic-total').textContent = classicTotal;
    document.getElementById('spicy-total').textContent = spicyTotal;
    document.getElementById('roasted-total').textContent = roastedTotal;

    let totalPrice = classicTotal + spicyTotal + roastedTotal;
    document.getElementById('total-price').textContent = totalPrice;

    calculateChange();
}

function calculateChange() {
    let totalPrice = parseFloat(document.getElementById('total-price').textContent);
    let payment = parseFloat(document.getElementById('payment').value);
    let change = payment - totalPrice;
    document.getElementById('change').textContent = change.toFixed(2);
}

document.querySelectorAll('.adjust-btn').forEach(button => {
    button.addEventListener('click', function () {
        let item = this.getAttribute('data-item');
        let type = this.getAttribute('data-type');

        if (type === 'increase') {
            quantities[item]++;
        } else if (type === 'decrease' && quantities[item] > 0) {
            quantities[item]--;
        }

        updateOrder();
    });
});

updateOrder();