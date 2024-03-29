/* eslint-disable consistent-return */
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const URL = process.env.TOKEN_URL || 'https://site202156.tw.cs.unibo.it/v1/token'
const cookie = new Cookies()
async function validateAccessToken() {
  const accessToken = cookie.get('accessToken')
  try {
    const { data } = await axios.post(`${URL}/validate`, { accessToken })
    if (data.code !== 200) {
      const refreshToken = cookie.get('refreshToken')
      const res = await axios.post(`${URL}/refresh`, { refreshToken })
      cookie.remove('accessToken', { path: '/' })
      cookie.set('accessToken', res.data.accessToken, { path: '/', sameSite: 'Lax' })
    }
  } catch (err) {
    const navigate = useNavigate()
    navigate('*')
  }
}
export default validateAccessToken
