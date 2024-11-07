document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/report-proposal/proposal-list") >= 0) getProposalList(0,20);  
  else if(window.location.pathname.indexOf("/report-proposal/proposal-detail") >= 0) getProposal();  
});

  /// proposal ////////////////////////////////////////////////////////////////////////////////////
  function getProposalList(currentPage, size, type =0){       
    document.getElementById('proposal-list_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;
    let proposalState = document.getElementById('proposal-reply-state');
    let _filterState =  (proposalState.options[proposalState.selectedIndex]).value === 'all' ? null : (proposalState.options[proposalState.selectedIndex]).value ;    

    let domReferrer = document.referrer;
    console.log(domReferrer.indexOf('dashboard'))
    if ( domReferrer.indexOf('dashboard') !== -1 && (type === 0)){
      console.log('dashboard에서 오면');
      _filterState = 0;
      $('#proposal-reply-state option[value=0]').attr('selected', true);
    }

    let _keyword = document.getElementById('proposal-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '답변대기';_state[2] = '답변완료';
    let url = baseUrl + "/proposals?" ;
    
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
    url +='&state=0,2';
    }

    url += (_keyword === null ? '' : ('&keyword=' + _keyword)); 
    url += '&offset='+ currentPage*size +"&limit=" + size;

   ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((proposals) => {
        // console.log('proposals' + JSON.stringify(proposals.data));
        let proposalGrid= "";
        let proposalData = proposals.data.proposals;
        let proposalDataTotal = proposals.data.total;
        let iteration = proposalData.length > size ? size :  proposalData.length;
        console.log('iteration' + iteration );
        for( let i=0;  i < proposalData.length ; i++){
          let values = proposalData[i]
          // console.log('values' + JSON.stringify(values))
          console.log('values' + (values.birth)?.substring(4,6))
          proposalGrid+=`<tr>
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
              <td><a href="./proposal-detail.html?id=${values.id}" class="underline">${values.name}</a></td>
              <td>${values.birth=== null ? "" : calculateAge(new Date((values.birth)?.substring(0,4),(values.birth)?.substring(4,6),(values.birth)?.substring(7,8)))}</td>           
      
              <td>${values.schoolName}</td>           
              <td>${_state[values.state]}</td>           
              <td>${dateToStr(strToDate(values.createDate))}</td>
              <td>${dateToStr(strToDate(values.lastDate))}</td>
            <tr>`;             
        }
        let numOfPage = Math.ceil((proposalDataTotal-1)/size);
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
            paging += `<a href="#" class="page-link" onclick="getNoticePopupList(`+page+`,`+ size + `)">`+ (currentPage+1) +`</a></li>`;
        }      
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
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
        document.getElementById('proposal-list_grid').innerHTML = proposalGrid=== "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": proposalGrid;          
        document.getElementById('proposal-list-pagination').innerHTML = paging;
        document.getElementById('proposal-list-total').innerHTML = '&nbsp;<strong>' +proposalDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }
  
  function getProposal(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('id' + id);

    let url = baseUrl + "./proposals?id=" + id;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((proposal) => {
        let proposalData = proposal.data.proposals;
        
          if(proposalData.length > 0){
            let _proposalData = proposalData[0];
            let state = _proposalData.state;           
            
            document.getElementById('proposal-state').innerHTML = _proposalData.state === 2 ? '답변완료' : '답변대기';
        
            document.getElementById('proposal-name').innerHTML = _proposalData.name;
            document.getElementById('proposal-email').innerHTML = _proposalData.email;
            document.getElementById('proposal-school-name').innerHTML = _proposalData.schoolName;
            // document.getElementById('proposal-school-id').innerHTML = _proposalData.schoolId;
            document.getElementById('proposal-sns-account').innerHTML = _proposalData.snsAccount;
            document.getElementById('proposal-student-number').innerHTML = _proposalData.studentNumber;
            document.getElementById('proposal-mobile').innerHTML = _proposalData.mobile;
            document.getElementById('proposal-content').innerHTML = _proposalData.content;          
            document.getElementById('proposal-create-date').innerHTML = dateToStr(strToDate(_proposalData.createDate?_proposalData.createDate:""))
            document.getElementById('proposal-last-date').innerHTML = dateToStr(strToDate(_proposalData.lastDate?_proposalData.lastDate:""))

            let imageGrid = "";
            for ( let i = 1 ; i< 11; i++){
              let fileName = 'file' + i.toString();
              let domId = 'proposal-image-file-'+ i.toString();

              if (_proposalData[fileName] !== null){
              imageGrid += `
                        <div class="list-item">
                        <a href="javascript:layerPopup.openPopup('imageTypeNoneTitlePopup', true)"><img src="${_proposalData[fileName]}" alt="" id="${domId}" onclick="pushPreview(${i})"/></a>
                        </div>
                      `;
                // document.getElementById(domId).src = _proposalData[fileName];
              }
            }              
            document.getElementById('proposal-image_grid').innerHTML = imageGrid;
            
            console.log('_proposalData.answer'+ _proposalData.answer);
            if ( _proposalData.answer !== null &&_proposalData.answer !== ""){
              document.getElementById("reply-button").style.display = 'none';
              document.getElementById("proposal-reply-container").style.display = 'none';
              document.getElementById("proposal-answer-reply").innerHTML = _proposalData.answer;
            } 
            
            window.sessionStorage.setItem("proposalId",_proposalData.id);
          }
      })                    
    }).catch(error => console.log(error));
  }

  function replyProposal(){
    let _proposalId = window.sessionStorage.getItem("proposalId")
    let _answer = document.getElementById("proposal-reply").value;

    console.log('_answer' + _answer);
    if (_answer ===""){
      document.getElementById("proposal-alert-title").innerHTML = "<strong>답변 내용을 입력해주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('proposalAlertPopup', true);";
    }

    let url = baseUrl + "/proposal" ;
    let params = {      
        id: _proposalId,
        state: 2,
        answer: _answer
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content        
            document.getElementById("proposal-alert-title").innerHTML = "<strong>답변이 등록되었습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('proposalAlertPopup', true);";
            let okElement = document.getElementById("alert-ok");
            okElement.addEventListener("click", function (e) {
              location.href ="./proposal-list.html"
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

  function calculateAge(birthDate) {
  // 생년월일을 '년', '월', '일'로 분리합니다.
  var birthYear = birthDate.getFullYear();
  var birthMonth = birthDate.getMonth();
  var birthDay = birthDate.getDate();

  // 현재 날짜를 가져옵니다.
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate();

  // 만 나이를 계산합니다.
  var age = currentYear - birthYear;

  // 현재 월과 생일의 월을 비교합니다.
  if (currentMonth < birthMonth) {
    age--;
  }
  // 현재 월과 생일의 월이 같은 경우, 현재 일과 생일의 일을 비교합니다.
  else if (currentMonth === birthMonth && currentDay < birthDay) {
    age--;
  }

  return age;
  }

  function changeProposalState(_state, proposalId = null){
    // console.log('qnaId' +qnaId);
    // console.log('_stacte' +_state);
    let url = baseUrl + "/proposal" ;
    let proposal_id = proposalId === null ? parseInt(window.sessionStorage.getItem("proposalId")) : proposalId;
    console.log('proposal_id' + proposal_id);
    let params = {     
        id: proposal_id,
        state: _state
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
        
            return
          }
       }) 
  
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    const deleteQnaRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });
  
    post(deleteQnaRequest);
  }

  function changeProposalsState(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    if ( totalCnt === 0 ){
      document.getElementById("proposal-alert-title").innerHTML ='<strong>삭제할 항목이 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('proposalAlertPopup', true);";
      return;
    } 
    for(const checkbox of checkboxes){       
        changeProposalState(1,(checkbox.value).replace('/',''));
    }

    document.getElementById("proposal-alert-title").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
    location.href= "javascript:layerPopup.openPopup('proposalAlertPopup', true);"; 
    let okElement = document.getElementById("alert-ok");
    okElement.addEventListener("click", function (e) {
      location.href= 'proposal-list.html';
    });
   
  }

  function changeProposalDelete(_state, proposalId){
    // console.log('qnaId' +qnaId);
    // console.log('_stacte' +_state);
    let url = baseUrl + "/proposal" ;
    let proposal_id = proposalId === null ? parseInt(window.sessionStorage.getItem("proposalId")) : proposalId;
    console.log('proposal_id' + proposal_id);
    let params = {     
        id: proposal_id,
        state: _state
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            location.href = "proposal-list.html"
            return
          }
       }) 
  
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    const deleteQnaRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });
  
    post(deleteQnaRequest);
  }

  function deleteAlert(){
    document.getElementById("proposal-confirm-message").innerHTML ='<strong>선택한 표지모델을 삭제하시겠어요? 삭제된 표지모델는 복구할 수 없습니다..</strong>';
    location.href= "javascript:layerPopup.openPopup('proposalConfirmPopup', true);";
    let okElement = document.getElementById("confirm-ok");
    okElement.addEventListener("click", function (e) {
      changeProposalDelete(1,null);
    });
  }

  function pushPreview(index){

    let domId = 'proposal-image-file-'+ index.toString();
  
      console.log('domId' + domId);
    document.getElementById("proposal-preview-image").src = document.getElementById(domId).src;
  } 

  function searchStart(e){
    if(e.keyCode === 13){
      getProposalList(0,20);
    }
  }