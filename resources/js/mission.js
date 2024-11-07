document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/mission/mission-completed-member-list") >= 0) getMissionCompleteList(0,20);  
  else if(window.location.pathname.indexOf("/mission/mission-completed-member-detail") >= 0) getUserMission();  
  else if(window.location.pathname.indexOf("/mission/mission-board") >= 0)  getMission(1);  
  else if(window.location.pathname.indexOf("/mission/mission-modify") >= 0)  getMission(2);  
});

///// 미션 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getMissionCompleteList(currentPage, size, type =null){
      addYearOption();  
      document.getElementById('mission-list_grid').innerHTML = "";
      let _keyword = document.getElementById('mission-search').value;
      let missionsState = document.getElementById('mission-state');
      let _filterState =  (missionsState.options[missionsState.selectedIndex]).value === 'all' ? null : (missionsState.options[missionsState.selectedIndex]).value ;    
      let paySubscription = document.getElementById('pay-subscription');
      let _paySubscription =  (paySubscription.options[paySubscription.selectedIndex]).value === 'all' ? null : (paySubscription.options[paySubscription.selectedIndex]).value ;  
      let _year = document.getElementById('mission-year').value;
      let _month;
      let todayMonth = (new Date()).getMonth() + 1;
      if ( type !== 1){       
        $('#mission-month option[value='+ todayMonth +']').attr('selected', true);
      }
      _month = document.getElementById('mission-month').value; 
      let _dateFilter = parseInt(_year + (_month<10?'0'+_month:_month)); 
      let url = baseUrl + "/missions?" ;
      url += '&date=' + _dateFilter;
      if ( _filterState !== null){   
        url +='&filter='+ _filterState;
      } 
      if ( _paySubscription !== null){   
        url +='&isReward='+ _paySubscription; 
      } 
      url += (_keyword === null ? '' : ('&keyword=' + _keyword));
      url += '&offset='+ currentPage *size +"&limit=" + size;

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((missions) => {
            let missionsGrid= "";
            let paging= "";
            let _missions = missions.data?.missions;
            let _missonsTotal = missions.data?.total;
            console.log('_missions' + JSON.stringify(_missions))
            console.log(' _missonsTotal' + JSON.stringify(_missonsTotal))
            // if ( _missonsTotal > 0 ){
              let iteration = _missonsTotal > size ? size : _missonsTotal;
              for( let i=0;  i < _missions.length ; i++){
                console.log('iteration' + iteration);
                let values = _missions[i];
                missionsGrid+=`<tr>
                          <td>
                            <div class="selector-cover checkbox solo">
                              <label class="label">
                                <input type="checkbox" name="notice-short" class="chk" onclick="itemCheck()" value=${values.userId}/>
                                <span class="label-text">
                                    <span class="selector"></span>
                                </span>
                              </label>
                            </div>
                          </td>
                          <td>${values.userId}</td>
                           <td><a href="./mission-completed-member-detail.html?userId=${values.userId}" class="underline">${values.name}</a></td>      
                           <td>${values.voiceCount}</td> 
                           <td>${values.communityCount}</td> 
                           <td>${values.reportCount}</td> 
                           <td>${values.postVoiceCount}</td> 
                           <td>${values.postReportCount}</td>                                               
                           <td>${values.isReward === 1 ? 'Y': 'N'}</td>                                               
                          <td>${dateToStr(strToDate(values.createDate))}</td>
                        <tr>`;              
              }
              let numOfPage = Math.ceil(Math.ceil((_missonsTotal-1)/size));
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
                            <a href="#" class="page-link" onclick="getMissionCompleteList(0,`+size+`)">First</a>
                          </li>`
              }
              if (currentPage == 0){ 
                paging += `<li class="controller prev disabled">`;
              } else {
                paging += `<li class="controller prev">
                            <a href="#" class="page-link" onclick="getMissionCompleteList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                          </li>`
              }
                      
              for ( let page = startOfPage ; page< endOfPage; page++){             
                  if (page === (currentPage)){
                    paging +=`<li class="paging current">` 
                  } else {
                    paging +=`<li class="paging">` 
                  }                                              
                  paging += `<a href="#" class="page-link" onclick="getMissionCompleteList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
              }      

              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller next disabled">`;
              } else {
                paging += `<li class="controller next">
                            <a href="#" class="page-link" onclick="getMissionCompleteList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                          </li>`
              }     
              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller last disabled">`;
              } else {
                paging += `<li class="controller last">
                            <a href="#" class="page-link" onclick="getMissionCompleteList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                          </li>`
              }                         
              console.log('missionsGrid' + missionsGrid);
              document.getElementById('mission-list_grid').innerHTML = missionsGrid === "" ? "<tr><td colspan='10'>데이터가 없습니다.</td></tr>": missionsGrid;
              document.getElementById('mission-list-total').innerHTML = '<strong> ' +_missonsTotal + ' </strong>';
              document.getElementById('mission-list-pagination').innerHTML = paging;
            // }
          });
      }).catch(error => console.log(error));
  }
  
  function getMission(type,menu = null){     
    let u = window.location.href;
    let _year = menu !== null ?document.getElementById('mission-year').value : (new Date()).getFullYear().toString();
    let _month = menu !== null ?document.getElementById('mission-month').value : ((new Date()).getMonth() +1).toString();    
   
    let _dateFilter = parseInt(_year + (_month<10?'0'+_month:_month));
    console.log('_dateFilter' + _dateFilter);
    if ( type ===1){
      $('#mission-month option[value='+ _month +']').attr('selected', true);
      window.sessionStorage.setItem("missionDate",_dateFilter);
    }
    
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    
    // console.log('id' + id);
    // let url = baseUrl + "/missions?userId=" + id;

    let url = baseUrl + "/missions?date=" +  _dateFilter;

    fetch(url, headers.json_headers)     
    .then((response) => {
      checkError(response.status);
      response.json().then((missions) => {
        let missionsTaskData = missions.data.tasks;
        let missionsData = missions.data.missions[0];
        
          // if(missionTaskData.length > 0){
            // let _faqData = faqData[0];
        console.log('missionsTaskData' + JSON.stringify(missionsTaskData));
        let _voice = missionsTaskData.voice;
        let _community = missionsTaskData.community;           
        let _report = missionsTaskData.report;           
        let _postVoice = missionsTaskData.postVoice;           
        let _postReport = missionsTaskData.postReport;           
                  
        if (type === 1){                
          document.getElementById('mission-voice').innerHTML ='<strong class="title">글쓰기 '+_voice+'회</strong>';
          document.getElementById('mission-community').innerHTML ='<strong class="title">글쓰기 '+_community+'회</strong>';
          document.getElementById('mission-report').innerHTML ='<strong class="title">이슈 제보 '+_report+'회</strong>';
          document.getElementById('mission-post-voice').innerHTML ='<strong class="title">글쓰는 기사 발행 '+_postVoice+'회</strong>';
          document.getElementById('mission-post-report').innerHTML ='<strong class="title">제보 내용이 기사로 발행 '+_postReport+'회</strong>';                 
        } else if (type === 2){              
          document.getElementById('mission-voice').value =_voice;
          document.getElementById('mission-community').value = _community;
          document.getElementById('mission-report').value = _report;
          document.getElementById('mission-post-voice').value = _postVoice;
          document.getElementById('mission-post-report').value = _postReport;
        } 
          
      })                    
    }).catch(error => console.log(error));
  }

  function getUserMission(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    // console.log('id' + id);
      // let url = baseUrl + "/missions?userId=" + id;

    let url = baseUrl + "/missions?userId=" + id ;
    window.sessionStorage.setItem('missionUserId',id);
    fetch(url, headers.json_headers)     
    .then((response) => {
      checkError(response.status);
      response.json().then((missions) => {
        let missionsTaskData = missions.data.tasks;
        let missionsData = missions.data.missions[0];
       
        //////// 미션 목표
        let _taskVoice = missionsTaskData.voice;
        let _taskCommunity = missionsTaskData.community;           
        let _taskReport = missionsTaskData.report;           
        let _taskPostVoice = missionsTaskData.postVoice;           
        let _taskPostReport = missionsTaskData.postReport;    
        
        /////// 개인 미션 수행결과
        /////// 기본 미션 --- 글 쓰는 20대, 커뮤너티, 제보하기
        let _missionVoiceCount = missionsData.voiceCount;
        let _missionVoiceDate = missionsData.voiceDate;

        let _missionCommunityCount = missionsData.communityCount;           
        let _missionCommunityDate = missionsData.communityDate;           

        let _missionReportCount = missionsData.reportCount;           
        let _missionReportDate = missionsData.reportDate;           

        /////// 도전 미션 --- 캠퍼스 에디터, 크롤러
        let _missionPostVoiceCount = missionsData.postVoiceCount;           
        let _missionPostVoiceDate = missionsData.postVoiceDate;           

        let _missionPostReportCount = missionsData.postReportCount;           
        let _missionPostReportDate = missionsData.postReportDate;           
        let _mobile = missionsData.mobile ? (missionsData.mobile).substr(0,3)+ '-' + (missionsData.mobile).substr(3,4) +  '-' + (missionsData.mobile).substr(7,4):"";
        document.getElementById('mission-name').innerHTML = missionsData.name;
        document.getElementById('mission-nickname').innerHTML = missionsData.nickname;
        document.getElementById('mission-email').innerHTML = missionsData.email;
        document.getElementById('mission-mobile').innerHTML = _mobile;
        // document.getElementById('mission-grade').innerHTML = '인증회원여부' + '('+ missionsData.schoolName?missionsData.schoolName :"" +')' ;
        document.getElementById('mission-grade').innerHTML = missionsData.schoolId? "인증회원" : "" +  (missionsData.schoolName?  '('+missionsData.schoolName+')':"")  ;

        document.getElementById('mission-voice-state').innerHTML = _taskVoice >= _missionVoiceCount ? 'Y' : 'N';
        document.getElementById('mission-voice-count').innerHTML = _missionVoiceCount + '회';
        document.getElementById('mission-voice-date').innerHTML = _missionVoiceDate? dateToStr(strToDate(_missionVoiceDate)): "";

        document.getElementById('mission-community-state').innerHTML = _taskCommunity >= _missionCommunityCount ? 'Y' : 'N';
        document.getElementById('mission-community-count').innerHTML = _missionCommunityCount + '회';
        document.getElementById('mission-community-date').innerHTML = _missionCommunityDate? dateToStr(strToDate(_missionCommunityDate)) :"";

        document.getElementById('mission-report-state').innerHTML = _taskReport >= _missionReportCount ? 'Y' : 'N';
        document.getElementById('mission-report-count').innerHTML = _missionReportCount + '회';
        document.getElementById('mission-report-date').innerHTML = _missionReportDate? dateToStr(strToDate(_missionReportDate)): "";

        document.getElementById('mission-post-voice-state').innerHTML = _taskPostVoice >= _missionPostVoiceCount ? 'Y' : 'N';
        document.getElementById('mission-post-voice-count').innerHTML = _missionPostVoiceCount + '회';
        document.getElementById('mission-post-voice-date').innerHTML = _missionPostVoiceDate? dateToStr(strToDate(_missionPostVoiceDate)): "";

        document.getElementById('mission-post-report-state').innerHTML = _taskPostReport >= _missionPostReportCount ? 'Y' : 'N';
        document.getElementById('mission-post-report-count').innerHTML = _missionPostReportCount + '회';
        document.getElementById('mission-post-report-date').innerHTML =_missionPostReportDate? dateToStr(strToDate(_missionPostReportDate)): "";  
        
        ////// 캐릿 구독권
        document.getElementById('mission-reward-state').innerHTML = missionsData.isReward === 0? 'N': 'Y';     
        document.getElementById('mission-reward-date').innerHTML = missionsData.rewardDate? dateToStr(missionsData.rewardDate):"";     
                
        if (missionsData.isReward === 0){
          document.getElementById("pay-complete-guide").style.display = 'block';
          document.getElementById("pay-complete").style.display = 'none';
        } else {
          document.getElementById("pay-complete-guide").style.display = 'none';
          document.getElementById("pay-complete").style.display = 'block';
        }
          
      })                    
    }).catch(error => console.log(error)); 
  }

  function modifyMission(){   
    let _voice = document.getElementById('mission-voice').value;
    let _community = document.getElementById('mission-community').value;
    let _report = document.getElementById('mission-report').value;
    let _postVoice = document.getElementById('mission-post-voice').value;
    let _postReport = document.getElementById('mission-post-report').value;

    console.log('_month' + _month);
    let _dateFilter = window.sessionStorage.getItem("missionDate");

    let url = baseUrl + "/mission-tasks" ;
    let params = {
        date : _dateFilter,
        voice: _voice,
        community: _community,
        report: _report,           
        postVoice: _postVoice,
        postReport: _postReport
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            //  location.href='./현황.html';           
             return
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const missionRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(missionRequest);
  }

  function confirmMission(){
    document.getElementById("missionAlertMessage").innerHTML = "<strong>미션이 설정되었습니다.</strong>";   
    location.href = "javascript:layerPopup.openPopup('missionAlertPopup', true)";
    // goMissionMain();
  }

  function cancelMission(){
    document.getElementById("missionConfirmMessage").innerHTML = "<strong>설정을 취소하시겠어요?</strong>";   
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = "./mission-board.html";
      return;
    });      
  }

  function goMissionMain(){
    // document.getElementById("missionConfirmMessage").innerHTML =  "<strong>캐릿 구권 지급 완료 안내하시겠어요?</strong>";
    // location.href = "javascript:layerPopup.openPopup('missionConfirmPopup', true)";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = "./mission-board.html";
      return;
    });      
    
  }

  function downloadCheck(){
    let alertMessage = "<strong>다운로드할 데이터가 없습니다.</strong>";
    if (document.getElementById('mission-list_grid').innerHTML === ""){
      document.getElementById("missionAlertMessage").innerHTML = alertMessage;
      location.href = "javascript:layerPopup.openPopup('missionAlertPopup', true)";
      return;
    } else {
      // document.getElementById("reasonFormPopupFile").innerHTML = alertMessage;
      location.href = "javascript:layerPopup.openPopup('reasonFormPopupFile', true)";
      // return;
    }
  }

  function getMissionMemberExcel(currentPage, size){
    let _keyword = document.getElementById('mission-search').value;
    let missionsState = document.getElementById('mission-state');
    let _filterState =  (missionsState.options[missionsState.selectedIndex]).value === 'all' ? null : (missionsState.options[missionsState.selectedIndex]).value ;    
    let paySubscription = document.getElementById('pay-subscription');
    let _paySubscription =  (paySubscription.options[paySubscription.selectedIndex]).value === 'all' ? null : (paySubscription.options[paySubscription.selectedIndex]).value ;   
    let downloadReason = document.getElementById("download-reason").value;
    let url = baseUrl + "/missions/excel?";
    if ( _filterState !== null){   
       url +='&filter='+ _filterState;
    } 
    if ( _paySubscription !== null){   
      url +='&isReward='+ _paySubscription;
    } 
    url += "&reason=" + downloadReason;
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

    console.log('downloadReason' + downloadReason.length);
    console.log('downloadReason' + downloadReason);
    if (downloadReason === ""){
      document.getElementById("missionAlertMessage").innerHTML = "<strong>파일다운로드하는 사유를 입력해 주세요.</strong>";
      location.href = "javascript:layerPopup.openPopup('missionAlertPopup', true)";
      return;
    } else if (downloadReason.length < 2){
      document.getElementById("missionAlertMessage").innerHTML =  "<strong>두자 이상 입력해 주세요.</strong>";
      location.href = "javascript:layerPopup.openPopup('missionAlertPopup', true)";
      return;
    }

    fetch(url, headers.excel_headers)
    .then((response) => {
        response.blob().then((points) => {
            var filename = 'missionMemeber.xlsx';
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(points);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
            console.log('points'+points)
        }); 
    }).catch(error => console.log(error));        
  }

  function addYearOption(){
     let thisYear = new Date().getFullYear();
     let filterYear = document.getElementById("mission-year");

     let _filterYear = filterYear.options[filterYear.selectedIndex].value;

     console.log('thisYear'+thisYear);
     console.log('_filterYear'+_filterYear);
  }

  function guideIncomeComplete(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    let _year = document.getElementById('mission-year').value;
    let _month = document.getElementById('mission-month').value; 
    let _dateFilter = parseInt(_year + (_month<10?'0'+_month:_month)); 
  
    if ( totalCnt === 0 ){    
      document.getElementById("missionAlertMessage").innerHTML = "<strong>지급할 사용자를 선택하세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('missionAlertPopup', true);";
      return;
    } else {
      document.getElementById("missionConfirmMessage").innerHTML =  "<strong>캐릿 구독권 지급 완료 안내하시겠어요?</strong>";
      location.href = "javascript:layerPopup.openPopup('missionConfirmPopup', true)";
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        
        for(const checkbox of checkboxes){       
          updateIsReward(_dateFilter,(checkbox.value).replace('/',''));
        }
      });      
    }  
  }

  function updateIsReward(_missionDate, _userId=null){   
    let url = baseUrl + "/mission" ;
    let params = { 
       date : _missionDate,
       userId : parseInt(_userId),
       isReward : 1   
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

  function checkDetail(){
      let _userId = window.sessionStorage.getItem('missionUserId');
      let missionDate = document.getElementById('mission-voice-date').innerHTML;
      let _dateFilter = parseInt((missionDate).substring(0,4) +(missionDate).substring(5,7)) ;
      // let _dateFilter =  parseInt(_year + (_month<10?'0'+_month:_month)); 
      // console.log('_missionDate'+ _missionDate);
      document.getElementById("missionConfirmMessage").innerHTML =  "<strong>캐릿 구독권 지급 완료 안내하시겠어요?</strong>";
      location.href = "javascript:layerPopup.openPopup('missionConfirmPopup', true)";
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {        
          updateIsReward(_dateFilter,_userId);
      });      
  }


function searchStart(e,type){
  if(e.keyCode === 13){  
    getMissionCompleteList(0,20);    
  }
}