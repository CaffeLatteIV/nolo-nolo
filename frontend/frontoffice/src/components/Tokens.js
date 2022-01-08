/* eslint-disable consistent-return */
import Cookies from 'universal-cookie'
import axios from 'axios'

const URL = process.env.TOKEN_URL || 'http://localhost:5000/v1/token'
const cookie = new Cookies()
async function validateAccessToken() {
  const accessToken = cookie.get('accessToken')
  try {
    await axios.post(`${URL}/validate`, { accessToken })
    return true
  } catch (err) {
    const refreshToken = cookie.get('refreshToken')
    const { data } = await axios.post(`${URL}/refresh`, { refreshToken })
    cookie.set('accessToken', data.accessToken)
  }
}
export default validateAccessToken
