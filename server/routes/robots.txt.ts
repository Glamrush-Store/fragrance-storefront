export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /account/',
    'Disallow: /auth/',
    'Disallow: /checkout/',
    'Disallow: /payment/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
