/**
 * Created by phuttipong on 10/5/2559.
 */
import {sortBy, first} from 'underscore';

class AccountTransStore {
    constructor() {
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
}
export default new AccountTransStore();
