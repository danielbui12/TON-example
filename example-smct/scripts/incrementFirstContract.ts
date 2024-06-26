import { Address, toNano } from '@ton/core';
import { FirstContract } from '../wrappers/FirstContract';
import { NetworkProvider, sleep } from '@ton/blueprint';
require('dotenv').config();

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    const address = Address.parse(process.env.FIRST_CONTRACT_ADDRESS || await ui.input('FirstContract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const firstContract = provider.open(FirstContract.fromAddress(address));

    const counterBefore = await firstContract.getCounter();

    await firstContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await firstContract.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await firstContract.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write(`Counter increased from ${counterBefore} to ${counterAfter}`);
    ui.write('Counter increased successfully!');
}
