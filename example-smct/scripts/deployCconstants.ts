import { toNano } from '@ton/core';
import { Cconstants } from '../wrappers/Cconstants';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const cconstants = provider.open(await Cconstants.fromInit());

    await cconstants.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(cconstants.address);

    // run methods on `cconstants`
}
