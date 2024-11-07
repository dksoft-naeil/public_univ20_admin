document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/report-proposal/report-list") >= 0) getReportList(0,20);  
  else if(window.location.pathname.indexOf("/report-proposal/report-detail") >= 0) getReport();  
});

function getReportList(currentPage, size, type = 0){       
    let reportState = document.getElementById('report-state');
    let _filterState =  (reportState.options[reportState.selectedIndex]).value === 'all' ? null : (reportState.options[reportState.selectedIndex]).value ;    
    let domReferrer = document.referrer;
    console.log(domReferrer.indexOf('dashboard'))
    if ( domReferrer.indexOf('dashboard') !== -1 && (type === 0)){
      console.log('dashboard에서 오면');
      _filterState = 0;
      $('#report-state option[value=0]').attr('selected', true);
    } else {
      $('#report-state option[value=all]').attr('selected', true);
    }

    document.getElementById('report-list_grid').innerHTML = ""
    let reportPublishState = document.getElementById('report-publish-state');
    let _filterPublishState =  (reportPublishState.options[reportPublishState.selectedIndex]).value === 'all' ? null : (reportPublishState.options[reportPublishState.selectedIndex]).value ;    
    let _keyword = document.getElementById('report-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '답변완료';_state[2] = '답변대기'; _state[3] = '답변완료';
    // console.log('manager-action banner list page' + page );
    ///category(0:main 1:mypage 2:magazine 3:magazine_detail 4:voice 5:voice_detail 6:community 7:community_detail
    let _category = {}; _category[0] = '메인';_category[1] = '마이페이지';_category[2] = '매거진 목록';_category[3] = '매거진 기사';_category[4] = "20's voice 목록";_category[5] = "20's voice 기사";_category[6] = "커뮤니티 메인";_category[7] = "커뮤니티 글";

    let url = baseUrl + "/reports?";
   
    if ( _filterState !== null && _filterPublishState !== null){   
      if (parseInt(_filterState) === 2) {
        url +='&state=2';
      } else {
        if (_filterPublishState === 'Y'){
          url +='&state=0';
        } else {
          url +='&state=3';
        }        
      }
    } else if (_filterState !== null){
      if (_filterState === '2'){
        url +='&state=2';
      } else {
        url +='&state=0,3';
      }
    } else if (_filterPublishState !== null){   
        if (_filterPublishState === 'Y'){
          url +='&state=0';
        } else {
          url +='&state=3';
        }
    } else {
      url +='&state=0,2,3';
    }

    // if (_filterState !== null){   
    //   if (_filterState === '2'){
    //     url +='&state=2';
    //   } else {
    //     url +='&state=0,3';
    //   }
    // }
    if ( _keyword !== null && _keyword !== "" ){
      url += '&keyword=' + _keyword;
    }
    // url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

    //;
    fetch(url, headers.json_headers)
    .then((response) => {
      // checkError(response.status);
      response.json().then((reports) => {
        // console.log('banners' + JSON.stringify(reports.data));
        let reportGrid= "";
        let reportData = reports.data.reports;
        let reportDataTotal = reports.data.total;
        let numOfPage = Math.ceil(reportDataTotal/size);
        let iteration = reportData.length > size ? size :  reportData.length;
        console.log('manager-action banner list iteration' + iteration );
        // for( let i = reportDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
        for( let i=0;  i < reportData.length ; i++){
          let values = reportData[i]
          reportGrid+=`<tr>
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
                        <td><a href="./report-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                        <td>${values.state === 2 ? "답변대기" : "답변완료"}</td>           
                        <td>${values.state === 2? '-': values.state === 0?'Y' : 'N'}</td>
                        <td>${values.lastDate?dateToStr(strToDate(values.lastDate)):""}</td>
                        <td>${values.createDate?dateToStr(strToDate(values.createDate)):""}</td>
                      <tr>`;
        }

      //   let numOfPage = Math.ceil((_noticePopupDataTotal-1)/size);
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
                      <a href="#" class="page-link" onclick="getReportList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getReportList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getReportList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getReportList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getReportList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }                         
                  
        // console.log('noticeGrid' + noticeGrid)
        document.getElementById('report-list_grid').innerHTML  = reportGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>":reportGrid;          
        document.getElementById('report-list-pagination').innerHTML = paging;
        document.getElementById('report-list-total').innerHTML = '&nbsp;<strong>' +reportDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
}

function getReport(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('id' + id);

    let url = baseUrl + "/reports?id=" + id;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((report) => {
        let reportGrid= "";
        let reportData = report.data.reports;
        let reportDataTotal = report.data.total;
        let _state = {}; _state[0] = '게시';_state[2] = '제보전달';_state[3] = '답변완료(미발행)';//_state[null] = '';
          if(reportData.length > 0){
            let _reportData = reportData[0];
            let _type = reportData.category;
            let state = _reportData.state;        
            let _mobile = _reportData.mobile ? (_reportData.mobile).substr(0,3)+ '-' + (_reportData.mobile).substr(3,4) +  '-' + (_reportData.mobile).substr(7,4):"";   
            // console.log('_state' +_state[_state] );report-post
            document.getElementById('report-reply-state').innerHTML =  (_reportData.state === 3 || _reportData.state === 0)? "답변완료": "답변대기";
            document.getElementById('report-title').innerHTML = _reportData.title;
            document.getElementById('report-content').innerHTML = _reportData.content.replaceAll('\r\n', '<br />');

            document.getElementById('report-name').innerHTML = _reportData.name;
            document.getElementById('report-email').innerHTML = _reportData.email;
            document.getElementById('report-mobile').innerHTML = _mobile;
        
            document.getElementById('report-reply-date').innerHTML = _reportData.lastDate !== _reportData.createDate ? dateToStr(strToDate(_reportData.lastDate?_reportData.lastDate:"")) : "";
            document.getElementById('report-create-date').innerHTML = dateToStr(strToDate(_reportData.createDate?_reportData.createDate:""));
            document.getElementById('report-reply-content').value = _reportData.answer;

            state === 3 ? $(":radio[name='report-post'][value='nonIssue']").prop('checked', true) : $(":radio[name='report-post'][value='issue']").prop('checked', true) ;

            let imageGrid = "";
            for ( let i = 1 ; i< 6; i++){
              let fileName = 'file' + i.toString();
              let domId = 'report-image-file-'+ i.toString();

              if (_reportData[fileName] !== null){
              imageGrid += `
                        <div class="list-item">
                        <a href="javascript:layerPopup.openPopup('imageTypeNoneTitlePopup', true)"><img src="${_reportData[fileName]}" alt="" id="${domId}" onclick="pushPreview(${i})"/></a>
                        </div>
                      `;
                // document.getElementById(domId).src = _proposalData[fileName];
              }
            }              
            document.getElementById('report-image_grid').innerHTML = imageGrid;
            
            console.log('_proposalData.answer'+ _reportData.answer);
            if ( _reportData.answer !== null &&_reportData.answer !== ""){
              document.getElementById("reply-button").style.display = 'none';
              document.getElementById("issue-container").style.display = 'none';
              document.getElementById("report-reply-container").style.display = 'none';
              document.getElementById("report-answer-reply").innerHTML = _reportData.answer;
            } 
            
            // window.sessionStorage.setItem("proposalId",_proposalData.id);
            // }                                       
            window.sessionStorage.setItem("reportId",_reportData.id);
          }
      })                    
    }).catch(error => console.log(error));
}

function changeReportState(_state, reportId = null){

    let url = baseUrl + "/report" ;
    let _reportId = reportId === null ? parseInt(window.sessionStorage.getItem("reportId")) : reportId;
    let params = "";
    let _answer = "";
    if ( _state === 1){
      params = {     
        id:  _reportId,
        state: _state
      }
    } else {
      _answer = document.getElementById("report-reply-content").value;
      console.log('_answer'+_answer);
      console.log('reportId' + _reportId);
      params = {     
        id:  _reportId,
        state: _state,
        answer: _answer
      }
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            if (_state === 1 ){
              document.getElementById("report-alert-message").innerHTML = "<strong>삭제가 완료되었어요.</strong>";
              location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)";
            } else {
              document.getElementById("report-alert-message").innerHTML = "<strong>답변 내용이 입력되었습니다.</strong>";
              location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)";
            }
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href = "./report-list.html"
            });  
             return
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changeReportStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeReportStateRequest);
}  

function deleteListReport(){
  const checkboxes = document.querySelectorAll('.chk:checked');   
  // console.log('checkboxes' + JSON.stringify(checkboxes));

  const totalCnt = checkboxes.length;  
 
  if (totalCnt === 0){
    document.getElementById("report-alert-message").innerHTML = "<strong>한 개 이상 선택해야 합니다.</strong>";
    location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)";
  } else {
    document.getElementById("report-confirm-message").innerHTML = "<strong>선택한 제보기사를 삭제하시겠어요? 삭제된 제보기사는 복구할 수 없습니다.</strong>";
    location.href="javascript:layerPopup.openPopup('reportConfirmPopup', true)"; 
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      for(const checkbox of checkboxes){
      changeReportState(1,(checkbox.value).replace('/',''))
      }
    });  
  }
}

function reportConfirmPopup(){
  document.getElementById("reportConfirmMessage").innerHTML = "<strong>선택한 제보 기사를 삭제하시겠어요? 삭제된 제보 기사는(표지 모델은) 복구할 수 없습니다.</strong>";
  location.href="javascript:layerPopup.openPopup('reportConfirmPopup', true)";    
  return
} 

function cancelOK(){
  document.getElementById("voice-alert-title").innerHTML = "<strong>제안을 완료했습니다.</strong>";
  location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)";
  return
}

function reportReply(){
  
  let _reply = document.getElementById("report-reply-content").value;

  if (_reply === ""){
    document.getElementById("report-alert-message").innerHTML = "<strong>답변 내용을 입력해 주세요.</strong>";
    location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)";   
    return
  }

  // if ( count=== 0){
    document.getElementById("report-confirm-message").innerHTML = "<strong>작성한 답변은 제보자의 마이페이지에 게시됩니다.</strong>";
    location.href="javascript:layerPopup.openPopup('reportConfirmPopup', true)";   
  //   count++
  // }
  // // return;
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    let replyContent = document.getElementById("report-reply-content").value;
    if (replyContent === ""){
      document.getElementById("report-alert-message").innerHTML = "<strong>답변 내용을 입력해 주세요.</strong>";
      location.href="javascript:layerPopup.openPopup('reportAlertPopup', true)"; 
      return;
    } else {
      console.log('여기')
      let state = $('input[name=report-post]:checked').val() === 'issue' ? 0 :  3 ; 
      console.log('state'+state)
      changeReportState(state);
    }
  });   
}

function pushPreview(index){

  let domId = 'report-image-file-'+ index.toString();

    console.log('domId' + domId);
  document.getElementById("report-preview-image").src = document.getElementById(domId).src;
} 

function deleteReport(){
  document.getElementById("report-confirm-message").innerHTML = "<strong>선택한 제보기사를 삭제하시겠어요? 삭제된 제보기사는 복구할 수 없습니다.</strong>";
  location.href="javascript:layerPopup.openPopup('reportConfirmPopup', true)"; 
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    changeReportState(1)
  });  
}

function searchStart(e,type){
  if(e.keyCode === 13){  
    getReportList(0,20);    
  }
}