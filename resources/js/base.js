var baseUrl =  ""
var appPath = "";
var adminPath = "";

var client_id = '';
var client_secret = '';

var accessToken =window.localStorage.getItem("");
var refreshToken =window.localStorage.getItem("");

var isLogined = null;
var headers = { 
    json_headers: { headers: {
        "Content-Type": "application/json", 
        "Authorization": 'Bearer ' + accessToken
    }},
    form_headers: { headers: {       
        "Authorization": 'Bearer ' + accessToken
    }},
    excel_headers: { headers:  {
        "Content-Type": "application/vnd.ms-excel",
        "Authorization": 'Bearer ' + accessToken
    }}
};

document.addEventListener("DOMContentLoaded", () => {
    accessToken =window.localStorage.getItem("");
    refreshToken =window.localStorage.getItem("");
    let meInfo = JSON.parse(window.localStorage.getItem("meInfo"));
    if(!accessToken || !refreshToken) {
    // if(!meInfo) {
        isLogined = false;
        if(window.location.pathname.indexOf("/login/login") < 0) window.location.href='../login/login-IDPW-input.html';
    } 
    else{
        isLogined = true;

        let meInfo = JSON.parse(window.localStorage.getItem("meInfo"));
        $(".header-user .name")?.text(meInfo.name + '(' + meInfo.email + ')');
        // console.log($(".header-user .name")?.text(meInfo.name + '(' + meInfo.email + ')'));

        if(window.location.pathname.indexOf("/login/login") >= 0 ) window.location.href='../dashboard/index.html';
      
    }

    // 기본 앱 주소 변경
    //if($(".fix-url").text().indexOf('https://univ20.com/') === 0) $(".fix-url").text(appPath + '/');
    if($("#fixUrl")?.attr('placeholder')?.indexOf('https://univ20.com/') === 0) $("#fixUrl").attr('placeholder', appPath + '/');
    if($("#fixUrl01")?.attr('placeholder')?.indexOf('https://univ20.com/') === 0) $("#fixUrl01").attr('placeholder', appPath + '/');
    if($("#fixUrl02")?.attr('placeholder')?.indexOf('https://univ20.com/') === 0) $("#fixUrl02").attr('placeholder', appPath + '/');    
    if($("#fixUrl03")?.attr('placeholder')?.indexOf('https://univ20.com/') === 0) $("#fixUrl03").attr('placeholder', appPath + '/');    

    //error
    if(window.location.pathname.indexOf("/error/error") >= 0 ){
        let code = window.location.search.split('=')[1];
        console.log('error code => ' + code);
        if(code === '400')  $(".text")?.text("400 - 잘못된 요청 입니다.");
        else if(code === '403') $(".text")?.text("403 - 액세서가 거부 되었습니다.");
        else if(code === '404') $(".text")?.text("404 - 요청하신 페이지를 찾을 수 없습니다.");
        else if(code === '409') $(".text")?.text("409 - 요청하신 페이지를 찾을 수 없습니다.");
        else if(code === '500') $(".text")?.text("409 - 서버에 예상치 못한 문제가 발생하였습니다.");    
        else $(".text")?.text((code ? (code + " - ") : "") + "알수 없는 문제가 발생했습니다.");
    }
});

function logout(){
   window.localStorage.clear();
   window.sessionStorage.clear();
   window.location.href='../login/login-IDPW-input.html';
}

function changePassword(){
    window.location.href='../login/change-password.html';
}

function checkError(status){
    if(status === 400) window.location.href = '../error/error.html?code=' + status; 
    else if(status === 401) logout();
    else if(status === 403) logout();
    //else if(status === 404) window.location.href = '../error/error.html?code=' + status; 
    //else if(status === 409) window.location.href = '../error/error.html?code=' + status; 
    else if(status === 500) window.location.href = '../error/error.html?code=' + status; 
}
