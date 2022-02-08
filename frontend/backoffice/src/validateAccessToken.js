import axios from 'axios'
import Cookies from 'universal-cookie'

export default async function validateAccessToken() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    const URL = process.env.TOKEN_URL || 'http://localhost:5000/v1/token'
    try {
    const { data } = await axios.post(`${URL}/validate`, { accessToken });
    if (data.code !== 200) {
        const refreshToken = cookies.get("refreshToken");
        const res = await axios.post(`${URL}/refresh`, { refreshToken });
        cookies.remove("accessToken", { path: "/" });
        cookies.set("accessToken", res.data.accessToken, {
        path: "/",
        sameSite: "Lax",
        });
    }
    } catch (err) {
        console.log("Refresh Token Error")
    }
}