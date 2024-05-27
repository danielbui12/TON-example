import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Getter } from '../wrappers/Getter';
import '@ton/test-utils';

describe('Getter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let getter: SandboxContract<Getter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        getter = blockchain.openContract(await Getter.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await getter.send(
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
            to: getter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and getter are ready to use
    });
});
