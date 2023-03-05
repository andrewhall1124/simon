function login(){
    const loginName = doctument.queerySelector("#name");
    localStorage.setItem("username",loginName.value);
    window.location.href = "play.html"
}