import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Cconstants } from '../wrappers/Cconstants';
import '@ton/test-utils';

describe('Cconstants', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let cconstants: SandboxContract<Cconstants>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        cconstants = blockchain.openContract(await Cconstants.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await cconstants.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: cconstants.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and cconstants are ready to use
    });
});
