## Response Types

### 1. POST Checkout response Success

- **Status Code**: 200 OK
- **Message**: "Success"
- **Description**: Pagniated list of Brands
- **Action**:
- **payload**: {
  "success": true,
  "message": "Order created successfully.",
  "data": {
  "id": "01kr99ys482nvpk05xprhbk163",
  "order_number": "GR-20260510-675835",
  "status": "pending_payment",
  "subtotal": 24.23,
  "shipping_amount": 1500,
  "total": "1524.23",
  "currency": "NGN",
  "shipping_rate_id": "01kr1cx564fqx9rx9dz4ved8kx",
  "shipping_method_name": "Standard Delivery",
  "shipping_zone_name": "Lagos",
  "shipping_address": {
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "08012345678",
  "country": "NG",
  "state": "Lagos",
  "city": "Ikeja",
  "postal_code": "100001",
  "line1": "12 Allen Avenue",
  "line2": "Near Computer Village"
  },
  "billing_address": {
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "08012345678",
  "country": "NG",
  "state": "Lagos",
  "city": "Ikeja",
  "postal_code": "100001",
  "line1": "12 Allen Avenue",
  "line2": "Near Computer Village"
  },
  "placed_at": "2026-05-10T16:01:36+00:00",
  "paid_at": null,
  "items": [
  {
  "id": "01kr99ys5a46yt7w9wgyg7djt2",
  "product_id": "01kqmqqqj1hhftvmj96hk8s5z3",
  "product_variant_id": "01kqmqqqj5ppyr4feh6ja60w3d",
  "product_name": "SPF 50 Daily Sunscreen Fluid",
  "product_slug": "spf-50-daily-sunscreen-fluid-4",
  "sku": "SMPL-VIDUDO-5",
  "unit_price": 24.23,
  "quantity": 1,
  "line_total": "24.23",
  "product_snapshot": {
  "product_id": "01kqmqqqj1hhftvmj96hk8s5z3",
  "variant_id": "01kqmqqqj5ppyr4feh6ja60w3d",
  "name": "SPF 50 Daily Sunscreen Fluid",
  "slug": "spf-50-daily-sunscreen-fluid-4",
  "sku": "SMPL-VIDUDO-5",
  "price": 24.23
  }
  }
  ]
  }
  }
