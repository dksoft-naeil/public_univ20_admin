
document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/calendar/calendar-list") >= 0) getScheduleAllList(0,20);  
  else if(window.location.pathname.indexOf("/calendar/calendar-detail") >= 0) getSchedule(1);  
  else if(window.location.pathname.indexOf("/calendar/calendar-register-modify") >= 0) selectRegistModify(1);  
  else if(window.location.pathname.indexOf("/calendar/before-accord-calendar-detail") >= 0) getSchedule(2);  
  else if(window.location.pathname.indexOf("/calendar/before-accord-calendar-list") >= 0) getBeforeApprovalList(0,20);  
  else if(window.location.pathname.indexOf("/calendar/before-accord-calendar-register-modify") >= 0) selectRegistModify(2);  
});

function getScheduleAllList(currentPage, size){
    document.getElementById('schedule-all-list_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let scheduleAllState = document.getElementById('schedule-all-state');
    let _filterState =  (scheduleAllState.options[scheduleAllState.selectedIndex]).value === 'all' ? null : (scheduleAllState.options[scheduleAllState.selectedIndex]).value;
    let scheduleStatus = document.getElementById('schedule-all-status');
    let _filterStatus =  (scheduleStatus.options[scheduleStatus.selectedIndex]).value === 'all' ? null : (scheduleStatus.options[scheduleStatus.selectedIndex]).value ;    
    let scheduleCategory = document.getElementById('schedule-all-category');
    let _filterCategory =  (scheduleCategory.options[scheduleCategory.selectedIndex]).value === 'all' ? null : (scheduleCategory.options[scheduleCategory.selectedIndex]).value;
    let _keyword = document.getElementById('schedule-all-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[4] = '등록신청';_state[5] = '거절';_state[1] = '삭제';
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';
    let _category = {}; _category[0] = "댕스's PICK";_category[1] = "20's PICK";_category[2] = "어카운트's PICK";
 
    let url = baseUrl + "/schedules?" ;
    if ( _filterCategory !== null  ){
      url += '&category='+ _filterCategory; 
    }

    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' || _filterStatus === 'waiting'){
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

   ;
    if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('schedule-all-list_grid').innerHTML  = '';          
      document.getElementById('schedule-all-list-pagination').innerHTML = '';
      document.getElementById('schedule-all-list-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((schedules) => {
          console.log('schedules' + JSON.stringify(schedules.data));
          let schedulesGrid= "";
          let schedulesData = schedules.data.schedules;
          let schedulesDataTotal = schedules.data.total;
          let numOfPage = Math.ceil(schedulesDataTotal/size);
          let iteration = schedulesData.length > size ? size :  schedulesData.length;
          console.log('manager-action banner list iteration' + iteration );
          // for( let i = schedulesDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
          for( let i=0;  i < schedulesData.length ; i++){
            let values = schedulesData[i]
            let today = new Date();
            console.log('schedules state' + JSON.stringify(values.state));
            /// category 2 어카운트 경우 공식계정
            /// 대학생 인증회원, 관리자, 대학생 인증회원, 공식계정
            let _priv= values.category === 2 ? values.officialName? values.officialName:"": values.schoolId? '대학생 인증회원': "일반회원";
            let state = values.state === 2 ? '비공개' : "공개"
            schedulesGrid+=`<tr>
                              <td>
                                <div class="selector-cover checkbox solo">
                                  <label class="label">
                                    <input type="checkbox" name="banner-short" class="chk" onclick="itemCheck()" value=${values.id}/>
                                    <span class="label-text">
                                        <span class="selector"></span>
                                    </span>
                                  </label>
                                </div>
                              </td>
                              <td>${values.id}</td>
                              <td>${_category[values.category]}</td>
                              <td><a href="./calendar-detail.html?id=${values.id}" class="underline">${values.title}</a></td>                            
                              <td>${values.name}</td>           
                              <td>${_priv}</td>        
                              <td>${state}</td>      
                              <td>${values.state === 2 ? '-' :_status[values.status]}</td>
                              <td>${values.startTime?dateToStr(strToDate(values.startTime)):""}</td>
                              <td>${values.endTime?dateToStr(strToDate(values.endTime)):""}</td>
                              <td>${values.startDate?dateToStr(strToDate(values.startDate)):""}</td>
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
                          <a href="#" class="page-link" onclick="getScheduleAllList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getScheduleAllList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getScheduleAllList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getScheduleAllList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getScheduleAllList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }                         

          document.getElementById('schedule-all-list_grid').innerHTML  = schedulesGrid  === "" ? "<tr><td colspan='11'>데이터가 없습니다.</td></tr>": schedulesGrid;          
          document.getElementById('schedule-all-list-pagination').innerHTML = paging;
          document.getElementById('schedule-all-list-total').innerHTML = '&nbsp;<strong>' +schedulesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
}

function getSchedule(menu){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[4] = '등록신청';_state[5] = '거절';_state[6] = '삭제';
  let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';
  let _category = {}; _category[0] = "댕스's PICK";_category[1] = "20's PICK";_category[2] = "어카운트's PICK";
  let url = baseUrl + "/schedules?id=" + id;
  
  console.log('menu' + menu);
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((schedule) => {
      let scheduleGrid= "";
      let scheduleData = schedule.data.schedules;
      let scheduleDataTotal = schedule.data.total;
      
      if(scheduleData.length > 0){
        let _scheduleData = scheduleData[0];
        window.sessionStorage.setItem("scheduleState",_scheduleData.state);
          /////////기본 정보/////////
        document.getElementById('schedule-category').innerHTML = _category[_scheduleData.category];
        // document.getElementById("schedule-before-category").innerHTML = _category[_scheduleData.category];
        document.getElementById('schedule-official-name').innerHTML =  _scheduleData.officialId? _scheduleData.officialName :"-";
        document.getElementById('schedule-name').innerHTML = _scheduleData.name;
        if ( menu ===1 ){
          if (_scheduleData.state === 0 ){
            document.getElementById('schedule-state').innerHTML = '공개';
            document.getElementById('schedule-post-state').innerHTML = '즉시게시';
          } else if (  _scheduleData.state === 3){
            document.getElementById('schedule-state').innerHTML = '비공개';
            document.getElementById('schedule-post-state').innerHTML = "예약게시";
          } else if (  _scheduleData.state === 2){
            document.getElementById('schedule-state').innerHTML = '비공개';
            document.getElementById('schedule-post-state').innerHTML = "-";
          } 
        
          document.getElementById('schedule-post-status').innerHTML = _scheduleData.state=== 2 ? '-':_status[_scheduleData.status];
        } else {
          document.getElementById('schedule-state').innerHTML =_state[_scheduleData.state] ;
        }
        // /////////부가 정보/////////
        document.getElementById('schedule-create-date').innerHTML = dateToStr(strToDate(_scheduleData.createDate?_scheduleData.createDate:""))
        document.getElementById('schedule-event-period').innerHTML = dateToStr(strToDate(_scheduleData.startTime?_scheduleData.startTime:"")) + '~' +dateToStr(strToDate(_scheduleData.endTime?_scheduleData.endTime:""))
        document.getElementById('schedule-title').innerHTML = _scheduleData.title;
        document.getElementById('schedule-content').innerHTML = _scheduleData.content?_scheduleData.content.replaceAll('\r\n',"<br />"):"";
        document.getElementById('schedule-image').src = _scheduleData.file;
        document.getElementById('schedule-popup-image').src = _scheduleData.file?  _scheduleData.file : "";

        window.sessionStorage.setItem("scheduleId",_scheduleData.id);
        if (menu === 1){
          getScheduleCommentList(0,10,_scheduleData.id);
        }
      }       
      
    })                    
  }).catch(error => console.log(error));
}

function getBeforeApprovalList(currentPage, size){
  document.getElementById('schedule-before-approval-list_grid').innerHTML = ""
  document.getElementById('checkAll').checked = false;

  let scheduleBeforeApprovalState = document.getElementById('schedule-before-approval-state');
  let _filterState =  (scheduleBeforeApprovalState.options[scheduleBeforeApprovalState.selectedIndex]).value === 'all' ? null : (scheduleBeforeApprovalState.options[scheduleBeforeApprovalState.selectedIndex]).value;
  let _keyword = document.getElementById('schedule-before-approval-search').value;
  ///0:open, 1:delete, 2:private 3:reserved
  let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[4] = '승인대기';_state[5] = '거절';_state[1] = '삭제';
  let _category = {}; _category[0] = "댕스's PICK";_category[1] = "20's PICK";_category[2] = "어카운트's PICK";
  let url = baseUrl + "/schedules?" ;

  if ( _filterState !== null){   
    url +='&state='+ _filterState;
  } else {
    url +='&state=4,5';
  }

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((schedules) => {
      console.log('schedules' + JSON.stringify(schedules.data));
      let schedulesGrid= "";
      let schedulesData = schedules.data.schedules;
      let schedulesDataTotal = schedules.data.total;
      let numOfPage = Math.ceil(schedulesDataTotal/size);
      let iteration = schedulesData.length > size ? size :  schedulesData.length;
      console.log('manager-action banner list iteration' + iteration );
      // for( let i = schedulesDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
      for( let i=0;  i < schedulesData.length ; i++){
        let values = schedulesData[i]
        let today = new Date();
        let _priv= values.category === 2 ? values.officialName? values.officialName:"": values.schoolId? '대학생 인증회원': "일반회원";
        console.log('schedules state' + JSON.stringify(values.state));
        schedulesGrid+=`<tr>
                          <td>
                            <div class="selector-cover checkbox solo">
                              <label class="label">
                                <input type="checkbox" name="banner-short" class="chk" onclick="itemCheck()" value=${values.id}/>
                                <span class="label-text">
                                    <span class="selector"></span>
                                </span>
                              </label>
                            </div>
                          </td>
                          <td>${values.id}</td>
                          <td>${_category[values.category]}</td>
                          <td><a href="./before-accord-calendar-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                          <td>${values.name}</td>           
                          <td>${_priv}</td>           
                          <td>${_state[values.state]}</td>        
                          <td>${values.startTime?dateToStr(strToDate(values.startTime)):""}</td>
                          <td>${values.endTime?dateToStr(strToDate(values.endTime)):""}</td>
                          <td>${values.startDate?dateToStr(strToDate(values.startDate)):""}</td>
                        <tr>`;
      }

      // let numOfPage = Math.ceil((_missonsTotal-1)/size);
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
                      <a href="#" class="page-link" onclick="getBeforeApprovalList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getBeforeApprovalList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getBeforeApprovalList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getBeforeApprovalList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getBeforeApprovalList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }                         

      document.getElementById('schedule-before-approval-list_grid').innerHTML  = schedulesGrid  === "" ? "<tr><td colspan='10'>데이터가 없습니다.</td></tr>": schedulesGrid;          
      document.getElementById('schedule-before-approval-list-pagination').innerHTML = paging;
      document.getElementById('schedule-before-approval-list-total').innerHTML = '&nbsp;<strong>' +schedulesDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

// function selectRegistModify(type=0 /* 0:캘린더 등록 수정 1:승인대기 캘린더 등록 수정*/){
function selectRegistModify(type){
  let _scheduleId = window.sessionStorage.getItem("scheduleId");
  console.log('_scheduleId' + _scheduleId);
 
  // console.log('num' + id)
  if ( _scheduleId === null){
    console.log('등록');
    document.getElementById('schedule-regist').style.display = 'block';
    // if(type === 1){
      document.getElementById('schedule-modify').style.display = 'none';
      document.getElementById('schedule-modify-filezone').style.display = 'none';
      document.getElementById('schedule-modify-cancel').style.display = 'none';
      
    // }
  } else {
    console.log('수정');
    document.getElementById('schedule-regist-cancel').style.display = 'none';
    document.getElementById('schedule-regist').style.display = 'none';
    document.getElementById('schedule-modify').style.display = 'block';
    document.getElementById('schedule-register-filezone').style.display = 'none';
    let url = baseUrl + "/schedules?id=" + _scheduleId;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((schedule) => {
        let scheduleData = schedule.data.schedules;
       
        if(scheduleData.length > 0){
          let _scheduleData = scheduleData[0];
          let _state = _scheduleData.state;
       
          /// 상태
          (_state === 0 || _state === 3) ? $(":radio[name=schedule-state][value='public']").attr('checked', true) :  $(":radio[name=schedule-state][value='private']").attr('checked', true);
          
          /// 게시
          if(_scheduleData.state === 2){
            (new Date(_scheduleData.startDate) <= new Date(_scheduleData.lastDate)) ? 
              $(":radio[name=schedule-post-state][value='immediately']").attr('checked', true) : 
              $(":radio[name=schedule-post-state][value='reserved']").attr('checked', true);  
          }
          else{ 
            _scheduleData.state === 0 ? 
              $(":radio[name=schedule-post-state][value='immediately']").attr('checked', true) : 
              $(":radio[name=schedule-post-state][value='reserved']").attr('checked', true);  
          } 
          
          /// 카테고리
          $('#schedule-category option[value='+ _scheduleData.category +']').attr('selected', true);
          
          /// 게시일
          document.getElementById('schedule-start-date').value = dateToStr(strToDate(_scheduleData.startDate || "" ));
          
          // 행사 기간

          _scheduleData.isAllDay === 1 ? $(":checkbox[id=checkAllday]").attr('checked', true) : $(":checkbox[id=checkAllday]").attr('checked', false) ;  
          document.getElementById('schedule-start-time').value = dateToStr(strToDate(_scheduleData.startTime));
          document.getElementById('schedule-end-time').value = dateToStr(strToDate(_scheduleData.endTime));
          document.getElementById('schedule-title').value = _scheduleData.title;
          document.getElementById('schedule-content').value = _scheduleData.content;     
          
          sendFileToDropzone(dropzone02, _scheduleData.file);
          
          if (_scheduleData.isAllDay){
            document.getElementById('checkAllDay').checked = true;     
          }

        }
      })                    
    }).catch(error => console.log(error));

    if(type === 0) document.getElementById('schedule-official-container').style.display = 'none';
    
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
}

function changeScheduleState(_state,menu, scheduleId = null){
  // console.log('communityId' +scheduleId);
  let url = baseUrl + "/schedule" ;
  let _scheduleId = scheduleId === null ? parseInt(window.sessionStorage.getItem("scheduleId")) : scheduleId;
  let _reason = menu=== 2 ? document.getElementById("schedule-reject-reason").value : "";

  
  let params = {     
      id:  _scheduleId,
      state: _state,
      reason: _reason
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content       

            if (_state === 5 && menu === 2){
              document.getElementById("schedule-alert-message").innerHTML = "<strong>승인을 거절했습니다.</strong>";
              location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
            } else if (_state === 0 && menu === 2){
              document.getElementById("schedule-alert-message").innerHTML = "<strong>캘린더에 등록되었습니다.</strong>";
              location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
            }
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              if (menu ===1){
                location.href='./calendar-list.html';
              } else {
                location.href='./before-accord-calendar-list.html';
                document.getElementById("reasonFormPopupCalendar").style.display = 'none';
              }
            });
           
            // return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const changeScheduleStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(changeScheduleStateRequest);
}

function deleteSchedule(menu,scheduleId = null){
  let url = baseUrl + "/schedule" ;
  let schedule_id = scheduleId === null ?window.sessionStorage.getItem("scheduleId") : scheduleId;
  console.log('schedule_id' + schedule_id);
  let params = {     
      id:  schedule_id,
      state: 1
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            document.getElementById("calendar-alert-message").innerHTML = "<strong>삭제가 완료되었어요.</strong>";
            location.href="javascript:layerPopup.openPopup('calendarAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
              if (menu ===1){
                location.href='./calendar-list.html';
              } else {
                location.href='./before-accord-calendar-list.html'
              }
            });
          
            return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const scheduleRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(scheduleRequest);
}

function changeScheduleList(state,menu){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  console.log('checkboxes' + JSON.stringify(checkboxes));
  const totalCnt = checkboxes.length;        
  
  if (totalCnt ===0 ){
    document.getElementById("calendar-alert-message").innerHTML = "<strong>선택하신 항목이 없습니다.</strong>";
    location.href="javascript:layerPopup.openPopup('calendarAlertPopup', true);";
    return
  } 

  if (state === 1){
      document.getElementById("calendar-confirm-message").innerHTML = "<strong>선택한 캘린더 일정을 삭제하시겠어요? 삭제된 일정은 복구할 수 없습니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('calendarConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){    
          deleteSchedule(menu,(checkbox.value).replace('/',''));
      }
    }); 
    return;         
  } else if (state === 2){
    document.getElementById("calendar-confirm-message").innerHTML = "<strong>선택한 캘린더 일정을 비공개로 변경하시겠어요? </strong>";
    location.href= "javascript:layerPopup.openPopup('calendarConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){    
        changeStateSchedule(state,(checkbox.value).replace('/',''))
      }
    }); 
    return;           
  } else if (state === 0){
    document.getElementById("calendar-confirm-message").innerHTML = "<strong>선택한 캘린더 일정을 공개로 변경하시겠어요? </strong>";
    location.href= "javascript:layerPopup.openPopup('calendarConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){    
        changeStateSchedule(state,(checkbox.value).replace('/',''))
      }
    }); 
    return;               
  }

  if ( state === 1){
    document.getElementById("calendar-alert-message").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('calendarAlertPopup', true);"; 
  } else if ( state === 2){
    document.getElementById("calendar-alert-message").innerHTML ='<strong>선택한 캘린더 일정 상태를 비공개로 변경되었어요.</strong>';
    location.href= "javascript:layerPopup.openPopup('calendarAlertPopup', true);"; 
  } else if ( state === 0){
    document.getElementById("calendar-alert-message").innerHTML ='<strong>선택한 캘린더 일정 상태를 공개로 변경되었어요</strong>';
    location.href= "javascript:layerPopup.openPopup('calendarAlertPopup', true);"; 
  }

}

function getScheduleCommentList(currentPage, size,scheduleId){
  document.getElementById('schedule-comments-list_grid').innerHTML = ""
  let url = baseUrl + "/schedule-comments?scheduleId="+ scheduleId;
  url +='&state=0,2';
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((scheduleComments) => {
      console.log('scheduleComments' + JSON.stringify(scheduleComments.data));
      let scheduleCommentsGrid= "";
      let scheduleCommentsData = scheduleComments.data.comments;
      let scheduleCommentsDataTotal = scheduleComments.data.total;
      let numOfPage = Math.ceil(scheduleCommentsDataTotal/size);
      let iteration = scheduleCommentsData.length > size ? size :  scheduleCommentsData.length;
      console.log('iteration' + iteration);
      for( let i=0;  i < scheduleCommentsData.length ; i++){
        let values = scheduleCommentsData[i]
        let today = new Date();
      
        scheduleCommentsGrid+=`<tr>             
                                <td>${iteration-i}</td>         
                                <td>${values.content}</td>                                         
                                <td>${values.likeCount}</td>
                                <td>${values.name}</td>                       
                                <td>${values.createDate?dateToStr(strToDate(values.createDate)):""}</td>
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
                      <a href="#" class="page-link" onclick="getScheduleCommentList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getScheduleCommentList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getScheduleCommentList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getScheduleCommentList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getScheduleCommentList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }                         

      document.getElementById('schedule-comments-list_grid').innerHTML  = scheduleCommentsGrid === "" ? "<tr><td colspan='5'>데이터가 없습니다.</td></tr>": scheduleCommentsGrid;
      document.getElementById('schedule-comments-list-pagination').innerHTML = paging;
      document.getElementById('schedule-comments-list-total').innerHTML = '&nbsp;<strong>' +scheduleCommentsDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function registSchedule(){
  let category = document.getElementById("schedule-category");
  let _category =  parseInt((category.options[category.selectedIndex]).value);
  let officialName = document.getElementById("schedule-official-name");
  let _officialName =  (category.options[category.selectedIndex]).value;
  console.log('_category' + _category);
  let _state =  $('input[name=schedule-state]:checked').val() === 'private' ? 2 : $('input[name=schedule-post-state]:checked').val() === 'reserved' ? 3 : 0;
  let _isAllDay =  document.getElementById("checkAllDay").checked ? 1:0;
  let _postStartDate = dateToStr(strToDate(document.getElementById('schedule-start-date').value));
  let _eventstartTime = dateToStr(strToDate(document.getElementById('schedule-start-time').value));
  let _eventEndTime = dateToStr(strToDate(document.getElementById('schedule-end-time').value));
  let _title = document.getElementById('schedule-title').value;
  let _content = document.getElementById('schedule-content').value;   
  let url = baseUrl + "/schedule/register" ;
  let formData = new FormData();

  if ( _category === 2){
    let _officialName = document.getElementById("schedule-official-name");
    let _officialId = (_officialName.options[_officialName.selectedIndex]).value;
    console.log('_officialId --->' + _officialId);
    formData.append('officialId', _officialId);
  }
  formData.append('state', _state);
  formData.append('startDate', _postStartDate);
  formData.append('startTime', _eventstartTime);
  formData.append('endTime', _eventEndTime);
  formData.append('category', _category);
  formData.append('title', _title);
  formData.append('content', _content);
  formData.append('isAllDay', _isAllDay);
  
  if (mainFile !== null){
    console.log('mainEditFile file' + mainFile.name);
    if( mainFile) formData.append("file", mainFile, mainFile.name);
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 201) {  // No content
            document.getElementById("schedule-confirm-message").innerHTML = "<strong>캘린더에 등록되었습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('scheduleConfirmPopup', true);";
            let okElement = document.getElementById("confirm-OK");
              okElement.addEventListener("click", function (e) {
                location.href='./calendar-list.html'
            });             
            return;
          }
      }) 
  
      } catch (error) {
      console.error("Error:", error);
      }
  }
  
  const request1 = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,
      body: formData,
  });
  
  post(request1);
}

function modifySchedule(menu){
  let category = document.getElementById("schedule-category");
  let _category =  (category.options[category.selectedIndex]).value;
  // let officialName = document.getElementById("schedule-official-name");
  // let _officialName =  (category.options[category.selectedIndex]).value;
  console.log('_category' + _category);
  let _state =  $('input[name=schedule-state]:checked').val() === 'private' ? 2 : $('input[name=schedule-post-state]:checked').val() === 'reserved' ? 3 : 0;
  let _postStartDate = dateToStr(strToDate(document.getElementById('schedule-start-date').value));
  let _eventstartTime = dateToStr(strToDate(document.getElementById('schedule-start-time').value));
  let _eventEndTime = dateToStr(strToDate(document.getElementById('schedule-end-time').value));
  let _title = document.getElementById('schedule-title').value;
  let _content = document.getElementById('schedule-content').value;
  let _isAllDay =  document.getElementById("checkAllDay").checked ? 1:0;
  let _id =window.sessionStorage.getItem("scheduleId")
  let url = baseUrl + "/schedule" ;

  let formData = new FormData();
  formData.append('id', _id);
  if ( menu===2 ){    
    formData.append('state', window.sessionStorage.getItem("scheduleState"));
  }
  if ( _category === 2){
    let _officialName = document.getElementById("schedule-official-name");
    let _officialId = (_officialName.options[_officialName.selectedIndex]).value;
    console.log('_officialId --->' + _officialId);
    formData.append('officialId', _officialId);
  }
  formData.append('startDate', _postStartDate);
  formData.append('startTime', _eventstartTime);
  formData.append('endTime', _eventEndTime);
  formData.append('category', _category);
  // formData.append('subject', _subject);
  formData.append('title', _title);
  formData.append('content', _content);
  formData.append('isAllDay', _isAllDay);
  
  if(isModifiedFiles && mainEditFile) formData.append("file", mainEditFile, mainEditFile.name);
  
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content
              if (menu ===1){
                document.getElementById("schedule-alert-message").innerHTML = "<strong>캘린더 정보가 수정되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  location.href='./calendar-list.html';
                }); 
                return;
              } else {
                document.getElementById("schedule-alert-message").innerHTML = "<strong>캘린더 정보가 수정되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  location.href='./before-accord-calendar-list.html'
                }); 
                return;
              }
              
            }
        }) 

        } catch (error) {
        console.error("Error:", error);
        }
    }

  const request1 = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,
      body: formData,
  });

  post(request1);
}

function getCategory(){
  let scheduleCategory = document.getElementById('schedule-category');
  if (scheduleCategory.options[scheduleCategory.selectedIndex].value === '2'){
    document.getElementById('schedule-official-container').style.display = 'block';
    getOfficialListbySchedule();
  } else {
    document.getElementById('schedule-official-container').style.display = 'none';
  }
}

function setAllDay(){
  let today = new Date()
  let _startDate = new Date(document.getElementById("schedule-start-time").value);
  let _endDate = new Date(document.getElementById("schedule-end-time").value);
 _startDate.setHours(0);
 _startDate.setMinutes(0);
 _endDate.setHours(23);
 _endDate.setMinutes(59);
  console.log('_startDate' + _startDate);
  console.log('_endDate' + _endDate);
  
  document.getElementById("schedule-start-time").value = dateToStr(_startDate);
  document.getElementById("schedule-end-time").value = dateToStr(_endDate);
  // datepicker1.setDate(new Date(_startDate));
  // datepicker2.setDate(_endDate);
 
  // let is_checked = document.getElementById("checkAllDay").checked;
  // console.log('is_checked'+  is_checked);
  // document.getElementById("checkAllDay").checked = !is_checked;    
  // console.log('is_checked'+  document.getElementById("checkAllDay").checked);
}

function goRegister(){
  window.sessionStorage.removeItem('scheduleId');
  location.href="./calendar-register-modify.html"
}

function checkInputSchedule(type,menu){
  // let _postState = document.getElementById('schedule-post-state').value;
  let _postStartDate = new Date(document.getElementById('schedule-start-date').value).getTime();
  let _startTime = new Date(document.getElementById('schedule-start-time').value).getTime();
  let category = document.getElementById("schedule-category");
  let _category =  (category.options[category.selectedIndex]).value;
  let _title = document.getElementById('schedule-title').value;
  let _content = document.getElementById('schedule-content').value;

  // let _content = document.getElementById('editor').value;
  // let _state =  $('input[name=banner-state]:checked').val() === 'private' ? 2 : $('input[name=banner-state]:checked').val() === 'reserved' ? 3 : 0;

  if((menu === 1) &&  $('input[name="schedule-state"]').is(":checked") === false){
    document.getElementById("schedule-alert-message").innerHTML = "<strong>캘린더 상태를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
    return;
  } else if( $('input[name="schedule-post-state"]').is(":checked") === false){
    document.getElementById("schedule-alert-message").innerHTML = "<strong>캘린더 게시를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
    return;
  } else if(_postStartDate === ""){
    document.getElementById("schedule-alert-message").innerHTML = "<strong>게시일을 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
    return;
  } else if ( _category === 'all'){
      document.getElementById("schedule-alert-message").innerHTML = "<strong>카테고리를 선택해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
      return;
  } else if ( _title === ''){
      document.getElementById("schedule-alert-message").innerHTML = "<strong>제목을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
      return;
  } else if ( _content === ''){
      document.getElementById("schedule-alert-message").innerHTML = "<strong>내용를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('scheduleAlertPopup', true);";
      return;
  } 
  
  if (type === 1){      
      registSchedule();    
  } else {      
      modifySchedule(menu);
  }
}

function cancelRegister(menu,type){
  if (type === 1){
    document.getElementById("schedule-confirm-message").innerHTML = "<strong>등록을 취소하시겠어요?</strong>";
  } else {
    document.getElementById("schedule-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
  }
  
  location.href= "javascript:layerPopup.openPopup('scheduleConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        if (menu ===1){
          location.href='./calendar-list.html';
        } else {
          location.href='./before-accord-calendar-list.html';
          document.getElementById("reasonFormPopupCalendar").style.display = 'none';
        }
    });
}

function setToday(){
  console.log('setToday')
  const today = new Date();
  document.getElementById('schedule-start-date').value = dateToStr(today);
  // document.getElementById('main-story-end-date').value = dateToStr(today);
}

function checkDelete(menu){
  document.getElementById("schedule-confirm-message").innerHTML = "<strong>선택한 캘린더 일정을 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다.</strong>";
  location.href= "javascript:layerPopup.openPopup('scheduleConfirmPopup', true)";
  // reason-OK"
  let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        // if (menu ===1){
        //   deleteSchedule();
        // } else {
          deleteSchedule(menu);
        // }
    });
}

function searchStart(e,type){
  if(e.keyCode === 13){
    if ( type === 1){
      getScheduleAllList(0,20);
    } else  if ( type === 2){
      getBeforeApprovalList(0,20);
    }      
  }
}

function changeStateSchedule(_state,scheduleId = null){
  let url = baseUrl + "/schedule" ;
  let schedule_id = scheduleId === null ?window.sessionStorage.getItem("scheduleId") : scheduleId;
  console.log('schedule_id' + schedule_id);
  let params = {     
      id:  schedule_id,
      state: _state
  }
  
  console.log('changeStateSchedule state' +_state );
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content 
            if(_state === 2){
              document.getElementById("calendar-alert-message").innerHTML = "<strong>비공개 상태로 변경되었어요.</strong>";
            }
            else if(_state === 0){
              document.getElementById("calendar-alert-message").innerHTML = "<strong>공개 상태로 변경되었어요.</strong>";
            } 
            location.href="javascript:layerPopup.openPopup('calendarAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {             
                location.href='./calendar-list.html';             
            });
          
            return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const scheduleRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(scheduleRequest);
}

function setDatePicker(){
  let _startDate = document.getElementById('schedule-start-date').value
  setDatePicker.setDate(_startDate)
}