  ///////////////////// 매거진 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/login/login-Temp-auth.html") >= 0) clearStorage();      
  });
  
  /// 로그인 로그아웃 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function login(loginId = null, loginPwd = null, appType, refreshToken = null) {
    let _emailId = document.getElementById("emailId").value;
    let _password = document.getElementById("password").value;
    let url = baseUrl + "/oauth/token";
    let grant_type = 'password';
    let login_username = _emailId;
    let login_password = _password;
    let client_id = '';
    let client_secret = '';
  
    let params = {
        grant_type: grant_type,
        username: login_username,
        password: login_password,
        refresh_token: refreshToken,
        client_id: client_id,
        client_secret: client_secret
    }
    const loginRequest = new Request(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",  
      },
      body: JSON.stringify(params),
    });
  
    async function post(request) {
      try {
        await fetch(request)
       .then(response => {
        response.json().then((auth) => {
          
          let resultMessage = auth.message;
          if (resultMessage === 'authorization_required' ){
          document.getElementById("loginAlertMessage").innerHTML = "<strong>비밀번호가 일치하지 않습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
          return;
          } else if (resultMessage === 'resource_not_found' ){
          document.getElementById("loginAlertMessage").innerHTML = "<strong>아이디가 일치하지 않습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
          return;
          } else {
          let authToken = auth;

          window.localStorage.clear();
          window.localStorage.setItem("adminAccessToken", authToken.access_token);
          window.localStorage.setItem("adminRefreshToken", authToken.refresh_token);
          window.localStorage.setItem("adminLoginId", login_username);
                      
          getMeInfo(authToken.access_token);   
          }         
        })    
       })     
      }catch (error) {
        console.error("Error:", error);
      }      
    }
    post(loginRequest);
  }

  function getMeInfo(access_token) {
    let url = baseUrl + "/users/me";
    let header = { headers: {
      "Content-Type": "application/json", 
      "Authorization": 'Bearer ' + access_token}};    
    fetch(url,header)   
    .then((response) => {
        response.json().then((meInfo) => {
          let _grade = meInfo.data.user.grade;
          let _lastDate = meInfo.data.user.lastDate;
          let _createDate = new Date(meInfo.data.user.createDate).getTime();
          let loginPwdDate = meInfo.data.user.loginPwdDate;
          let _loginPwdDate = new Date(meInfo.data.user.loginPwdDate).getTime();
          let _reservedDate =_loginPwdDate + 180*60*60*24*1000;
          let today = new Date()         
          let reservedDate = new Date(_reservedDate);
         

          if ( _grade < 50){
            document.getElementById("loginAlertMessage").innerHTML = "<strong>관리자계정이 아닙니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            return;
          } else if ( reservedDate < today){
            window.localStorage.setItem("meInfo",JSON.stringify(meInfo.data.user));
            document.getElementById("loginAlertMessage").innerHTML = "<strong>패스워드를 변경한지 6개월이 지났습니다..</strong>";
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {            
              location.href = './change-password.html';
            });
            return;
          } else if ( _createDate === _loginPwdDate){    
            window.localStorage.setItem("meInfo",JSON.stringify(meInfo.data.user));  
            // location.href='../dashboard/index.html';
            location.href = './change-password.html';
            // window.localStorage.clear();
            // window.sessionStorage.clear();
            // location.href = './login-OTP-auth.html';
            return;
          } 
          else {
            window.localStorage.setItem("meInfo",JSON.stringify(meInfo.data.user));
            location.href='../dashboard/index.html';
            return;
          }       
        });
    });
  }

  function verify(type){
    let loginId = document.getElementById("emailId").value;
    let loginPassword = document.getElementById("password").value;
    let loginAlertMessage = "" ;

    if (loginId === ""){
      loginAlertMessage = "아이디를 입력해 주세요.";
      document.getElementById("loginAlertMessage").innerHTML = "<strong>"+loginAlertMessage+"</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    }
    if (loginPassword === ""){
      loginAlertMessage = "패스워드를 입력해 주세요.";
      document.getElementById("loginAlertMessage").innerHTML = "<strong>"+loginAlertMessage+"</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    }

    login(loginId, loginPassword);    
  }

  function changePassword(){
    let me = JSON.parse(window.localStorage.getItem("meInfo"));
    let password1 = document.getElementById("password01").value;
    let password2 = document.getElementById("password02").value;
    let password3 = document.getElementById("password03").value;
    let passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/
    let checkCharacter = /([A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?])\1{2,}/g;
   
    let _loginId = me.loginId;
    let _mobile = me.mobile?me.mobile:"";

    if (password1 === ""){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>기존 비밀번호를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    } else if (password2 === ""){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>변경 비밀번호를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    } else if (checkCharacter.test(password2)){
      document.getElementById("loginAlertMessage").innerHTML = "<strong>같은 문자가 3회 이상 반복될 수 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return    
    } else if (password2 === password1){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>직전의 비밀번호는 사용할 수 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    }else if (!passwordRegex.test(password2)) {
      document.getElementById("loginAlertMessage").innerHTML = "<strong>비밀번호는 8자이상으로 영문, 숫자, 특수문자를 조합하여 사용해주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return  ;
    } else if (password3 === ""){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>변경 비밀번호 확인를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return;
    } else if (password2 !== password3){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>변경 비밀번호와 변경 비밀번호 확인이 일치하지 않습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return;
    } else if ((password2.indexOf(_loginId) != -1) || (_mobile !== "" && password2.indexOf(_mobile) != -1)){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>이메일(아이디),휴대폰번호 정보와 유사한 비밀번호는 사용할 수 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return;
    } 

   
    console.log('me' + me.birth);
    let url = baseUrl + "/user/change-password" ;

    let params = {
      userId:  me.id,
      currentPassword: password1,
      newPassword: password2      
    }
    async function post(request) {
    try {
      await fetch(request).then(response => {
          console.log(response);
          if(response.status === 200) {  // No content    
              document.getElementById("loginAlertMessage").innerHTML = "<strong>비밀번호가 성공적으로 변경되었습니다. 다시 한번 로그인해주세요.</strong>";
              location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                window.localStorage.clear();
                location.href = './login-IDPW-input.html';
              });
              return
          }else if(response.status === 409) {  // No content       
            let errorData = response.json()
            console.log('error data'+ errorData)
            document.getElementById("loginAlertMessage").innerHTML = "<strong>기존의 비밀번호와 동일하지 않습니다. 다시 확인해 주세요.</strong>";
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            return
          }
      }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const request1 = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers, 
      body: JSON.stringify(params)
    });

    post(request1);
  }
 
  function issueTempPassword(){  
    let _userId = document.getElementById("userId").value;
    let _userName = document.getElementById("userName").value;
    let client_id = '';
    let client_secret = '';

    if (_userId === ""){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>아이디를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    } else if (_userName === ""){      
      document.getElementById("loginAlertMessage").innerHTML = "<strong>이름을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      return
    }
    let url = baseUrl + "/user/find-manager-password" ;

    let params = {
      loginId:  _userId,
      name: _userName,
      client_id: client_id,
      client_secret: client_secret,
    }

    async function post(request) {
    try {
      await fetch(request)
      .then(response => {
        return response.json();
      }).then(data=>{
          let auth = data;
          let _email = auth.data?.email? auth.data.email :"";

          if(auth.message === 'resource_not_found'){
            document.getElementById("loginAlertMessage").innerHTML = "<strong>아이디가 일치하지 않습니다.</strong>"
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            return
          }else if(auth.message === 'invalid_name'){
            document.getElementById("loginAlertMessage").innerHTML = "<strong>이름이 일치하지 않습니다.</strong>"
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            return
          } else {
            document.getElementById("loginAlertMessage").innerHTML = "<strong>임시비밀번호를 "+_email +"로 발송했습니다. 일반 메일함에서 확인이 안된다면, 스팸(정크)메일함에서 확인해 주세요.</strong>";
            location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href = './login-IDPW-input.html';
            });
            return
          }
      }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const request1 = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers, 
      body: JSON.stringify(params)
    });

    post(request1);
  }

  function checkOTP(){
    let otp = document.getElementById("otpNumber").value;
    if (otp === ""){
      document.getElementById("loginAlertMessage").innerHTML = "<strong>인증번호 6자리를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
      let okElement = document.getElementById("alert-OK");
      okElement.addEventListener("click", function (e) {
        location.href = './login-IDPW-input.html';
      });
    }
  }

  function showAlertMessage(){
    let meInfo = JSON.parse(window.localStorage.getItem("meInfo"));
    let today = new Date();   
    let _loginPwdDate = new Date(meInfo.loginPwdDate).getTime();
    let _reservedDate =_loginPwdDate + 180*60*60*24*1000;
    let reservedDate = new Date(_reservedDate);

    console.log('reservedDate'+ reservedDate);
    console.log('today'+ today);

    if ( reservedDate < today){ 
      document.getElementById('change-password-alert-message').innerHTML = '비밀번호를 180일간 변경하지 않았습니다.<br />개인정보보호를 위해 비밀번호를 변경해주세요.' ;
    } else {
      document.getElementById('change-password-alert-message').innerHTML = '개인정보보호를 위해 비밀번호를 변경해주세요.';
    }      
  }

  function searchStart(e){
    if(e.keyCode === 13){
      verify(1)
    }
  }

  function clearStorage(){
    window.localStorage.clear();
    window.sessionStorage.clear();
  }