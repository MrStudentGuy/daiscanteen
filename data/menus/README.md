# Monthly menu files

Store each month as a separate JSON file in this directory using the canonical filename format `MonthYYYY.json`.

Examples:
- `April2026.json`
- `May2026.json`
- `June2026.json`

## Date keys

Each top-level key must be an ISO date in `YYYY-MM-DD` format.

## Schema

```json
{
  "2026-05-14": {
    "breakfast": {
      "items": ["ITEM 1", "ITEM 2"],
      "accompaniments": ["CHUTNEY", "CURD"]
    },
    "lunch": {
      "salad": "SALAD NAME",
      "healthy": "SOUP OR HEALTHY ITEM",
      "vegetable": "MAIN VEGETABLE",
      "dal": "DAL NAME",
      "rice": "RICE ITEM",
      "roti_puri_bread": "BREAD ITEM",
      "fruit_dessert": "FRUIT OR DESSERT"
    },
    "evening_snacks": ["SNACK 1"]
  }
}
```

## Operational flow

1. Add the next month file with the same schema.
2. Keep the filename in `MonthYYYY.json` format.
3. Redeploy the app.
4. The new month becomes available without code changes because the server loader discovers files dynamically.
