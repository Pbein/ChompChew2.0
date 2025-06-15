# Scripts

## Load Seed Data

To populate your Supabase database with sample recipes:

```bash
npm run seed
```

This script will:
1. Check if recipes already exist in the database
2. Create a demo user if needed
3. Insert 4 sample recipes with different dietary tags
4. Skip if recipes already exist

The sample recipes include:
- Chicken & Rice Soup (low-fiber, UC-safe)
- Vegan Chocolate Chip Cookies (vegan, dairy-free)
- Mediterranean Quinoa Bowl (vegetarian, gluten-free, high-protein)
- Honey Garlic Salmon (high-protein, omega-3, gluten-free)

This ensures both guest and authenticated users will see recipes on the homepage. 