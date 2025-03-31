import * as web3 from "@solana/web3.js";
import axios from "axios";

const connection = new web3.Connection(
        `${window.location.origin}/api/check`,
        {
            commitment: "confirmed"
        }
    );

async function getFees(pool: string, account: string) {
    const response = await axios.get(
        `https://app.meteora.ag/clmm-api/wallet/${account}/${pool}/earning`
    )

    return response.data.total_fee_usd_claimed;
}

async function parseTransaction(tx: web3.ParsedTransactionWithMeta) {
    if (tx.meta?.err) return;

    const logs = tx.meta?.logMessages?.join('\n') || '';

    if (logs.search('InitializePosition') != -1) {
        let instruction;

        for (let inst of tx.transaction.message.instructions) {
            let i = inst as web3.PartiallyDecodedInstruction;

            if (i.accounts != undefined && i.accounts.length == 16 && i.programId.toBase58() == 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo') {
                instruction = i;
                break;
            }
        }

        if (!instruction) return;

        const pool = instruction.accounts[1];

        return pool.toBase58()
    }
}

async function getPools(account: web3.PublicKey) {
    const signatures = await connection.getSignaturesForAddress(account);
    const transactions = await connection.getParsedTransactions(signatures.map(i => i.signature), {maxSupportedTransactionVersion: 0})

    let result = [];

    for (let tx of transactions) {
        if (tx) {
            const pool = await parseTransaction(tx);
            if (pool) result.push(pool);
        }
    }

    return [...new Set(result)];
}

export async function check(address: string, messageElement: HTMLElement) {
    try {
        const addressPC = new web3.PublicKey(address);
        messageElement.textContent = "Получаем список пулов";
        const pools = await getPools(addressPC);
        messageElement.textContent = `Считаем комиссии в ${pools.length} пулах [0/${pools.length}]`
        let sum = 0;
        for (let pool of pools) {
            sum += await getFees(pool, addressPC.toBase58());
            messageElement.textContent = `Считаем комиссии в ${pools.length} пулах [${pools.indexOf(pool) + 1}/${pools.length}]`
        }
        messageElement.textContent = `Итоговая комиссия: ${sum.toFixed(2).replace('.', ',')}$`
    } catch (e) {
        console.error(e);
        messageElement.textContent = "Произошла ошибка";
    }
}