document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/calendar/official-account-list") >= 0) getOfficialList(0,20);  
  else if(window.location.pathname.indexOf("/calendar/official-account-detail") >= 0) getOfficial();  
  else if(window.location.pathname.indexOf("/calendar/official-account-register-modify") >= 0) selectRegistModifyOfficial();  
});

///// 공식계정관리  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getOfficialList(currentPage, size){
  document.getElementById('official-list_grid').innerHTML = "";
 window.sessionStorage.removeItem("officialId");
  let _keyword = document.getElementById('official-search').value;
  console.log('_keyword' + _keyword);
  let officialState = document.getElementById('official-state');
  let _filterState =  (officialState.options[officialState.selectedIndex]).value === 'all' ? null : (officialState.options[officialState.selectedIndex]).value ;    
  let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[1] = '';
  
  let url = baseUrl + "/officials?";
  if ( _filterState !== null){   
    url +='&state='+ _filterState;
  } else {
      url +='&state=0,2';
  }

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((officials) => {
      let officailGrid= "";
      // console.log('noticeData' + JSON.stringify(noticeData))
      let noticeData = officials.data.officials;
      let _noticeDataTotal = officials.data.total;
      let numOfPage = Math.ceil(_noticeDataTotal/size);
      let iteration = noticeData.length > size ? size :  noticeData.length;
      console.log('manager-action notice list iteration' + iteration );
      // for( let i = _noticeDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
        for( let i=0;  i < noticeData.length ; i++){
        // console.log('${values.title}'+ JSON.stringify(values))
        let values = noticeData[i]
        officailGrid+=`<tr>
            <td>
              <div class="selector-cover checkbox solo">
                <label class="label">
                  <input type="checkbox" name="notice-short" class="chk" onclick="itemCheck()" value=${values.id}/>
                  <span class="label-text">
                      <span class="selector"></span>
                  </span>
                </label>
              </div>
            </td>
            <td>${values.id}</td>
            <td><a href="./official-account-detail.html?id=${values.id}" class="underline">${values.name}</a></td>
            <td>${values.userCount}</td>
            <td>${_state[values.state]}</td>
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
                      <a href="#" class="page-link" onclick="getOfficialList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getOfficialList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getOfficialList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getOfficialList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getOfficialList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       
                
      console.log('officailGrid' + officailGrid)
      document.getElementById('official-list_grid').innerHTML  = officailGrid;          
      document.getElementById('official-list-pagination').innerHTML = paging;
      document.getElementById('official-list-total').innerHTML = '&nbsp;<strong>' +_noticeDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function getOfficial(){
    let u = window.location.href;
    let id;
    let editorId;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('id' + id);

    let url = baseUrl + "/officials?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((official) => {
        let officialData = official.data.officials;
        // let faqDataTotal = official.data.total;
        
          if(officialData.length > 0){
            let _officialData = officialData[0];
            // let _type = _faqData.category;
            let state = _officialData.state;           
            let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[1] = '';
            // let _category = {}; _category[0] = '회원';_category[1] = '기사';_category[2] = '기타';

            document.getElementById('official-name').innerHTML =  _officialData.name;
            document.getElementById('official-state').innerHTML = _state[_officialData.state];
            document.getElementById('official-create-date').innerHTML = dateToStr(strToDate(_officialData.createDate));
            window.sessionStorage.setItem("officialId",_officialData.id);
            
          }
          getOfficialUserList(0,20);
      })                    
    }).catch(error => console.log(error));
      
    url= baseUrl + "/users/all?state=0&limit=1000000";    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {       
        let users ='';
        let userData = response.data.users;
        
        for( let i = 0; i< userData.length; i++){
          let userItem = userData[i];
          users += `{label:"${userItem.email}", value:"${userItem.email}", id:${userItem.id}},`
          users += `{label:"${userItem.name}", value:"${userItem.name}", id:${userItem.id}},`
        }

      // console.log('users' + JSON.stringify(users))
      const script = document.createElement("script");
      text = document.createTextNode( `
        $(document).ready(function() {
          // jquery-ui autocomplete 참고 - https://jqueryui.com/autocomplete/
          var availableCity = [${users}];
          $('#autocomplete01').autocomplete({
            select: function(event, ui) {
              if (ui.item.value == '') {               
                event.preventDefault();
              }else{             
                editorId = Number(ui.item.id);
                // editorName = ui.item.value;
                // // editorId = Number(ui.item.value);
                // console.log('editor id ' + JSON.stringify(ui));
                console.log('editor name ' + editorId);
                window.sessionStorage.setItem("editorId",editorId)
              }
            },
            source: availableCity,                          
            delay: 150,
            minLength: 3,
            response: function(event, ui) {
              console.log();
              if (!ui.content.length) {
                var noResult = {
                  value: '',
                  label: $(this).val(),
                };
                ui.content.push(noResult);
              }
            },
          });

          $.ui.autocomplete.prototype._renderItem = function(ul, item) {
            if (item.value) {
              var t = String(item.value).replace(new RegExp(this.term, 'gi'), '<strong>$&</strong>');
              return $('<li></li>')
                .data('item.autocomplete', item)
                .append('<div>' + t + '</div>')
                .appendTo(ul);
            } else {
              return $('<li></li>')
                .data('item.autocomplete', item)
                .append('<div class="no-result">' + '검색결과가 없습니다. (직접입력)' + '</div>')
                .appendTo(ul);
            }
          };
        }); `);
      
      script.appendChild(text);
      document.body.appendChild(script);
      // console.log('editorId===>' + editorId)
      });
    }).catch(error => console.log(error));
}
////// community comment ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getOfficialUserList(currentPage,size){
    let _officialId = window.sessionStorage.getItem("officialId");
    console.log()
    let url = baseUrl + "/users/all?officialId=" + _officialId;
    url += '&offset='+ currentPage *size +"&limit=" + size;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((users) => {
        let officailUsersGrid= "";
        let officialUsersData = users.data.users;
        let officialUsersTotal = users.data.total;
        let numOfPage = Math.ceil(officialUsersTotal/size);
        let iteration = officialUsersData.length > size ? size :  officialUsersData.length;
        console.log('officialUsersTotal'+officialUsersTotal)
        for( let i=0;  i < officialUsersData.length ; i++){
          let values = officialUsersData[i]
          officailUsersGrid+=`<tr>
                                <td>${i+1}</td>
                                <td>${values.id}</td>
                                <td>${values.loginId}</td>
                                <td>${replacestr(values.name)}</td>    
                                <td onclick="deleteAuthority()">${'삭제하기'}</td>
                              <tr>`;             
        }

        let startOfPage = Math.floor(currentPage/10)* 10;
        let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        if (numOfPage < endOfPage){
          endOfPage = numOfPage;
        }           
        paging =`<ul class="pagination">`;
        if (currentPage <= 0){ 
          paging += `<li class="controller first disabled">`;
        } else {
          paging += `<li class="controller first">
                      <a href="#" class="page-link" onclick="getOfficialUserList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getOfficialUserList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getOfficialUserList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getOfficialUserList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getOfficialUserList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       

        document.getElementById('official-user-list_grid').innerHTML = officailUsersGrid;        
        document.getElementById('official-user-pagination').innerHTML = paging;        
        document.getElementById('official-user-list-total').innerHTML = '&nbsp;<strong>' +officialUsersTotal + '</strong>&nbsp;';
        document.getElementById("official-account-total").innerHTML = officialUsersTotal + '명';
      })
    })
}

function selectRegistModifyOfficial(){
    let _officialId =window.sessionStorage.getItem("officialId");
    console.log('_officialId' + _officialId);
   
    // console.log('num' + id)
    if ( _officialId === null){
      console.log('등록');
      document.getElementById('official-regist').style.display = 'block';
      document.getElementById('official-modify').style.display = 'none';
      document.getElementById('official-modify-cancel').style.display = 'none';
    } else {
      console.log('수정');
      document.getElementById('official-regist').style.display = 'none';
      document.getElementById('official-modify').style.display = 'block';
      document.getElementById('official-regist-cancel').style.display = 'none';

      // getNotification(_notificationId);
      let url = baseUrl + "/officials?id=" + _officialId;
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((official) => {
          // let notificaGrid= "";
          let officialData = official.data.officials;
          // let officalDataTotal = official.data.total;
          console.log('officialData' + JSON.stringify(officialData));
          if(officialData.length > 0){
            let _officialData = officialData[0];
            let _state = _officialData.state;
    
            // $('#faq-category option[value='+ _category +']').attr('selected', true);
            _state === 0 ? $(":radio[name='official-state'][value='public']").prop('checked', true) :  $(":radio[name='official-state'][value='private']").prop('checked', true);
            document.getElementById('official-name').value = _officialData.name;         
          }
        })                    
      });
      // window.sessionStorage.setItem("notification-id", id);
    }
}

function checkDuplication(){
  let _officiallName = document.getElementById("official-name").value;

  if (!_officiallName){
    // alert('계정명을 입력하세요.');
    document.getElementById("official-alert-message").innerHTML = "<strong>계정명을 입력하세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
    return;    
  } 


  let url = baseUrl + "/officials?" ;
  url += baseUrl + '&keyword=' + _officiallName;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((official) => {
      console.log('schools' + JSON.stringify(official.data));
      // let schoolGrid= "";
      let officialData = official.data.officials;
      let officialDataTotal = official.data.total;
      if ( officialDataTotal > 0){       
        document.getElementById("official-alert-message").innerHTML = "<strong>중복입니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
        return;    
        document.getElementById("official-name").value = "";      
      } else {
        window.sessionStorage.setItem("checkDup",true);
        document.getElementById("official-alert-message").innerHTML = "<strong>사용가능합니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
        return;    
      }
    });
  });
}

function registOfficial(){
// let category = document.getElementById("faq-category");
// let _category =  (category.options[category.selectedIndex]).value;
// console.log('_category' + _category);
let _state =  $('input[name=official-state]:checked').val() === 'private' ? 2 : 0;
// let _postStartDate = document.getElementById('banner-start-date').value;
// let _postEndDate = document.getElementById('banner-end-date').value;
let _officialName = document.getElementById('official-name').value;

let url = baseUrl + "/official/register" ;
let params = {          
    state: _state,         
    name: _officialName
}

async function post(request) {
try {
    await fetch(request).then(response => {
        if(response.status === 201) {  // No content
          document.getElementById("official-alert-message").innerHTML = "<strong>공식 계정이 등록되었어요.</strong>";
          location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
          let okElement = document.getElementById("alert-OK");
          okElement.addEventListener("click", function (e) {
            location.href = './official-account-list.html';
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
    body: JSON.stringify(params),
});

post(request1);
}

function modifyOfficial(){
  let _state =  $('input[name=faq-state]:checked').val() === 'private' ? 2 : 0;
  let _officialName = document.getElementById('official-name').value;
  let _id = parseInt(window.sessionStorage.getItem("officialId"));
  let url = baseUrl + "/official" ;
  let params = {          
      // title: _title,   
      id:  parseInt(_id),
      state: _state,         
      name: _officialName
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
      console.log('modifyFaq 성공'+ response.status)
      if(response.status === 200) {  // No content
        document.getElementById("official-alert-message").innerHTML = "<strong>정보가 수정되었어요.</strong>";
        location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
        let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
          location.href = './official-account-list.html';
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
      body: JSON.stringify(params),
  });

  post(request1);
}

function changeOfficialState(_state, officialId = null){
    console.log('officalId' + officialId);
    let url = baseUrl + "/official" ;
    let _officialId = officialId === null ? parseInt(window.sessionStorage.getItem("officialId")) : officialId;
    // console.log()
    let params = {     
        id:  parseInt(_officialId),
        state: _state
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
               if(_state === 1){
                document.getElementById("official-alert-message").innerHTML ='<strong>삭제가 완료되었어요.</strong>';
                location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
                return;
               }else {
                document.getElementById("official-alert-message").innerHTML ='<strong>비공개 상태로 변경되었어요.</strong>';
                location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
                return;
               }
            }
        }) 

        } catch (error) {
        console.error("Error:", error);
        }
    }

    const changeOfficialStateRequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });

    post(changeOfficialStateRequest);
}

function deleteOfficial(officialId = null){
    let url = baseUrl + "/official" ;
    let official_id = officialId === null ?window.sessionStorage.getItem("officialId") : officialId;
    console.log()
    let params = {     
        id:  official_id,
        state: 1
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
                location.href='./official-list.html'       
                return
            }
        }) 

        } catch (error) {
        console.error("Error:", error);
        }
    }

    const officailrequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });

    post(officailrequest);
}

function changeOfficialList(_state){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;       
    const stateMessage = _state === 1? '<strong>선택한 공식계정을 삭제하시겠어요? 삭제된 계정 권한은 복구할 수 없습니다.</strong>': '<strong>선택한 공식계정의 상태를 비공개로 변경하시겠어요?</strong>';
    if ( totalCnt === 0 ){      
      // document.getElementById("notice-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("official-alert-message").innerHTML ='<strong>선택한 계정이 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
      return;
    }else{
      // document.getElementById("notice-confirm-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("official-confirm-message").innerHTML = stateMessage;
      location.href= "javascript:layerPopup.openPopup('officialConfirmPopup', true);";   
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){                
          changeOfficialState(_state,(checkbox.value).replace('/',''));
        }
      });
    }

    // for(const checkbox of checkboxes){     
    //     console.log('checkbox.value' + (checkbox.value).replace('/',''));
    //     if (state === 1){
    //         deleteOfficial((checkbox.value).replace('/',''));
    //     } else {
    //         changeOfficialState(state,(checkbox.value).replace('/',''))
    //     }
    // }
}

function getOfficialListbySchedule(){
  let url = baseUrl + "/officials?state=0";

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((officials) => {
      let officialGrid= "";
      // console.log('noticeData' + JSON.stringify(noticeData))
      let officialsData = officials.data.officials;
      let officialsTotal = officials.data.total;
      let officialSelect = document.getElementById("schedule-official-name");
      for(let i =0; i < officialsTotal ; i++){
        let values = officialsData[i];
        let option = document.createElement('option');
        option.innerText = values.name;
        option.value= values.id;
        officialSelect.append(option);
      }
    });
  });
}

function cancelOfficial(type){
  if ( type === 1){
    document.getElementById("official-confirm-message").innerHTML = "<strong>등록을 취소하시겠어요?</strong>";
  } else {
    document.getElementById("official-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
  }
  window.sessionStorage.removeItem('checkDup');
  location.href= "javascript:layerPopup.openPopup('officialConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    location.href = './official-account-list.html';
  });
  return
}

function checkInput(type){
  let officialName = document.getElementById("official-name").value;
  let _checkDup = window.sessionStorage.getItem("checkDup");
  if (($('input[name="official-state"]').is(":checked") === false)){    
    document.getElementById("official-alert-message").innerHTML = "<strong>계정 상태를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
    return;    
  } else if (officialName === ""){    
    document.getElementById("official-alert-message").innerHTML = "<strong>계정명을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
    return;    
  } else if ( !_checkDup){
    document.getElementById("official-alert-message").innerHTML = "<strong>중복확인을 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
    return;   
  }
  
  if (type === 1){
    registOfficial();
  }else {
    modifyOfficial();
  }
}

function registerAuthority(){
  // let _state =  $('input[name=faq-state]:checked').val() === 'private' ? 2 : 0;
  // let _officialNam e = document.getElementById('official-name').value;
  
  let _officialId = parseInt(window.sessionStorage.getItem("officialId"));
  let _editorid = parseInt(window.sessionStorage.getItem("editorId"));
  let url = baseUrl + "/user" ;
  let params = {          
      // title: _title,   
      id: _editorid,
      // state: _state,         
      officialId: _officialId
  }
  console.log('officialId' + _officialId)
  async function post(request) {
  try {
      await fetch(request).then(response => {
      console.log('modifyFaq 성공'+ response.status)
      if(response.status === 200) {  // No content
        document.getElementById("official-alert-message").innerHTML = "<strong>권한자로 지정되었습니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
        let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
          location.href = './official-account-list.html';
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
      body: JSON.stringify(params),
  });

  post(request1);
}

function checkDetail(type){
  if ( type === 1 ){      
    document.getElementById("official-confirm-message").innerHTML ='<strong>선택한 권한을 삭제하시겠어요? 삭제된 권한은 복구할 수 없습니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('officialConfirmPopup', true);";    
    // return
  }else{    
    document.getElementById("official-confirm-message").innerHTML ='<strong>선택한 권한의 상태를 비공개로 변경하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('officialConfirmPopup', true);";
    // return
  }

  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
     changeOfficialState(type);
  });        
  return
}

function deleteAuthority(){
  let _officialId = window.sessionStorage.getItem("officialId");
  document.getElementById("official-alert-message").innerHTML = "<strong>권한자에서 제외되었습니다.</strong>";
  location.href= "javascript:layerPopup.openPopup('officialAlertPopup', true);";
  let okElement = document.getElementById("alert-OK");
  okElement.addEventListener("click", function (e) {
    location.href = './official-account-detail.html?id='+_officialId;
  });        
  return
}


function searchStart(e,type){
  if(e.keyCode === 13){
    getOfficialList(0,20);
  }
}
