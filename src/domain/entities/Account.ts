export class Account {
  constructor(
    public id: number,
    public userId: number,
    public balance: number,
    public type?: string
  ) {}

  deposit(amount: number) {
    if (amount <= 0) throw new Error("invalid deposit");
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount <= 0 || amount > this.balance) throw new Error("invalid withdrawal");
    this.balance -= amount;
  }
}