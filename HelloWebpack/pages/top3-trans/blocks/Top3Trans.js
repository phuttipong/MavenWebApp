import React, {Component} from 'react';
import './Top3Trans.css';

import AccountTransStore from '../../../stores/AccountTransStore';

class Top3Trans extends Component {
    render() {
        AccountTransStore.deposit(200000, '2015-01-01');
        AccountTransStore.deposit(500000, '2015-02-01');
        AccountTransStore.deposit(100000, '2015-03-01');
        AccountTransStore.withdraw(300000, '2015-04-01');

        var transactions = AccountTransStore.getTopTransactions().map((transaction) => {
            return <li key={transaction.id} //
                       className="top3-trans__item">{transaction.amount + " (" + transaction.date + ")"}</li>
        });

        // Top 3: 500000, -300000, 200000
        return (<div>{transactions}</div>);
    }
}

export default Top3Trans;