# 🛑 Danger Zone

## CAUTION: Destructive Scripts Ahead

The scripts contained in this directory are **powerful and destructive**. They are designed for specific, one-off maintenance tasks and can cause **irreversible data loss** if run improperly or in the wrong environment.

**DO NOT RUN ANY SCRIPT IN THIS FOLDER UNLESS YOU:**

1.  **Fully Understand What It Does:** Read the script's source code from top to bottom.
2.  **Have a Current Database Backup:** Ensure you can restore your data if something goes wrong.
3.  **Are Targeting the Correct Environment:** Double-check that your `.env` files are pointing to a development or staging database, NOT production.

---

### Scripts

-   `clear-database.mjs`: Deletes all records from the `recipes` table in the database. 