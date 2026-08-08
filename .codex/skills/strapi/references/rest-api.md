# Strapi v5 REST API

## Base URL Pattern
```
GET /api/{pluralApiId}          # collection type list
GET /api/{pluralApiId}/:id      # collection type single entry
GET /api/{singularApiId}        # single type
POST /api/{pluralApiId}         # create
PUT /api/{pluralApiId}/:id      # update
DELETE /api/{pluralApiId}/:id   # delete
```

## Response Shape
All responses wrap content in `data`:
```json
// Collection list
{ "data": [ { "id": 1, "title": "...", "slug": "..." } ], "meta": { "pagination": { "page": 1, "pageSize": 25, "pageCount": 4, "total": 100 } } }

// Single entry / single type
{ "data": { "id": 1, "title": "...", "slug": "..." } }
```

Note: In Strapi v5, attributes are flat on `data` (no nested `attributes` object like v4).

## Filtering
Use `filters` query param with operator brackets:
```
/api/products?filters[price][$lte]=100
/api/products?filters[category][slug][$eq]=dresses
/api/products?filters[$or][0][slug][$eq]=foo&filters[$or][1][slug][$eq]=bar
```

### Common Operators
| Operator | Meaning |
|---|---|
| `$eq` | equals |
| `$ne` | not equal |
| `$lt` / `$lte` | less than / less than or equal |
| `$gt` / `$gte` | greater than / greater than or equal |
| `$in` | in array |
| `$contains` | string contains (case-sensitive) |
| `$containsi` | string contains (case-insensitive) |
| `$null` | is null |
| `$notNull` | is not null |
| `$between` | between two values |

## Sorting
```
/api/products?sort=price:asc
/api/products?sort[0]=price:asc&sort[1]=title:desc
```

## Pagination
```
/api/products?pagination[page]=1&pagination[pageSize]=12
/api/products?pagination[start]=0&pagination[limit]=12   # offset-based
```

## Field Selection
```
/api/products?fields[0]=title&fields[1]=slug&fields[2]=price
```

## Locale (i18n)
```
/api/products?locale=fr
```
