## Response Types

### 1. Address List Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Description**: Pagniated list of Brands
- **Action**:
- **payload**: {
  "success": true,
  "message": "Success",
  "data": [
  {
  "id": "01kr1qtatj629rjycmr9kdy7k9",
  "label": "Home",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+2348000000001",
  "address_line_1": "12 Bode Thomas Street",
  "address_line_2": "Flat 3B",
  "country": "Nigeria",
  "state": "Lagos",
  "city": "Surulere",
  "postal_code": "101212",
  "is_default": true
  },
  {
  "id": "01kr1qtatyq5j72fk8rpj2hzjp",
  "label": "Office",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+2348000000002",
  "address_line_1": "7 Adeola Odeku Street",
  "address_line_2": null,
  "country": "Nigeria",
  "state": "Lagos",
  "city": "Victoria Island",
  "postal_code": "101233",
  "is_default": false
  }
  ]
  }

### 2. Get Single Address by ID Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Description**: Pagniated list of Brands
- **Action**:
- **payload**: {
  "success": true,
  "message": "Success",
  "data": {
  "id": "01kr1qtatyq5j72fk8rpj2hzjp",
  "label": "Office",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+2348000000002",
  "address_line_1": "7 Adeola Odeku Street",
  "address_line_2": null,
  "country": "Nigeria",
  "state": "Lagos",
  "city": "Victoria Island",
  "postal_code": "101233",
  "is_default": false
  }
  }
