document.addEventListener('DOMContentLoaded', function() {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const initialBalanceInput = document.getElementById('initialBalance'); // Novo elemento
    const transactionForm = document.getElementById('transactionForm');
    const balanceAmount = document.getElementById('balanceAmount');
    const categoryPercentage = document.getElementById('categoryPercentage');
    const transactionDetails = document.getElementById('transactionDetails');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let initialBalance = parseFloat(localStorage.getItem('initialBalance')) || 0; // Novo valor

    function updateUI() {
        let totalBalance = initialBalance; // Inicializa com o saldo total inserido
        const categories = {};

        transactionDetails.innerHTML = '';

        transactions.forEach((transaction, index) => {
            totalBalance += transaction.amount;

            if (categories[transaction.category]) {
                categories[transaction.category] += transaction.amount;
            } else {
                categories[transaction.category] = transaction.amount;
            }

            const colorClass = transaction.amount >= 0 ? 'text-success' : 'text-danger';
            const transactionItem = document.createElement('div');
            transactionItem.className = 'mb-2';
            transactionItem.innerHTML = `
                <span class="${colorClass}">${transaction.category}:</span>
                ${transaction.description} - R$ ${transaction.amount.toFixed(2)}
                <button class="btn btn-danger btn-sm ml-2 delete-button" data-index="${index}">Excluir</button>
            `;
            transactionDetails.appendChild(transactionItem);
        });

        balanceAmount.textContent = `R$ ${totalBalance.toFixed(2)}`;

        const categoryPercentageHTML = Object.entries(categories)
            .map(([category, amount]) => {
                const percentage = (amount / totalBalance) * 100;
                const colorClass = amount >= 0 ? 'text-success' : 'text-danger';
                return `
                    <div class="mb-2">
                        <span class="${colorClass}">${category}:</span>
                        ${percentage.toFixed(2)}%
                    </div>
                `;
            })
            .join('');

        categoryPercentage.innerHTML = categoryPercentageHTML;
    }

    function addTransaction(event) {
        event.preventDefault();

        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const category = categoryInput.value;

        if (description && !isNaN(amount)) {
            transactions.push({ description, amount, category });
            localStorage.setItem('transactions', JSON.stringify(transactions));

            initialBalance = parseFloat(initialBalanceInput.value); // Atualiza o saldo total inicial
            localStorage.setItem('initialBalance', initialBalance); // Armazena o novo saldo total

            updateUI();

            descriptionInput.value = '';
            amountInput.value = '';
        }
    }

    function deleteTransaction(index) {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateUI();
    }

    transactionForm.addEventListener('submit', addTransaction);

    transactionDetails.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            if (!isNaN(index)) {
                deleteTransaction(index);
            }
        }
    });

    updateUI();
});