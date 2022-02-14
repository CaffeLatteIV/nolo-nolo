const OPERATION_URL = 'https://site202156.tw.cs.unibo.it/v1/operations'
const INVENTORY_URL = 'https://site202156.tw.cs.unibo.it/v1/inventories'
const TOKEN_URL = 'https://site202156.tw.cs.unibo.it/v1/token'

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
  console.log(accessToken)
  const res = await $.ajax({
    url: `${OPERATION_URL}/rentals/revenue/month/${title}`,
    type: 'GET',
    dataType: "json",
    headers: { "Authorization": "Bearer " + accessToken },
  })
  console.log('res', res)
  return res
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
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  $.ajax({
    url: `${TOKEN_URL}/validate`,
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ accessToken: accessToken || '' }),
    success: (data) => {
      if (data.code && data.code !== 200) {
        // aggiorno il refresh token
        const refreshToken = cookie.get('refreshToken')
        if (refreshToken) {
          $.ajax({
            url: `${TOKEN_URL}/refresh`,
            type: 'POST',
            data: JSON.stringify({ refreshToken }),
            dataType:'json',
            contentType: "application/json; charset=utf-8",
            success: (response) => {
              cookie.remove('accessToken')
              cookie.set('accessToken', response.accessToken, { path: '/', sameSite: 'Lax' })
            }
          })
        }
      }

    }
  })
}
const cookie = new UniversalCookie()
const client = cookie.get('client')
const role = client?.role
if(!role || role !== 'manager'){
window.location.href = "http://localhost:3000/";

}
export { getMonthlyRevenue, getStatus, getProduct, groupClientAge, countClientGender, getConditions, avgRentMonth, avgRentLength, bestSellers }