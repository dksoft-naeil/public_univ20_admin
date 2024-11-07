
document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/basic-data/school-list") >= 0) getSchoolList(0, 20);  
  else if(window.location.pathname.indexOf("/basic-data/school-detail") >= 0) getSchool();
  else if(window.location.pathname.indexOf("/basic-data/school-register-modify") >= 0) selectRegistModify();  
});

  /// school ////////////////////////////////////////////////////////////////////////////////////
  function getSchoolList(currentPage, size, filterCategory=null, filterStatus=null){       
    document.getElementById('school-list_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;
    window.sessionStorage.removeItem("schoolId");

    let schoolState = document.getElementById('school-state');
    let _filterState = (schoolState.options[schoolState.selectedIndex]).value === 'all' ? null : (schoolState.options[schoolState.selectedIndex]).value ;    
    let _keyword = document.getElementById('school-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[1] = '';

    let url = baseUrl + "/schools?" ;
    if ( _filterState !== null){   
        url +='state='+ _filterState;
    }

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage*size +"&limit=" + size;

   ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((schools) => {
        console.log('schools' + JSON.stringify(schools.data));
        let schoolGrid= "";
        let schoolData = schools.data.schools;
        let _schoolDataTotal = schools.data.total;
        let numOfPage = Math.ceil((_schoolDataTotal-1)/size);
        let startOfPage = Math.floor(currentPage/10)* 10;
        let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        if ( numOfPage < endOfPage){
          endOfPage = numOfPage;
        }           
    
        let iteration = schoolData.length > size ? size :  schoolData.length;
        for( let i=0;  i < schoolData.length ; i++){
          let values = schoolData[i]
          schoolGrid+=`<tr>
              <td>
                <div class="selector-cover checkbox solo">
                  <label class="label">
                    <input type="checkbox" name="banner-short" class="chk" onclick="itemCheck()"/>
                    <span class="label-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </td>
              <td>${values.id}</td>
              <td><a href="./school-detail.html?id=${values.id}" class="underline">${values.name}</a></td>
              <td>${_state[values.state]}</td>           
              <td>${values.region}</td>
              <td>${values.domain1 !== null ? values.domain1 : ""}</td>
              <td>${values.userCount}</td>
            <tr>`;             
        }
        
        paging =`<ul class="pagination">`;
        if (currentPage <= 0){ 
          paging += `<li class="controller first disabled">`;
        } else {
          paging += `<li class="controller first">
                      <a href="#" class="page-link" onclick="getSchoolList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getSchoolList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getSchoolList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      
        if ( (currentPage+1) === numOfPage || (numOfPage === 0)){ 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getSchoolList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getSchoolList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }               
                  
        document.getElementById('school-list_grid').innerHTML  = schoolGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": schoolGrid;          
        document.getElementById('school-list-pagination').innerHTML = paging;
        document.getElementById('school-list-total').innerHTML = '&nbsp;<strong>' +_schoolDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }

  function selectRegistModify(){
    let id = window.sessionStorage.getItem("schoolId");
    // let _reportId = window.sessionStorage.getItem("reportId");
  
    console.log('여기는 왜 안 돼' + id);
    if ( id === null){
      console.log('등록');
      document.getElementById('school-regist').style.display = 'block';
      document.getElementById('school-modify').style.display = 'none';
    } else {
      console.log('수정');
      document.getElementById('school-regist').style.display = 'none';
      document.getElementById('school-modify').style.display = 'block';
      
      let id =window.sessionStorage.getItem("schoolId");
      let url = baseUrl + "/schools?id=" + id;
      
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((school) => {
          let schoolData = school.data.schools;
          
          if(schoolData.length > 0){
            // let 
            let _schoolData = schoolData[0];
            // let _type = _noticePopup.category;
            let _state = _schoolData.state;           
            console.log('state' + JSON.stringify(_schoolData));
            document.getElementById('school-name').value = _schoolData.name;
            document.getElementById('school-region').value = _schoolData.region;
            document.getElementById('school-auth-email').value = _schoolData.domain1;
            _state === 0 ? $(":radio[name='school-state'][value='public']").prop('checked', true) :  $(":radio[name='school-state'][value='private']").prop('checked', true)
            // document.getElementById('school-state').innerHTML = _schoolData.state;     
           window.sessionStorage.setItem("schoolId",_schoolData.id);
          }
        })                    
      }).catch(error => console.log(error));
    }
  }

  function checkDuplication(){
    let _schoolName = document.getElementById("school-name").value;

    let url = baseUrl + "/schools?" ;
    url += baseUrl + '&keyword=' + (_schoolName === null ? '' : _schoolName);
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((schools) => {
        console.log('schools' + JSON.stringify(schools.data));
        // let schoolGrid= "";
        let schoolData = schools.data.schools;
        let _schoolDataTotal = schools.data.total;
        if ( _schoolDataTotal > 0){                 
          document.getElementById("school-alert-message").innerHTML = '<strong>사용 가능한 학교명입니다.=</strong>';
          location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";   


          document.getElementById("school-name").value = "";      
        } else {
          alert('사용가능');

        }
      });
    }).catch(error => console.log(error));
  }

  function registSchool(){   
    let _state =  $('input[name=school-state]:checked').val() === 'private' ? 2 :  0;    
    let _name = document.getElementById('school-name').value;
    let _email = document.getElementById('school-email').value;   
    let _region = document.getElementById('school-region');
    let _schoolRegion = (_region.options[_region.selectedIndex]).value === 'all' ? null : (_region.options[_region.selectedIndex]).value ;
   
    let url = baseUrl + "/school/register" ;
    let params = {                
        state: _state,         
        region: _schoolRegion,
        division: '대학교',
        name: _name,
        domain1: _email    
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 201) {  // No content    
              location.href='./school-list.html'
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
      body: JSON.stringify(params),
    });
  
    post(request1);
  }

  function getSchool(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('id' + id);

    let url = baseUrl + "/schools?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((school) => {
        let schoolData = school.data.schools;
        
        if(schoolData.length > 0){
          // let 
          let _schoolData = schoolData[0];
          // let _type = _noticePopup.category;
          let _state = _schoolData.state;           
          console.log('state' + JSON.stringify(_schoolData));
          document.getElementById('school-name').innerHTML = _schoolData.name;
          document.getElementById('school-region').innerHTML = _schoolData.region;
          document.getElementById('school-auth-email').innerHTML = _schoolData.domain1;
          document.getElementById('school-auth-member').innerHTML = _schoolData.userCount;
          document.getElementById('school-state').innerHTML = _schoolData.state;     
         window.sessionStorage.setItem("schoolId",_schoolData.id);
        }
      })                    
    }).catch(error => console.log(error));
  }

  function changeSchoolState(schoolId=null){

    console.log('magazineArticleId' + schoolId);
    let url = baseUrl + "/school" ;
    let school_Id = schoolId === null ? parseInt(window.sessionStorage.getItem("schoolId")) : schoolId;
    // console.log()
    let params = {     
        id:  school_Id,
        state: _state
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            schoolOK();
            //  
            //  return
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changeMagazineStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeMagazineStateRequest);
  }

  function changeSchoolListState(_state){
    console.log('changeMagazineArticlesState state'+ _state)
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    const stateText = _state === 1? '삭제': '비공개';
    const stateMessage = _state === 1? '<strong>선택한 학교 정보를 삭제하시겠어요? 삭제된 정보는 복구할 수 없습니다.</strong>': '<strong>선택한 학교 정보의 상태를 비공개로 변경하시겠어요?</strong>';
    let okMessage =  _state === 1? '<strong>삭제가 완료되었어요.</strong>': '<strong>비공개로 변경되었어요.</strong>';
    if ( totalCnt === 0 ){      
      document.getElementById("school-alert-message").innerHTML ='<strong>선택한 학교정보가 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";
      return;
    }else{
      document.getElementById("school-confirm-message").innerHTML = '<strong>'+stateMessage+'</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolConfirmPopup', true);";   
      let okElement = document.getElementById("confirm-ok");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){            
          changeSchoolState(_state,(checkbox.value).replace('/',''));
        }
      });
    }   
  }

  function schoolOK(){
    console.log("school ok")
    location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true)";
    return 
  }

  function goOK(){
    location.href="./school-list.html";
  }

  function checkInput(type){

    let _name = document.getElementById('school-name').value;
    let _email = document.getElementById('school-auth-email').value;   
    let _region = document.getElementById('school-region');
    let _schoolRegion = (_region.options[_region.selectedIndex]).value === 'all' ? null : (_region.options[_region.selectedIndex]).value ;    

    if (_name === ""){
      document.getElementById("school-alert-message").innerHTML = '<strong>학교명을 작성해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";   
      return;
     } else if (_schoolRegion === null){
      document.getElementById("school-alert-message").innerHTML = '<strong>지역을 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";   
      return;
     } else if (_email === "@"){
      document.getElementById("school-alert-message").innerHTML = '<strong>인증메일주소를 작성해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";   
      return;
     } else if($('input[name="school-state"]').is(":checked") === false){
      document.getElementById("school-alert-message").innerHTML = '<strong>상태을 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('schoolAlertPopup', true);";   
      return;
    } else 


    if ( type === 1){
      console.log('등록');
      // registSchool();
    } else {
      console.log('수정');
      // modifySchool();
    }
    
  }

  function cancelRegister(){
    document.getElementById("school-confirm-message").innerHTML = '<strong>등록/수정을 취소하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('schoolConfirmPopup', true);";  
    let okElement = document.getElementById("confirm-ok");
    okElement.addEventListener("click", function (e) {
      location.href = "./school-list.html";
    }); 
  }

  function goRegister(){
    window.sessionStorage.removeItem("schoolId");
    location.href = "./school-register-modify.html"
  }

  function searchStart(e){
    if(e.keyCode === 13){
      getSchoolList(0,20);
    }
  }