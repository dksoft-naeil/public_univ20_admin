document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/notice/notification-list") >= 0) getNotificationList(0,20);  
  else if(window.location.pathname.indexOf("/notice/notification-detail") >= 0) getNotification();  
  else if(window.location.pathname.indexOf("/notice/notification-register-modify") >= 0) selectRegistModify();  
});

  ///// 공지 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getNotificationList(currentPage, size){
    window.sessionStorage.removeItem("notificationId");
    let _keyword = document.getElementById('notification-search').value;
    let notificationState = document.getElementById('notification-state');
    let _filterState =  (notificationState.options[notificationState.selectedIndex]).value === 'all' ? null : (notificationState.options[notificationState.selectedIndex]).value ;    
    console.log('keyword' +_keyword);

    let url = baseUrl + "/notifications?";//+ '&keyword=' + (_keyword === null ? '' : _keyword);
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      url +='&state=0,2,3';
    }
    
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;
    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((notifications) => {
          let notificationsGrid= "";
          let paging= "";
          // console.log('notices' + JSON.stringify(notifications))
          let _notifications = notifications.data.notifications;
          let _notificationsTotal = notifications.data.total? notifications.data.total:0;
          // let numOfPage = _notificationsTotal/size;
          console.log('_notifications' + JSON.stringify(_notifications))
          // console.log('_notifications _notificationsTotal' + JSON.stringify(_notificationsTotal))
          if ( _notificationsTotal > 0 ){
            let iteration = _notificationsTotal > size ? size : _notificationsTotal;
            // for( let i = _notificationsTotal - currentPage*size; iteration > 0 && i > 0; i--, iteration--){
            for( let i=0;  i < _notifications.length ; i++){
              console.log('iteration' + iteration);
              let values = _notifications[i]
              notificationsGrid+=`<tr>
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
                        <td><a href="./notification-detail.html?id=${values.id}" class="underline">${(values.content).replace("[공지]","")}</a></td>                                                 
                        <td>${values.state ===3 ? '예약발송' : '발송완료'}</td>
                        <td>${dateToStr(strToDate(values?.startDate))}</td>
                        <td>${dateToStr(strToDate(values?.createDate))}</td>
                      <tr>`;              
            }
            let numOfPage = Math.ceil((_notificationsTotal-1)/size);
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
                          <a href="#" class="page-link" onclick="getNotificationList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getNotificationList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getNotificationList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getNotificationList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getNotificationList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }                         
            
          }
          document.getElementById('notification-list_grid').innerHTML = notificationsGrid === "" ? "<tr><td colspan='6'>데이터가 없습니다.</td></tr>": notificationsGrid;;
          document.getElementById('notification-list-total').innerHTML = '<strong>' +_notificationsTotal + '</strong>';
          document.getElementById('notification-list-pagination').innerHTML = paging;
        });
    }).catch(error => console.log(error));
  }
  
  function setNotificationToday(){
    let _date = new Date()
    var datepicker = new tui.DatePicker('#notification-wrapper', {
      date: _date,
        input: {
            element: '#notification-date',
            format: 'yyyy-MM-dd HH:mm'
        }
    });
  }

  function getNotification(notificationId = null){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0 && notificationId === null){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
    }else{
      id = notificationId;
    }
    console.log('id' + id);

    let url = baseUrl + "/notifications?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((notification) => {
        // let notificaGrid= "";
        let notificationData = notification.data.notifications;
        let _notificationDataTotal = notification.data.total;
        
        if(notificationData.length > 0){
          let _notificationData = notificationData[0];
          let _state = _notificationData.state;
          let today = new Date();
          let startdate = new Date(_notificationData.startDate);
          console.log('today' +today );
          console.log('startdate' + startdate );
          if ((_state === 0 || _state === 3) && (today > startdate)){
            document.getElementById('notification-state').innerHTML = '발송완료';
          } else if ((_state === 3) && (today < startdate)){
            document.getElementById('notification-state').innerHTML = '예약발송';
          }
          
          document.getElementById('notification-date').innerHTML = dateToStr(strToDate(_notificationData.startDate || ""));
          document.getElementById('notification-createdate').innerHTML = dateToStr(strToDate(_notificationData.createDate || ""));
          document.getElementById('notification-content').innerHTML = (_notificationData.content).replace("[공지]","");
          window.sessionStorage.setItem("notificationId",id)     
        }
      })                    
    }).catch(error => console.log(error));
  }
  
  function registNotification(){
    //let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let _state =  $('input[name=notification-state]:checked').val() === 'immediately' ? 0 : $('input[name=notification-state]:checked').val() === 'reserved' ? 3 : 4;
    let _sendTime = dateToStr(strToDate(document.getElementById('notification-date').value));
    let _content = document.getElementById('notification-content').value;

    console.log('_state' + _state);
    let url = baseUrl + "/notification/register" ;
    let params = {          
        state: _state,
        content: _content,
        startDate: _sendTime
    }

    async function post(request) {
      try {
        await fetch(request).then(response => {
            if(response.status === 201) {  // No content       
              document.getElementById("notification-alert-message").innerHTML = "<strong>등록되었습니다.</strong>";
              location.href= "javascript:layerPopup.openPopup('notificationAlertPopup', true)";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href='./notification-list.html'   
              });
            }
        }); 
      }
      catch (error) {
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

  function deleteNotification(notificationId = null){
    let url = baseUrl + "/notification" ;
    let notification_id = notificationId === null ?window.sessionStorage.getItem("notificationId") : notificationId;
    console.log('notification_id'+notification_id)
    let params = {     
        id:  notification_id,
        state: 1
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            document.getElementById("notification-alert-message").innerHTML = "<strong>삭제가 완료되었습니다.</strong>"
            location.href="javascript:layerPopup.openPopup('notificationAlertPopup', true)";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              // for(const checkbox of checkboxes){
                // deleteNotification((checkbox.value).replace('/',''));
                location.href='./notification-list.html'       
            // }
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

  function deleteNotifications(){
    let url = baseUrl + "/notification" ;

    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;        

    if (totalCnt === 0){
        document.getElementById("notification-alert-message").innerHTML = "<strong>선택한 항목이 없습니다.</strong>"
        location.href="javascript:layerPopup.openPopup('notificationAlertPopup', true)";
        return;
    } else {
        document.getElementById("notification-confirm-message").innerHTML = "<strong>선택한 알림을 삭제하시겠어요? 삭제된 알림은 복구할 수 없습니다.</strong>"
        location.href="javascript:layerPopup.openPopup('notificationConfirmPopup', true)";
    }
    
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){
        deleteNotification((checkbox.value).replace('/',''));
    }
    });

    // console.log('checkboxes' + JSON.stringify(checkboxes));
    // for(const checkbox of checkboxes){
    //     deleteNotification((checkbox.value).replace('/',''));
    // }
  }

  function modifyNotification(){
    let _state =  $('input[name=notification-state]:checked').val() === 'immediately' ? 0 : 3;
    let _sendTime = document.getElementById('notification-date').value;
    let _content = document.getElementById('notification-content').value;
    let _notificationId =window.sessionStorage.getItem("notificationId")
   
    console.log('_status' + _state) ;
    console.log('_sendTime' + _sendTime) ;
    console.log('_content' + _content) ;
  
    let url = baseUrl + "/notification" ;
    let params = {          
        id: parseInt(_notificationId),
        state: _state,
        content: _content.replace("[공지]",""),
        startDate: _sendTime
        // createDate: _sendTime,         
        // lastDate: _sendTime
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
             location.href='./notification-list.html';           
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

  function selectRegistModify(){
    let _notificationId =window.sessionStorage.getItem("notificationId");
    console.log('_notificationId' + _notificationId);
   
    // console.log('num' + id)
    if ( _notificationId === null){
      console.log('등록');
      document.getElementById('notification-regist').style.display = 'block';
      document.getElementById('notification-modify').style.display = 'none';
      document.getElementById('notification-modify-cancel').style.display = 'none';
    } else {
      console.log('수정');
      document.getElementById('notification-regist').style.display = 'none';
      document.getElementById('notification-modify').style.display = 'block';
      document.getElementById('notification-regist-cancel').style.display = 'none';
      
      // getNotification(_notificationId);
      let url = baseUrl + "/notifications?id=" + _notificationId;
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((notification) => {
          // let notificaGrid= "";
          let notificationData = notification.data.notifications;
          let _notificationDataTotal = notification.data.total;
          console.log('notificationData' + JSON.stringify(notificationData));
          if(notificationData.length > 0){
            let _notificationData = notificationData[0];
            let _state = _notificationData.state;
            let today = new Date();
            let startdate = new Date(_notificationData.startDate);
            
            _state === 0 ? $(":radio[name='notification-state'][value='immediately']").attr('checked', true) :  $(":radio[name='notification-state'][value='reserved']").attr('checked', true)

            
            console.log('_notificationData.startDat' + _notificationData.startDate)
            document.getElementById('notification-date').value = dateToStr(strToDate(_notificationData.startDate));
            document.getElementById('notification-content').value =(_notificationData.content).replace("[공지]","");       
          }
        })                    
      }).catch(error => console.log(error));

      // window.sessionStorage.setItem("notification-id", id);
    }
  }
  
  function cancelNotification(type){

    if (type === 1){
      document.getElementById("notification-confirm-message").innerHTML ='<strong>등록을 취소하시겠어요?</strong>';     
    } else {
      document.getElementById("notification-confirm-message").innerHTML ='<strong>수정을 취소하시겠어요?</strong>';     
    }
    location.href= "javascript:layerPopup.openPopup('notificationConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href="./notification-list.html";
    })   
  }

  function alertOK(){
      location.href="./notification-list.html";
  }

  function checkNotificationInput(type){
    let _notifictionDate = document.getElementById("notification-date").value;
    let _notifictionContent = document.getElementById("notification-content").value;

    if ($('input[name="notification-state"]').is(":checked") === false){
      document.getElementById("notification-alert-message").innerHTML ='<strong>발송상태를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('notificationAlertPopup', true);";
      return;
    } else if(_notifictionDate === ""){
      // adviceAlertMessage = "발송시간을 지정해 주세요."
      document.getElementById("notification-alert-message").innerHTML = "<strong>발송시간을 지정해 주세요</strong>";
      location.href="javascript:layerPopup.openPopup('notificationAlertPopup', true)";  
      return
    } else if (_notifictionContent === ""){
      // adviceAlertMessage = "내용을 입력해 주세요."
      document.getElementById("notification-alert-message").innerHTML = "<strong>내용을 입력해 주세요.</strong>";
      location.href="javascript:layerPopup.openPopup('notificationAlertPopup', true)";
      return
    } else {
      if (type === 1){
        console.log('등록');
        registNotification();
      }else {
        console.log('수정');
        modifyNotification();
      }
    }
  }

  function checkDetail(){
    document.getElementById("notification-confirm-message").innerHTML = "<strong>삭제하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('notificationConfirmPopup', true)";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      deleteNotification();
    })
  }

  function searchStart(e){
    if(e.keyCode === 13){
      getNotificationList(0,20);
    }
  }