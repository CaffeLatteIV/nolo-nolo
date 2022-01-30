const OPERATION_URL = 'http://localhost:5000/v1/operations'
const INVENTORY_URL = 'http://localhost:5000/v1/inventories'
const TOKEN_URL = 'http://localhost:5000/v1/token'

async function bestSellers() {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/bestSellers?n=3`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function getMonthlyRevenue(title = '') {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/rentals/revenue/month/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function getStatus(title = '') {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/rentals/count/status/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function getConditions(title = '') {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/rentals/count/conditions/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function groupClientAge() {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/clients/count/age/`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function countClientGender() {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/clients/count/gender/`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function avgRentMonth(title = '') {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/rentals/month/avg/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function avgRentLength(title = '') {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/rentals/single/avg/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
}
async function getProduct(id) {
  return $.ajax({
    url: `${INVENTORY_URL}/products/${id}`,
    type: 'GET',
    dataType: "json",
  })
}
async function validateAccessToken() {
  const cookies = new UniversalCookie()
  // cookies.set('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpbm8iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY0MzAzNzM3MH0.rNHJHkrld49itgnDCbcirqkU060xaIZ6hVJT6SWv9QU', { path: '/' })
  const accessToken = cookies.get('accessToken')
  $.ajax({
    url: `${TOKEN_URL}/validate`,
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ accessToken }),
    success: (data) => {
      if (data.code === 401) {
        console.log('Asking for new access token')
        // aggiorno il refresh token
        const refreshToken = cookies.get('refreshToken')
        if (refreshToken) {
          $.ajax({
            url: `${TOKEN_URL}/refresh`,
            type: 'POST',
            data: JSON.stringify({ refreshToken }),
            contentType: "application/json; charset=utf-8",
            success: (response) => {
              cookies.remove('accessToken')
              cookies.set('accessToken', response.accessToken, { path: '/' })
            }
          })
        }
      }

    }
  })
}
export { getMonthlyRevenue, getStatus, getProduct, groupClientAge, countClientGender, getConditions, avgRentMonth, avgRentLength, bestSellers }