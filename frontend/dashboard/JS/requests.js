const OPERATION_URL = 'http://localhost:5000/v1/operations'
const TOKEN_URL = 'http://localhost:5000/v1/token'

async function bestSellers() {
  await validateAccessToken()
  const cookie = new UniversalCookie()
  const accessToken = cookie.get('accessToken')
  return $.ajax({
    url: `${OPERATION_URL}/bestSellers`,
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
async function validateAccessToken() {
  const cookies = new UniversalCookie()
  // cookies.set('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpbm8iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY0MzAzNzM3MH0.rNHJHkrld49itgnDCbcirqkU060xaIZ6hVJT6SWv9QU', { path: '/' })
  const accessToken = cookies.get('accessToken')
  $.ajax({
    url: `${TOKEN_URL}/validate`,
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ accessToken }),
    error: () => {
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



  })
}
export { getMonthlyRevenue, getStatus, getConditions, avgRentMonth, avgRentLength,bestSellers }