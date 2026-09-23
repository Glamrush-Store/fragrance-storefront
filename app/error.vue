<script setup lang="ts">
interface StorefrontError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const props = defineProps<{ error: StorefrontError }>()
const config = useRuntimeConfig()
const isNotFound = computed(() => props.error.statusCode === 404)
const statusCode = computed(() => props.error.statusCode || 500)

useSeoMeta({
  title: () => isNotFound.value ? 'Page not found — Glamrush' : 'Something went wrong — Glamrush',
  description: () => isNotFound.value
    ? 'The page you were looking for could not be found. Continue shopping at Glamrush.'
    : 'Something interrupted your visit to Glamrush. Return to the storefront and try again.',
  robots: 'noindex, nofollow',
})

const goTo = async (path: string) => {
  await clearError({ redirect: path })
}
</script>

<template>
  <div class="error-page">
    <a href="#error-content" class="skip-link">Skip to content</a>

    <header class="error-header">
      <button type="button" class="wordmark" aria-label="Return to Glamrush home" @click="goTo('/')">
        GLAMRUSH
      </button>
      <p>Fragrance, found by feeling</p>
      <button type="button" class="header-link" @click="goTo(`/category/${config.public.storefrontSlug}`)">
        Shop fragrances
      </button>
    </header>

    <main id="error-content" class="error-main">
      <div class="error-number" aria-hidden="true">
        <span>{{ statusCode.toString().charAt(0) }}</span>
        <span class="mark-wrap">
          <img src="/favicon.png" alt="" width="128" height="128">
        </span>
        <span>{{ statusCode.toString().charAt(2) }}</span>
      </div>

      <div class="error-copy">
        <p class="eyebrow">{{ isNotFound ? 'A note out of place' : 'A momentary interruption' }}</p>
        <h1>{{ isNotFound ? 'This trail has faded.' : 'Something went off note.' }}</h1>
        <p>
          {{ isNotFound
            ? 'The page may have moved, sold out, or never existed. Let’s find you something unforgettable instead.'
            : 'We couldn’t complete that request. Return to the storefront and try again in a moment.' }}
        </p>

        <div class="error-actions">
          <button type="button" class="primary-action" @click="goTo('/')">
            Return home <span aria-hidden="true">↗</span>
          </button>
          <button type="button" class="secondary-action" @click="goTo(`/category/${config.public.storefrontSlug}`)">
            Browse all scents
          </button>
        </div>
      </div>
    </main>

    <footer class="error-footer">
      <span>Glamrush</span>
      <p>Leave an impression. Keep the memory.</p>
      <span>© {{ new Date().getFullYear() }}</span>
    </footer>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  color: var(--ink);
  background:
    radial-gradient(circle at 72% 36%, rgba(124, 24, 58, .1), transparent 28rem),
    var(--paper);
}

.error-header,
.error-footer {
  width: 100%;
  padding-inline: clamp(1.25rem, 4vw, 4.5rem);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.error-header {
  min-height: 5.25rem;
  border-bottom: 1px solid var(--line);
}

.wordmark {
  width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: var(--display);
  font-size: 1.55rem;
  letter-spacing: .1em;
  cursor: pointer;
}

.error-header p,
.header-link,
.error-footer {
  font-size: .625rem;
  font-weight: 600;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.error-header p { margin: 0; opacity: .55; }
.header-link { justify-self: end; padding: .6rem 0; border: 0; border-bottom: 1px solid; background: none; cursor: pointer; }

.error-main {
  position: relative;
  width: min(100%, 100rem);
  margin-inline: auto;
  padding: clamp(3rem, 7vw, 6.5rem) clamp(1.25rem, 6vw, 6.5rem);
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(19rem, .85fr);
  gap: clamp(3rem, 8vw, 9rem);
  align-items: center;
}

.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--display);
  font-size: clamp(9rem, 22vw, 24rem);
  line-height: .7;
  letter-spacing: -.11em;
  color: var(--rust);
  user-select: none;
}

.mark-wrap {
  width: clamp(5.25rem, 11vw, 10.5rem);
  aspect-ratio: 1;
  margin-inline: clamp(.35rem, 1.4vw, 1.4rem);
  display: grid;
  place-items: center;
  border: 1px solid rgba(25, 19, 15, .25);
  border-radius: 50%;
  background: var(--lime);
  transform: rotate(-9deg);
}

.mark-wrap img { width: 62%; height: auto; object-fit: contain; }
.error-copy { max-width: 33rem; }
.error-copy .eyebrow { margin: 0 0 1.5rem; color: var(--rust); }

.error-copy h1 {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(3.3rem, 6vw, 6.8rem);
  font-weight: 400;
  line-height: .9;
  letter-spacing: -.045em;
}

.error-copy > p:not(.eyebrow) {
  max-width: 29rem;
  margin: 2rem 0 0;
  color: rgba(25, 19, 15, .68);
  font-size: clamp(.875rem, 1.2vw, 1rem);
  line-height: 1.75;
}

.error-actions { margin-top: 2.25rem; display: flex; flex-wrap: wrap; gap: .75rem; }
.error-actions button { min-height: 3rem; padding: .85rem 1.15rem; font-size: .625rem; font-weight: 700; letter-spacing: .11em; text-transform: uppercase; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.error-actions button:hover { transform: translateY(-2px); }
.primary-action { display: inline-flex; align-items: center; gap: 2.4rem; border: 1px solid var(--ink); background: var(--ink); color: var(--cream); }
.primary-action span { font-size: 1rem; }
.secondary-action { border: 1px solid var(--ink); background: transparent; color: var(--ink); }
.secondary-action:hover { background: rgba(25, 19, 15, .06); }

.error-footer {
  min-height: 4.5rem;
  border-top: 1px solid var(--line);
}

.error-footer p { margin: 0; text-align: center; opacity: .55; }
.error-footer span:last-child { justify-self: end; }

@media (max-width: 800px) {
  .error-header { grid-template-columns: 1fr auto; }
  .error-header p { display: none; }
  .error-main { grid-template-columns: 1fr; gap: 3.5rem; text-align: center; }
  .error-number { font-size: clamp(8rem, 41vw, 15rem); }
  .mark-wrap { width: clamp(4.5rem, 21vw, 7.5rem); }
  .error-copy { margin-inline: auto; }
  .error-copy > p:not(.eyebrow) { margin-inline: auto; }
  .error-actions { justify-content: center; }
}

@media (max-width: 520px) {
  .error-main { padding-block: 3.75rem; }
  .header-link { font-size: .55rem; }
  .error-footer { grid-template-columns: 1fr auto; }
  .error-footer p { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .error-actions button { transition: none; }
}
</style>
