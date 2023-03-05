function login(){
    const loginName = doctument.querySelector("#name");
    localStorage.setItem("username",loginName.value);
    window.location.href = "play.html"
}