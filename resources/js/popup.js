document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/notice/popup-list") >= 0) getNoticePopupList(0,20);  
  else if(window.location.pathname.indexOf("/notice/popup-register-modify") >= 0) selectRegistModify();  
  else if(window.location.pathname.indexOf("/notice/popup-detail") >= 0) getNoticePopup();    
});
   
  ///// 공지팝업 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getNoticePopupList(currentPage, size){
    document.getElementById('notice-popup-list_grid').innerHTML = "";
    window.sessionStorage.removeItem("popupId");
    let _keyword = document.getElementById('popup-search').value;
    let popupState = document.getElementById('popup-state');
    let _filterState =  (popupState.options[popupState.selectedIndex]).value === 'all' ? null : (popupState.options[popupState.selectedIndex]).value ;    
    let popupStatus = document.getElementById('popup-status');
    let _filterStatus =  (popupStatus.options[popupStatus.selectedIndex]).value === 'all' ? null : (popupStatus.options[popupStatus.selectedIndex]).value ;    
    let popupType = document.getElementById('popup-type');
    let _filterType =  (popupState.options[popupType.selectedIndex]).value === 'all' ? null : (popupType.options[popupType.selectedIndex]).value ;    
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';
    let url = baseUrl + "/popups?";

    // url += 'category=' + (_filterType === null ? '' : _filterType);
    if ( _filterType !== null){   
      url +='category='+ _filterType;
    } 

    if ( _filterState !== null){   
      
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ||  _filterStatus  === 'finishing' ){
        url +='&state=0,3';
      } else {
        url +='&state=0,2,3';
      }         
    }

    if ( _filterStatus !== null && _filterStatus !== '-'){           
      if  ((_filterState === null ||_filterState === '0,3')){
        url +='&status='+ _filterStatus;
      }      
    } 

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage*size +"&limit=" + size;

    if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ||  _filterStatus  === 'finishing' ))){
      document.getElementById('notice-popup-list_grid').innerHTML  = "<tr><td colspan='9'>데이터가 없습니다.</td></tr>";
      document.getElementById('notice-popup-list-pagination').innerHTML = '';
      document.getElementById('notice-popup-list-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((popup) => {
          let noticePopupGrid = "";
          let noticePopupData = popup.data.popups;
          let _noticePopupDataTotal = popup.data.total;
          let iteration = noticePopupData.length > size ? size :  noticePopupData.length;
          
          for( let i=0;  i < noticePopupData.length ; i++){
            let values = noticePopupData[i];
            let today = new Date();
            // let postState = today.getTime() < (new Date(values.startDate)).getTime() ? '대기중' : today.getTime() >  (new Date(values.endDate)).getTime()? '완료' : '게시중'
            let popupstate = values.state === 2? '비공개':"공개";
            let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
            noticePopupGrid+=`<tr>
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
                                <td><a href="./popup-detail.html?id=${values.id}" class="underline">${values.subject}</a></td>
                                <td>${values.category === 0? '텍스트' : '이미지'}</td>
                                <td>${values.state === 2 ? '비공개' : '공개'}</td>
                                <td>${values.state === 2 ? '-' : _status[values.status]}</td>
                                <td>${dateToStr(strToDate(values.startDate?values.startDate:""))}</td>
                                <td>${dateToStr(strToDate(values.endDate?values.endDate:""))}</td>
                                <td>${dateToStr(strToDate(values.createDate))}</td>
                              <tr>`;
          }

          let numOfPage = Math.ceil((_noticePopupDataTotal-1)/size);
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
                        <a href="#" class="page-link" onclick="getNoticePopupList(0,`+size+`)">First</a>
                      </li>`
          }
          if (currentPage == 0){ 
            paging += `<li class="controller prev disabled">`;
          } else {
            paging += `<li class="controller prev">
                        <a href="#" class="page-link" onclick="getNoticePopupList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                      </li>`
          }
                  
          for ( let page = startOfPage ; page< endOfPage; page++){             
              if (page === (currentPage)){
                paging +=`<li class="paging current">` 
              } else {
                paging +=`<li class="paging">` 
              }                                              
              paging += `<a href="#" class="page-link" onclick="getNoticePopupList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
          }      
          if (((currentPage+1) === numOfPage) || (numOfPage === 0)) { 
            paging += `<li class="controller next disabled">`;
          } else {
            paging += `<li class="controller next">
                        <a href="#" class="page-link" onclick="getNoticePopupList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                      </li>`
          }     
          if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
            paging += `<li class="controller last disabled">`;
          } else {
            paging += `<li class="controller last">
                        <a href="#" class="page-link" onclick="getNoticePopupList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                      </li>`
          }                         
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('notice-popup-list_grid').innerHTML  = noticePopupGrid  === "" ? "<tr><td colspan='9'>데이터가 없습니다.</td></tr>":noticePopupGrid;          
          document.getElementById('notice-popup-list-pagination').innerHTML = paging;
          document.getElementById('notice-popup-list-total').innerHTML = '&nbsp;<strong>' +_noticePopupDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function getNoticePopup(){
    // let _id =window.sessionStorage.getItem("popupId");
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    } 
    else if (_id !==null){
       id = _id;
    }
    console.log('id' + id);

    let url = baseUrl + "/popups?id=" + id;
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((popup) => {
        let noticePopupGrid= "";
        let noticePopupData = popup.data.popups;
        let _noticePopupDataTotal = popup.data.total;
        
          if(noticePopupData.length > 0){
            // let 
            let _noticePopup = noticePopupData[0];
            let _type = _noticePopup.category;
            let _state = _noticePopup.state;          

            console.log('state' + JSON.stringify(_noticePopup));
            let _popuptype = '';
            if (_state === 0 || _state === 3){
              _popuptype = '공개'
              document.getElementById('popup-public-button').style.display = 'none';
            }else if (_state === 2){
              _popuptype = '비공개';
              document.getElementById('popup-private-button').style.display = 'none';
            }

            document.getElementById('notice-popup-state').innerHTML = _popuptype;
            document.getElementById('notice-popup-type').innerHTML = _type === 0 ? "텍스트" : "이미지";
            
            let _popupstate = '';
            if (_state === 2) {
              _popupstate = '-'
            } else if (_state === 0) {
              _popupstate = '즉시 게시';
            } else {
              _popupstate = '예약 게시';
            }

            document.getElementById('notice-popup-post-state').innerHTML =  _popupstate;
            document.getElementById('notice-popup-status').innerHTML =  _noticePopup.state === 2 ? '-' :_status[_noticePopup.status];
            document.getElementById('notice-popup-subject').innerHTML = _noticePopup.subject;
            // document.getElementById('notice-popup-post-startdate').innerHTML = _noticePopup.startDate;
            document.getElementById('notice-popup-post-startdate').innerHTML = dateToStr(strToDate(_noticePopup.startDate?_noticePopup.startDate:""))
            // document.getElementById('notice-popup-post-enddate').innerHTML = _noticePopup.endDate;
            document.getElementById('notice-popup-post-enddate').innerHTML =dateToStr(strToDate(_noticePopup.endDate?_noticePopup.endDate:""))
            // document.getElementById('notice-popup-post-createdate').innerHTML = _noticePopup.createDate;
            document.getElementById('notice-popup-post-createdate').innerHTML = dateToStr(strToDate(_noticePopup.createDate?_noticePopup.createDate:""))
            document.getElementById('notice-popup-link').innerHTML = '<a href="javascript:void(0);" target="_blank" class="underline">_noticePopup.href</a>';
        
            if (_type === 0){
              console.log('_type' + _type); 
              document.getElementById('notice-popup-text-title').innerHTML = _noticePopup.title;
              document.getElementById('notice-popup-text-content').innerHTML = _noticePopup.content?_noticePopup.content.replaceAll('\r\n',"<br />"):"";
              document.getElementById('notice-popup-preview-text-title').innerHTML = '<strong>'+_noticePopup.title+ '</strong>';
              document.getElementById('notice-popup-preview-text-content').innerHTML = _noticePopup.content?_noticePopup.content.replaceAll('\r\n',"<br />"):"";
            
              document.getElementById('notice-popup-image-container').style.display = 'none';
              document.getElementById('notice-popup-image-link-container').style.display = 'none';
              document.getElementById('notice-popup-image-preview').style.display = 'none';
              
            } else {              
              document.getElementById('notice-popup-preview-image-title').innerHTML = '<strong>'+_noticePopup.title+ '</strong>';
              document.getElementById('notice-popup-text-title').innerHTML = '<strong>'+_noticePopup.title+ '</strong>';
              document.getElementById('notice-popup-preview-image-src').src = _noticePopup.file? _noticePopup.file : "";
              document.getElementById('notice-popup-text-container').style.display = 'none';
              document.getElementById('notice-popup-text-preview').style.display = 'none';
              document.getElementById('notice-popup-link').innerHTML = _noticePopup.href? _noticePopup.href : "";
              
              const img =  document.getElementById("popup-image");             
              img.setAttribute('src',_noticePopup.file?_noticePopup.file:"");
            }
            window.sessionStorage.setItem("popupId",_noticePopup.id);
          }
      })                    
    }).catch(error => console.log(error));
  }
  
  function setNoticePopupToday(){ 

    let _isDate = new Date('2024-10-10');

    console.log('_isDate'+ _isDate );
    let _date = new Date()
      var datepicker = new tui.DatePicker('#notice-popup-post-start-wrapper', {
          date: _date,
             input: {
                 element: '#notice-popup-post-startdate',
                 format:  'yyyy-MM-dd HH:mm'
             }
      });
  }
  
  function registNoticePopup(){
    let _type =  parseInt($('input[name=notice-popup-type]:checked').val()) ;

    let _state =  $('input[name=notice-popup-state]:checked').val() === 'private' ? 2 :$('input[name=notice-popup-post-state]:checked').val() === 'immediately' ? 0 : 3;
    // let _postStatus =  $('input[name=notice-popup-post-status]:checked').val() === 'immediately' ? 1 : 2;
    // let _postStartDate = _state === 3 ? document.getElementById('notice-popup-post-startdate').value : null;
    let _postStartDate = document.getElementById('notice-popup-post-startdate').value ;
    let _postEndDate = document.getElementById('notice-popup-post-enddate').value;
    let _subject = document.getElementById('notice-popup-subject').value;
    let _title =_type === 0 ? document.getElementById('notice-popup-text-title').value :  document.getElementById('notice-popup-image-title').value;
    let _content = "";
    let _link = _type === 1 ? document.getElementById('notice-popup-image-link').value : "";
    // let _title = document.getElementById('notice-popup-text-title').value
 
    if (_type === 0){
      _content = document.getElementById('notice-popup-text-content').value;
    } else {
      _link = document.getElementById('notice-popup-link').value;
    }
   
    console.log('텍스트 문구' + _content);
    let url = baseUrl + "/popup/register" ;
    let formData = new FormData();
    formData.append('state', _state);
    formData.append('startDate', _postStartDate);
    formData.append('endDate', _postEndDate);
    formData.append('category', _type);
    formData.append('subject', _subject);
    formData.append('title', _title);
    formData.append('href', _link);
    formData.append('content', _content);
    // formData.append('link', _link);
    if (_type === 1){
      console.log('mainfile' + mainFile.name);
      if(mainFile)formData.append("file", mainFile, mainFile.name);

    }

    console.log('_title' + _title);
    console.log('_content' + _content);
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 201) {  // No content    
            document.getElementById("popup-alert-message").innerHTML = "<strong>등록되었습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true)";    
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./popup-list.html'
            });
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
  
  function getContentUIType(type){ 
    console.log('getContentUIType' + type);
    if (type === 'text'){
      console.log('getContentUIType text');
      document.getElementById('notice-popup-content-image-type').style.display = 'none';
      document.getElementById('notice-popup-content-text-type').style.display = 'block';
      document.getElementById('notice-popup-image-preview').style.display = 'none';
      document.getElementById('notice-popup-text-preview').style.display = 'block';
    } else {
      console.log('getContentUIType image ');
      document.getElementById('notice-popup-content-image-type').style.display = 'block';
      document.getElementById('notice-popup-content-text-type').style.display = 'none';
      document.getElementById('notice-popup-text-preview').style.display = 'none';
      document.getElementById('notice-popup-image-preview').style.display = 'block';
      document.getElementById('imageTypePopup').style.display = 'block';       
    }
  }

  function selectRegistModify(){
    // readyEditor();
    let u = window.location.href;
    let _id =window.sessionStorage.getItem("popupId");
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    } 
    console.log('num' + id)
    if ( id === undefined && _id ===null){
      console.log('등록');
      document.getElementById('notice-popup-regist').style.display = 'block';
      document.getElementById('notice-popup-modify').style.display = 'none';
      // document.getElementById('notice-popup-image-link').style.display = 'none';
      document.getElementById('popup-modify-filezone').style.display = 'none';
      
      getContentUIType('text');
    } else {
      console.log('수정');
      // $('#popup-register-filezone').style.display = "none";
      document.getElementById('popup-register-filezone').style.display = "none";
      document.getElementById('notice-popup-regist').style.display = 'none';
      document.getElementById('popup-register-filezone').style.display = 'none';
      document.getElementById('notice-popup-modify').style.display = 'block';
      // window.sessionStorage.setItem("popupId", id);
      
      let url = baseUrl + "/popups?id=" +window.sessionStorage.getItem("popupId");
  
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((popup) => {
          let noticePopupGrid= "";
          let noticePopupData = popup.data.popups;
          let _noticePopupDataTotal = popup.data.total;
          
            if(noticePopupData.length > 0){
              // let 
              let _noticePopup = noticePopupData[0];
              let _type = _noticePopup.category;
              let _state = _noticePopup.state;           
              console.log('state' + JSON.stringify(_noticePopup));
              let _popuptype = '';
           

              // 유형
              _type === 0 ? $(":radio[name='notice-popup-type'][value=0]").attr('checked', true) :  $(":radio[name='notice-popup-type'][value=1]").attr('checked', true);

              // 상태
              _noticePopup.state === 2 ? $(":radio[name='notice-popup-state'][value='private']").attr('checked', true) :  $(":radio[name='notice-popup-state'][value='public']").attr('checked', true);
              
              /// 게시
              if(_noticePopup.state === 2){
                (new Date(_noticePopup.startDate) <= new Date(_noticePopup.lastDate)) ? 
                  $(":radio[name='notice-popup-post-state'][value='immediately']").attr('checked', true) :
                  $(":radio[name='notice-popup-post-state'][value='reserved']").attr('checked', true);
              }
              else{ 
                _noticePopup.state === 0 ? 
                  $(":radio[name='notice-popup-post-state'][value='immediately']").attr('checked', true) :
                  $(":radio[name='notice-popup-post-state'][value='reserved']").attr('checked', true);
              } 

              document.getElementById('notice-popup-subject').value = _noticePopup.subject;          
              document.getElementById('notice-popup-post-startdate').value = dateToStr(strToDate(_noticePopup.startDate?_noticePopup.startDate:""));
              document.getElementById('notice-popup-post-enddate').value =  dateToStr(strToDate(_noticePopup.endDate?_noticePopup.endDate:""));
             
              console.log('_type' + _type);
              if (_type === 0){
                document.getElementById('notice-popup-content-image-type').style.display = 'none';
                document.getElementById('notice-popup-text-title').value = _noticePopup.title;
                document.getElementById('notice-popup-text-content').value = _noticePopup.content;     
                document.getElementById('notice-popup-text-preview').style.display = 'block';      
                document.getElementById('notice-popup-image-preview').style.display = 'none';     

                document.getElementById('notice-popup-image-title').value = "";    
                document.getElementById('popup-preview-image').src = "" ;   
                document.getElementById('notice-popup-link').value = "";  
              } else {
                document.getElementById('notice-popup-image-title').value = _noticePopup.title;    
                document.getElementById('popup-preview-image').src = _noticePopup.file?_noticePopup.file :"" ;    
                document.getElementById('notice-popup-link').value = _noticePopup.href? _noticePopup.href :""  ;    

                document.getElementById('notice-popup-text-preview').style.display = 'none';   
                document.getElementById('notice-popup-image-preview').style.display = 'block';  
                document.getElementById('notice-popup-content-text-type').style.display = 'none';    
                if(_noticePopup.file) sendFileToDropzone(dropzone02, _noticePopup.file);                 
              }

             

            }
        })                    
      }).catch(error => console.log(error));
    }

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

  function changePopupState(_state,popupId = null){
    console.log('popupId' +popupId);
    let url = baseUrl + "/popup" ;
    let popup_id = popupId === null ? parseInt(window.sessionStorage.getItem("popupId")) : popupId;
    // console.log()
    let params = {     
        id:  popup_id,
        state: _state
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            //  location.href='./popup-list.html'       
            // confirmOK(_state);
            return;
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changePopupStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers, 
      body: JSON.stringify(params),
    });

    post(changePopupStateRequest);
  }

  function changePopupsState(_state){
    console.log('changePopupsState state'+ _state)
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    const stateText = _state === 1? '삭제':_state === 2 ? '비공개' :'공개' ;
    if ( totalCnt === 0 ){
      // alert("선택하신 공지 팝업이 없습니다.");
      // document.getElementById("popup-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("popup-alert-title").innerHTML = "<strong>선택한 공지 팝업이 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else {
      
      if ( type === 1){
        document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업을 삭제하시겠어요? 삭제된 팝업은 복구할 수 없습니다.</strong>';
      } else if ( type === 2){
        document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업상태를 비공개로 변경하시겠어요?</strong>';
      } else {
        document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업상태를 공개로 변경하시겠어요?</strong>';
      }
      // document.getElementById("popup-alert-message").innerHTML = "선택한 항목이 없습니다.";
      location.href= "javascript:layerPopup.openPopup('popupConfirmPopup', true);";
      let confirmOkElement = document.getElementById("confirm-OK");
      let closeElement = document.getElementById("confirm-CLOSE");
      confirmOkElement.addEventListener("click", function (e) {
        // changePopupsState(type,null);
        for(const checkbox of checkboxes){       
          changePopupState(_state,(checkbox.value).replace('/',''));
        }
        if (_state === 1){
          document.getElementById("popup-alert-title").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
        } else if(_state === 2){
          document.getElementById("popup-alert-title").innerHTML ='<strong>비공개로 변경되었습니다.</strong>';
        } else {
          document.getElementById("popup-alert-title").innerHTML ='<strong>공개로 변경되었습니다.</strong>';
        }
        location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);"; 
      });
      closeElement.addEventListener("click", function (e) {
        console.log('popup ');
        location.href='./popup-list.html';
      });

      // for(const checkbox of checkboxes){       
      //     changePopupState(_state,(checkbox.value).replace('/',''));
      // }
      // if (_state === 1){
      //   document.getElementById("popup-alert-title").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
      // } else if(_state === 2){
      //   document.getElementById("popup-alert-title").innerHTML ='<strong>비공개로 변경되었습니다.</strong>';
      // } else {
      //   document.getElementById("popup-alert-title").innerHTML ='<strong>공개로 변경되었습니다.</strong>';
      // }

      // location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);"; 
      // let okElement = document.getElementById("alert-OK");
      // okElement.addEventListener("click", function (e) {
      //   location.href= 'popup-list.html';
      // });
    }
  }

  function modifyPopup(){
    let _popupId =window.sessionStorage.getItem("popupId");
    let _type =  parseInt($('input[name=notice-popup-type]:checked').val()) ;
    let _state =  $('input[name=notice-popup-state]:checked').val() === 'private' ? 2 :$('input[name=notice-popup-post-state]:checked').val() === 'immediately' ? 0 : 3;
    // let _postStatus =  $('input[name=notice-popup-post-status]:checked').val() === 'immediately' ? 1 : 2;
    // let _postStartDate = _state === 3 ? document.getElementById('notice-popup-post-startdate').value : null;
    let _postStartDate = document.getElementById('notice-popup-post-startdate').value ;
    let _postEndDate = document.getElementById('notice-popup-post-enddate').value;
    let _subject = document.getElementById('notice-popup-subject').value;
    let _title =_type === 0 ? document.getElementById('notice-popup-text-title').value :  document.getElementById('notice-popup-image-title').value;
    let _content = "";
    let _link = _type === 1 ? document.getElementById('notice-popup-link').value :"";

    let url = baseUrl + "/popup" ;
    let formData = new FormData();

    if (_type === 1){
      console.log('mainEditFile file====>' + mainEditFile.name);
      console.log('isModifiedFiles====>' + isModifiedFiles);
      if(isModifiedFiles && mainEditFile) formData.append("file", mainEditFile, mainEditFile.name);
    } else {
      _content =  document.getElementById('notice-popup-text-content').value
    }

    console.log('_content' + _content);
    console.log('_title' + _title);
    console.log('_type' + _type);
    formData.append('id', _popupId);
    formData.append('state', _state);
    formData.append('startDate', _postStartDate);
    formData.append('endDate', _postEndDate);
    formData.append('category', _type);
    formData.append('subject', _subject);
    formData.append('title', _title);
    formData.append('content', _content);
    formData.append('href', _link);
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content         
            document.getElementById("popup-alert-message").innerHTML = "<strong>공지 팝업이 수정되었어요.</strong>";
            location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";     
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href="./popup-detail.html?id="+ _popupId;
            });
              // location.href='./popup-list.html'
              return
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

  function setPreview(type){   
    if ( type === 0){
      document.getElementById("popup-preview-title").innerHTML =  '<strong>' + document.getElementById("notice-popup-text-title").value + '</strong>';
      document.getElementById("popup-preview-content").innerHTML = (document.getElementById("notice-popup-text-content").value).replaceAll('\n',"<br />");
    } else{
      document.getElementById("popup-preview-image-title").innerHTML =  '<strong>' + document.getElementById("notice-popup-image-title").value + '</strong>';
      // document.getElementById("popup-preview-image-title").innerHTML =  '<strong>' + document.getElementById("notice-popup-image-title").value + '</strong>';
      // document.getElementById('popup-preview-image').src = mainEditFile.name;
      console.log('mainEditFile' + JSON.stringify(mainEditFile));
    }
  }

  function guideConfirm(type){
    if ( type === 1){  //// 삭제
      // document.getElementById("popup-confirm-title").innerHTML = "<strong>삭제</strong>";
      document.getElementById("popup-confirm-message").innerHTML = "<strong>현재 팝업을 삭제하시겠어요? 삭제된 팝업은 복구할 수 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('popupConfirmPopup', true);";
      // return;   
    } else  if ( type === 2){ 
      // document.getElementById("popup-confirm-title").innerHTML = "<strong>비공개</strong>";
      document.getElementById("popup-confirm-message").innerHTML = "<strong>현재 팝업을 비공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('popupConfirmPopup', true);";
      // return; 
    } else {
      // document.getElementById("popup-confirm-title").innerHTML = "<strong>공개</strong>";
      document.getElementById("popup-confirm-message").innerHTML = "<strong>현재 팝업을 공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('popupConfirmPopup', true);";
    }
 
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      console.log("confirm ok")
      changePopupState(type);
      if (type === 1){
        document.getElementById("popup-alert-message").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
      } else if(type === 2){
        document.getElementById("popup-alert-message").innerHTML ='<strong>비공개로 변경되었습니다.</strong>';
      } else {
        document.getElementById("popup-alert-message").innerHTML ='<strong>공개로 변경되었습니다.</strong>';
      }
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);"; 
      let alertOkElement = document.getElementById("alert-OK");
      alertOkElement.addEventListener("click", function (e) {
        console.log("alert ok")
        location.href= './popup-list.html';
      });
 
    });
  }

  function confirmOK(type){
    if (type === 1){
      document.getElementById("popup-alert-message").innerHTML = "<strong>삭제가 완료되었어요.</strong>";
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";      
    } else if(type === 2){
      document.getElementById("popup-alert-message").innerHTML = "<strong>비공개로 변경되었어요.</strong>";
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
    } else {
      document.getElementById("popup-alert-message").innerHTML = "<strong>공개로 변경되었어요.</strong>";
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
    }
    let okElement = document.getElementById("alert-OK");
    okElement.addEventListener("click", function (e) {
      location.href="./popup-list.html";
    });
  }

  function alertOK(){
    location.href='./popup-list.html'      
  }

  function checkPopupInput(choice){
    let subject = document.getElementById("notice-popup-subject").value;
    let textTitle = document.getElementById("notice-popup-text-title").value;
    let imgTitle = document.getElementById("notice-popup-image-title").value;
    let content = document.getElementById("notice-popup-text-content").value;
    let postStartDate = document.getElementById("notice-popup-post-startdate").value;
    let postEndDate = document.getElementById("notice-popup-post-enddate").value;
    let link = document.getElementById("notice-popup-link").value;
    // let imageFile = mainEditFile;
    let imageFile = mainFile;
    let type= $("input:radio[name='notice-popup-type']:checked").val();
    console.log('link' + link);
    console.log('type' + type);
    console.log('imageFile' + imageFile);
    console.log('imgTitle' + imgTitle);
    console.log('mainEditFile' + imgTitle);
    console.log('state' +$("input:radio[name='notice-popup-state']:checked").val());
    
     if ( subject === ""){
      document.getElementById("popup-alert-message").innerHTML ='<strong>팝업 제목을 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ($('input[name="notice-popup-type"]').is(":checked") === false){
      document.getElementById("popup-alert-message").innerHTML ='<strong>팝업 유형를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ($('input[name="notice-popup-state"]').is(":checked") === false){
      document.getElementById("popup-alert-message").innerHTML ='<strong>팝업 상태를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
     } else if ($('input[name="notice-popup-post-state"]').is(":checked") === false){
      document.getElementById("popup-alert-message").innerHTML ='<strong>팝업 게시를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;      
    } else if ( (textTitle === "") && (type=== '0')){
      document.getElementById("popup-alert-message").innerHTML ='<strong>제목을 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ( content === "" && (type=== '0')){
      document.getElementById("popup-alert-message").innerHTML ='<strong>내용을 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ( imgTitle === "" && (type=== '1')){
      document.getElementById("popup-alert-message").innerHTML ='<strong>제목을 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ( mainEditFile === null && (type=== '1') && choice === 2){
      document.getElementById("popup-alert-message").innerHTML ='<strong>이미지을 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;
    } else if ( mainFile === null && (type=== '1')&& choice === 1 ){
      document.getElementById("popup-alert-message").innerHTML ='<strong>이미지을 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
    } else if ( link === "" && (type=== '1')){
      document.getElementById("popup-alert-message").innerHTML ='<strong>연결 링크를 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
      return;  
    } else {
      existPopup(choice);      
    }   
  }

  function changeAlert(type){
    if ( type === 1){
      document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업을 삭제하시겠어요? 삭제된 팝업은 복구할 수 없습니다.</strong>';
    } else if ( type === 2){
      document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업상태를 비공개로 변경하시겠어요?</strong>';
    } else {
      document.getElementById("popup-confirm-message").innerHTML ='<strong>선택한 팝업상태를 공개로 변경하시겠어요?</strong>';
    }
    // document.getElementById("popup-alert-message").innerHTML = "선택한 항목이 없습니다.";
    location.href= "javascript:layerPopup.openPopup('popupConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    let closeElement = document.getElementById("confirm-CLOSE");
    okElement.addEventListener("click", function (e) {
      changePopupsState(type,null);
    });
    closeElement.addEventListener("click", function (e) {
      console.log('popup ');
      location.href='./popup-list.html';
    });
  }

  function setNoticePopupToday(){
    console.log('setToday')
    const today = new Date();
    document.getElementById('notice-popup-post-startdate').value = dateToStr(today);
    datepicker.setDate(today);
  }

  function existPopup(choice){   
    let _startTime = new Date(document.getElementById("notice-popup-post-startdate").value);
    let _endTime = new Date(document.getElementById("notice-popup-post-enddate").value);
    let url = baseUrl + "/popups?state=0,3&startDate=" + _startTime.toISOString() +  "&endDate=" + _endTime.toISOString();
    console.log('_startTime' + _startTime);
    console.log('_endTime' + _endTime);
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((popup) => {
        let noticePopupGrid= "";
        let noticePopupData = popup.data.popups;
        let _noticePopupDataTotal = popup.data.total;
        
        console.log('choice' + choice);
        console.log('noticePopup' + noticePopupData);
        console.log('_noticePopupDataTotal' + _noticePopupDataTotal);
        if (((_noticePopupDataTotal === 1 ||_noticePopupDataTotal === 0 ) && (choice === 2)) ||((_noticePopupDataTotal === 0) && (choice === 1))){
          if (choice === 1){
            registNoticePopup();
          } else {
            modifyPopup();
          }
        } else {
          document.getElementById("popup-alert-message").innerHTML ='<strong>이미 다른 공지 팝업이 메인 메이지에 게시 중이에요.</strong>';
          document.getElementById("popup-sub-alert-message").innerHTML ='<strong>*공지 팝업은 최대 1개까지 메인페이지에 노출됩니다.</strong>';
          location.href= "javascript:layerPopup.openPopup('popupAlertPopup', true);";
          return;
        }
      
      })                    
    }).catch(error => console.log(error));
  }

  function searchStart(e){
    if(e.keyCode === 13){
      getNoticePopupList(0,20);
    }
  }