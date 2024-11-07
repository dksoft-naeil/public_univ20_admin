///  voice 전체기사 ////////////////////////////////////////////////////////////////////////////////////   
document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/voice/all-article-list") >= 0) getVoiceAllList(0,20);
  else if(window.location.pathname.indexOf("/voice/all-article-editing-completed-detail.html") >= 0) getVoiceDraft();
  else if(window.location.pathname.indexOf("/voice/all-article-editing-ask-detail.html") >= 0) getAskArticle();
  else if(window.location.pathname.indexOf("/voice/all-article-editing-publish-detail.html") >= 0) getPublishArticle();
  else if(window.location.pathname.indexOf("/voice/all-article-editing-publish-waiting-modify.html") >= 0) getEditingCompletedArticle();
  else if(window.location.pathname.indexOf("/voice/all-article-editing-publish-ongoing-modify.html") >= 0) getVoicePublishModify();

  else if(window.location.pathname.indexOf("/voice/editing-guide") >= 0) getEditingArticle();
  else if(window.location.pathname.indexOf("/voice/editing-ask-article-detail") >= 0) getAskArticle();  
  else if(window.location.pathname.indexOf("/voice/editing-completed-article-list") >= 0) getVoiceDraftList(0,20); 
  else if(window.location.pathname.indexOf("/voice/editing-completed-article-detail") >= 0) getVoiceDraft();
  else if(window.location.pathname.indexOf("/voice/editing-mentoring-article-list") >= 0) getVoiceMentoringList(0,20);  
  else if(window.location.pathname.indexOf("/voice/editing-publish-article-detail.html") >= 0) getPublishArticle();
  // else if(window.location.pathname.indexOf("/voice/editing-publish-article-detail") >= 0) getPublishArticle(); 
  else if(window.location.pathname.indexOf("/voice/publish-article-detail") >= 0) getPublishArticle(); 
  else if(window.location.pathname.indexOf("/voice/publish-article-list") >= 0) getVoicePublishList(0,20); 
  else if(window.location.pathname.indexOf("/voice/publish-article-modify") >= 0) getVoicePublishModify(); 
  else if(window.location.pathname.indexOf("/voice/topic-of-month-detail") >= 0) getVoiceSubject(); 
  else if(window.location.pathname.indexOf("/voice/topic-of-month-list") >= 0) getVoiceSubjectList(0,20); 
  else if(window.location.pathname.indexOf("/voice/topic-of-month-regist-modify") >= 0) selectRegistModify(); 
  else if(window.location.pathname.indexOf("/voice/writing-completed-list") >= 0) getVoiceDraftList(0,20); 
  else if(window.location.pathname.indexOf("/voice/editing-mentoring-completed-article-modify") >= 0) getEditingCompletedArticle();
});

function getVoiceAllList(currentPage, size, filterCategory=null, filterStatus=null){       
  document.getElementById('voice-article_grid').innerHTML = ""
  document.getElementById('checkAll').checked = false;
  window.sessionStorage.removeItem('voiceId');
  
  let _state={}; _state[0] = '첨삭완료'; _state[2] = '첨삭완료'; _state[3] = '첨삭완료';  _state[5] = '작성완료'; _state[6] = '수정(첨삭)제안'; _state[7] = '첨삭등록';  _state[8] = '수정(첨삭)제안';  _state[9] = '첨삭등록';  _state[10] = '첨삭요청';  _state[11] = '첨삭등록'; 
  
  let voiceAllState = document.getElementById('voice-all-state');
  let _filterState =  (voiceAllState.options[voiceAllState.selectedIndex]).value === 'all' ? null : (voiceAllState.options[voiceAllState.selectedIndex]).value ;    
  let voiceAllYear = document.getElementById('voice-year');
  let _filterYear =  (voiceAllYear.options[voiceAllYear.selectedIndex]).value === 'all' ? null : (voiceAllYear.options[voiceAllYear.selectedIndex]).value ;    
  let voiceAllMonth = document.getElementById('voice-month');
  let _filterMonth =  (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value === 'all' ? null : (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value ;    
  let _keyword = document.getElementById('voice-all-search').value;

  let url = baseUrl + "/voices?" ;
  if ( _filterState !== null){   
    url +='&state='+ _filterState;
  } else {
    url +='&state=0,2,3,5,6,7,8,9,10,11';
  }

  let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
  let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
  let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
  url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voices) => {
      console.log('voices' + JSON.stringify(voices.data));
      let voicesGrid= "";
      let voicesData = voices.data.voices;
      let _voicesDataTotal = voices.data.total;
      let numOfPage = Math.ceil(_voicesDataTotal/size);

      for( let i=0;  i < voicesData.length ; i++){
        let values = voicesData[i];
        
        let href = "";

        // 작성 완료 기사
        if(values.state === 5 ||  values.state === 6 || values.state === 8) 
          href = `"./all-article-editing-completed-detail.html?id=${values.id}"`;
        // 수정(첨삭) 중 기사
        else if(values.state === 7 || values.state === 9 || values.state === 10 || values.state === 11) 
          href = `"./all-article-editing-ask-detail.html?id=${values.id}"`;
        // 발행 기사
        else if(values.state === 0 || values.state === 2 || (values.state === 3)) 
          href = `"./all-article-editing-publish-detail.html?id=${values.id}"`;


        voicesGrid+=`<tr>
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
                      <td><a href=${href}  class="underline">${values.title}</a></td>
                      <td>${replacestr(values.name)}</a></td>          
                      <td>${_state[values.state]}</td>                      
                      <td>${(values.state === 3 || values.state ===0) ? dateToStr(strToDate(values.startDate)):""}</td>
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
                    <a href="#" class="page-link" onclick="getVoiceAllList(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getVoiceAllList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getVoiceAllList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getVoiceAllList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getVoiceAllList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
                
      document.getElementById('voice-article_grid').innerHTML  = voicesGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": voicesGrid;       
      document.getElementById('voice-article-pagination').innerHTML = paging;
      document.getElementById('voice-article-total').innerHTML = '&nbsp;<strong>' + _voicesDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function deleteVoiceAll(voiceAllId = null){
  let reason = document.getElementById('voice-all-reason');
  let _reason =  (reason.options[reason.selectedIndex]).value === 'all' ? null : (reason.options[reason.selectedIndex]).value ;   
  if ( parseInt(_reason) !== 3){
    _reasonMessage = reason.options[_reason].text;
  } else {
    _reasonMessage = document.getElementById("voice-all-etc-reason").value;
  }

  console.log('_reasonMessage' +_reasonMessage );
  let url = baseUrl + "/voice" ;
  let voiceAll_Id = voiceAllId === null ?window.sessionStorage.getItem("voiceAllId") : voiceAllId;
  console.log('_reasonMessage'+_reasonMessage);
  let params = {     
      id:  voiceAll_Id,
      state: 1,
      reason:_reasonMessage
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
              // document.getElementById("deleteReasonPopup").style.display= 'none';
              document.getElementById("voice-alert-message").innerHTML = "<strong>삭제가 완료되었어요.</strong>";
              location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";    
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href='./all-article-list.html';
              })
              return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const voiceallRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(voiceallRequest);
}

function changeVoiceAllList(state){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  const totalCnt = checkboxes.length;    
  console.log('checkboxes' + JSON.stringify(checkboxes));

  if ( totalCnt === 0 ){
    // document.getElementById("publish-alert-message").innerHTML ='<strong>' +stateText+'</strong>';
    document.getElementById("voice-alert-message").innerHTML = "<strong>선택된 기사가 없습니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";      
    return;
  }
  else {
    // document.getElementById("magazine-confirm-title").innerHTML ='<strong>' +stateText+'</strong>';
    // document.getElementById("voice-delete-message").innerHTML = '<strong>선택한 기사를 삭제하시겠어요? 삭제된 기사는 복구할 수 없습니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('deleteReasonPopup', true);";   
    selectReason('voice-all-reason','voice-all-etc-reason');
    let reasonOkElement = document.getElementById("delete-OK");
    reasonOkElement.addEventListener("click", function (e) {
      console.log('changeVoiceAllList 삭제');
      let deleteReason = document.getElementById("voice-all-reason");
      let deleteReasonEtc = document.getElementById("voice-all-etc-reason").value;
      console.log((deleteReason.options[deleteReason.selectedIndex]).value);
      if((deleteReason.options[deleteReason.selectedIndex]).value === 'all'){
        // document.getElementById("voice-alert-message").innerHTML ='<strong>삭제 사유를 선택해 주세요.</strong>';
        // location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);"; 
        document.getElementById("voice-confirm-message").innerHTML ='<strong>삭제 사유를 선택해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('voiceConfirmPopup', true);"; 
        return;
      } else if ((deleteReason.options[deleteReason.selectedIndex]).value === '3' && (deleteReasonEtc === "")){
        document.getElementById("voice-alert-message").innerHTML ='<strong>기타 이유를 입력해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);"; 
        return;
      }

    // let okElement = document.getElementById("confirm-OK");
    // okElement.addEventListener("click", function (e) {     
      for(const checkbox of checkboxes){           
        deleteVoiceAll((checkbox.value).replace('/',''))
      }
    })      
    // })
  }
}
///  voice 발행기사 //////////////////////////////////////////////////////////////////////////////////// 
function getVoicePublishList(currentPage, size, filterCategory=null, filterStatus=null){       
  document.getElementById('voice-publish_grid').innerHTML = ""
  document.getElementById('checkAll').checked = false;

  let voiceAllState = document.getElementById('voice-publish-state');
  let _filterState =  (voiceAllState.options[voiceAllState.selectedIndex]).value === 'all' ? null : (voiceAllState.options[voiceAllState.selectedIndex]).value ;       
  let voiceAllYear = document.getElementById('voice-year');
  let _filterYear =  (voiceAllYear.options[voiceAllYear.selectedIndex]).value === 'all' ? null : (voiceAllYear.options[voiceAllYear.selectedIndex]).value ;    
  let voiceAllMonth = document.getElementById('voice-month');
  let _filterMonth =  (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value === 'all' ? null : (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value ;    
  let _keyword = document.getElementById('voice-publish-searh').value;
  ///0:open, 1:delete, 2:private 3:reserved
 
  let url = baseUrl + "/voices?offset="+ currentPage+"&limit=" + size ;
  console.log('_filterState' + _filterState);
  if ( _filterState !== null){   
    if (parseInt(_filterState) === 0){
      url +='&state=0,3&status=ongoing';
    } else {
      url +='&state=2';
    }   
  } else {
    url +='&state=0,2,3&startDate=' + new Date().toISOString()
  }
  let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
  let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
  let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
  url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voicesPublish) => {
      console.log('voices' + JSON.stringify(voicesPublish.data));
      let voicesPublishGrid= "";
      let voicesPublishData = voicesPublish.data.voices;
      let voicesPublishDataTotal = voicesPublish.data.total;
      let numOfPage = Math.ceil(voicesPublishDataTotal/size);

      for( let i=0;  i < voicesPublishData.length ; i++){
        let values = voicesPublishData[i]
        voicesPublishGrid+=`<tr>
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
                              <td><a href="./publish-article-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                              <td>${replacestr(values.name)}</a></td>
                              <td>${values.state === 2 ? '비공개' : '공개' }</td>                      
                              <td>${values.startDate? dateToStr(strToDate(values.startDate)) : ""}</td>
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
                    <a href="#" class="page-link" onclick="getCommunityList(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getCommunityList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getCommunityList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getCommunityList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getCommunityList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
                
      document.getElementById('voice-publish_grid').innerHTML  = voicesPublishGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": voicesPublishGrid;          
      document.getElementById('voice-publish-pagination').innerHTML = paging;
      document.getElementById('voice-publish-total').innerHTML = '&nbsp;<strong>' + voicesPublishDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function deleteVoicePublish(voiceId = null){
  // let reason = document.getElementById('voice-all-reason');
  // let _reason =  (reason.options[reason.selectedIndex]).value === 'all' ? null : (reason.options[reason.selectedIndex]).value ;   
  // if ( parseInt(_reason) !== 3){
  //   _reasonMessage = reason.options[_reason].text;
  // } else {
  //   _reasonMessage = document.getElementById("voice-all-etc-reason").value;
  // }

  let url = baseUrl + "/voice" ;
  let voice_Id = voiceId === null ?window.sessionStorage.getItem("voiceId") : voiceId;
  // console.log('_reasonMessage'+_reasonMessage);
  let params = {     
      id:  voice_Id,
      state: 1
      // reason:_reasonMessage
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
              // location.href='./all-article-list.html';              
              return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const voiceallRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

  post(voiceallRequest);
}

function changeVoiceState(_state, voiceId = null){
  console.log('voiceId' +voiceId);
  let url = baseUrl + "/voice" ;
  let _voiceId = voiceId === null ? parseInt(window.sessionStorage.getItem("voiceId")) : voiceId;
  // console.log()
  let params = {     
      id:  _voiceId,
      state: _state
  }

  async function post(request) {
  try {
     await fetch(request).then(response => {
        if(response.status === 200) {  // No content       
           //location.href='./publish-article-list.html';       
           return
        }
     }) 

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const changeVoiceStateRequest = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

  post(changeVoiceStateRequest);
}

function changeVoicePublishList(state){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  console.log('checkboxes' + JSON.stringify(checkboxes));
  const totalCnt = checkboxes.length;     
  // if ( totalCnt === 0 ){
  //   // document.getElementById("publish-alert-message").innerHTML ='<strong>' +stateText+'</strong>';
  //   document.getElementById("publish-alert-message").innerHTML = "<strong>선택한 발행 기사가 없습니다.</strong>";
  //   location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
  //   return;
  // }
  // else {
    for(const checkbox of checkboxes){
      console.log('checkbox.value' + (checkbox.value).replace('/',''));
      if (state === 1){
        deleteVoicePublish((checkbox.value).replace('/',''));
      } else {
        changeVoiceState(state,(checkbox.value).replace('/',''))
      }
    }

    if (state === 0){
      document.getElementById("publish-alert-message").innerHTML = "<strong>공개로 변경되었습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
      let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
        location.href = "./publish-article-list.html"
      });
    } else if (state === 1){
      document.getElementById("publish-alert-message").innerHTML = "<strong>삭제가 완료되었습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
      let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
        location.href = "./publish-article-list.html"
      });
    } else {
      document.getElementById("publish-alert-message").innerHTML = "<strong>비공개로 변경되었습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
      let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
        location.href = "./publish-article-list.html"
      });
    }

  // }
}

function getPublishArticle(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  console.log('id' + id);

  let url = baseUrl + "/voices?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {
      let voiceData = voice.data.voices;
      let _voiceData = voiceData[0];
      let _voiceState = _voiceData.state;
      let _voiceStartDate = _voiceData.startDate;
      let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
      let today = new Date();
      // let startdate = new Date(_communityData.startDate);
      console.log('today ' + today );

      if ( _voiceState === 5 ||  _voiceState === 6 ||  _voiceState === 8|| _voiceState === 7 || _voiceState === 9 ||  _voiceState === 10 ||  _voiceState === 11  ){
        location.href='./all-article-list.html'
        return;
      }
      ///기본 내용 
      document.getElementById('voice-state').innerHTML = '발행완료';
      if (_voiceData.state  === 2){
        document.getElementById('voice-post-state').innerHTML = '비공개';
        document.getElementById('voice-post-status').innerHTML = '-';
        document.getElementById('publish-private').style.display = 'none';
      } else {
        document.getElementById('voice-post-state').innerHTML = '공개';
        document.getElementById('voice-post-status').innerHTML = _status[_voiceData.status];
        document.getElementById('publish-public').style.display = 'none';
      }

      document.getElementById('voice-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));
      document.getElementById('voice-show-count').innerHTML = _voiceData.showCount;
      document.getElementById('voice-like-count').innerHTML = _voiceData.likeCount;
      document.getElementById('voice-accept-date').innerHTML = dateToStr(strToDate(_voiceData.startDate));
      document.getElementById('voice-name').innerHTML = _voiceData.name;
      ///작성자
      document.getElementById('voice-name').innerHTML = _voiceData.name;
      document.getElementById('voice-nickname').innerHTML = _voiceData.nickname;
      document.getElementById('voice-email').innerHTML = _voiceData.email;
      document.getElementById('voice-mobile').innerHTML = _voiceData.mobile;
      document.getElementById('voice-right').innerHTML = _voiceData.schoolId?'대학생인증회원('+_voiceData.schoolName+')':"일반회원";
      
      ///주제            
      document.getElementById('topic-of-month-title').innerHTML = _voiceData.subject.title;
      document.getElementById('topic-of-month-keyword').innerHTML = _voiceData.subject.words;
      document.getElementById('topic-of-month-detail').innerHTML = _voiceData.subject.wordsInfo;
      document.getElementById('topic-of-month-create-date').innerHTML = _voiceData.subject.createDate;

      ///대표 이미지
      document.getElementById('voice-main-image').src = _voiceData.file;

      document.getElementById('voice-title').innerHTML = _voiceData.title;
      document.getElementById('voice-summary').innerHTML = _voiceData.summary;
      document.getElementById('voice-content').innerHTML = _voiceData.content;

      let tagArray = (_voiceData.tags)?.split(',');    
      console.log('tagArray' + tagArray);
      if ( tagArray !== undefined){
        document.getElementById('voice-article-tag1').innerHTML = tagArray[0] === undefined ? "" : tagArray[0] ;                   
        document.getElementById('voice-article-tag2').innerHTML = tagArray[1] === undefined ? "" : tagArray[1] ;          
        document.getElementById('voice-article-tag3').innerHTML = tagArray[2] === undefined ? "" : tagArray[2] ;              
      }
      // console.log('_voiceData.state' + _voiceData.state);
      if (_voiceData.state === 3 && _voiceData.status === 'waiting'){
        document.getElementById("publish-ongoing").style.display = "none";
        // document.getElementById("editing-mentoring").style.display = "none";
      } else if ((_voiceData.state === 3 && _voiceData.status === 'ongoing') || _voiceData.state === 0 || _voiceData.state === 2){
        document.getElementById("publish-waiting").style.display = "none";
      }
      window.sessionStorage.setItem("voiceId",_voiceData.id);
      getPublishArticleComment(0,20);
    
    })                    
  }).catch(error => console.log(error));
}

function getPublishArticleComment(currentPage, size){
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voice-comments?state=0&voiceId=" + _voiceId;
  
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voicesComment) => {
      // console.log('voices' + JSON.stringify(voicesComment.data));
      let voicesCommentGrid= "";
      let voicesCommentData = voicesComment.data.comments;
      let voicesCommentDataTotal = voicesComment.data.total;
      let numOfPage = Math.ceil(voicesCommentDataTotal/size);

      for( let i=0;  i < voicesCommentData.length ; i++){
        let values = voicesCommentData[i];
        let href = "";
      
        voicesCommentGrid+=`<tr>       
            <td>${values.id}</td>                                           
            <td>${values.content}</td>
            <td>${values.likeCount}</td>
            <td>${values.name}</td>
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
                    <a href="#" class="page-link" onclick="getPublishArticleComment(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getPublishArticleComment(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getPublishArticleComment(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getPublishArticleComment(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getPublishArticleComment(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
                
      // console.log('noticeGrid' + noticeGrid)
      document.getElementById('publish-comment_grid').innerHTML  = voicesCommentGrid;          
      document.getElementById('publish-comment-pagination').innerHTML = paging;
      document.getElementById('publish-comment-total').innerHTML = '&nbsp;<strong>' + voicesCommentDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function getVoicePublishModify(){ 
  let _voiceId = window.sessionStorage.getItem("voiceId");

  let url = baseUrl + "/voices?id=" + _voiceId;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {
      let voiceData = voice.data.voices;
      let _voiceData = voiceData[0];
      let today = new Date();
      // let startdate = new Date(_communityData.startDate);
      console.log('today' +today );

      ///기본 내용
      if(_voiceData.state === 0 || _voiceData.state === 3) $(":radio[name='publish-article-state'][value='public']").prop('checked', true) 
      else $(":radio[name='publish-article-state'][value='private']").prop('checked', true);
      
      ///주제                    
      document.getElementById('publish-article-title').value = _voiceData.title;
      document.getElementById('publish-article-summary').value = _voiceData.summary;
      document.getElementById('fixUrl').value = _voiceData.url1;
      document.getElementById('fixUrl02').value = _voiceData.url2;

      //// preview 
      document.getElementById('publish-preview-category').innerHTML = _voiceData.category;
      document.getElementById('publish-preview-name').innerHTML = _voiceData.name;
      document.getElementById('publish-preview-email').innerHTML = _voiceData.email;
      document.getElementById('publish-preview-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));
      document.getElementById('publish-preview-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));
      document.getElementById('publish-preview-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));

      editorInstance.html.insert(_voiceData.content);
      
      sendFileToDropzone(dropzone02, _voiceData.file);
      let tagArray = (_voiceData.tags)?.split(',');    
      console.log('tagArray' + tagArray);
      if ( tagArray !== undefined){
        document.getElementById('publish-article-tag1').value = tagArray[0] === undefined ? "" : tagArray[0] ;                   
        document.getElementById('publish-article-tag2').value = tagArray[1] === undefined ? "" : tagArray[1] ;          
        document.getElementById('publish-article-tag3').value = tagArray[2] === undefined ? "" : tagArray[2] ;              
      }
      console.log('_voiceData.state' + _voiceData.state);
      // if (_voiceData.state === 5){
      //   document.getElementById("editing-propose").style.display = "block";
      //   document.getElementById("editing-mentoring").style.display = "none";
      // } else if (_voiceData.state === 6){
      //   document.getElementById("editing-propose").style.display = "none";
      //   document.getElementById("editing-mentoring").style.display = "block";
      // }

      getPublishArticleCommentModify(0,20);
      window.sessionStorage.setItem("voiceId",_voiceData.id);
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

function getPublishArticleCommentModify(currentPage, size){
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voice-comments?state=0&voiceId=" + _voiceId;
  
  fetch(url, headers.json_headers)
  .then((response) => { 
    checkError(response.status);    
    response.json().then((voicesComment) => {
    // console.log('voices' + JSON.stringify(voicesComment.data));
    let voicesCommentGrid= "";
    let voicesCommentData = voicesComment.data.comments;
    let voicesCommentDataTotal = voicesComment.data.total;
    let numOfPage = Math.ceil(voicesCommentDataTotal/size);

    for( let i=0;  i < voicesCommentData.length ; i++){
    let values = voicesCommentData[i];
    let href = "";
    
      voicesCommentGrid+=`<tr>  
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
                          <td>${values.content}</td>
                          <td>${values.likeCount}</td>
                          <td>${values.name}</td>
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
                  <a href="#" class="page-link" onclick="getPublishArticleCommentModify(0,`+size+`)">First</a>
                </li>`
    }
    if (currentPage == 0){ 
      paging += `<li class="controller prev disabled">`;
    } else {
      paging += `<li class="controller prev">
                  <a href="#" class="page-link" onclick="getPublishArticleCommentModify(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                </li>`
    }
            
    for ( let page = startOfPage ; page< endOfPage; page++){             
        if (page === (currentPage)){
          paging +=`<li class="paging current">` 
        } else {
          paging +=`<li class="paging">` 
        }                                              
        paging += `<a href="#" class="page-link" onclick="getPublishArticleCommentModify(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
    }      

    if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
      paging += `<li class="controller next disabled">`;
    } else {
      paging += `<li class="controller next">
                  <a href="#" class="page-link" onclick="getPublishArticleCommentModify(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                </li>`
    }     
    if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
      paging += `<li class="controller last disabled">`;
    } else {
      paging += `<li class="controller last">
                  <a href="#" class="page-link" onclick="getPublishArticleCommentModify(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                </li>`
    }       
              
    // console.log('noticeGrid' + noticeGrid)
    document.getElementById('publish-comment_grid').innerHTML  = voicesCommentGrid;          
    document.getElementById('publish-comment-pagination').innerHTML = paging;
    document.getElementById('publish-comment-total').innerHTML = '&nbsp;<strong>' + voicesCommentDataTotal + '</strong>&nbsp;';
  });
  }).catch(error => console.log(error));
}

function checkModify(){
  if($('input[name="publish-article-state"]').is(":checked") === false){
    document.getElementById("publish-alert-message").innerHTML = "<strong>기사 공개를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
    return;
  }
  publishVoice();
}

function checkPublishVocie(){
  // https://dev.univ20.com/home/html/views/magazine/feature.html?id=5
  // https://dev.univ20.com/home/html/views/magazine/news.html?id=20&category=2
  // https://dev.univ20.com/home/html/views/voice/detail.html?id=48
  let _fixUrl = document.getElementById('fixUrl').value;
  let _fixUrl02 = document.getElementById('fixUrl02').value;
  console.log('_fixUrl' + _fixUrl);
  console.log('_fixUrl02'+_fixUrl02);

  if ( _fixUrl !== ""  && !_fixUrl.includes('/html/views/voice/detail.html?id=')){
    document.getElementById("publish-alert-message").innerHTML = "<strong>비슷한 기사URL을 확인해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
    return;
  } else if (_fixUrl02 !== ""  && !_fixUrl02.includes('/html/views/voice/detail.html?id=')){
    document.getElementById("publish-alert-message").innerHTML = "<strong>비슷한 기사URL2을 확인해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
    return;
  } else {
    publishVoice()
    console.log('success');
  } 
}
function publishVoice(){  
  console.log('publishVoice')
  let voiceId = window.sessionStorage.getItem("voiceId");

  let url = baseUrl + "/voice" ;
     
  let _tag1 = document.getElementById("publish-article-tag1").value;
  let _tag2 = document.getElementById("publish-article-tag2").value;
  let _tag3 = document.getElementById("publish-article-tag3").value;    
  let _title = document.getElementById("publish-article-title").value;
  let _summary = document.getElementById("publish-article-summary").value; 
  let _fixUrl = document.getElementById("fixUrl").value;
  let _fixUrl02 = document.getElementById("fixUrl02").value;

  let _tag = _tag1 + ',' + _tag2 + ',' +  _tag3 ;   
  let _content = editorInstance.html.get("editor");
  let formData = new FormData();
  formData.append('id', voiceId);
  formData.append('state', $('input[name=publish-article-state]:checked').val() === 'private' ? 2 : 0);
  // formData.append('state',  2);
  formData.append('title', _title);
  formData.append('summary', _summary);  
  formData.append('content', _content);  
  formData.append('tags', _tag);
  formData.append('url1', _fixUrl);
  formData.append('url2', _fixUrl02);

  if(isModifiedFiles){
    console.log('mainFile name' + mainEditFile?.name);
    if(mainEditFile)formData.append("files", mainEditFile, mainEditFile.name);
  }

  async function post(request) {
   try {
       await fetch(request).then(response => {
           if(response.status === 200) {  // No content                    
              console.log('voice 첨삭');
               document.getElementById("publish-alert-message").innerHTML = "<strong>발행기사가 수정되었습니다.</strong>";
               location.href="javascript:layerPopup.openPopup('publishAlertPopup', true)";
               let okElement = document.getElementById("alert-OK");
               okElement.addEventListener("click", function (e) {
                 location.href = './publish-article-detail.html?id=' + voiceId;
               });
              
               return
           }
       }) 

       } catch (error) {
       console.error("Error:", error);
       }
   }

   const voiceRequest = new Request(url, {
       method: "POST",
       headers: headers.form_headers.headers,
       body:formData,
   });

  post(voiceRequest);
}

function checkPublishItem(type){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  console.log('checkboxes' + JSON.stringify(checkboxes));
  const totalCnt = checkboxes.length;     

  if ( totalCnt === 0 ){
    document.getElementById("publish-alert-message").innerHTML = "<strong>선택된 발행기사가 없습니다.</strong>";
    location.href="javascript:layerPopup.openPopup('publishAlertPopup', true)";
    return;
    // let okElement = document.getElementById("alert-OK");
    // okElement.addEventListener("click", function (e) {
    //   location.href = 'publish-article-detail.html?id=' + _vocieId;
    // });
  }
  if ( type === 0){
    console.log('공개')
    document.getElementById("publish-confirm-message").innerHTML ="<strong>선택한 기사 상태를 공개로 변경하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('publishConfirmPopup', true)";
    // return;
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      changeVoicePublishList(0);
    });
    // changeVoicePublishList(1);
  } else if ( type === 1){
    console.log('삭제')
    document.getElementById("publish-confirm-message").innerHTML = "<strong>선택된 발행기사가 삭제하시겠습니까? 삭제된 기사는 복구할 수 없습니다.</strong>";
    location.href="javascript:layerPopup.openPopup('publishConfirmPopup', true)";
    // return;
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      changeVoicePublishList(1);
    });
    // changeVoicePublishList(1);
  } else if ( type === 2){
    console.log('비공개')
    document.getElementById("publish-confirm-message").innerHTML = "<strong>선택한 기사 상태를 비공개로 변경하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('publishConfirmPopup', true)";
    // return;
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      changeVoicePublishList(2);
    });
  }
  
}

///  voice 첨식멘토링 기사 //////////////////////////////////////////////////////////////////////////////////// 
function getVoiceMentoringList(currentPage, size, type=0){       
  document.getElementById('voice-mentoring_grid').innerHTML = ""

  let voiceAllYear = document.getElementById('voice-year');
  let _filterYear =  (voiceAllYear.options[voiceAllYear.selectedIndex]).value === 'all' ? null : (voiceAllYear.options[voiceAllYear.selectedIndex]).value ;    
  let voiceAllMonth = document.getElementById('voice-month');
  let _filterMonth =  (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value === 'all' ? null : (voiceAllMonth.options[voiceAllMonth.selectedIndex]).value ;    

  let _state = {}; _state[3] = '첨삭완료';  _state[7] = '첨삭등록';  _state[9] = '첨삭등록'; _state[10] = '첨삭요청'; _state[11] = '첨삭등록';
  let voiceMentoringState = document.getElementById('voice-mentoring-state');
  let _filterState =  (voiceMentoringState.options[voiceMentoringState.selectedIndex]).value === 'all' ? null : (voiceMentoringState.options[voiceMentoringState.selectedIndex]).value ;    
  
  
  // 이 코드 뭐징?
  let domReferrer = document.referrer;    
  console.log(domReferrer.indexOf('dashboard'))
  if ( domReferrer.indexOf('dashboard') !== -1 && (type === 0)){
    console.log('dashboard에서 오면');
    _filterState = '10';
    $('#voice-mentoring-state option[value=10]').attr('selected', true);
  }
  
  let _keyword = document.getElementById('voice-mentoring-search').value;
 
  let url = baseUrl + "/voices?";
  if ( _filterState !== null){   
    if( _filterState=== '2,3'){
      url +='&state=2,3&status=waiting';
    } else{
      url +='&state='+ _filterState;
    }       
  } else {
    url +='&state=2,3,7,9,10,11&status=waiting';
  }
  let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
  let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
  let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
  url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voicesMentoring) => {
      console.log('voices' + JSON.stringify(voicesMentoring.data));
      let voicesMentoringGrid= "";
      let voicesMentoringData = voicesMentoring.data.voices;
      let voicesMentoringDataTotal = voicesMentoring.data.total;
      let numOfPage = Math.ceil(voicesMentoringDataTotal/size);
      let href
      for( let i=0;  i < voicesMentoringData.length ; i++){
        let values = voicesMentoringData[i];
        
        if (values.state === 3 || values.state === 2){
          //  href = `"./editing-publish-article-detail.html?id=${values.id}"`;
          href = `"./editing-publish-article-detail.html?id=${values.id}"`;
        } else {
          href = `"./editing-ask-article-detail.html?id=${values.id}"`;
        }
     
        voicesMentoringGrid+=`<tr>       
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
                                <td><a href=${href}  class="underline">${values.title}</a></td>
                                <td>${replacestr(values.name)}</a></td>
                                <td>${_state[values.state]}</td>                                
                                <td>${values.acceptDate? dateToStr(strToDate(values.acceptDate)): ""}</td>
                                <td>${values.state === 3 ?dateToStr(strToDate(values.startDate)) : ""}</td>
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
                    <a href="#" class="page-link" onclick="getVoiceMentoringList(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getVoiceMentoringList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getVoiceMentoringList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getVoiceMentoringList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getVoiceMentoringList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
                
      // console.log('noticeGrid' + noticeGrid)
      document.getElementById('voice-mentoring_grid').innerHTML  = voicesMentoringGrid === "" ? "<tr><td colspan='8'>데이터가 없습니다.</td></tr>": voicesMentoringGrid; ;          
      document.getElementById('voice-mentoring-pagination').innerHTML = paging;
      document.getElementById('voice-mentoring-total').innerHTML = '&nbsp;<strong>' + voicesMentoringDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

///------첨식멘토링(첨삭 요청)
function getAskArticle(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){//// && communityId != null){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  console.log('id' + id);

  let url = baseUrl + "/voices?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {

      let voiceData = voice.data.voices;
      
      if(voiceData.length > 0){
        let _voiceData = voiceData[0];
        let _voiceState = parseInt(_voiceData.state);
        let today = new Date();

        let _state = {}; _state[3] = '첨삭완료';  _state[7] = '첨삭등록'; _state[9] = '첨삭등록'; _state[10] = '첨삭요청'; _state[11] = '첨삭등록';
        let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
     
        /// 상태값에 따른 분기
        if (_voiceState === 5 || _voiceState === 6 ||  _voiceState === 8 ||_voiceState === 0 || _voiceState === 2 ){
          location.href='./all-article-list.html'
          return;
        }

        // let startdate = new Date(_communityData.startDate);
        console.log('today' +today );
        // console.log('_voiceData.state' + _state[_voiceData.state11] );
        console.log('_voiceData.state' + _voiceData.state);
        ///기본 내용
        document.getElementById('voice-state').innerHTML =  _state[_voiceState];
        document.getElementById('voice-status').innerHTML =  _status[_voiceData.status];
        document.getElementById('voice-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));
        document.getElementById('voice-last-date').innerHTML = dateToStr(strToDate(_voiceData.lastDate));
        ///작성자
        document.getElementById('voice-name').innerHTML = _voiceData.name;
        document.getElementById('voice-nickname').innerHTML = _voiceData.nickname?_voiceData.nickname:"";
        document.getElementById('voice-email').innerHTML = _voiceData.email?_voiceData.email:"";
        document.getElementById('voice-mobile').innerHTML = _voiceData.mobile?_voiceData.mobile:"";
        document.getElementById('voice-grade').innerHTML = _voiceData.schoolId?"대학생 인증회원("+_voiceData.schoolName+")":"일반회원";
    
        ///주제            
        if ( _voiceData.subject !== null){
          document.getElementById('topic-of-month-title').innerHTML = _voiceData.subject?.title ?  _voiceData.subject.title: "";
          document.getElementById('topic-of-month-keyword').innerHTML = _voiceData.subject.words ? _voiceData.subject.words:"";       
          document.getElementById('topic-of-month-detail').innerHTML = _voiceData.subject.wordsInfo? _voiceData.subject.wordsInfo:"";
          document.getElementById('topic-of-month-create-date').innerHTML = _voiceData.subject.createDate;
        }
      
        document.getElementById('voice-title').innerHTML = _voiceData.title ? _voiceData.title :"";
        document.getElementById('voice-summary').innerHTML = _voiceData.summary?_voiceData.summary:"";
        document.getElementById('voice-content').innerHTML = _voiceData.content? _voiceData.content:""; 
        document.getElementById('voice-main-image').src = _voiceData.file? _voiceData.file:""; 
        console.log('여기')
        let tagArray = (_voiceData.tags)?.split(',');    
        console.log('tagArray' + tagArray);
        if ( tagArray !== undefined){
          document.getElementById('voice-article-tag1').innerHTML = tagArray[0] === undefined ? "" : tagArray[0] ;                   
          document.getElementById('voice-article-tag2').innerHTML = tagArray[1] === undefined ? "" : tagArray[1] ;          
          document.getElementById('voice-article-tag3').innerHTML = tagArray[2] === undefined ? "" : tagArray[2] ;              
        }
    
        window.sessionStorage.setItem("voiceId",_voiceData.id);
      
        // // editing-registration 7/// 첨삭등록
        // // editing-asking        9/// 첨삭요청 대기중
        // // editing-completed   3  /// 첨삭완료 수정가능
        // // editing-asking-guide 10  /// 첨삭완료 
       
        if ( _voiceState === 7 || _voiceState === 11 ||_voiceState === 10 ){  
          console.log('_voiceState' + _voiceState);         
          document.getElementById("editing-registration").style.display = "block";
          document.getElementById("editing-completed").style.display = "none";
          document.getElementById("editing-asking").style.display = "none";
          // document.getElementById("editing-asking-guide").style.display = "none";
        } else if ( _voiceState === 9){  
          document.getElementById("editing-registration").style.display = "none";
          document.getElementById("editing-completed").style.display = "none";
          document.getElementById("editing-asking").style.display = "block";
          // document.getElementById("editing-asking-guide").style.display = "none";
        } else {
          document.getElementById("editing-registration").style.display = "none";
          document.getElementById("editing-completed").style.display = "none";
          document.getElementById("editing-asking").style.display = "none";
          // document.getElementById("editing-asking-guide").style.display = "none";
        }
        getAskArticleAdviceList();
        getAskArticleQuestionList();       
      }    
    })
  }).catch(error => console.log(error));  
}

function getAskArticleQuestionList(){
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voice-questions?voiceId="+ _voiceId;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((editingQuestions) => {
      console.log('voices' + JSON.stringify(editingQuestions.data));
      let editingQuestionsData = editingQuestions.data.questions;
      let editingQuestionsTotal = editingQuestions.data.total;
      let editingQuestionsGrid= "";

      if (editingQuestionsTotal > 0){
        for ( let i =0; i<editingQuestionsTotal; i++ ){
          let editingQuestion = editingQuestionsData[i];
          editingQuestionsGrid +=`
                            <div class="list-item">
                                <span class="title">${(editingQuestion.content).replaceAll('\n','<br />')}</span>
                                <span class="date">${dateToStr(strToDate(editingQuestion.createDate))}</span>
                              </div>`;
        }
      } else {
        editingQuestionsGrid +=`
                                <div class="editing-inquiry-list">
                                  <div class="empty-data">등록된 문의사항이 없습니다.</div>
                                </div>
        `;
      }
      // console.log('noticeGrid' + noticeGrid)
      document.getElementById('editing-mentoring-inquiry-list').innerHTML  = editingQuestionsGrid;          
    });
  }).catch(error => console.log(error));
}

function getAskArticleAdviceList(type =null){
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voice-advices?voiceId=" + _voiceId;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((editingAdvices) => {
      console.log('voices' + JSON.stringify(editingAdvices.data));
      let editingAdvicesData = editingAdvices.data.advices;
      let editingAdvicesTotal = editingAdvices.data.total;
      let editingAdvicesGrid= "";
      let topEditingAdvicesGrid =""
      if (editingAdvicesTotal > 0){
        for( let i=0;  i < editingAdvicesData.length ; i++){
          let values = editingAdvicesData[i];
          editingAdvicesGrid +=`  
                            <div class="editing-comment-box-item">                              
                            <div class="writer">${values.name}</div>
                              <div class="date">${dateToStr(strToDate(values.createDate))}</div>
                              <div class="comment-box">
                                <div class="info-text">${values.title}</div>
                                <div class="text-box">${values.content}</div>
                              </div>
                            </div>`
          if ( i === (editingAdvicesData.length -1)){
          topEditingAdvicesGrid = `
                            <div class="editing-comment-box-item">                              
                            <div class="writer">${'아래의 첨삭내용이 반영되었습니다.'}</div>
                            <div class="writer">${values.name}${'의 첨삭내용('}${dateToStr(strToDate(values.createDate))}${')'}</div>                                 
                            </div>`
          } 
          if (values.state === 11){
            console.log('임시저장' + JSON.stringify(values));
            let _part = values.part;
            console.log('첨삭_part' + _part);

            if (_part === '2'){
              $('#editing-progress-main-image').checked = true;
            }
          }
        }
      } else {
        editingAdvicesGrid +=`
                            <div class="empty-text">등록된 첨삭글이 없습니다.</div> 
        `;
      }
      // console.log('noticeGrid' + noticeGrid)
      document.getElementById('editing-advice-list_grid').innerHTML  = editingAdvicesGrid;          
      if ( type === null){
        document.getElementById('editing-content').innerHTML  = topEditingAdvicesGrid === ""? "등록된 첨삭글이 없습니다." : topEditingAdvicesGrid;          
      }
    });
  }).catch(error => console.log(error));
}

///  voice-subject 1404 ////////////////////////////////////////////////////////////////////////////////////
function getVoiceSubjectList(currentPage, size){
  let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
    let voiceSubjectState = document.getElementById('voice-subject-state');  
    let _filterState =  (voiceSubjectState.options[voiceSubjectState.selectedIndex]).value === 'all' ? null : (voiceSubjectState.options[voiceSubjectState.selectedIndex]).value ;    
    let voiceSubjectStatus = document.getElementById('voice-subject-status');
    let _filterStatus =  (voiceSubjectStatus.options[voiceSubjectStatus.selectedIndex]).value === 'all' ? null : (voiceSubjectStatus.options[voiceSubjectStatus.selectedIndex]).value ;    
    document.getElementById('voice-subject_grid').innerHTML = "";
    let _keyword = document.getElementById('voice-subject-search').value;
    ////     0:공개, 1:삭제, 2:비공개, 3:예약
    // let _state={}; _state[0]= "공개"; _state[2]= "비공개"; _state[3]= "예약";
   
    let url = baseUrl + "/voice-subjects?" ;
    
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

    if ( _filterStatus !== null && _filterStatus !== '-' && _filterState !== '2'){         
      if  ((_filterState === null ||_filterState === '0,3')){
        url +='&status='+ _filterStatus;
      }      
    } 

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

    if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ||  _filterStatus  === 'finishing' ))){
      document.getElementById('voice-subject_grid').innerHTML  = '';          
      document.getElementById('voice-subject-pagination').innerHTML = '';
      document.getElementById('voice-subject-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        // checkError(response.status);
        response.json().then((voiceSubject) => {
          console.log('voices' + JSON.stringify(voiceSubject.data));
          let voiceSubjectGrid= "";
          let voiceSubjectData = voiceSubject.data.subjects;
          let voiceSubjectDataTotal = voiceSubject.data.total;

          for( let i=0;  i < voiceSubjectData.length ; i++){
            let values = voiceSubjectData[i]
            voiceSubjectGrid+=`<tr>
                                  <td>${values.id}</td>
                                  <td><a href="./topic-of-month-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                                  <td>${values.state === 2 ? '비공개': '공개'}</td>
                                  <td>${values.state === 2 ? '-' :_status[values.status]}</td>      
                                  <td>${values.startDate ? dateToStr(strToDate(values.startDate)) : ""}</td>
                                  <td>${values.endDate?dateToStr(strToDate(values.endDate)):values.endDate}</td>
                                  <td>${dateToStr(strToDate(values.createDate))}</td>
                                <tr>`;             
          }
          let numOfPage = Math.ceil((voiceSubjectDataTotal-1)/size);
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
                      <a href="#" class="page-link" onclick="getVoiceSubjectList(0,`+size+`)">First</a>
                      </li>`
          }
          if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
          } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getVoiceSubjectList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                      </li>`
          }
                    
          for ( let page = startOfPage ; page< endOfPage; page++){             
              if (page === (currentPage)){
              paging +=`<li class="paging current">` 
              } else {
              paging +=`<li class="paging">` 
              }                                              
              paging += `<a href="#" class="page-link" onclick="getVoiceSubjectList(`+currentPage+`,`+ size + `)">`+ (page+1) +`</a></li>`;
          }      

          if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
          } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getVoiceSubjectList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                      </li>`
          }     
          if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
          } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getVoiceSubjectList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                      </li>`
          }       
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('voice-subject_grid').innerHTML  = voiceSubjectGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": voiceSubjectGrid;   
          document.getElementById('voice-subject-pagination').innerHTML = paging;
          document.getElementById('voice-subject-total').innerHTML = '&nbsp;<strong>' + voiceSubjectDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
}

function getVoiceSubject(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  console.log('id' + id);

  let url = baseUrl + "/voice-subjects?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voiceSubject) => {
      let voiceSubjectData = voiceSubject.data.subjects[0];
      let _articleType = voiceSubjectData.state === 2 ? '비공개' : '공개';
      let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';   

      document.getElementById('voice-subject-state').innerHTML = _articleType;
      let _articleState = voiceSubjectData.state === 2  ? "-" : voiceSubjectData.state === 0 ? "즉시 게시" : "예약 게시";
      document.getElementById('voice-subject-post-state').innerHTML = _articleState
      document.getElementById('voice-subject-post-status').innerHTML = voiceSubjectData.state === 2? '-' :_status[voiceSubjectData.status];

      document.getElementById('voice-subject-start-date').innerHTML =  voiceSubjectData.state === 2 ? "-" : voiceSubjectData.startDate ? dateToStr(strToDate(voiceSubjectData.startDate)) : "";
      document.getElementById('voice-subject-end-date').innerHTML = voiceSubjectData.state === 2 ? "-" : voiceSubjectData.endDate ? dateToStr(strToDate(voiceSubjectData.endDate)): "";
      document.getElementById('voice-subject-create-date').innerHTML = dateToStr(strToDate(voiceSubjectData.createDate));

      document.getElementById('subject-keyword-1').innerHTML = voiceSubjectData.words1;
      document.getElementById('subject-keyword-detail-1').innerHTML = voiceSubjectData.wordsInfo1;
      if (voiceSubjectData.words2 !== ""){
        document.getElementById('subject-keyword-2').innerHTML = voiceSubjectData.words2;
        document.getElementById('subject-keyword-detail-2').innerHTML = voiceSubjectData.wordsInfo2;
      } else {
        document.getElementById("voice-sub-subject-2").style.display = "none";
      }
      if (voiceSubjectData.words3 !== ""){
        document.getElementById('subject-keyword-3').innerHTML = voiceSubjectData.words3 ;
        document.getElementById('subject-keyword-detail-3').innerHTML = voiceSubjectData.wordsInfo3;
      } else {
        document.getElementById("voice-sub-subject-3").style.display = "none";
      }
      window.sessionStorage.setItem("subjectId",voiceSubjectData.id);
    
      getVoiceSubjectArticles(0,20);
    })                    
  }).catch(error => console.log(error));
}

function getVoiceSubjectArticles(currentPage, size){   
  let subjectId =window.sessionStorage.getItem("subjectId");
  let url = baseUrl + "/voices?subjectId=" + subjectId;
  url +='&state=0,2,3,5,6,9,10';
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voices) => {
      console.log('voices' + JSON.stringify(voices.data));
      let voicesGrid= "";
      let voicesData = voices.data.voices;
      let _voicesDataTotal = voices.data.total;
      let numOfPage = Math.ceil(_voicesDataTotal/size);
      let iteration = voicesData.length > size ? size :  voicesData.length;

      for( let i=0;  i < voicesData.length ; i++){
        let values = voicesData[i];
        
        let href = "";
        // 작성 완료 기사
        if(values.state === 5 || values.state === 5 || values.state === 7) 
          href = `"./editing-completed-article-detail.html?id=${values.id}"`;
        // 수정(첨삭) 중 기사
        else if(values.state === 8 || values.state === 9 || values.state === 10 || values.state === 11 || (values.state === 3 && values.status === 'waiting')) 
          href = `"./editing-ask-article-detail.html?id=${values.id}"`;
        // 발행 기사
        else if(values.state === 0 || values.state === 2 || (values.state === 3 && values.status === 'ongoing')) 
          href = `"./publish-article-detail.html?id=${values.id}"`;

        voicesGrid+=`<tr>            
            <td>${iteration -i}</td>
            <td><a href=`+href+` class="underline">${values.title}</a></td>
            <td>${replacestr(values.name)}</a></td>
            <td>${_state[values.state]}</td>                      
            <td>발행일</td>
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
                    <a href="#" class="page-link" onclick="getVoiceSubjectArticles(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getVoiceSubjectArticles(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getVoiceSubjectArticles(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getVoiceSubjectArticles(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getVoiceSubjectArticles(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
    
      document.getElementById('voice-subject-article_grid').innerHTML  = voicesGrid;          
      document.getElementById('voice-subject-article-pagination').innerHTML = paging;
      document.getElementById('voice-subject-article-total').innerHTML =  _voicesDataTotal;
      // document.getElementById('voice-subject-article-total').innerHTML = '&nbsp;<strong>' + _voicesDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function selectRegistModify(){
  let id =window.sessionStorage.getItem("subjectId");

  console.log('id' + id)
  if ( id === undefined || id===null){
    console.log('등록');
    setTimeout(() => {
      // document.getElementById('voice-sub-subject-1').style.display = 'none';
      document.getElementById('voice-sub-subject-2').style.display = 'none';
      document.getElementById('voice-sub-subject-3').style.display = 'none';
      document.getElementById('voice-subject-modify').style.display = 'none';
      document.getElementById('cancel-modify').style.display = 'none';
      // document.getElementById('voice-sub-subject-2').style.display = 'block';
    },100);
  } else {
    console.log('수정');
    document.getElementById('cancel-regist').style.display = 'none';
    document.getElementById('voice-subject-regist').style.display = 'none';      
    let url = baseUrl + "/voice-subjects?id=" + id;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((voiceSubject) => {
        // let notificaGrid= "";
        let voiceSubjectData = voiceSubject.data.subjects;
        let voiceSubjectDataTotal = voiceSubject.data.total;
        console.log('voiceSubjectData' + JSON.stringify(voiceSubjectData));
        if(voiceSubjectData.length > 0){
          let _voiceSubjectData = voiceSubjectData[0];

          /// 상태
          if(_voiceSubjectData.state === 0) $(":radio[name='voice-subject-state'][value='public']").attr('checked', true);
          else $(":radio[name='voice-subject-state'][value='private']").attr('checked', true);

          /// 게시
          if(_voiceSubjectData.state  === 2){
            (new Date(_voiceSubjectData.startDate) <= new Date(_voiceSubjectData.lastDate)) ? 
              $(":radio[name='voice-subject-post-state'][value='immediately']").attr('checked', true) :
              $(":radio[name='voice-subject-post-state'][value='reserved']").attr('checked', true);
          }
          else{ 
            _voiceSubjectData.state  === 0 ? 
              $(":radio[name='voice-subject-post-state'][value='immediately']").attr('checked', true) : 
              $(":radio[name='voice-subject-post-state'][value='reserved']").attr('checked', true);
          } 
         
          // 게시기간
          document.getElementById('voice-subject-post-start-date').value = dateToStr(strToDate(_voiceSubjectData.startDate));
          document.getElementById('voice-subject-post-end-date').value = dateToStr(strToDate(_voiceSubjectData.endDate));

          document.getElementById('voice-subject-title').value = _voiceSubjectData.title;
          document.getElementById('subject-keyword-1').value = _voiceSubjectData.words1;
          document.getElementById('subject-keyword-detail-1').value = _voiceSubjectData.wordsInfo1;
          if (_voiceSubjectData.words2 !== ""){
            document.getElementById('subject-keyword-2').value = _voiceSubjectData.words2;
            document.getElementById('subject-keyword-detail-2').value = _voiceSubjectData.wordsInfo2;
          } else {
            document.getElementById("voice-sub-subject-2").style.display = "none";
          }
          if (_voiceSubjectData.words3 !== ""){
            document.getElementById('subject-keyword-3').value = _voiceSubjectData.words3;
            document.getElementById('subject-keyword-detail-3').value = _voiceSubjectData.wordsInfo3;
            document.getElementById('add-subject-button').style.display = 'none';

          } else {
            document.getElementById("voice-sub-subject-3").style.display = "none";
          }
          // document.getElementById('voice-subject-title').innerHTML = _voiceSubjectData.title;
          // document.getElementById('notification-content').value = _bannerData.content;        
        }
      })                    
    }).catch(error => console.log(error));

    // window.sessionStorage.setItem("notification-id", id);
  }
}

function addSubSubject(){
  console.log('addSubSubject1' +  document.getElementById('voice-sub-subject-1').style.display);
  console.log('addSubSubject2' +  document.getElementById('voice-sub-subject-2').style.display);
  console.log('addSubSubject3' +  document.getElementById('voice-sub-subject-3').style.display);
  
  if (document.getElementById('voice-sub-subject-2').style.display === 'none'){   
      document.getElementById('voice-sub-subject-2').style.display = 'block';   
      return
  } else if (((document.getElementById('voice-sub-subject-2').style.display === 'block')|| (document.getElementById('voice-sub-subject-2').style.display === '')) && (document.getElementById('voice-sub-subject-3').style.display === 'none')){
    document.getElementById('voice-sub-subject-3').style.display = 'block';  
    document.getElementById('add-subject-button').style.display = 'none';
    return
  }
 
    console.log('addSubSubject1' +  document.getElementById('voice-sub-subject-1').style.display);
    console.log('addSubSubject2' +  document.getElementById('voice-sub-subject-2').style.display);
    console.log('addSubSubject3' +  document.getElementById('voice-sub-subject-3').style.display);
    
  // }
}

function deleteSubSubject(subjectNum){   
    let keyword1 = document.getElementById("subject-keyword-1").value;
    let keyword2 = document.getElementById("subject-keyword-2").value;
    let keyword3 = document.getElementById("subject-keyword-3").value;
    let keywordInfo1 = document.getElementById("subject-keyword-detail-1").value;
    let keywordInfo2 = document.getElementById("subject-keyword-detail-2").value;
    let keywordInfo3 = document.getElementById("subject-keyword-detail-3").value;
  // subject-keyword-detail-1
    console.log('keyword1'+keyword1);
    console.log('keyword2'+keyword2);
    console.log('keyword3'+keyword3);
    console.log('keywordInfo1'+keywordInfo1);
    console.log('keywordInfo2'+keywordInfo2);
    console.log('keywordInfo3'+keywordInfo3);
    console.log('document.getElementById("voice-sub-subject-3").style.display'+document.getElementById("voice-sub-subject-3").style.display);
  
    let subjectList = [];
    if (subjectNum === 1 &&  (document.getElementById("voice-sub-subject-2").style.display === "none") && (document.getElementById("voice-sub-subject-3").style.display=="none")){
      document.getElementById("monthSubjectAlertMessage").innerHTML = "<strong>주제 설정은 최소 1여야 합니다.</strong>";
      location.href = "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true)";
      return
    }
   
    if (keyword1 !== "" && subjectNum !==1 ){
      subjectList.push({"keyword":keyword1,"keywordInfo":keywordInfo1})
    } else {
      document.getElementById("subject-keyword-1").value = "";
      document.getElementById("subject-keyword-detail-1").value = ""
    }
    if (keyword2 !== "" && subjectNum !==2 ){
      subjectList.push({"keyword":keyword2,"keywordInfo":keywordInfo2})
    } else {
      document.getElementById("subject-keyword-2").value = "";
      document.getElementById("subject-keyword-detail-2").value = ""
    }
    if (keyword3 !== "" && subjectNum !==3 ){
      subjectList.push({"keyword":keyword3,"keywordInfo":keywordInfo3})
    } else {
      document.getElementById("subject-keyword-3").value = "";
      document.getElementById("subject-keyword-detail-3").value = ""
    }
   
    console.log(subjectList);
    console.log(subjectList.length);
    if ( subjectList.length < 3){
      document.getElementById('add-subject-button').style.display = 'block';
    }
    for( let i = 0 ; i < 3 ; i++ ){
      // let domId = 'voice-sub-subject-'+ (i+1);
      let keyId = 'subject-keyword-'+ (i+1);
      let domId = 'voice-sub-subject-'+ (i+1);
      let keyDetailId = 'subject-keyword-detail-'+ (i+1);
      document.getElementById(domId).style.display = 'none';
      document.getElementById(keyId).value = "";
      document.getElementById(keyDetailId).value = "";
    }
    for( let i = 0 ; i < subjectList.length ; i++ ){
      let domId = 'voice-sub-subject-'+ (i+1);
      let keyId = 'subject-keyword-'+ (i+1);
      let keyDetailId = 'subject-keyword-detail-'+ (i+1);
      // if ( i < subjectList.length){
        document.getElementById(domId).style.display = 'block';
        document.getElementById(keyId).value = subjectList[i].keyword;
        document.getElementById(keyDetailId).value = subjectList[i].keywordInfo;    
    }   
}

function registVoiceSubject(){
  console.log('등록');
  let monthSubjectAlertMessage = ""

  let _title = document.getElementById("voice-subject-title").value;   
  let _subjectState =  $('input[name=voice-subject-state]:checked').val() === 'private' ? 2 : $('input[name=voice-subject-post-state]:checked').val() === 'immediately' ? 0 : 3;
  let _keyword1 = document.getElementById("subject-keyword-1").value;
  let _title1 = document.getElementById("subject-keyword-detail-1").value;
  let _keyword2 = document.getElementById("subject-keyword-2").value;
  let _title2 = document.getElementById("subject-keyword-detail-2").value;
  let _keyword3 = document.getElementById("subject-keyword-3").value;
  let _title3 = document.getElementById("subject-keyword-detail-3").value;
  let _startDate = document.getElementById("voice-subject-post-start-date").value;
  let _endDate = document.getElementById("voice-subject-post-end-date").value;

  if (_title === ""){
    monthSubjectAlertMessage = "주제 제목을 입력해 주세요.";
    document.getElementById("monthSubjectAlertMessage").innerHTML = '<strong>'+monthSubjectAlertMessage+'</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return
  }

  let url = baseUrl + "/voice-subject/register" ;
  let params = {          
      state: _subjectState,         
      title: _title,
      startDate: _startDate,
      endDate: _endDate,
      words1: _keyword1,
      wordsInfo1: _title1,
      words2: _keyword2,
      wordsInfo2: _title2,
      words3: _keyword3,
      wordsInfo3: _title3
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 201) {  // No content
            document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제가 등록되었습니다..</strong>';
            location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./topic-of-month-list.html'
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

function modifyVoiceSubject(){
  let monthSubjectAlertMessage = ""
  let _id =window.sessionStorage.getItem("subjectId");
  let _title = document.getElementById("voice-subject-title").value;   
  let _subjectState =  $('input[name=voice-subject-state]:checked').val() === 'private' ? 2 : $('input[name=voice-subject-post-state]:checked').val() === 'immediately' ? 0 : 3;
  let _keyword1 = document.getElementById("subject-keyword-1").value;
  let _title1 = document.getElementById("subject-keyword-detail-1").value;
  let _keyword2 = document.getElementById("subject-keyword-2").value;
  let _title2 = document.getElementById("subject-keyword-detail-2").value;
  let _keyword3 = document.getElementById("subject-keyword-3").value;
  let _title3 = document.getElementById("subject-keyword-detail-3").value;
  let _startDate = document.getElementById("voice-subject-post-start-date").value;
  let _endDate = document.getElementById("voice-subject-post-end-date").value;

  if (_title === ""){
    monthSubjectAlertMessage = "주제 제목을 입력해 주세요.";
    document.getElementById("monthSubjectAlertMessage").innerHTML = '<strong>'+monthSubjectAlertMessage+'</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return
  }
  // console.log('_title' + _title);
  // console.log('_subjectState' + _subjectState);
  // console.log('_keyword1' + _keyword1);
  // console.log('_title1' + _title1);
  // console.log('_keyword2' + _keyword2);
  // console.log('_title2' + _title2);
  // console.log('_keyword3' + _keyword3);
  // console.log('_title3' + _title3);

  let url = baseUrl + "/voice-subject" ;
  let params = {     
      id: _id,
      state: _subjectState,         
      title: _title,
      startDate: _startDate,
      endDate: _endDate,
      words1: _keyword1,
      wordsInfo1: _title1,
      words2: _keyword2,
      wordsInfo2: _title2,
      words3: _keyword3,
      wordsInfo3: _title3
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content    
            document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>수정되었습니다.</strong>';
            location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./topic-of-month-list.html'
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

function goRegister(){
  window.sessionStorage.removeItem("subjectId");
  selectRegistModify();
}

function changeVoiceSubject(){
  let _subjectId = window.sessionStorage.getItem("subjectId");
  let url = baseUrl + "/voice-subject" ;
  let params = {     
      id: _subjectId,
      state: 1      
  }
  
  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content    
            window.sessionStorage.removeItem("subjectId");
            document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>삭제가 완료되었습니다..</strong>';
            location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./topic-of-month-list.html'
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
///  voice 작성 완료 기사 //////////////////////////////////////////////////////////////////////////////////// 
function getVoiceDraftList(currentPage, size, filterCategory=null, filterStatus=null){       
  document.getElementById('voice-draft_grid').innerHTML = ""
  // document.getElementById('checkAll').checked = false;

  let voicDraftState = document.getElementById('voice-draft-state');
  let _filterState =  (voicDraftState.options[voicDraftState.selectedIndex]).value === 'all' ? null : (voicDraftState.options[voicDraftState.selectedIndex]).value ;    
  //let voicDraftAcceptState = document.getElementById('voice-draft-accept-state');
  //let _filterAcceptState =  (voicDraftAcceptState.options[voicDraftAcceptState.selectedIndex]).value === 'all' ? null : (voicDraftAcceptState.options[voicDraftAcceptState.selectedIndex]).value ;    
  let _keyword = document.getElementById('voice-draft-search').value;

  ///0:open, 1:delete, 2:private 3:reserved
  let _state = {}; _state[5] = '작성완료'; _state[6] = '수정(첨삭)제안'; _state[8] = '수정(첨삭)제안';
  let url = baseUrl + "/voices?";

  if ( _filterState !== null){   
    url +='&state='+_filterState;
  } else {
    url +='&state=5,6,8';
  }

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

 ;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voicesDraft) => {
      console.log('voices' + JSON.stringify(voicesDraft.data));
      let voicesDraftGrid= "";
      let voicesDraftData = voicesDraft.data.voices;
      let voicesDraftDataTotal = voicesDraft.data.total;
      let numOfPage = Math.ceil(voicesDraftDataTotal/size);

      for( let i=0;  i < voicesDraftData.length ; i++){
        let values = voicesDraftData[i];
      
        voicesDraftGrid+=`<tr>
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
                        
            <td><a href="./editing-completed-article-detail.html?id=${values.id}"  class="underline">${values.title}</a></td>

            <td>${replacestr(values.name)}</a></td>
            <td>${_state[values.state]}</td>                                   
            <td>${values.state==8 ? 'N' : '-'}</td>                                  
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
                    <a href="#" class="page-link" onclick="getVoiceDraftList(0,`+size+`)">First</a>
                  </li>`
      }
      if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
      } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getVoiceDraftList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                  </li>`
      }
              
      for ( let page = startOfPage ; page< endOfPage; page++){             
          if (page === (currentPage)){
            paging +=`<li class="paging current">` 
          } else {
            paging +=`<li class="paging">` 
          }                                              
          paging += `<a href="#" class="page-link" onclick="getVoiceDraftList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
      }      

      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
      } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getVoiceDraftList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                  </li>`
      }     
      if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
      } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getVoiceDraftList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                  </li>`
      }       
                
      // console.log('noticeGrid' + noticeGrid)
      document.getElementById('voice-draft_grid').innerHTML  = voicesDraftGrid === "" ? "<tr><td colspan='9'>데이터가 없습니다.</td></tr>": voicesDraftGrid;       
      document.getElementById('voice-draft-pagination').innerHTML = paging;
      document.getElementById('voice-draft-total').innerHTML = '&nbsp;<strong>' + voicesDraftDataTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function getVoiceDraft(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){//// && communityId != null){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }

  console.log('id' + id);

  let url = baseUrl + "/voices?id=" + id;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {
      
      let voiceData = voice.data.voices;
      let _state = {}; _state[5] = '작성완료'; _state[6] = '수정(첨삭)제안'; _state[8] = '수정(첨삭)제안';
      if(voiceData.length > 0){
        let _voiceData = voiceData[0];
        let _voiceState = _voiceData.state;
        let today = new Date();
        // let startdate = new Date(_communityData.startDate);
        console.log('today' +today );
        // console.log('_voiceData.state' + _state[_voiceData.state] );

        /// 상태값에 따른 분기
        if (_voiceState === 3 || _voiceState === 9 ||  _voiceState === 10 ||  _voiceState === 11 ||  _voiceState === 7){
          location.href='./all-article-list.html'
          return;
        }

        ///기본 내용
        document.getElementById('voice-state').innerHTML = _state[_voiceData.state];
        document.getElementById('voice-create-date').innerHTML = dateToStr(strToDate(_voiceData.createDate));      
        document.getElementById('voice-last-date').innerHTML = dateToStr(strToDate(_voiceData.lastDate));    
        document.getElementById('voice-editing-accept-state').innerHTML = _voiceData.state===7? 'Y' : _voiceData.state===8? 'N': '-';
        ///작성자
        document.getElementById('voice-name').innerHTML = _voiceData.name;
        document.getElementById('voice-nickname').innerHTML = _voiceData.nickname;
        document.getElementById('voice-email').innerHTML = _voiceData.email;
        document.getElementById('voice-mobile').innerHTML = _voiceData.mobile;
        
        ///주제            
        if (_voiceData.subject !== null){
          document.getElementById('topic-of-month-title').innerHTML = _voiceData.subject.title?  _voiceData.subject.title : "";
          document.getElementById('topic-of-month-keyword').innerHTML = _voiceData.subject.words? _voiceData.subject.words : "";
          document.getElementById('topic-of-month-detail').innerHTML = _voiceData.subject.wordsInfo ? _voiceData.subject.wordsInfo : "";
          document.getElementById('topic-of-month-create-date').innerHTML = _voiceData.subject.createDate ? _voiceData.subject.createDate : "";
        }
      
        document.getElementById('voice-main-image').src = _voiceData.file?  _voiceData.file:"";
        document.getElementById('voice-title').innerHTML = _voiceData.title;
        document.getElementById('voice-summary').innerHTML = _voiceData.summary;
        document.getElementById('voice-content').innerHTML = _voiceData.content;
        
        
        let tagArray = (_voiceData.tags)?.split(',');    
        console.log('tagArray' + tagArray);
        if ( tagArray !== undefined){
          document.getElementById('voice-article-tag1').innerHTML = tagArray[0] === undefined ? "" : tagArray[0] ;                   
          document.getElementById('voice-article-tag2').innerHTML = tagArray[1] === undefined ? "" : tagArray[1] ;          
          document.getElementById('voice-article-tag3').innerHTML = tagArray[2] === undefined ? "" : tagArray[2] ;              
        }
        console.log('_voiceData.state' + _voiceData.state);

        if (_voiceData.state === 5){
          document.getElementById("editing-propose").style.display = "block";
          document.getElementById("editing-mentoring").style.display = "none";
          document.getElementById("editing-registration").style.display = "none";
        } 
        else if (_voiceData.state === 6){
          document.getElementById("editing-propose").style.display = "none";
          document.getElementById("editing-mentoring").style.display = "block";
          document.getElementById("editing-registration").style.display = "none";
        } else if (_voiceData.state === 7){
          document.getElementById("editing-propose").style.display = "none";
          document.getElementById("editing-mentoring").style.display = "none";
          document.getElementById("editing-registration").style.display = "block";
        } else if (_voiceData.state === 8){
          document.getElementById("editing-propose").style.display = "block";
          document.getElementById("editing-mentoring").style.display = "none";
          document.getElementById("editing-registration").style.display = "none";
        }
        window.sessionStorage.setItem("voiceId",_voiceData.id)             
      }
      
    })                    
  }).catch(error => console.log(error));
}

function proposeMentoring(type){
  // document.getElementById("voice-alert-title").innerHTML = "<strong>제안을 완료했습니다.</strong>";
  // location.href="javascript:layerPopup.openPopup('voiceConfirmPopup', true)";    
  // return
  if(type === 1){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    if ( totalCnt === 0 ){
      document.getElementById("voice-alert-message").innerHTML ='<strong>첨삭멘토링을 제안할 기사를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";
    } 
    else{
      document.getElementById("voice-confirm-message").innerHTML ='<strong>기사에 첨삭 멘토링을 제안하시겠어요?</strong>';
      location.href= "javascript:layerPopup.openPopup('voiceConfirmPopup', true);";
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){       
          // changeProposalState(1,(checkbox.value).replace('/',''));
          mentoringOK((checkbox.value).replace('/',''))
        }
      });
    }
  } else if(type === 2){
    document.getElementById("voice-confirm-message").innerHTML ='<strong>기사에 첨삭 멘토링을 제안하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('voiceConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      mentoringOK()
    });
  }
}

function mentoringOK(voiceId = null ){
    let voice_id = voiceId === null ? parseInt(window.sessionStorage.getItem("voiceId")) : voiceId;

    let url = baseUrl + "/voice" ;

    let params = {     
        id:  parseInt(voice_id),
        state: 6
    }
    
    async function post(request) {
    try {
          await fetch(request).then(response => {
            if(response.status === 200) {

              document.getElementById("voice-alert-message").innerHTML = "<strong>첨삭 멘토링 제안을 완료했습니다.</strong>";
              location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                  if(voiceId !== null) location.reload()
                  else window.history.back();
              });

            }
          }) 
        } catch (error) {
          console.error("Error:", error);
        }
    }

    const voiceallRequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });

    post(voiceallRequest);
}

function proposeEditing(){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  const totalCnt = checkboxes.length;

  console.log('totalCnt' + totalCnt);
  if (totalCnt < 0){
    location.href= "javascript:layerPopup.openPopup('systemAlertPopup01', true);";
  }
}

function cancelOK(){
  location.href="./topic-of-month-list.html"
}

////////////첨삭///////////////
function getEditingArticle(){
  let id = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voices?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {
      let voiceData = voice.data.voices;
        
      if(voiceData.length > 0){
        let _voiceData = voiceData[0];
        let _state = _voiceData.state;
        let tagArray = (_voiceData.tags)?.split(',');    
        let today = new Date();


        // let startdate = new Date(_communityData.startDate);
        console.log('today' +today );
        document.getElementById('autocomplete01').value = JSON.parse(window.localStorage.getItem("meInfo")).name;
        document.getElementById('voice-title').value = _voiceData.title;
        document.getElementById('voice-summary').value = _voiceData.summary;
        document.getElementById('voice-main-image').src = _voiceData.file;
        // document.getElementById('editor').value = _voiceData.content;
        editorInstance.html.insert(_voiceData.content);
        console.log('tagArray'+ _voiceData.tags);
        document.getElementById('voice-tag-1').value = tagArray === undefined ? "" : tagArray[0] ;                   
        document.getElementById('voice-tag-2').value = tagArray !== undefined && tagArray[1] === undefined ? "" : tagArray[1] ;          
        document.getElementById('voice-tag-3').value = tagArray !== undefined && tagArray[1] === undefined ? "" : tagArray[2] ;     
        // document.getElementById('voice-tag-1').value = _voiceData.tags;

        ///// 임시저장인경우 voice-advice 임시저장한 내용 가져오기
        if (_state === 11){
          
        }
        getAskArticleAdviceList('editing');
        getAskArticleQuestionList();
      }
    })                    
  }).catch(error => console.log(error));
}

function editorCheck(type){
  if (type === 0){      
    if ($('#editing-editor-title').is(':checked')) 
     $('#editing-progress-title').prop('checked',true);
  } else if (type===1){
    if($('#editing-editor-content').is(':checked')) 
      $('#editing-progress-content').prop('checked',true);
  } else {      
   if ($('#editing-editor-tag').is(':checked')) 
    $('#editing-progress-tag').prop('checked',true);
  }
}

function editingCheck(type){
  if (type=== 0 &&!$('#editing-progress-title').is(':checked')){
     $('#editing-editor-title').prop('checked',false);
  } else if (type===1){
    if(!$('#editing-progress-content').is(':checked')){
      $('#editing-editor-content').prop('checked',false);
    }
  } else if (type === 2){
    if (!$('#editing-progress-tag').is(':checked')){
      $('#editing-editor-tag').prop('checked',false)
    }
  }
}

function editingAddAdvice(content,type){
  let url= baseUrl + "/users/all?state=0&grade=50,100&name=" + (document.getElementById("autocomplete01").value.length > 0 ? document.getElementById("autocomplete01").value : ' ');    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {    

      let _mainPart = "";
      let _titlePart = "";
      let _contentPart = "";
      let _tagPart = "";
      let _qnaPart = "";
      let _title = "";
      let _part = "" ;
      let _userId = "";

      let adviceAlertMessage = ""
      let adviceContent = document.getElementById("editing-advice-content").value;
      let adviceWriter = document.getElementById("autocomplete01").value;
      let voiceTitle = document.getElementById("voice-title").value;
      let voiceSummary= document.getElementById("voice-summary").value;
      //let voiceContent = document.getElementById("editing-writer").values;
      let tag1 = document.getElementById("voice-tag-1").value;
      let tag2 = document.getElementById("voice-tag-2").value;
      let tag3 = document.getElementById("voice-tag-3").value;
      let voiceTag = (tag1? tag1 : "") + (tag2? ','+tag2 : "") + (tag3? ','+tag3 : "");
      let voiceParams = {};
    
      let isCheck = $("input:checkbox[name='switch-check']:checked").val();
    
      console.log('voiceTag' +voiceTag );

      // if ( type === 1){
      if(isCheck !== 'on'){
        adviceAlertMessage = "최소 1개이상의 첨삭 영역을 선택해 주세요."
        document.getElementById("voice-alert-title").innerHTML = "<strong>"+adviceAlertMessage + "</strong>";
        location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";  
        return
      } else if(adviceWriter === ""){
        adviceAlertMessage = "첨삭에디터를 지정해 주세요."
        document.getElementById("voice-alert-title").innerHTML = "<strong>"+adviceAlertMessage + "</strong>";
        location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";  
        return
      } else if (adviceContent === ""){
        adviceAlertMessage = "첨삭 의견을 작성해 주세요."
        document.getElementById("voice-alert-title").innerHTML = "<strong>"+adviceAlertMessage + "</strong>";
        location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";
        return
      } else if (tag1 === "" && tag2 === "" && tag3 === ""){
        adviceAlertMessage = "태그를 최소 1개 이상 입력해 주세요."
        document.getElementById("voice-alert-title").innerHTML = "<strong>"+adviceAlertMessage + "</strong>";
        location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";    
        return
      } 
      // }
      
      ///// 첨삭의견 추가
      let _voiceId = window.sessionStorage.getItem("voiceId");
      let url = baseUrl + "/voice-advice/register" ;
    
      // editing-progress-main-image
      if ($('#editing-progress-main-image').is(':checked')){
        _mainPart = '대표이미지,';
        _part = "0,"
      }      
      if ($('#editing-progress-title').is(':checked') && $('#editing-editor-title').is(':checked')){
        _titlePart = '[에디터 수정]제목 및 한 줄 소개,';
        _part += "2,"
        voiceParams["title"] = voiceTitle;
        voiceParams["summary"] = voiceSummary;
        // voiceParams += "summary:'" + voiceSummary + "',";
      } else if ($('#editing-progress-title').is(':checked')){
        _titlePart = '제목 및 한 줄 소개,';
        _part += "1,"
      }
      if ($('#editing-progress-content').is(':checked') && $('#editing-editor-content').is(':checked')){
        _contentPart = '[에디터 수정]본문,';
        _part += "4,";
        voiceParams["content"] = content;
        // voiceParams += "content:'" + content + "',";
        // voiceParams += "summary:" + voiceSummary + ',';
      } else if ($('#editing-progress-content').is(':checked')){
        _contentPart = '본문,';
        _part += "3,"
      }
      if ( ($('#editing-editor-tag').is(':checked')) && ($('#editing-editor-tag').is(':checked'))){
        _tagPart = '[에디터 수정]태그,';
        _part += "6,";
        voiceParams["tags"] = voiceTag;
        // voiceParams += "tags:'" + voiceTag + "'";
      } else if ($('#editing-progress-tag').is(':checked')){
        _tagPart = '태그,';
        _part += "5,"
      }

      if ($('#editing-editor-qna').is(':checked')){
        _qnaPart = '문의사항,';
        _part += "7,"
      }
      // console.log('part' + _part);
      console.log('_mainPart' + _mainPart);
      console.log('_titlePart' + _titlePart);
      console.log('_contentPart' + _contentPart);
      console.log('_tagPart' + _tagPart);
      console.log('_tagPart' + _part);
      console.log('voiceParams' + voiceParams);

      _title = _mainPart + _titlePart + _contentPart + _tagPart + _qnaPart;
      _userId = document.getElementById("autocomplete01").value.length > 0?response.data.users[0].id:_me.id;

      let  _vocieId = parseInt(window.sessionStorage.getItem("voiceId"));
      let _me = JSON.parse(window.localStorage.getItem("meInfo"));
      console.log('_title' + _title.slice(0,-1));
      console.log('_part' + _part.slice(0,-1));
      let params = {     
          voiceId: _voiceId,
          userId: _userId,
          title: _title.slice(0,-1),
          part:  _part.slice(0,-1),
          state: type === 2? 11: 0,
          content: adviceContent      
      }
      
      async function post(request) {
      try {
          await fetch(request).then(response => {
              if(response.status === 201) {  // No content   
                voiceParams["id"] =parseInt(_voiceId);
                voiceParams["userId"] =  _userId;
                if ( type === 1){
                  voiceParams["state"] = 9;
                  // document.getElementById("voice-alert-title").innerHTML = "<strong>첨삭의견이 등록되었습니다.</strong>";
                  // location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";
                  // let okElement = document.getElementById("alert-OK");
                  // okElement.addEventListener("click", function (e) {
                  //   location.href = 'editing-ask-article-detail.html?id=' + _voiceId;
                  // });
                  
                  // return
                } else  if ( type === 2){
                  voiceParams["state"] = 11;
                }
                console.log('voiceParams' + JSON.stringify(voiceParams));
                editingVoice(voiceParams,type);                
              
              }
          }) 

        } catch (error) {
        console.error("Error:", error);
        }
    }

    const voiceRequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });

    post(voiceRequest);

    });
  }).catch(error => console.log(error));
}

function editingVoice(params,type){  
 console.log('params' + JSON.stringify(params) )
 let _voiceId = window.sessionStorage.getItem("voiceId");
 let url = baseUrl + "/voice" ;
 async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content                    
             console.log('voice 첨삭');
              if (type === 1){
                document.getElementById("voice-alert-title").innerHTML = "<strong>첨삭의견이 등록되었습니다.</strong>";
              } else if (type === 2){
                document.getElementById("voice-alert-title").innerHTML = "<strong>임시 저장되었습니다.</strong>";
              }
              location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true)";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href = './editing-ask-article-detail.html?id=' + _voiceId;
              });
              return
          }
      }) 

      } catch (error) {
      console.error("Error:", error);
      }
  }

  const voiceRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
  });

 post(voiceRequest);
}

function cancelEditing(){
// editing-advice-alert-message
console.log("cancelEditing");
let _voiceId = window.sessionStorage.getItem("voiceId");
document.getElementById("editing-confirm-message").innerHTML = "<strong>기사 첨삭을 취소하시겠습니까?</strong>";
location.href = "javascript:layerPopup.openPopup('editingConfirmPopup', true)";
let okElement = document.getElementById("confirm-OK");
okElement.addEventListener("click", function (e) {
  location.href = 'editing-ask-article-detail.html?id=' + _voiceId;
});

}

function alertOK(){
// location.href= "./editing-completed-article-detail.html?id=" + window.sessionStorage.getItem("voiceId");
}

function completeEditing(){
}

function checkSubjectInput(type){
  let _title = document.getElementById("voice-subject-title").value;  
  let postStartDate = document.getElementById("voice-subject-post-start-date").value;
  let postEndDate = document.getElementById("voice-subject-post-end-date").value;
  let _keyword1 = document.getElementById("subject-keyword-1").value;
  let _keywordDetail = document.getElementById("subject-keyword-detail-1").value;
 
  if ( _title === ""){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제 제목을 입력해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return;
  } else if ($('input[name="voice-subject-state"]').is(":checked") === false){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제 상태를 선택해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return;
  } else if ($('input[name="voice-subject-post-state"]').is(":checked") === false){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제 게시를 선택해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return;
  } else if (postStartDate === "" || postEndDate === ""){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>게시 기간을 선택해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return;
  } else if (_keyword1 === "" ){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제01의 키워드를 입력해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
    return;
  } else if (_keywordDetail === "" ){
    document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>주제01의 상세 주제를 입력해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";    
    return;
  }

  if (type === 1){
    registVoiceSubject();
  } else {
    modifyVoiceSubject();
  }
}

function deleteSubject(){
     console.log('주제 관련 기사 개수'+document.getElementById("voice-subject-article-total").innerHTML);
     let articleCount = document.getElementById("voice-subject-article-total").innerHTML;

     if (articleCount > 0) {
      document.getElementById("monthSubjectAlertMessage").innerHTML ='<strong>삭제가 불가능해요. 현재 주제로 등록된 글 쓰는 20대 기사가 있습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('monthSubjectAlertPopup', true);";
     } else {
      document.getElementById("monthSubjectConfirmMessage").innerHTML ='<strong>현재 주제을 삭제하시겠어요? 삭제된 주제는 복구할 수 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('monthSubjectConfirmPopup', true);";
      let okElement = document.getElementById("confirm-ok");
      okElement.addEventListener("click", function (e) {
        changeVoiceSubject();
      });

      // alert-OK
     }
}

function cancelTopic(type){
  // <strong>등록/수정을 취소하시겠어요?</strong>
  if (type === 1){
    document.getElementById("monthSubjectConfirmMessage").innerHTML ='<strong>등록을 취소하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectConfirmPopup', true);";
    // return;
  } else {
    document.getElementById("monthSubjectConfirmMessage").innerHTML ='<strong>수정을 취소하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('monthSubjectConfirmPopup', true);";
    // return;
  }
  let okElement = document.getElementById("confirm-ok");
  okElement.addEventListener("click", function (e) {
    location.href = './topic-of-month-list.html';
  });
}


function changePublishDate(startDate){
  let url = baseUrl + "/voice" ;
  let _voiceId =  parseInt(window.sessionStorage.getItem("voiceId"));
  let today = dateToStr(new Date());
  let _startDate = document.getElementById("publish-accept-date").value;
  console.log('voiceId: ' + _voiceId + ', startDate: ' + startDate + ', state: ' + (startDate !== today ? 3 : 0));
  console.log('today' + today);
  let params = {     
      id:  _voiceId,
      state: _startDate !== today ? 3 : 0,
      startDate: _startDate
  }

  async function post(request) {
  try {
     await fetch(request).then(response => {
        if(response.status === 200) {  // No content       
          //  location.href='./editing-mentoring-article-list.html'       
           return
        }
     }) 

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const changeVoiceStateRequest = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

  post(changeVoiceStateRequest);
}

function updateVoiceAcceptDate(){
  let _acceptDate = document.getElementById("publish-accept-date").value;
  let _voiceId = window.sessionStorage.getItem("voiceId");
  // let today = dateToStr(new Date());

  console.log('_acceptDate' + _acceptDate);
  if (_acceptDate === ""){
    document.getElementById("voice-alert-title").innerHTML ='<strong>발행일을 입력하지 않았습니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";
    return
  } else {
    
    document.getElementById("voice-alert-title").innerHTML ='<strong>선택한 기사의 첨삭이 완료되었습니다. 기사는 발행 예정일에 맞춰 글 쓰는 20대 페이지에 공개됩니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";
    let okElement = document.getElementById("alert-OK");
    okElement.addEventListener("click", function (e) {
      changePublishDate(_acceptDate);
   
      location.href = 'editing-mentoring-completed-article-modify.html?id=' + _voiceId;
    });
  }
  ///// state = 3으로 update;

}

////////////첨삭/////////////// state : 3
function getEditingCompletedArticle(){

  // let u = window.location.href;
  // let id;
  // if(u.indexOf("?") > 0){
  //     path = u.substr(0 , u.indexOf("?"));        
  //     query = u.substr(u.indexOf("?") + 1);
  //     var pair = query.split('=');
  //     _voiceId = pair[1];
  // } 
  // // else if (_id !==null){
  // //    id = _id;
  // // }
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voices?id=" + _voiceId;
  
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((voice) => {
      let voiceData = voice.data.voices;
        
      if(voiceData.length > 0){
        let _voiceData = voiceData[0];
        let tagArray = (_voiceData.tags)?.split(',');    

        let today = new Date();
        console.log('today' +today );
        document.getElementById('editing-prepublish-date').value = dateToStr(strToDate(_voiceData.startDate));
        document.getElementById('voice-title').value = _voiceData.title;
        document.getElementById('voice-summary').value = _voiceData.summary;
        // document.getElementById('editor').value = _voiceData.content;
        editorInstance.html.insert(_voiceData.content);
        console.log('tagArray'+ _voiceData.tags);
        document.getElementById('voice-tag-1').value = tagArray === undefined ? "" : tagArray[0] ;                   
        document.getElementById('voice-tag-2').value = tagArray !== undefined && tagArray[1] === undefined ? "" : tagArray[1] ;          
        document.getElementById('voice-tag-3').value = tagArray !== undefined && tagArray[1] === undefined ? "" : tagArray[2] ; 
        // if(_noticePopup.file) sendFileToDropzone(dropzone02, _noticePopup.file);
        if(_voiceData.file) sendFileToDropzone(dropzone02, _voiceData.file);    
     
      }
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

function editingCompletedPreview(){
  // document.getElementById("editing-advice-alert-message").innerHTML ='<strong>선택한 기사의 첨삭이 완되었습니다. 기사는 발행 예정일에 맞춰 글쓰는 20대 페이지에 공개됩니다.</strong>';
 
  document.getElementById('editing-preview-title').innerHTML =  document.getElementById('voice-title').value;
  document.getElementById('editing-preview-summary').innerHTML =  document.getElementById('voice-summary').value;
  document.getElementById("editing-preview-content").innerHTML =  editorInstance.html.get("editor");
  document.getElementById('editing-preview-tag1').innerHTML =  document.getElementById('voice-tag-1').value;
  document.getElementById('editing-preview-tag2').innerHTML =  document.getElementById('voice-tag-2').value;
  document.getElementById('editing-preview-tag3').innerHTML =  document.getElementById('voice-tag-3').value;
  // document.getElementById('voice-tag-2').value
  // document.getElementById('voice-tag-3').value
  location.href= "javascript:layerPopup.openPopup('write20PreviewPopup', true)";    
}

 function editingCompleted(){
  let prePublishDate = document.getElementById("editing-prepublish-date").value;
  if (prePublishDate === ""){
    document.getElementById("editing-alert-message").innerHTML = "<strong>발행 예정일을 입력해 주세요.</strong>";
    location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true);";
    return;
  }
  document.getElementById("editing-confirm-message").innerHTML = "<strong>수정을 완료하시겠어요?</strong>";
  location.href="javascript:layerPopup.openPopup('editingConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    console.log('여기');
    editingCompleteModify();
      // console.log('checkbox.value' + (checkbox.value).replace('/',''));
        // changeStoryState((checkbox.value).replace('/',''))
  });
 }

 function editingCompleteModify(){
  let voiceId = window.sessionStorage.getItem("voiceId");

  let _tag1 = document.getElementById("voice-tag-1").value;
  let _tag2 = document.getElementById("voice-tag-2").value;
  let _tag3 = document.getElementById("voice-tag-3").value;    
  let _title = document.getElementById("voice-title").value;
  let _summary = document.getElementById("voice-summary").value; 
  let _postDate = dateToStr(strToDate(document.getElementById("editing-prepublish-date").value)); 
  let _tag = _tag1 + ',' + _tag2 + ',' +  _tag3 ;   
  let _content = editorInstance.html.get("editor");
  if(isModifiedFiles){
    console.log('mainFile name' + mainEditFile?.name);
    if(mainEditFile)formData.append("files", mainEditFile, mainEditFile.name);
  }

  console.log('발행예정일' +_postDate );
  let url = baseUrl + "/voice/" ;
  let formData = new FormData();
  formData.append('id', voiceId);
  formData.append('title', _title);
  formData.append('summary', _summary);  
  formData.append('content', _content);  
  formData.append('tags', _tag);
  formData.append('startDate', _postDate);

  async function post(request) {
  try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content
            document.getElementById("editing-alert-message").innerHTML ='<strong>첨삭수정이 완료되었습니다.</strong>';
            location.href= "javascript:layerPopup.openPopup('voiceAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href='./editing-mentoring-article-list.html'
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
      body: formData
  });
  
  post(request1);
 }

function publishPreview(){
 
  document.getElementById('publish-preview-name').innerHTML =  document.getElementById('publish-article-title').value;
  document.getElementById('publish-preview-title').innerHTML =  document.getElementById('publish-article-title').value;
  document.getElementById('publish-preview-summary').innerHTML =  document.getElementById('publish-article-summary').value;
  document.getElementById("publish-preview-content").innerHTML =  editorInstance.html.get("editor");
  document.getElementById('publish-preview-tag1').innerHTML =  document.getElementById('publish-article-tag1').value;
  document.getElementById('publish-preview-tag2').innerHTML =  document.getElementById('publish-article-tag2').value;
  document.getElementById('publish-preview-tag3').innerHTML =  document.getElementById('publish-article-tag3').value;
  // document.getElementById('voice-tag-2').value
  // document.getElementById('voice-tag-3').value
  location.href= "javascript:layerPopup.openPopup('write20PreviewPopup', true)";    
}

function cancelPublishModify(){
  document.getElementById("publish-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
  location.href="javascript:layerPopup.openPopup('publishConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    location.href = "./publish-article-list.html"
  });
}

function cancelEditingModify(){
  document.getElementById("editing-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
  location.href="javascript:layerPopup.openPopup('editingConfirmPopup', true);";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    location.href = "./editing-mentoring-article-list.html"
  });
}

function checkState(state){
   console.log('checkState')
   if ( state === 1 ){    
    document.getElementById("voice-confirm-message").innerHTML = "<strong>선택한 기사를 삭제하시겠어요? 삭제된 기사는 복구할 수 없습니다.</strong>";
    location.href="javascript:layerPopup.openPopup('voiceConfirmPopup', true);";
 
   } else if ( state === 2 ){
    document.getElementById("voice-confirm-message").innerHTML = "<strong>선택한 기사 상태를 비공개로 변경하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('voiceConfirmPopup', true);";
   } else if ( state === 0 ){
    document.getElementById("voice-confirm-message").innerHTML = "<strong>선택한 기사 상태를 공개로 변경하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('voiceConfirmPopup', true);";
   }
   let okElement = document.getElementById("confirm-OK");
   okElement.addEventListener("click", function (e) {
     changePublishDetailState(state);
   });
}

function changePublishDetailState(_state){
  let url = baseUrl + "/voice" ;
  let _voiceId =  parseInt(window.sessionStorage.getItem("voiceId")) ;

  let params = {     
      id:  _voiceId,
      state: _state,      
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
        if(response.status === 200) {  // No content    
          if ( _state === 1){
            document.getElementById("voice-alert-message").innerHTML = "<strong>삭제가 완료되었어요.</strong>";
            location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true);";
          } else if ( _state === 2){
            document.getElementById("voice-alert-message").innerHTML = "<strong>비공개 상태로 변경되었어요.</strong>";
            location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true);";
          } else {
            document.getElementById("voice-alert-message").innerHTML = "<strong>공개 상태로 변경되었어요.</strong>";
            location.href="javascript:layerPopup.openPopup('voiceAlertPopup', true);";
          }
          let okElement = document.getElementById("alert-OK");
          okElement.addEventListener("click", function (e) {
            location.href='./publish-article-list.html'     
          });
            
            return
        }
      }) 

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const changeVoiceStateRequest = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

    post(changeVoiceStateRequest);
}

function setToday(){
  console.log('setToday')
  const today = new Date();
  document.getElementById('voice-subject-post-start-date').value = dateToStr(today);
}

function searchStart(e,type){
  if(e.keyCode === 13){
    if(type === 1){
      getVoiceSubjectList(0,20);
    } else if(type === 2){
      getVoiceAllList(0,20);
    } else if (type === 3){
      getVoiceDraftList(0,20);
    } else if (type === 4){
      getVoiceMentoringList(0,20);
    } else if (type === 5){
      getVoicePublishList(0,20);
    }
  }
}

function checkDeleteComment(){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  const totalCnt = checkboxes.length;    
  console.log('checkboxes' + JSON.stringify(checkboxes));
  if ( totalCnt === 0 ){
    document.getElementById("publish-alert-message").innerHTML ='<strong>삭제할 댓글을 선택해 주세요.</strong>';
    location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
  } 
  else{
    document.getElementById("publish-confirm-message").innerHTML ='<strong>댓글을 삭제하시겠어요?</strong>';
    location.href= "javascript:layerPopup.openPopup('publishConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){       
        deletePublishComment((checkbox.value).replace('/',''))
      }
    });
  }
}

function deletePublishComment(commentId){
  let _voiceId = window.sessionStorage.getItem("voiceId");
  let url = baseUrl + "/voice-comment/" ;
  let params = {
    "id": commentId,
    "voiceId": _voiceId ,
    "state": 1
  }

  async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content
              document.getElementById("publish-alert-message").innerHTML ='<strong>댓글이 삭제되었습니다.</strong>';
              location.href= "javascript:layerPopup.openPopup('publishAlertPopup', true);";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                // location.href='./publish-article-detail.html?id='+ _voiceId;
              });           
            }
        }) 
    
        } catch (error) {
        console.error("Error:", error);
        }
    }
    
    const deletePublishComment = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });
    
    post(deletePublishComment);
}