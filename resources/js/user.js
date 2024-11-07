document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/member/manager-list") >= 0) getManagerList(0, 20);  
  else if(window.location.pathname.indexOf("/member/manager-detail") >= 0) getManager();  
  // else if(window.location.pathname.indexOf("/member/manager-register") >= 0) ;  
  else if(window.location.pathname.indexOf("/member/manager-modify") >= 0) getNewUserId();  
  else if(window.location.pathname.indexOf("/member/member-list") >= 0) getMemberList(0, 20);   
  else if(window.location.pathname.indexOf("/member/member-detail") >= 0) getMember();  
});

  ///// 관리자 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getManagerList(currentPage, size){
    document.getElementById('manager-list_grid').innerHTML = "";
    window.sessionStorage.setItem("checkDup",false);

    let _keyword = document.getElementById('manager-search').value;
    console.log('_keyword' + _keyword);
    let managerGrade = document.getElementById('manager-grade');
    let _filterGrade =  (managerGrade.options[managerGrade.selectedIndex]).value === 'all' ? null : (managerGrade.options[managerGrade.selectedIndex]).value ;    
    
    let url = baseUrl + "/users/all?type=2";
    if ( _filterGrade !== null){   
      url +='&grade='+ _filterGrade;
    } else {
        url +='&grade=50,100';
    }

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += 'offset='+ currentPage *size +"&limit=" + size;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((managers) => {
        let managerGrid= "";
        let managerData = managers.data.users;
        let managerDataTotal = managers.data.total;
        let numOfPage = Math.ceil(managerDataTotal/size);
        let iteration = managerData.length > size ? size :  managerData.length;
        for( let i=0;  i < managerData.length ; i++){
          let values = managerData[i]
          managerGrid+=`<tr>
                          <td>${values.id}</td>
                          <td><a href="./manager-detail.html?id=${values.id}" class="underline">${values.loginId}</a></td>
                          <td>${replacestr(values.name)}</td>
                          <td>${values.grade}</td>                   
                          <td>${values.nickname}</td>               
                          <td>${dateToStr(strToDate(values.createDate))}</td>
                        <tr>`;
        }

        let startOfPage = Math.floor(currentPage/10)* 10;
        let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        if ( numOfPage < endOfPage){
            endOfPage = numOfPage;
        }           
        paging =`<ul class="pagination">`;
            if (currentPage <= 0){ 
            paging += `<li class="controller first disabled">`;
            } else {
            paging += `<li class="controller first">
                        <a href="#" class="page-link" onclick="getManagerList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
            paging += `<li class="controller prev disabled">`;
            } else {
            paging += `<li class="controller prev">
                        <a href="#" class="page-link" onclick="getManagerList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                paging +=`<li class="paging current">` 
                } else {
                paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getManagerList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ( (currentPage+1) === numOfPage || (numOfPage === 0)){ 
            paging += `<li class="controller next disabled">`;
            } else {
            paging += `<li class="controller next">
                        <a href="#" class="page-link" onclick="getManagerList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
            paging += `<li class="controller last disabled">`;
            } else {
            paging += `<li class="controller last">
                        <a href="#" class="page-link" onclick="getManagerList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                  
        console.log('managerGrid' + managerGrid)
        document.getElementById('manager-list_grid').innerHTML  = managerGrid === "" ? "<tr><td colspan='6'>데이터가 없습니다.</td></tr>": managerGrid;
        document.getElementById('manager-list-pagination').innerHTML = paging;
        document.getElementById('manager-list-total').innerHTML = '&nbsp;<strong>' +managerDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }

  function getManager(){
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    ///0:연애, 1:진로, 2:일상, 3:우리학교
    // let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substring(0 , u.indexOf("?"));        
        query = u.substring(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }

    let url = baseUrl + "/users/" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((manager) => {
          let _managerData = manager.data.user;
          let _birth = _managerData.birth ? _managerData.birth.substring(0,4) + '년 ' + _managerData.birth.substring(4,6) +  '월 ' + _managerData.birth.substring(6,8)+  '일 ' : "";
          let _mobile = _managerData.mobile ?  _managerData.mobile.substring(0,3) + '-' + _managerData.mobile.substring(3,7) +  '-' + _managerData.mobile.substring(7,11) : "";
          let today = new Date();
          console.log('today' +today );
          console.log('_managerData.state' + _state[_managerData.state] );

          ///제목 및 한 줄 소개
          document.getElementById('manager-id').innerHTML = _managerData.loginId;
          document.getElementById('manager-name').innerHTML = _managerData.name;
          document.getElementById('manager-birth').innerHTML = _birth;
          document.getElementById('manager-grade').innerHTML = _managerData.grade;
          document.getElementById('manager-nickname').innerHTML = _managerData.nickname;
          document.getElementById('manager-email').innerHTML = _managerData.email;
          document.getElementById('manager-byline').innerHTML = _managerData.byLine === 0 ? '노출안함' :'노출';
          document.getElementById('manager-mobile').innerHTML = _mobile;
          document.getElementById('manager-create-date').innerHTML = dateToStr(strToDate(_managerData.createDate));
          document.getElementById('manager-email').innerHTML = _managerData.email;        
          document.getElementById('manger-profile-image').src = _managerData.profilePath?_managerData.profilePath:"";        
          document.getElementById('manger-preview-profile-image').src = _managerData.profilePath?_managerData.profilePath:"";       
          
          window.sessionStorage.setItem("managerId",_managerData.id)     
        // }
       
      })                    
    }).catch(error => console.log(error));
  }

  function registerManager(){
    let _userId = parseInt(window.sessionStorage.getItem("userId"));
    let _grade = parseInt($('input[name=manager-type]:checked').val());
    let _loginId = document.getElementById('manager-login-id').value;
    let _name = document.getElementById('manager-name').value;

    let _nickname = document.getElementById('manager-nickname').value? document.getElementById('manager-nickname').value :"";
    let _email = document.getElementById('manager-email').value;
    let _instagram = document.getElementById('manager-instagram').value;
    let _youtube = document.getElementById('manager-youtube').value;
    let _byline =  $('input[name=manager-byline]:checked').val();
    let _mobile = document.getElementById('manager-mobile').value;
    if(_mobile) _mobile = _mobile.replaceAll('-','');

    console.log('_grade' + _grade);
    console.log('_loginId' + _loginId);
    console.log('_name' + _name);
   //  console.log('_image' + _image);
    console.log('_nickname' + _nickname);
    console.log('_instagram' + _instagram);
    console.log('_youtube' + _youtube);
    console.log('_byline' + _byline);
    console.log('_mobile' + _mobile);
    console.log('_email' + _email);

    let url = baseUrl + '/user/register';
    let params = {    
     loginId: _loginId,    
     loginPwd: "univ20manager!@",
     grade: _grade,
     name: _name,
     nickname: _nickname,
     email: _email,
     instagramUrl: _instagram,
     email: _email,
     youtubeUrl: _youtube,
     mobile: _mobile,
     client_id: client_id,
     client_secret: client_secret,
   }
   async function post(request) {
    try {
      await fetch(request).then(response => {   
        checkError(response.status);      
        response.json().then((user) => {      
          console.log('user' + JSON.stringify(user))     
          //if(user.data?.profilePatgh){
            // changeManagerProfile();
          // } else {
            console.log('user', user.data.user.id);
            document.getElementById("manager-alert-message").innerHTML = "<strong>관리자에 등록되었어요. 해당 관리자에게 계정과 함께 임시 비밀번호가 메일로 발송되었어요.</strong>";
            location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              console.log( user.data.user.id);
              changeManagerProfile( user.data.user.id);
              issueTempPassword(user.data.user.loginId, user.data.user.name);
              // location.href='./manager-list.html'   
            });
        //  }
        });
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
   console.log('registerManager');
  }

  function modifyManager(){
         let _userId = parseInt(window.sessionStorage.getItem("managerId"));
         let _grade = parseInt($('input[name=manager-type]:checked').val());
        //  let _loginId = document.getElementById('manager-login-id').value;
        //  let _name = document.getElementById('manager-name').value;
   
         let _nickname = document.getElementById('manager-nickname').value? document.getElementById('manager-nickname').value :"";
         let _email = document.getElementById('manager-email').value;
         let _instagram = document.getElementById('manager-instagram').value;
         let _youtube = document.getElementById('manager-youtube').value;
         let _byline =  $('input[name=manager-byline]:checked').val();
         let _mobile = document.getElementById('manager-mobile').value;
         console.log('_grade' + _grade);
        //  console.log('_loginId' + _loginId);
        //  console.log('_name' + _name);
        //  console.log('_image' + _image);
         console.log('_nickname' + _nickname);
         console.log('_instagram' + _instagram);
         console.log('_youtube' + _youtube);
         console.log('_byline' + _byline);
         console.log('_mobile' + _mobile);
         console.log('_email' + _email);
         let url = baseUrl + '/user/';
         let params = {
          id: _userId,
          grade: _grade,
          // name: _name,
          nickname: _nickname,
          email: _email,
          instagramUrl: _instagram,
          email: _email,
          youtubeUrl: _youtube,
          mobile: _mobile
        }
        async function post(request) {
        try {
          await fetch(request).then(response => {  
            checkError(response.status);       
            response.json().then((user) => {      
              console.log('isModifiedFiles' + isModifiedFiles)          
              if(isModifiedFiles){                
                changeManagerProfile(2);
              } else {
                document.getElementById("manager-confirm-message").innerHTML = "<strong>관리자 정보가 등록되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
                let okElement = document.getElementById("confirm-OK");
                okElement.addEventListener("click", function (e) {
                  location.href='./manager-list.html'   
                });
              }
            });
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
        console.log('modifyManager');
  }

  function changeManagerProfile(id = null){
    let _userId = window.sessionStorage.getItem("managerId");
    let url = baseUrl + '/user/upload-profile-image';
    let formData = new FormData();
   
    // formData.append('file', _image);

    console.log('isModifiedFiles' + isModifiedFiles);
    console.log('mainFile' + mainFile);
    if ( id === null ){
      formData.append('userId', _userId);
      formData.append("file", mainFile, mainFile.name);
    } else if(isModifiedFiles && mainFile){
      formData.append('userId', id);
      formData.append("file", mainFile, mainFile.name);
    
    }

   async function post(request) {
    try {
      await fetch(request).then(response => {     
        checkError(response.status);    
        response.json().then((user) => {

          if(window.location.pathname.indexOf("/member/manager-register")>=0){
            location.href='./manager-list.html'
          }
          else{
            document.getElementById("manager-alert-message").innerHTML = "<strong>관리자 정보가 수정되었습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./manager-list.html'   
            });
          }
        });
      })  
    } catch (error) {
      console.error("Error:", error);
    }
  }

   const request1 = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,     
      body: formData
   });

    post(request1);
    console.log('사진등록');
}

  function getNewUserId(){
    let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let id = JSON.parse(window.sessionStorage.getItem("managerId"));

    let url = baseUrl + "/users/"+ id ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((user) => {
        let userData = user.data.user;
        console.log('userData ===>' + JSON.stringify(userData))
        // window.sessionStorage.setItem("userId",userData.id);
        window.sessionStorage.setItem("userNickname",userData.nickname);
        document.getElementById("manager-login-id").innerHTML = userData.loginId;
        document.getElementById("manager-name").innerHTML = userData.name;
        document.getElementById("manager-nickname").value = userData.nickname?userData.nickname:"";
      
        document.getElementById("manager-email").value = userData.email?userData.email:"";
        document.getElementById("manager-mobile").value = userData.mobile?userData.mobile:"";
        document.getElementById("manager-instagram").value = userData.instagramUrl?userData.instagramUrl:"";
        document.getElementById("manager-youtube").value = userData.youtubeUrl? userData.youtubeUrl:"";
        // document.getElementById("manager-youtube").value = userData.youtubeUrl;
        // byLine : 바이라인 노출(0:안함 1:개인메일 2:인스타url 3:유튜브url)
        (userData.grade === 100) ?  $(":radio[name='manager-type'][value=100]").prop('checked', true) : $(":radio[name='manager-type'][value=50]").prop('checked', true) ;               
        userData.byLine === 1  ? $(":radio[name='manager-byline'][value='email']").prop('checked', true) :  
        userData.byLine === 2  ? $(":radio[name='manager-byline'][value='instagram']").prop('checked', true) : 
        userData.byLine === 3  ? $(":radio[name='manager-byline'][value='youbube']").prop('checked', true) : 
        $(":radio[name='manager-byline'][value='none']").prop('checked', true); 

        console.log('profilePath'+userData.profilePath);
        if (userData.profilePath !== null) sendFileToDropzone(dropzone01, userData.profilePath);
      })
    }).catch(error => console.log(error));

    const sendFileToDropzone = async (dropzone, url) => {
      if(!url) return;
      const response = await fetch(url);
      const data = await response.blob();
      const ext = url.split(".").pop(); 
      const metadata = {type: `image/${ext}`};
      const filename = url.split("/").pop();
      var file = new File([data], filename, metadata);

      dropzone.emit("addedfile", file, true);   
      dropzone.emit("thumbnail", file, url);
      dropzone.emit("accept", file);
      dropzone.emit("complete", file);
    };
  }
  
  function getUserId(){
    let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let _managerId = document.getElementById("manager-login-id").value;
    // let url = baseUrl + "/users/all?loginId="+ _managerId ;

    console.log('_me' + _me)
    console.log('_me' + _me.birth?_me.birth:"")
    console.log('_me' + client_id)
    console.log('_me' + client_secret)

    if (_managerId === ""){
      document.getElementById("manager-alert-message").innerHTML = "<strong>아이디를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
      return;
    }

    let url = baseUrl + "/users/all?loginId="+ _managerId ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((user) => {

        let userData = user.data.users[0];
        let userDataTotal = user.data.total;
      
        if( userDataTotal === 0){
          console.log('신규');
          document.getElementById("manager-alert-message").innerHTML = "<strong>사용할 수 있는 아이디입니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
          window.sessionStorage.setItem("checkDup", true);
          // document.getElementById("manager-name").value = "";
          // document.getElementById("manager-nickname").value = "";
        
          // document.getElementById("manager-email").value = "";
          // document.getElementById("manager-mobile").value = "";
          // document.getElementById("manager-instagram").value = "";
          // document.getElementById("manager-youtube").value = "";
          // deleteToDropzone(dropzone01);



        // } else {
        //   window.sessionStorage.setItem("userId",userData.id);
        //   window.sessionStorage.setItem("userNickname",userData.nickname);
        //   document.getElementById("manager-name").value = userData.name;
        //   document.getElementById("manager-nickname").value = userData.nickname;
        
        //   document.getElementById("manager-email").value = userData.email;
        //   document.getElementById("manager-mobile").value = userData.mobile;
        //   document.getElementById("manager-instagram").value = userData.instagramUrl;
        //   document.getElementById("manager-youtube").value = userData.youtubeUrl;
        //   // document.getElementById("manager-youtube").value = userData.youtubeUrl;÷
        //   // byLine : 바이라인 노출(0:안함 1:개인메일 2:인스타url 3:유튜브url)
        //   (userData.grade === 100) ?  $(":radio[name='manager-type'][value=100]").prop('checked', true) : $(":radio[name='manager-type'][value=50]").prop('checked', true) ;               
        //   userData.byeLine === 1  ? $(":radio[name='manager-byline'][value='email']").prop('checked', true) :  
        //   userData.byeLine === 2  ? $(":radio[name='manager-byline'][value='instagram']").prop('checked', true) : 
        //   userData.byeLine === 3  ? $(":radio[name='manager-byline'][value='youbube']").prop('checked', true) : 
        //   $(":radio[name='manager-byline'][value='none']").prop('checked', true); 

        //   console.log('profilePath'+userData.profilePath);
        //   if (userData.profilePath !== null) sendFileToDropzone(dropzone01, userData.profilePath);
        } else {
          document.getElementById("manager-alert-message").innerHTML = "<strong>이미 사용되고 있는 아이디입니다. 다른 아이디를 입력해 주세요.</strong>";
          location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        }
      })
    }).catch(error => console.log(error));
  
  }

  function getUserNickname(){
    let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let _managerNickname = document.getElementById("manager-nickname").value;
    let _originNickname = window.sessionStorage.getItem("userNickname");
    let url = baseUrl + "/user/exists";

    if (_managerNickname === ""){
      document.getElementById("manager-alert-message").innerHTML = "<strong>닉네임를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
      return;
    } else if (_managerNickname === _originNickname){
      document.getElementById("manager-alert-message").innerHTML = "<strong>기존의 닉네임과 같습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
      return;
    }
    console.log('_managerNickname' + _managerNickname)  
    let params = {
      nickname:  _managerNickname,
      client_id: client_id,
      client_secret: client_secret      
    }
    async function post(request) {
    try {
      await fetch(request).then(response => {     
        checkError(response.status);    
        response.json().then((user) => {
          let _exist = user.data.exists;
          // let _exist = user.data;
          if (!_exist){
            document.getElementById("manager-confirm-message").innerHTML = "<strong>사용가능한 닉네임입니다. 사용하시겠습니까?</strong>";
            location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
        
            let cancelElement = document.getElementById("confirm-CANCEL");
            cancelElement.addEventListener("click", function (e) {
                document.getElementById("manager-nickname").value = _originNickname;
            });
          }           
        });
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

  function checkInput(type){
    let _managerId = type === 1 ? document.getElementById("manager-login-id").value : document.getElementById("manager-login-id").innerHTML;
    let _managerName = document.getElementById("manager-name").value;
    let _managerEmail = document.getElementById("manager-email").value;
    let _check = window.sessionStorage.getItem("checkDup");
   
    let email_regex = '^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$';
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    // console.log('_check' + email_regex.test(_managerId));
    console.log('_managerId'+ _managerId);

    if ( type === 1){
     
       if (_managerId === "" || _check === 'false'){
        document.getElementById("manager-alert-message").innerHTML = "<strong>아이디를 입력후 중복확인 해주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;    
      } else if (!regex.test(_managerId)){
        document.getElementById("manager-alert-message").innerHTML = "<strong>아이디가 올바르지 않습니다. 이메일 형식이어야 합니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;
      } else if (_managerName === ""){
        document.getElementById("manager-alert-message").innerHTML = "<strong>이름을 입력해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;
      } else if ($('input[name="manager-type"]').is(":checked") === false){
        document.getElementById("manager-alert-message").innerHTML = "<strong>권한을 선택해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;  
      } else if ( _managerEmail === ""){
        document.getElementById("manager-alert-message").innerHTML = "<strong>이메일을 입력해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;  
      } else if (!regex.test(_managerEmail)){
        document.getElementById("manager-alert-message").innerHTML = "<strong>이메일을 입력해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
        return;  
      }
      registerManager();
    } else {
      modifyManager();
    }
  }

  function cancelManager(){
    document.getElementById("manager-confirm-message").innerHTML = "<strong>등록을 취소하시겠습니까?</strong>";
    location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href='./manager-list.html'   
    });
    return;
  }

  function deleteManager(){
    document.getElementById("manager-confirm-message").innerHTML = "<strong>관리자를 삭제하시겠어요??</strong>";
    location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      // unregister(1);
    });
    return;
  }

  function changeMangerState(){
    let url = baseUrl + '/user/';
    let params = {
     id: _userId,
     state: 1
   }
   async function post(request) {
   try {
      await fetch(request).then(response => {   
        checkError(response.status);      
        response.json().then((user) => {                
        if(isModifiedFiles){
          changeManagerProfile();
        } else {
          document.getElementById("manager-confirm-message").innerHTML = "<strong>관리자 정보가 수정되었습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
          let okElement = document.getElementById("confirm-OK");
          okElement.addEventListener("click", function (e) {
            location.href='./manager-list.html'   
          });
        }
        });
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
   console.log('modifyManager');
  }

  function changeMemberProfile(){

    let profile = document.getElementById('user-profile-image').src;
    let _userId = window.sessionStorage.getItem("memberId");
    let _meInfo = window.localStorage.getItem("meInfo");
    let url = baseUrl + '/user/upload-profile-image';
 
    console.log('profile' + profile)
    let formData = new FormData();
    formData.append('loginId', _userId);   
    formData.append('profilePath', null);   

    async function post(request) {
    try {
        await fetch(request).then(response => {  
          checkError(response.status);       
          response.json().then((user) => {
            document.getElementById("manager-confirm-message").innerHTML = "<strong>사용자 이미지를 삭제했습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
            let okElement = document.getElementById("confirm-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./member-detail.html?' + _userId;   
            });
          });
        }) 
        } catch (error) {
          console.error("Error:", error);
        }
    }

   const request1 = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,     
      body: formData
   });

  //  post(request1);
   console.log('사진삭제');
  }
 
  function resetPassword(){
    document.getElementById("manager-confirm-message").innerHTML = "<strong>선택한 관리자의 비밀번호를 초기화할까요? 관리자의 개인 이메일로 임시 비밀번호가 발송 됩니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      issueTempPassword();
      // document.getElementById("manager-alert-message").innerHTML = "<strong>선택한 관리자의 비밀번호를 초기화할까요? 관리자의 개인 이메일로 임시 비밀번호가 발송 됩니다.</strong>";
      // location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
      // let okElement = document.getElementById("confirm-OK");
      // okElement.addEventListener("click", function (e) {
        
      // });
    });
  }

  function issueTempPassword(_id = null, _name = null){   
    let _userId = _id === null ?  document.getElementById("manager-login-id").innerHTML : _id;
    let _userName = _name === null ? document.getElementById("manager-name").innerHTML : _name;
    let client_id = '';
    let client_secret = '';

    let url = baseUrl + "/user/find-manager-password" ;

    let params = {
      loginId:  _userId,
      name: _userName, 
      client_id: client_id,
      client_secret: client_secret,
  }
    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content    
              // location.href='./ad-banner-list.html'
              document.getElementById("manager-alert-message").innerHTML = "<strong>임시비밀번호를 입력하신 아이디(이메일)로 발송했습니다. 일반 메일함에서 확인이 안된다면, 스팸(정크)메일함에서 확인해 주세요.</strong>";
              location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                // location.href = './login-IDPW-input.html';
              });
              return
          } 
          // else {
          //   document.getElementById("loginAlertMessage").innerHTML = "<strong>아이디, 이름이 일치하지 않습니다.</strong>";
          //   location.href= "javascript:layerPopup.openPopup('loginAlertPopup', true);";
          // }
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

  function cancelModify(){
    document.getElementById("manager-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
    location.href= "javascript:layerPopup.openPopup('managerConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = './manager-list.html';
    });
    return
  }

  function goRegister(){
    window.sessionStorage.removeItem("userNickname");
    location.href = "./manager-register.html"
  }

  function unregister(type){
    console.log('삭제');
    let _userId;
    if ( type === 1){
      _userId = window.sessionStorage.getItem("managerId");
    } else {
      _userId = window.sessionStorage.getItem("memberId");
    }
    
    let url = baseUrl + '/user/unregister';
    let params = {    
      userId: _userId,    
      type: 1
    }

    async function post(request) {
      try {
        await fetch(request).then(response => {   
          checkError(response.xstatus);      
          response.json().then((user) => {      
            console.log('user' + JSON.stringify(user))     
            //if(user.data?.profilePatgh){
              // changeManagerProfile();
            // } else {
              if ( type === 1){
                console.log('user', user.data.user.id);
                document.getElementById("manager-alert-message").innerHTML = "<strong>관리자가 삭제되었어요.</strong>";
                location.href= "javascript:layerPopup.openPopup('managerAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  location.href = './manager-list.html';
                });
              } else {
                // console.log('user', user.data.user.id);
                document.getElementById("member-alert-message").innerHTML = "<strong>탈퇴가 완료되었어요.</strong>";
                location.href= "javascript:layerPopup.openPopup('memberAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  location.href = './member-list.html';
                });
              }
          //  }
          });
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
    //  console.log('registerManager');
  }

  function searchStart(e,type){
    if(e.keyCode === 13){
      if(type === 1){
        getMemberList(0,20);
      } else {
        getManagerList(0,20);
      }
     
    }
  }

  function deleteMember(){
    document.getElementById("member-confirm-message").innerHTML = "<strong>선택한 회원을 탈퇴시키겠어요? 삭제되 개인정보는 복구할 수 없습니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('memberConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      // unregister(2);
      console.log('회원탈퇴')
    return;
    })
  }

  ///// 회원 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getMemberList(currentPage, size){
    document.getElementById('member-list_grid').innerHTML = "";
    let _keyword = document.getElementById('member-search').value;
    console.log('_keyword' + _keyword);
    let userGrade = document.getElementById('member-grade');
    let _filterAuth =  (userGrade.options[userGrade.selectedIndex]).value === 'all' ? null : (userGrade.options[userGrade.selectedIndex]).value ;    
    
    let url = baseUrl + "/users/all?type=0";
    if ( _filterAuth !== null){   
      url += '&isStudent='+_filterAuth ;
    } 
    url += '&grade= 1';
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;
    console.log('_filterAuth' + _filterAuth);

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((users) => {
        let userGrid= "";
        // console.log('noticeData' + JSON.stringify(noticeData))
        let userData = users.data.users;
        let userDataTotal = users.data.total;
        let numOfPage = Math.ceil(userDataTotal/size);
        let iteration = userData.length > size ? size :  userData.length;
        console.log('manager-action notice list iteration' + iteration );
        for( let i=0;  i < userData.length ; i++){
          let values = userData[i];
          let _birth = values.birth;
          let _mobile = values.mobile ?  values.mobile.substring(0,3) + '-' + values.mobile.substring(3,7) +  '-' + values.mobile.substring(7,11) : "";
          // let _birth = null;
          let birth = _birth ? _birth.substring(0,4) + '-' + _birth.substring(4,6) +  '-' + _birth.substring(6,8) : "";
          userGrid+=`<tr>
                      <td>${values.id}</td>
                      <td>${values.id}</td>
                      <td><a href="./member-detail.html?id=${values.id}" class="underline">${values.loginId}</a></td>
                      <td>${replacestr(values.name)}</td>
                      <td>${birth}</td>
                      <td>${values.schoolId !== null ? '대학생 인증 회원':"일반 회원"}</td>
                      <td>${values.nickname?values.nickname:''}</td>               
                      <td>${values.email}</td>               
                      <td>${_mobile}</td>               
                      <td>${dateToStr(strToDate(values.createDate))}</td>
                      <td>${dateToStr(strToDate(values.createDate))}</td>
                      <td>${dateToStr(strToDate(values.lastDate))}</td>
                    <tr>`;
        }

        let startOfPage = Math.floor(currentPage/10)* 10;
        // let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        if ( numOfPage < endOfPage){
            endOfPage = numOfPage;
        }           
        paging =`<ul class="pagination">`;
            if (currentPage <= 0){ 
            paging += `<li class="controller first disabled">`;
            } else {
            paging += `<li class="controller first">
                        <a href="#" class="page-link" onclick="getMemberList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
            paging += `<li class="controller prev disabled">`;
            } else {
            paging += `<li class="controller prev">
                        <a href="#" class="page-link" onclick="getMemberList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                paging +=`<li class="paging current">` 
                } else {
                paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getMemberList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      
          
            if ( (currentPage+1) === numOfPage|| (numOfPage === 0)){ 
            paging += `<li class="controller next disabled">`;
            } else {
            paging += `<li class="controller next">
                        <a href="#" class="page-link" onclick="getMemberList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }  

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
            paging += `<li class="controller last disabled">`;
            } else {
            paging += `<li class="controller last">
                        <a href="#" class="page-link" onclick="getMemberList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                  
        // console.log('userGrid' + userGrid)
        document.getElementById('member-list_grid').innerHTML  = userGrid  === "" ? "<tr><td colspan='12'>데이터가 없습니다.</td></tr>": userGrid;
        document.getElementById('member-list-pagination').innerHTML = paging;
        document.getElementById('member-list-total').innerHTML = '&nbsp;<strong>' +userDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }

  function getMember(){
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    ///0:연애, 1:진로, 2:일상, 3:우리학교
    // let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){//// && communityId != null){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
   
    console.log('id' + id);

    let url = baseUrl + "/users/" + id ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((user) => {

        let userData = user.data.user;
        // let _birth = userData.birth;
        let _birth = userData.birth ? userData.birth.substring(0,4) + '년 ' + userData.birth.substring(4,6) +  '월 ' + userData.birth.substring(6,8)+  '일 ' : "";
        let mobile = userData.mobile ?  userData.mobile.substring(0,3) + '-' + userData.mobile.substring(3,7) +  '-' + userData.mobile.substring(7,11) : "";
        let today = new Date();
        console.log('mobile' +mobile );
        console.log('_communityData.state' + _state[userData.state] );

        ///기본 정보
        document.getElementById('user-id').innerHTML = userData.loginId;
        document.getElementById('user-name').innerHTML = userData.name;
        document.getElementById('user-birth').innerHTML = _birth;
        document.getElementById('user-is-student').innerHTML = (userData.schoolId? '인증회원':"");
        document.getElementById('user-agree-date').innerHTML = userData.notificationDate? dateToStr(strToDate(userData.notificationDate)) : "";
        document.getElementById('user-create-date').innerHTML = dateToStr(strToDate(userData.createDate));

        ////////부가정보
        document.getElementById('user-nickname').innerHTML = userData.nickname;
        document.getElementById('user-email').innerHTML = userData.email;
        document.getElementById('user-instagram-url').innerHTML = userData.instagramUrl;
        document.getElementById('user-youtube-url').innerHTML = userData.youtubeUrl;
        document.getElementById('user-byline').innerHTML = userData.byLine === 'none' ? '노출안함' :'노출';
        document.getElementById('user-mobile').innerHTML = mobile;
        document.getElementById('user-profile-image').src = userData.profilePath? userData.profilePath:"";
     
        document.getElementById('user-school-name').innerHTML = userData.schoolName?userData.schoolName:"";        
        document.getElementById('user-school-email').innerHTML = userData.schoolEmail?userData.schoolEmail:"";        
        
        window.sessionStorage.setItem("memberId",userData.id)     
       
      })                    
    }).catch(error => console.log(error));
  }


  function resetNickname(){  
    let _userId = window.sessionStorage.getItem("memberId");
    let url = baseUrl + '/user';
 
    let params = {
     id: _userId,
     nickname: null
    }
 
    async function post(request) {
    try {
        await fetch(request).then(response => {  
          checkError(response.status);       
          response.json().then((user) => {
            document.getElementById("member-alert-message").innerHTML = "<strong>사용자 닉네임을 초기화하였습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('memberAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./member-detail.html?' + _userId;   
            });
          });
        }) 
        } catch (error) {
          console.error("Error:", error);
        }
    }

   const request1 = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,     
      body: JSON.stringify(params)
   });

  //  post(request1);
   console.log('사진삭제');
  }