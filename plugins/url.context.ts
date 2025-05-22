// ~/plugins/url.context.ts
export default defineNuxtPlugin(() => {
  const route = useRoute()
  
  const getContext = () => ({
    domain: route.path.split('/')[1] || null,
    user: route.path.split('/')[2] || null,
    page: route.path.split('/')[3] || null
  })

  return {
    provide: {
      urlContext: getContext()
    }
  }
})