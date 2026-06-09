{
  "name": "Customer",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Company Name"
    },
    "contact_person": {
      "type": "string",
      "title": "Contact Person"
    },
    "email": {
      "type": "string",
      "title": "Email"
    },
    "phone": {
      "type": "string",
      "title": "Phone"
    },
    "city": {
      "type": "string",
      "title": "City"
    },
    "status": {
      "type": "string",
      "title": "Status",
      "enum": [
        "Active",
        "Inactive"
      ],
      "default": "Active"
    }
  },
  "required": [
    "name",
    "contact_person",
    "email"
  ]
}