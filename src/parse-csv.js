module.exports = (csv, filename = null) => {
  let now = new Date();
  // TODO(next)

  // Use the filename to find a matching config

  // Parse the csv string to 'Transactions'

  // Return the results object
  return {
    error: "oops",
    success: true,
    name: filename || `ynab-${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.csv`,
    transactions: [
      {
        Amount: 420.69,
        Date: new Date(),
        Memo: "Hello world",
        Payee: "" // Empty strings are allowed
      }
    ]
  };
};
