import { getConfiguration } from "./configuration";
import * as ynab from "ynab";

describe("categories", () => {
  it("get my categories from ynab", async () => {
    try {
      // Load in configuration
      const config = getConfiguration();

      // Initialize a YNAB api client
      const API = new ynab.API(config.ynab.token);

      // Get all budget ids
      const budgets = await API.budgets.getBudgets(false);
      const budgetIds = budgets.data.budgets.map((budget) => budget.id);

      // For every budget, get the categories
      const promises = budgetIds.map(async (id) => {
        const budget = await API.budgets.getBudgetById(id);
        const categories = budget.data.budget.categories;
        const categoryGroups = budget.data.budget.category_groups;

        categories && categories.forEach((category) => {
          // Remove the note from the category
          delete category.note;

          // Get the category group id
          const categoryGroupId = category.category_group_id;

          // Get the category group name
          const categoryGroup = categoryGroups && categoryGroups.find(
            (group) => group.id === categoryGroupId
          );

          (category as any).groupName = categoryGroup && categoryGroup.name;
        });
        return {
          categories,
          categoryGroups,
          budgetName: budget.data.budget.name,
        };
      });
      const categoriesPerBudget = await Promise.all(promises);

      const buddyCategories: BuddyCategory[] = [];
      categoriesPerBudget.forEach(budget => {
        budget.categories?.forEach(category => {
          const buddyCategory: BuddyCategory = {
            name: category.name,
            groupName: (category as any).groupName,
            budgetName: budget.budgetName,
            budgeted: category.budgeted,
            activity: category.activity,
            balance: category.balance
          }
          if (!category.hidden && !category.deleted) buddyCategories.push(buddyCategory);
        });
      });

      const encrypted = encrypt(buddyCategories);

      debugger;
    } catch (error) {
      debugger;
    }
  });
});

function encrypt(categories: BuddyCategory[]) {
  const crypto = require("asymmetric-crypto");
  const key = crypto.keyPair();
  debugger;
  const ciphertext = crypto.encrypt(JSON.stringify(categories), key.publicKey);
  return ciphertext;
}

type BuddyCategory = {
  name: string;
  groupName: string;
  budgetName: string;
  budgeted: number;
  balance: number;
  activity: number;
}