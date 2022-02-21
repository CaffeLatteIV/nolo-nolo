function logout(){
  const cookies = new UniversalCookie()
  cookies.remove('client',{path:"/"})
  cookies.remove('refreshToken',{path:"/"})
  cookies.remove('accessToken',{path:"/"})
  window.location.href="https://site202156.tw.cs.unibo.it/"
}