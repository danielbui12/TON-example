import "@stdlib/deploy";

message Deposit{
    amount: Int as uint32;
    // queryId: Int as uint32;
}

message Withdraw{
    amount: Int as uint32;
    target: Address;
}

contract Fund with Deployable {

    balance: Int as uint256;

    init() {
        self.balance = 10;    
    }

    receive(){
        throw(111);
    }

    receive(msg: Deposit){
        self.balance = self.balance + msg.amount;
    }

    receive(msg: Withdraw){
        require(self.balance>=msg.amount, "there isn't such balance on contract");
        self.balance = self.balance - msg.amount;
        send(SendParameters{
            to: msg.target,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            // cause of missing "queryId", this will be reverted
            body: Deposit{
              amount: msg.amount,
              // queryId: 0
            }.toCell()
        });
    }

    // as the "fallback" function
    bounced(src: Deposit){
        self.balance = self.balance + src.amount;
    }

    get fun balance(): Int {
        return self.balance;
    }
}