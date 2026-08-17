# Storefront feature catalog

## Global storefront shell

- API-managed announcement text and optional link
- Responsive navigation and category hierarchy
- Search entry points
- Customer account and bag controls
- Bag dropdown with items, quantity adjustment, removal, subtotal, and checkout action
- Footer content links, contact information, and newsletter subscription form

## Homepage

- Campaign-driven hero imagery, copy, and calls to action
- Ordered API-configured sections
- Featured, newest, sale, category, collection, and manually selected product groups
- A maximum of four displayed products per product section
- Responsive product cards with quick add

## Catalog and search

- Category landing pages
- Keyword search synchronized to the URL
- Brand, category, price, sale, and attribute facets
- Server-driven result counts and pagination
- Sorting and mobile filter presentation
- Quick add for simple products
- Variant picker before quick add for variable products
- Visible sale-filter checked/unchecked state

## Product detail

- Product name, brand, price, sale state, and availability
- Primary image with thumbnail carousel for multiple images
- Variant option selection
- Image set changes for the currently selected variant
- Quantity limited by available inventory and quantity already in the bag
- Add-to-bag action and saved-item interaction
- Long HTML product description displayed in a full-width lower section
- Branded fallback image when no catalog image exists

## Bag

- Guest and authenticated carts
- Bag dropdown instead of immediate checkout navigation
- Quantity increment/decrement with optimistic 500 ms debouncing
- Item removal
- Server-refreshed subtotal
- Inventory and maximum-quantity feedback
- Guest cart preserved and merged after authentication

## Authentication

- Registration
- Email/password login
- Google social login
- Password reset request, six-digit code verification, and password replacement
- HttpOnly stateful SPA session
- CSRF protection and one-time retry after expiration
- Protected account route

## Customer account

- Address listing, creation, editing, deletion, and default selection
- Country selection followed by state and city API requests
- Saved-item/wishlist management
- Paginated order history

## Checkout

- Contact, shipping, and optional billing details
- Saved-address integration for authenticated customers
- Dynamic country/state/city selectors
- Shipping option calculation and readable delivery-method display
- Order summary with debounced quantity controls and removal
- Discount-code application and updated totals
- Payment-method selection
- Idempotent order creation and payment initialization

## Payment completion

- Paystack and Flutterwave callback route
- Backend transaction verification
- Completed, failed, pending, and verification-error states
- Successful receipt/order summary
- Continue-shopping action
- Failed-order bag restoration when supported

## Content and support

- Dynamic published content pages such as About, delivery, returns, privacy, and terms
- FAQ categories, search, and pagination
- Contact form with validation and submission reference
- Newsletter subscription status and confirmation messaging

## Standard behavior

Customer-facing workflows should always provide:

- Responsive mobile and desktop layouts
- Loading/skeleton states
- Empty and unavailable states
- Actionable API error messages without exposing internals
- Disabled and cursor states matching availability
- Keyboard navigation and visible focus
- Currency and totals sourced from API contracts
- No browser-only trust for price, inventory, discount, order, or payment decisions
