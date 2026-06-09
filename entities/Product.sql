{
  "name": "Product",
  "type": "object",
  "properties": {
    "sku": {
      "type": "string",
      "title": "SKU"
    },
    "name": {
      "type": "string",
      "title": "Product Name"
    },
    "category": {
      "type": "string",
      "title": "Category",
      "enum": [
        "Shirts",
        "Pants",
        "Jackets",
        "Dresses",
        "Accessories"
      ]
    },
    "unit_price": {
      "type": "number",
      "title": "Unit Price ($)"
    },
    "description": {
      "type": "string",
      "title": "Description"
    }
  },
  "required": [
    "sku",
    "name",
    "category",
    "unit_price"
  ]
}