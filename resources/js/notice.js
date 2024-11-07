///// 공지 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/etc/notice-list") >= 0) getNoticeList(0,20);  
  else if(window.location.pathname.indexOf("/etc/notice-detail") >= 0) getNotice();  
  else if(window.location.pathname.indexOf("/etc/notice-register-modify") >= 0)  selectRegistModify(1);  
});

function getNoticeList(currentPage, size){
  document.getElementById('notice-list_grid').innerHTML = "";
  window.sessionStorage.removeItem("noticeId");
  let _keyword = document.getElementById('notice-search').value;
  console.log('_keyword' + _keyword);
  let noticeState = document.getElementById('notice-state');
  let _filterState =  (noticeState.options[noticeState.selectedIndex]).value === 'all' ? null : (noticeState.options[noticeState.selectedIndex]).value ;    
  let noticeStatus = document.getElementById('notice-status');
  let _filterStatus =  (noticeStatus.options[noticeStatus.selectedIndex]).value === 'all' ? null : (noticeStatus.options[noticeStatus.selectedIndex]).value ;    
 
  let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
  let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';

  let url = baseUrl + "/notices?";
  if ( _filterState !== null){   
    url +='&state='+ _filterState;
  } else {
    if ( _filterStatus  === '-' ){
      url +='&state=2';
    } else if ( _filterStatus === 'ongoing'|| _filterStatus  === 'waiting' ){
      url +='&state=0,3';
    } else {
      url +='&state=0,2,3';
    }         
  }

  if ( _filterStatus !== null && _filterStatus !== '-' && _filterState !== '2'){         
    if  ((_filterState === null ||_filterState === '0,3')){
      url +='&status='+ _filterStatus;
    }      
  } 

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;
  
  if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
    document.getElementById('notice-list_grid').innerHTML  = '';          
    document.getElementById('notice-list-pagination').innerHTML = '';
    document.getElementById('notice-list-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
    return
  } 
  else{
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((notices) => {
        let noticeGrid= "";
        // console.log('noticeData' + JSON.stringify(noticeData))
        let noticeData = notices.data.notices;
        let _noticeDataTotal = notices.data.total;
        let numOfPage = Math.ceil(_noticeDataTotal/size);
        let iteration = noticeData.length > size ? size :  noticeData.length;
        console.log('manager-action notice list iteration' + iteration );
        // for( let i = _noticeDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
        for( let i=0;  i < noticeData.length ; i++){
          // console.log('${values.title}'+ JSON.stringify(values))
          let values = noticeData[i]
          noticeGrid+=`<tr>
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
              <td><a href="./notice-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
              <td>${values.state === 2 ? "비공개" : "공개" }</td>      
              <td>${values.state === 2 ? '-' : _status[values.status]}</td>                   
              <td>${dateToStr(strToDate(values.startDate))}</td>
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
                            <a href="#" class="page-link" onclick="getNoticeList(0,`+size+`)">First</a>
                          </li>`
              }
              if (currentPage == 0){ 
                paging += `<li class="controller prev disabled">`;
              } else {
                paging += `<li class="controller prev">
                            <a href="#" class="page-link" onclick="getNoticeList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                          </li>`
              }
                      
              for ( let page = startOfPage ; page< endOfPage; page++){             
                  if (page === (currentPage)){
                    paging +=`<li class="paging current">` 
                  } else {
                    paging +=`<li class="paging">` 
                  }                                              
                  paging += `<a href="#" class="page-link" onclick="getNoticeList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
              }      

              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller next disabled">`;
              } else {
                paging += `<li class="controller next">
                            <a href="#" class="page-link" onclick="getNoticeList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                          </li>`
              }     
              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller last disabled">`;
              } else {
                paging += `<li class="controller last">
                            <a href="#" class="page-link" onclick="getNoticeList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                          </li>`
              }       
                  
        console.log('noticeGrid' + noticeGrid)
        document.getElementById('notice-list_grid').innerHTML = noticeGrid=== "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": noticeGrid;          
        document.getElementById('notice-list-pagination').innerHTML = paging;
        document.getElementById('notice-list-total').innerHTML = '&nbsp;<strong>' +_noticeDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }
}

function getNotice(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  console.log('id' + id);

  let url = baseUrl + "/notices?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((notice) => {
      let noticeData = notice.data.notices;
      
        if(noticeData.length > 0){
          let _noticeData = noticeData[0];
          let _state = _noticeData.state;  
          let _postState = '즉시 게시';
          let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';

          if (_state === 2) _state = '비공개';
          else if (_state === 0 || _state === 3) _state = '공개';
          document.getElementById('notice-state').innerHTML = _state;

          /// 게시
          if(_state === 2) (new Date(_noticeData.startDate) <= new Date(_noticeData.lastDate)) ? _postState = '즉시 게시' : _postState = '예약 게시'; 
          else _state === 0 ? _postState = '즉시 게시' : _postState = '예약 게시';
          document.getElementById('notice-post-state').innerHTML = _noticeData.state === 2 ? '-': _postState;
          document.getElementById('notice-post-status').innerHTML = _noticeData.state === 2 ? '-': _status[_noticeData.status];

          document.getElementById('notice-title').innerHTML = _noticeData.title;
          document.getElementById('notice-content').innerHTML = _noticeData.content;
      
          document.getElementById('notice-start-date').innerHTML = dateToStr(strToDate(_noticeData.startDate || ""))
          window.sessionStorage.setItem("noticeId",_noticeData.id);
        }
    })                    
  }).catch(error => console.log(error));
}

function setNoticeToday(){ 
  let _date = new Date()
  document.getElementById("notice-post-startdate").value = dateToStr(_date);
  datepicker.setDate(_date);
  $("input:radio[name='notice-post-state'][value='immediately']").prop('checked', true);
  $("input:radio[name='notice-post-state'][value='reserved']").prop('checked', false);

}

function registNotice(_content){  
  let _status =  $('input[name=notice-state]:checked').val() === 'private' ? 2 :$('input[name=notice-post-state]:checked').val() === 'immediately' ? 0: 3;  
  let _postStartDate = dateToStr(strToDate(document.getElementById('notice-post-startdate').value));   
  let _title = document.getElementById('notice-title').value;
  // let _editor = editorInstance.html.get();
  let _editor = document.getElementById('editor').innerHTML;;
  
  let url = baseUrl + "/notice/register" ;
  let params = {       
      state: _status,
      title: _title,
      content: _content,
      startDate: _postStartDate,
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
        if(response.status === 201) {  // No content        
          document.getElementById("notice-alert-title").innerHTML = "<strong>공지가 등록되었습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
          let okElement = document.getElementById("confirm-ok");
          okElement.addEventListener("click", function (e) {
            location.href ="./notice-list.html"
          });
          // return
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

function modifyNotice(){
  // let _state =  $('input[name=notice-state]:checked').val() === 'immediately' ? 0 : 3;
  let _state =  $('input[name=notice-state]:checked').val() === 'private' ? 2 :$('input[name=notice-post-state]:checked').val() === 'immediately' ? 0: 3;  
  let _sendTime = dateToStr(strToDate(document.getElementById('notice-post-startdate').value));
  let _title = document.getElementById('notice-title').value;
  let _content =  editorInstance.html.get();
  let _noticeId = window.sessionStorage.getItem("noticeId")
  
  console.log('_status' + _state) ;
  console.log('_sendTime' + _sendTime) ;
  console.log('_content' + _content) ;

  let url = baseUrl + "/notice" ;
  let params = {          
      id: _noticeId,
      state: _state,
      title:_title,
      content: _content,           
      startDate: _sendTime
      // createDate: _sendTime,         
      // lastDate: _sendTime
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
        if(response.status === 200) {  // No content       
          document.getElementById("notice-alert-title").innerHTML = "<strong>공지가 수정되었습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
          let okElement = document.getElementById("confirm-ok");
          okElement.addEventListener("click", function (e) {
            location.href ="./notice-list.html"
          });
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

function selectRegistModify(){
  let _noticeId = window.sessionStorage.getItem("noticeId");
  //console.log('_noticeId => ' + _noticeId);
  //console.log('num=> ' + _noticeId);

  if ( _noticeId === null){
    console.log('등록');
    document.getElementById('notice-regist').style.display = 'block';
    document.getElementById('notice-modify').style.display = 'none';
  } else {
    console.log('수정');
    document.getElementById('notice-regist').style.display = 'none';
    document.getElementById('notice-modify').style.display = 'block';

    let url = baseUrl + "/notices?id=" + _noticeId;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((notice) => {
        let noticeData = notice.data.notices;
        console.log('noticeData: ' + JSON.stringify(noticeData));

        if(noticeData.length > 0){
          let _noticeData = noticeData[0];
          let _state = _noticeData.state;
          let today = new Date();
          let startdate = new Date(_noticeData.startDate);
          
          // 상태
          _state === 2 ? $(":radio[name='notice-state'][value='private']").attr('checked', true) : $(":radio[name='notice-state'][value='public']").attr('checked', true) ;

          /// 게시
          if(_noticeData.state === 2){
            (new Date(_noticeData.startDate) <= new Date(_noticeData.lastDate)) ? 
              $(":radio[name='notice-post-state'][value='immediately']").attr('checked', true) : 
              $(":radio[name='notice-post-state'][value='reserved']").attr('checked', true);  
          }
          else{ 
            _noticeData.state === 0 ? 
              $(":radio[name='notice-post-state'][value='immediately']").attr('checked', true) : 
              $(":radio[name='notice-post-state'][value='reserved']").attr('checked', true);  
          } 

          console.log('_notificationData.startDat' + _noticeData.startDate)
          document.getElementById('notice-post-startdate').value = dateToStr(strToDate(_noticeData.startDate));
          document.getElementById('notice-title').value = _noticeData.title;  
          console.log(' _noticeData.content' +  _noticeData.content);      
          editorInstance.html.insert(_noticeData.content);
        }
      });                    
    }).catch(error => console.log(error));
  }
}

function changeNoticeState(_state,noticeId = null){
  console.log('noticeId' +noticeId);
  let url = baseUrl + "/notice" ;
  let _noticeId = noticeId === null ? parseInt(window.sessionStorage.getItem("noticeId")) : noticeId;

  let params = {     
      id:  _noticeId,
      state: _state
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content     
            let stateMessage = ""
            if (_state === 1){
              stateMessage = "<strong>삭제가 완료되었어요.</strong>";
            } else if (_state === 2){
              stateMessage= "<strong>비공개 상태로 변경되었어요.</strong>";
            } else if (_state === 0){
              stateMessage =  "<strong>공개 상태로 변경되었어요.</strong>";
            }
            document.getElementById("notice-alert-message").innerHTML = stateMessage;
            location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";   
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href = "./notice-list.html";
            });   
            return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const changeFaqStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(changeFaqStateRequest);
}

function changeNotice(noticeId = null){
    let url = baseUrl + "/notice" ;
    let notice_id = noticeId === null ?window.sessionStorage.getItem("noticeId") : noticeId;
    console.log()
    let params = {     
        id:  notice_id,
        state: 1
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
              location.href='./notice-list.html'       
              return
            }
        }) 

        } catch (error) {
        console.error("Error:", error);
        }
    }

    const faqrequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });

    post(faqrequest);
}

function changeNoticeList(_state){
    // let url = baseUrl + "/notice" ;

    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;       
  
    const stateText = _state === 1? '삭제': _state === 2 ? '비공개': '공개';
    const stateMessage = _state === 1? '<strong>선택한 공지사항을 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다.</strong>': '<strong>선택한 공시사항의 상태를 비공개로 변경하시겠어요?</strong>';
    let okMessage =  _state === 1? '<strong>삭제가 완료되었어요.</strong>':  _state === 2? '<strong>비공개로 변경되었어요.</strong>': '<strong>공개로 변경되었어요.</strong>'
    document.getElementById("notice-alert-message").innerHTML =  okMessage;
    if ( totalCnt === 0 ){      
      // document.getElementById("notice-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("notice-alert-message").innerHTML ='<strong>선택한 공지사항이 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
      return;
    }else{
      // document.getElementById("notice-confirm-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("notice-confirm-message").innerHTML = stateMessage;
      location.href= "javascript:layerPopup.openPopup('noticeConfirmPopup', true);";   
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){                
          changeNoticeState(_state,(checkbox.value).replace('/',''));
        }
      });
    }
}

function noticeOK(){
  console.log("school ok")
  location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true)";
  return 
}

function goOK(){
  location.href="./notice-list.html";
}

function checkInput(type,content){    
  let _postStartDate = document.getElementById('notice-post-startdate').value;
  let _title = document.getElementById('notice-title').value;
  // let _content = document.getElementById('editor').value;
  // let _state =  $('input[name=banner-state]:checked').val() === 'private' ? 2 : $('input[name=banner-state]:checked').val() === 'reserved' ? 3 : 0;

  if($('input[name="notice-state"]').is(":checked") === false){
    document.getElementById("notice-alert-title").innerHTML = "<strong>공지 상태를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
    return;
  } else if ($('input[name=notice-state]:checked').val() === 'public' && ($('input[name="notice-post-state"]').is(":checked") === false)){
      document.getElementById("notice-alert-title").innerHTML = "<strong>공지 게시를 체크해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
    return
  } else if (_postStartDate ===""){
    document.getElementById("notice-alert-title").innerHTML = "<strong>게시 기간을 선택해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
    return;
  } else if (_title ===""){
    document.getElementById("notice-alert-title").innerHTML = "<strong>제목을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
    return;
  } else if ( content ===""){
    document.getElementById("notice-alert-title").innerHTML = "<strong>내용을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('noticeAlertPopup', true);";
    return;
  } 

  if (type === 1){
    registNotice(content);
  } else {
    modifyNotice(content);
  }
}

function cancelNotice(){
  document.getElementById("notice-message").innerHTML = "<strong>등록을 취소하시겠어요?</strong>";
  location.href= "javascript:layerPopup.openPopup('noticeConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    location.href = "./notice-list.html";
  });   
}

function searchStart(e){
  if(e.keyCode === 13){
    getNoticeList(0,20);
  }
}