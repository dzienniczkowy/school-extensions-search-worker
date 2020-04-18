addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const params = {}
  const url = new URL(request.url)
  const queryString = url.search.slice(1).split('&')

  queryString.forEach(item => {
    const kv = item.split('=')
    if (kv[0]) params[kv[0]] = kv[1] || true
  })

  const serversRequest = await fetch('https://raw.githubusercontent.com/wulkanowy/school-extensions-list/master/servers.json')
  const servers = await serversRequest.json()

  const filtered = servers.filter(item => {
    return (
      item.id == params.id ||
      (typeof params.name !== 'undefined' && item.name == decodeURIComponent(params.name.replace(/\+/g, ' ')))
    )
  })

  return new Response(JSON.stringify(filtered), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}
