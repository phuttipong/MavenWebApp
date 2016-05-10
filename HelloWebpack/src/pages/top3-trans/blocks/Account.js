import React, {Component} from 'react';
import {sortBy, first} from 'underscore';
import './Account.css';

class Account extends Component {
    constructor() {
        super(...arguments);
        this.transactions = [];
    }

    getTopTransactions() {
        var getSortKey = transaction => -Math.abs(transaction.amount);
        var sortedTransactions = sortBy(this.transactions, getSortKey);
        return first(sortedTransactions, 3);
    }

    deposit(amount, date) {
        this.transactions.push({
            id: this.genNewId(),
            amount: amount,
            date: date
        });
    }

    withdraw(amount, date) {
        this.transactions.push({
            id: this.genNewId(),
            amount: -amount,
            date: date
        });
    }

    genNewId() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }

    render() {
        let myAccount = new Account();

        myAccount.deposit(200000, '2015-01-01');
        myAccount.deposit(500000, '2015-02-01');
        myAccount.deposit(100000, '2015-03-01');
        myAccount.withdraw(300000, '2015-04-01');

        var transactions = myAccount.getTopTransactions().map((transaction) => {
            return <li key={transaction.id} //
                       className="account__item">{transaction.amount + " (" + transaction.date + ")"}</li>
        });

        // Top 3: 500000, -300000, 200000
        return (<div>{transactions}</div>);
    }
}

export default Account;