import { toNano } from '@ton/core';
import { Getter } from '../wrappers/Getter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const getter = provider.open(await Getter.fromInit());

    await getter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(getter.address);

    // run methods on `getter`
}
