import * as openpgp from "openpgp";
import getPubKey from "./get-pub-key";
import getCategories from "./get-categories";

/**
 * This file is part of an upcoming feature where ynab-buddy auto-categorizes transactions.
 * It fetches categories from a budget and encrypts them so they can be managed securely.
 * Note that this will only work on a system that already has ynab-buddy initialized.
 */
async function categorize() {
  const publicKey = await getPubKey();

  const categories = getCategories();
  const json = JSON.stringify(categories);

  const message = await openpgp.createMessage({text: json});

  const ciphertext = await openpgp.encrypt({
    message,
    encryptionKeys: [publicKey],
    format: "armored"
  });

  ciphertext;
}

(async () => {await categorize()})();
