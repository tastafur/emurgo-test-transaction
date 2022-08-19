
type closingAccount = {
    accountId: string; 
    amount: number; 
}

type recipientAccount = { 
    accountId: string,
    credit: number 
}

type transferAccount = {
    closingAccountId?: string;
    recipientAccountId: string;
    credit?: number;
    value: number;
}

type transfer = [
    acc1: string,
    rec1: string | null,
    value: number
]
type allTransfers = {
    transfers: transfer[]
    operationalFee: number,
}

const newRebalancingTx = (closingAccounts: closingAccount[], recipientAccounts: recipientAccount[])/*: allTransfers*/ => { 
    const amountClosingAccounts = closingAccounts
        .reduce((acc: number, curr: closingAccount) => acc + curr.amount, 0)
    const creditRecipientAccounts = recipientAccounts
        .reduce((acc: number, curr: recipientAccount) => acc + curr.credit, 0)

    let transfers: transfer[];
    let operationalFee: number = 0;

    if ( amountClosingAccounts <= 0) {
        throw new Error("The value of the closed accounts must not be zero or negative number")
    }

    const transfersAccount: transferAccount[] = recipientAccounts.map((recipientAccountCurr: recipientAccount) => ({
        recipientAccountId: recipientAccountCurr.accountId,
        credit: recipientAccountCurr.credit,
        value: 0
    }))
    closingAccounts.forEach((closingAccountCurr: closingAccount) => {
        transfersAccount.forEach((transferAccountCurr: transferAccount) => {
            if (closingAccountCurr.amount > 0 && transferAccountCurr.value !== transferAccountCurr.credit) {
                transferAccountCurr.closingAccountId = closingAccountCurr.accountId;
                transferAccountCurr.value = closingAccountCurr.amount > transferAccountCurr.credit ? transferAccountCurr.credit : closingAccountCurr.amount;
                closingAccountCurr.amount = transferAccountCurr.credit > closingAccountCurr.amount ? 0 : closingAccountCurr.amount - transferAccountCurr.credit;
            }
        })
    });

    if (amountClosingAccounts < creditRecipientAccounts) {
        throw new Error("not enough funds for rebalancing")
    }

    if (amountClosingAccounts > creditRecipientAccounts) {
        closingAccounts.forEach((closingAccountCurr: closingAccount, index) => {
            if (closingAccountCurr.amount > 0 && closingAccountCurr.amount > (transfersAccount.length + 1) * 10) {
                transfersAccount.push({closingAccountId: closingAccountCurr.accountId, recipientAccountId: null, value: closingAccounts.length !== index + 1 ? closingAccountCurr.amount : closingAccountCurr.amount - (transfersAccount.length + 1) * 10})
            }
        })
    }

    transfers = transfersAccount.map((transferAccountCurr: transferAccount): transfer => [transferAccountCurr.closingAccountId, transferAccountCurr.recipientAccountId, transferAccountCurr.value])


    console.log("closingAccounts", closingAccounts);
    console.log("transfersAccount", transfersAccount);

    return {
        transfers,
        operationalFee: transfers.length * 10,
    };
}


const closingAccountsBank1: closingAccount[] = [{
    accountId: '123',
    amount: 1000
}]

const recipientAccountsBank1: recipientAccount[] = [{
    accountId: '214',
    credit: 500
}, {
    accountId: '512',
    credit: 400
}]

console.log('test 1', newRebalancingTx(closingAccountsBank1, recipientAccountsBank1))


const closingAccountsBank2: closingAccount[] = [{
    accountId: '123',
    amount: 500
}, {
    accountId: '423',
    amount: 500
}]

const recipientAccountsBank2: recipientAccount[] = [{
    accountId: '214',
    credit: 400
}]

console.log('test 2', newRebalancingTx(closingAccountsBank2, recipientAccountsBank2))