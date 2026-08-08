## Response Types

### 1. Product List Success

- **endpoint**: /products
- **available queries**: ?category={category_slug}&brand={brand_slug}&featured=true&per_page=5&page=1
- **Status Code**: 200 OK
- **Message**: "Success"
- **Action**:
- **payload**:{
  "success": true,
  "message": "Success",
  "data": [
  {
  "id": "01kqmqrmeadn7wrj8qbjnrwj5e",
  "name": "Gentle Eye Makeup Remover Pads",
  "slug": "gentle-eye-makeup-remover-pads-19",
  "sku": "SMPL-YZD7FQ-20",
  "type": "simple",
  "isOnSale": true,
  "price": 11.99,
  "stock_quantity": 56,
  "available": true,
  "is_featured": false,
  "sort_order": 19,
  "images": [
  {
  "id": 39,
  "name": "Gentle Eye Makeup Remover Pads",
  "url": "https://storage.googleapis.com/glamrush-images-dev/39/800.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/39/conversions/800-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/39/conversions/800-medium.jpg"
  }
  ],
  "category": {
  "id": "01kqmq9ktdzbtxqkykt8ewfp4h",
  "name": "Nail Polish",
  "slug": "nail-polish"
  },
  "brand": {
  "id": "01kqmq9z6n6ws81gydw5kqn78c",
  "name": "Charlotte Tilbury",
  "slug": "charlotte-tilbury"
  },
  "default_attributes": [],
  "variants": []
  },
  {
  "id": "01kqmqrp48s548h9wd53z7eye8",
  "name": "Hyaluronic Acid Plumping Lip Mask",
  "slug": "hyaluronic-acid-plumping-lip-mask-20",
  "sku": "SMPL-J5HSHH-21",
  "type": "simple",
  "isOnSale": true,
  "price": 15,
  "stock_quantity": 360,
  "available": true,
  "is_featured": false,
  "sort_order": 20,
  "images": [
  {
  "id": 40,
  "name": "Hyaluronic Acid Plumping Lip Mask",
  "url": "https://storage.googleapis.com/glamrush-images-dev/40/800.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/40/conversions/800-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/40/conversions/800-medium.jpg"
  }
  ],
  "category": {
  "id": "01kqmq9ktdzbtxqkykt8ewfp4h",
  "name": "Nail Polish",
  "slug": "nail-polish"
  },
  "brand": {
  "id": "01kqmq9z6n6ws81gydw5kqn78c",
  "name": "Charlotte Tilbury",
  "slug": "charlotte-tilbury"
  },
  "default_attributes": [],
  "variants": []
  },
  {
  "id": "01kqmqrqjvy820rqgpkybeg3q8",
  "name": "Satin Finish Lipstick",
  "slug": "satin-finish-lipstick-21",
  "sku": null,
  "type": "variable",
  "isOnSale": false,
  "price": 22,
  "stock_quantity": 0,
  "available": true,
  "is_featured": true,
  "sort_order": 21,
  "images": [
  {
  "id": 46,
  "name": "Satin Finish Lipstick",
  "url": "https://storage.googleapis.com/glamrush-images-dev/46/800.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/46/conversions/800-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/46/conversions/800-medium.jpg"
  }
  ],
  "category": {
  "id": "01kqmq9ktdzbtxqkykt8ewfp4h",
  "name": "Nail Polish",
  "slug": "nail-polish"
  },
  "brand": {
  "id": "01kqmq9rmv4bndsxcp5tnfjdfe",
  "name": "L'Oréal Paris",
  "slug": "loreal-paris"
  },
  "default_attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Red Velvet",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "RV01",
  "display_type": "select",
  "meta": null
  }
  ],
  "variants": [
  {
  "id": "01kqmqrqn5j4ebxn45zce53fas",
  "sku": "VAR-MAWIL2-22",
  "images": [
  {
  "id": 41,
  "name": "Variant VAR-MAWIL2-22",
  "url": "https://storage.googleapis.com/glamrush-images-dev/41/600.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/41/conversions/600-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/41/conversions/600-medium.jpg"
  }
  ],
  "isDefault": true,
  "price": 27.06,
  "salePrice": 23,
  "stock_quantity": 278,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Red Velvet",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "RV01",
  "display_type": "select",
  "meta": null
  }
  ]
  },
  {
  "id": "01kqmqrsmnmjzxyc83yz3kkx13",
  "sku": "VAR-HC3PED-22",
  "images": [
  {
  "id": 42,
  "name": "Variant VAR-HC3PED-22",
  "url": "https://storage.googleapis.com/glamrush-images-dev/42/600.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/42/conversions/600-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/42/conversions/600-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 22.44,
  "salePrice": 19.07,
  "stock_quantity": 237,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Pink Sugar",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "PS02",
  "display_type": "select",
  "meta": null
  }
  ]
  },
  {
  "id": "01kqmqrvpdya0pzb8yg5nqdn03",
  "sku": "VAR-QOTXUW-22",
  "images": [
  {
  "id": 43,
  "name": "Variant VAR-QOTXUW-22",
  "url": "https://storage.googleapis.com/glamrush-images-dev/43/600.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/43/conversions/600-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/43/conversions/600-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 26.18,
  "salePrice": null,
  "stock_quantity": 27,
  "inStock": true,
  "isOnSale": false,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Nude Beige",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "NB03",
  "display_type": "select",
  "meta": null
  }
  ]
  },
  {
  "id": "01kqmqrxaxezgp5v83fsgd254d",
  "sku": "VAR-83GAND-22",
  "images": [
  {
  "id": 44,
  "name": "Variant VAR-83GAND-22",
  "url": "https://storage.googleapis.com/glamrush-images-dev/44/600.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/44/conversions/600-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/44/conversions/600-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 20.02,
  "salePrice": 17.02,
  "stock_quantity": 128,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Berry Bliss",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "BB04",
  "display_type": "select",
  "meta": null
  }
  ]
  },
  {
  "id": "01kqmqryy8ztbgnth3azz4mghz",
  "sku": "VAR-FUQEVT-22",
  "images": [
  {
  "id": 45,
  "name": "Variant VAR-FUQEVT-22",
  "url": "https://storage.googleapis.com/glamrush-images-dev/45/600.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/45/conversions/600-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/45/conversions/600-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 25.3,
  "salePrice": 21.51,
  "stock_quantity": 264,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": null,
  "value": "Coral Kiss",
  "display_type": "color_swatch",
  "meta": null
  },
  {
  "type": "shade",
  "code": null,
  "value": "CK05",
  "display_type": "select",
  "meta": null
  }
  ]
  }
  ]
  }
  ],
  "meta": {
  "current_page": 7,
  "from": 19,
  "last_page": 17,
  "links": [
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=6",
  "label": "&laquo; Previous",
  "page": 6,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=1",
  "label": "1",
  "page": 1,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=2",
  "label": "2",
  "page": 2,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=3",
  "label": "3",
  "page": 3,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=4",
  "label": "4",
  "page": 4,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=5",
  "label": "5",
  "page": 5,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=6",
  "label": "6",
  "page": 6,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=7",
  "label": "7",
  "page": 7,
  "active": true
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=8",
  "label": "8",
  "page": 8,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=9",
  "label": "9",
  "page": 9,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=10",
  "label": "10",
  "page": 10,
  "active": false
  },
  {
  "url": null,
  "label": "...",
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=16",
  "label": "16",
  "page": 16,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=17",
  "label": "17",
  "page": 17,
  "active": false
  },
  {
  "url": "http://127.0.0.1:8000/api/v1/products?page=8",
  "label": "Next &raquo;",
  "page": 8,
  "active": false
  }
  ],
  "path": "http://127.0.0.1:8000/api/v1/products",
  "per_page": 3,
  "to": 21,
  "total": 51
  },
  "links": {
  "first": "http://127.0.0.1:8000/api/v1/products?page=1",
  "last": "http://127.0.0.1:8000/api/v1/products?page=17",
  "prev": "http://127.0.0.1:8000/api/v1/products?page=6",
  "next": "http://127.0.0.1:8000/api/v1/products?page=8"
  },
  "facets": {
  "price_range": {
  "min": 6.7,
  "max": 5000
  },
  "brands": [
  {
  "id": "01kqmq9rmv4bndsxcp5tnfjdfe",
  "name": "L'Oréal Paris",
  "slug": "loreal-paris",
  "count": 12
  },
  {
  "id": "01kqmq9z6n6ws81gydw5kqn78c",
  "name": "Charlotte Tilbury",
  "slug": "charlotte-tilbury",
  "count": 11
  },
  {
  "id": "01kqmq9ww6dwgeq0gpr8rashd1",
  "name": "MAC Cosmetics",
  "slug": "mac-cosmetics",
  "count": 10
  },
  {
  "id": "01kqmq9tpzzwetyr4s605wb2qd",
  "name": "NYX Professional",
  "slug": "nyx-professional",
  "count": 10
  },
  {
  "id": "01kqmq9pfrm2y6cycnfmdw1py2",
  "name": "Maybelline",
  "slug": "maybelline",
  "count": 8
  }
  ],
  "categories": [
  {
  "id": "01kqmq9ktdzbtxqkykt8ewfp4h",
  "name": "Nail Polish",
  "slug": "nail-polish",
  "count": 13
  },
  {
  "id": "01kqmq9d4r8x87tkvw7m1y4wpj",
  "name": "Moisturizers",
  "slug": "moisturizers",
  "count": 12
  },
  {
  "id": "01kqmq9fgmshdp3zc9rr9h4f88",
  "name": "Shampoo",
  "slug": "shampoo",
  "count": 10
  },
  {
  "id": "01kqmq9ac6cgnyv9rcfghnxtsd",
  "name": "Lipstick",
  "slug": "lipstick",
  "count": 9
  },
  {
  "id": "01kqmq9hqgzpbfg3aeyqxkj2bw",
  "name": "Perfumes",
  "slug": "perfumes",
  "count": 7
  }
  ],
  "attributes": [
  {
  "type": "color",
  "display_type": "color_swatch",
  "options": [
  {
  "value": "Red Velvet",
  "label": "Red Velvet",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Pink Sugar",
  "label": "Pink Sugar",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Nude Beige",
  "label": "Nude Beige",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Berry Bliss",
  "label": "Berry Bliss",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Coral Kiss",
  "label": "Coral Kiss",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Ruby Red",
  "label": "Ruby Red",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Midnight Black",
  "label": "Midnight Black",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Lilac Dream",
  "label": "Lilac Dream",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Coral Sun",
  "label": "Coral Sun",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Champagne Gold",
  "label": "Champagne Gold",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Intense Black",
  "label": "Intense Black",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Warm Brown",
  "label": "Warm Brown",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Deep Navy",
  "label": "Deep Navy",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Red",
  "label": "Red",
  "code": "RED",
  "meta": "{\"hex\": \"#ff0000\"}",
  "count": 1
  },
  {
  "value": "Black",
  "label": "Black",
  "code": "BLACK",
  "meta": "{\"hex\": \"#000000\"}",
  "count": 1
  }
  ]
  },
  {
  "type": "shade",
  "display_type": "select",
  "options": [
  {
  "value": "Medium Tan",
  "label": "Medium Tan",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "Light",
  "label": "Light",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "Medium",
  "label": "Medium",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "Dark Brown",
  "label": "Dark Brown",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "RV01",
  "label": "RV01",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "PS02",
  "label": "PS02",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "NB03",
  "label": "NB03",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "BB04",
  "label": "BB04",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "CK05",
  "label": "CK05",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Fair Ivory",
  "label": "Fair Ivory",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Light Beige",
  "label": "Light Beige",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Deep Mahogany",
  "label": "Deep Mahogany",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Peachy Keen",
  "label": "Peachy Keen",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Petal",
  "label": "Rose Petal",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Terracotta",
  "label": "Terracotta",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Light Medium",
  "label": "Light Medium",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Medium Dark",
  "label": "Medium Dark",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N10 Fair",
  "label": "N10 Fair",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N20 Light",
  "label": "N20 Light",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N30 Medium",
  "label": "N30 Medium",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N40 Tan",
  "label": "N40 Tan",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N50 Deep",
  "label": "N50 Deep",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Nude",
  "label": "Nude",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Pink",
  "label": "Pink",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Red",
  "label": "Red",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Berry",
  "label": "Berry",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Deep",
  "label": "Deep",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Pearl Glow",
  "label": "Pearl Glow",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Gold",
  "label": "Rose Gold",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Warm Bronze",
  "label": "Warm Bronze",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Midnight Black",
  "label": "Midnight Black",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Chestnut",
  "label": "Chestnut",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Auburn",
  "label": "Auburn",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Strawberry Blonde",
  "label": "Strawberry Blonde",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Light Bronze",
  "label": "Light Bronze",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Deep Glow",
  "label": "Deep Glow",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Blonde",
  "label": "Blonde",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Taupe",
  "label": "Taupe",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Black",
  "label": "Black",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Nude Shimmer",
  "label": "Nude Shimmer",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Pink Pop",
  "label": "Pink Pop",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Red Velvet",
  "label": "Red Velvet",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Clear Gloss",
  "label": "Clear Gloss",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Sweet Peach",
  "label": "Sweet Peach",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Berry Flush",
  "label": "Berry Flush",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Blush",
  "label": "Rose Blush",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "code",
  "display_type": null,
  "options": [
  {
  "value": "N10",
  "label": "N10",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N20",
  "label": "N20",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N30",
  "label": "N30",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "N40",
  "label": "N40",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "collection",
  "display_type": null,
  "options": [
  {
  "value": "Smoky Night",
  "label": "Smoky Night",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Gold",
  "label": "Rose Gold",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Earth Tones",
  "label": "Earth Tones",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Classic Smoke",
  "label": "Classic Smoke",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Warm Copper",
  "label": "Warm Copper",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Cool Taupe",
  "label": "Cool Taupe",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "size",
  "display_type": "size_label",
  "options": [
  {
  "value": "50ml",
  "label": "50ml",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "100ml",
  "label": "100ml",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "30ml",
  "label": "30ml",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "75ml",
  "label": "75ml",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "200ml",
  "label": "200ml",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Medium",
  "label": "Medium",
  "code": "M",
  "meta": "{}",
  "count": 1
  },
  {
  "value": "Small",
  "label": "Small",
  "code": "S",
  "meta": "{}",
  "count": 1
  },
  {
  "value": "Large",
  "label": "Large",
  "code": "L",
  "meta": "{}",
  "count": 1
  }
  ]
  },
  {
  "type": "finish",
  "display_type": "select",
  "options": [
  {
  "value": "Translucent",
  "label": "Translucent",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Banana",
  "label": "Banana",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Porcelain",
  "label": "Porcelain",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "type",
  "display_type": null,
  "options": [
  {
  "value": "Hydrating",
  "label": "Hydrating",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Mattifying",
  "label": "Mattifying",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Illuminating",
  "label": "Illuminating",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Color Correcting",
  "label": "Color Correcting",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "scent",
  "display_type": null,
  "options": [
  {
  "value": "Vanilla Bean",
  "label": "Vanilla Bean",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Garden",
  "label": "Rose Garden",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Citrus Burst",
  "label": "Citrus Burst",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Coffee & Mint",
  "label": "Coffee & Mint",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Lavender",
  "label": "Lavender",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Coconut Lime",
  "label": "Coconut Lime",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Honey Almond",
  "label": "Honey Almond",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "skin_type",
  "display_type": "select",
  "options": [
  {
  "value": "Oily Skin",
  "label": "Oily Skin",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "Dry Skin",
  "label": "Dry Skin",
  "code": null,
  "meta": null,
  "count": 2
  },
  {
  "value": "Sensitive Skin",
  "label": "Sensitive Skin",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Combination Skin",
  "label": "Combination Skin",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "formula",
  "display_type": "select",
  "options": [
  {
  "value": "Hydrating",
  "label": "Hydrating",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Clarifying",
  "label": "Clarifying",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Brightening",
  "label": "Brightening",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Extreme Volume",
  "label": "Extreme Volume",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Length & Lift",
  "label": "Length & Lift",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Waterproof Curl",
  "label": "Waterproof Curl",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Vitamin C",
  "label": "Vitamin C",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Hyaluronic Acid",
  "label": "Hyaluronic Acid",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Charcoal",
  "label": "Charcoal",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Rose Extract",
  "label": "Rose Extract",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "hair_type",
  "display_type": null,
  "options": [
  {
  "value": "Damaged Hair",
  "label": "Damaged Hair",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Dry Hair",
  "label": "Dry Hair",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Colored Hair",
  "label": "Colored Hair",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  },
  {
  "type": "benefit",
  "display_type": null,
  "options": [
  {
  "value": "Anti-Aging",
  "label": "Anti-Aging",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Brightening",
  "label": "Brightening",
  "code": null,
  "meta": null,
  "count": 1
  },
  {
  "value": "Deep Hydration",
  "label": "Deep Hydration",
  "code": null,
  "meta": null,
  "count": 1
  }
  ]
  }
  ]
  }
  }

### 2. Get Simple Product by SLUG Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Action**:
- **payload**:{
  "success": true,
  "message": "Success",
  "data": {
  "id": "01kqmqqhpt8qc0h0j3fnykbr93",
  "name": "Micellar Cleansing Water 400ml",
  "slug": "micellar-cleansing-water-400ml-1",
  "sku": "SMPL-3URXUZ-3",
  "type": "simple",
  "isOnSale": true,
  "price": 18.99,
  "stock_quantity": 260,
  "available": true,
  "is_featured": true,
  "sort_order": 1,
  "images": [
  {
  "id": 21,
  "name": "Micellar Cleansing Water 400ml",
  "url": "https://storage.googleapis.com/glamrush-images-dev/21/800.jpeg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/21/conversions/800-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/21/conversions/800-medium.jpg"
  }
  ],
  "category": {
  "id": "01kqmq9ac6cgnyv9rcfghnxtsd",
  "name": "Lipstick",
  "slug": "lipstick"
  },
  "brand": {
  "id": "01kqmq9tpzzwetyr4s605wb2qd",
  "name": "NYX Professional",
  "slug": "nyx-professional"
  },
  "default_attributes": [],
  "variants": []
  }
  }

### 3. Get Variable Product by Slug Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Action**:
- **payload**:"data": {
  "id": "01kqt8e3tnywv83sjng9sce22f",
  "name": "Test Variable Product",
  "slug": "test-variable-product",
  "sku": null,
  "type": "variable",
  "isOnSale": false,
  "price": 0,
  "available": true,
  "is_featured": true,
  "sort_order": 5,
  "images": [],
  "category": {
  "id": "01kqmq9ktdzbtxqkykt8ewfp4h",
  "name": "Nail Polish",
  "slug": "nail-polish"
  },
  "brand": {
  "id": "01kqmq9rmv4bndsxcp5tnfjdfe",
  "name": "L'Oréal Paris",
  "slug": "loreal-paris"
  },
  "default_attributes": [
  {
  "type": "color",
  "code": "RED",
  "value": "Red",
  "display_type": "color_swatch",
  "meta": "{\"hex\": \"#ff0000\"}"
  },
  {
  "type": "size",
  "code": "M",
  "value": "Medium",
  "display_type": "size_label",
  "meta": "{}"
  }
  ],
  "variants": [
  {
  "id": "01kqt8e41bgve3af4s7tq5vmkz",
  "sku": "LRLP-TESVARPR-10051-RED-M",
  "images": [
  {
  "id": 178,
  "name": "Zoya_Cherri-1",
  "url": "https://storage.googleapis.com/glamrush-images-dev/178/Zoya_Cherri-1.jpg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/178/conversions/Zoya_Cherri-1-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/178/conversions/Zoya_Cherri-1-medium.jpg"
  }
  ],
  "isDefault": true,
  "price": 5000,
  "salePrice": 4300,
  "stock_quantity": 20,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": "RED",
  "value": "Red",
  "display_type": "color_swatch",
  "meta": "{\"hex\": \"#ff0000\"}"
  },
  {
  "type": "size",
  "code": "M",
  "value": "Medium",
  "display_type": "size_label",
  "meta": "{}"
  }
  ]
  },
  {
  "id": "01kqt8e7n0tm3pjg96wzbgx7hs",
  "sku": "LRLP-TESVARPR-10051-RED-S",
  "images": [
  {
  "id": 179,
  "name": "12.08_GL_Best Gel Polishes",
  "url": "https://storage.googleapis.com/glamrush-images-dev/179/12.08_GL_Best-Gel-Polishes.jpg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/179/conversions/12.08_GL_Best-Gel-Polishes-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/179/conversions/12.08_GL_Best-Gel-Polishes-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 5000,
  "salePrice": 4300,
  "stock_quantity": 20,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": "RED",
  "value": "Red",
  "display_type": "color_swatch",
  "meta": "{\"hex\": \"#ff0000\"}"
  },
  {
  "type": "size",
  "code": "S",
  "value": "Small",
  "display_type": "size_label",
  "meta": "{}"
  }
  ]
  },
  {
  "id": "01kqt8e9cdkt8d9qcf6g2m1tdj",
  "sku": "LRLP-TESVARPR-10051-BLACK-L",
  "images": [
  {
  "id": 180,
  "name": "images",
  "url": "https://storage.googleapis.com/glamrush-images-dev/180/images.jpg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/180/conversions/images-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/180/conversions/images-medium.jpg"
  }
  ],
  "isDefault": false,
  "price": 5000,
  "salePrice": 4300,
  "stock_quantity": 20,
  "inStock": true,
  "isOnSale": true,
  "available": true,
  "attributes": [
  {
  "type": "color",
  "code": "BLACK",
  "value": "Black",
  "meta": "{\"hex\": \"#000000\"}"
  "meta": "{}"
  },
  {
  "type": "size",
  "code": "L",
  "value": "Large",
  "display_type": "size_label",
  "meta": "{}"
  }
  ]
  }
  ]
  }

### 3. Get a single Variant by ID Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Action**:
- **payload**: {
  "success": true,
  "message": "Success",
  "data": {
  "id": "01khc69c8crz9w51719ngpvz2x",
  "product_id": "01khc69c60sfr8eb78kbcz4ysz",
  "sku": "QPCR-TESVARPR-994277-008-RED",
  "is_default": true,
  "price": "5000.00",
  "sale_price": "4000.00",
  "sale_starts_at": "2026-02-10 18:45:00",
  "sale_ends_at": "2026-02-20 18:45:00",
  "manage_stock": true,
  "stock_quantity": 20,
  "in_stock": true,
  "attributes": [
  {
  "type": "size",
  "value": "8"
  },
  {
  "type": "color",
  "value": "Red"
  }
  ],
  "images": [
  {
  "id": 1,
  "name": "1_18",
  "url": "https://storage.googleapis.com/glamrush-images-dev/1/1_18.jpg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/1/conversions/1_18-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/1/conversions/1_18-medium.jpg"
  },
  {
  "id": 2,
  "name": "aveeno-daily-moisturising-body-wash-500ml_1",
  "url": "https://storage.googleapis.com/glamrush-images-dev/2/aveeno-daily-moisturising-body-wash-500ml_1.jpg",
  "thumb": "https://storage.googleapis.com/glamrush-images-dev/2/conversions/aveeno-daily-moisturising-body-wash-500ml_1-thumb.jpg",
  "medium": "https://storage.googleapis.com/glamrush-images-dev/2/conversions/aveeno-daily-moisturising-body-wash-500ml_1-medium.jpg"
  }
  ],
  "sort_order": 10,
  "status": "active",
  "created_at": "2026-02-13T19:05:19.000000Z",
  "updated_at": "2026-02-13T19:05:19.000000Z"
  }
  }
