{
  "name": "Inventory",
  "type": "object",
  "properties": {
    "product_name": {
      "type": "string",
      "title": "Product Name"
    },
    "sku": {
      "type": "string",
      "title": "SKU"
    },
    "quantity": {
      "type": "number",
      "title": "Quantity in Stock"
    },
    "warehouse": {
      "type": "string",
      "title": "Warehouse",
      "enum": [
        "Warehouse A",
        "Warehouse B",
        "Warehouse C"
      ]
    },
    "reorder_level": {
      "type": "number",
      "title": "Reorder Level"
    },
    "status": {
      "type": "string",
      "title": "Status",
      "enum": [
        "In Stock",
        "Low Stock",
        "Out of Stock"
      ],
      "default": "In Stock"
    }
  },
  "required": [
    "product_name",
    "sku",
    "quantity",
    "warehouse"
  ]
}