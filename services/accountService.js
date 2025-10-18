async function transfer(fromAccountId, toAccountId, amount) {
  console.log(`Transfer service called: from ${fromAccountId} to ${toAccountId}, amount ${amount}`);
  return { message: 'Transfer service reached' };
}

module.exports = { transfer };
