document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/etc/qna-list") >= 0) getQnaList(0,20);  
  else if(window.location.pathname.indexOf("/etc/qna-detail") >= 0) getQna();  
});

function getQnaList(currentPage, size, type=0){
  document.getElementById('qna-list_grid').innerHTML = "";
  let qnaState = document.getElementById('qna-state');
  let _filterState =  (qnaState.options[qnaState.selectedIndex]).value === 'all' ? null : (qnaState.options[qnaState.selectedIndex]).value ;    

  let domReferrer = document.referrer;    
  console.log(domReferrer.indexOf('dashboard'))
  if ( domReferrer.indexOf('dashboard') !== -1 && (type === 0)){
    console.log('dashboard에서 오면');
    _filterState = 0;
    $('#qna-state option[value=0]').attr('selected', true);
  }

  let _keyword = document.getElementById('qna-search').value;
  console.log('_keyword' + _keyword);
  
  let faqCategory = document.getElementById('qna-category');
  let _filterCategory =  (faqCategory.options[faqCategory.selectedIndex]).value === 'all' ? null : (faqCategory.options[faqCategory.selectedIndex]).value ;    
  let _state = {}; _state[0] = '공개';_state[2] = '답변완료';_state[1] = '';
  let _category = {}; _category[0] = '매거진';_category[1] = '미션 리워드';_category[2] = '나의 포인트';_category[3] = '신고/게시 중단';_category[4] = '비지니스';_category[5] = '기타';
  
  let url = baseUrl + "/qnas?";
  if ( _filterState !== null){   
      url +='&state='+ _filterState;
  } else {
      url +='&state=0,2,3';
  }
  if ( _filterCategory !== null){   
      url +='&category='+ _filterCategory;
  }

  url += (_keyword === null ? '' : ('&keyword=' + _keyword));
  url += '&offset='+ currentPage *size +"&limit=" + size;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((qnas) => {
        let qnaGrid= "";
        // console.log('noticeData' + JSON.stringify(noticeData))
        let qnaData = qnas.data.qnas;
        let qnaTotal = qnas.data.total;
      
        let iteration = qnaData.length > size ? size :  qnaData.length;
        console.log('manager-action notice list iteration' + iteration );
        for( let i=0;  i < qnaData.length ; i++){
        // console.log('${values.title}'+ JSON.stringify(values))
        let values = qnaData[i]
        qnaGrid+=`<tr>
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
            <td><a href="./qna-detail.html?id=${values.id}" class="underline">${values.title}</a></td>            
            <td>${_category[values.category]}</td>                
            <td>${values.state === 2 ? '답변완료' : "답변대기"}</td>                
            <td>${dateToStr(strToDate(values.createDate))}</td>
            <td>${dateToStr(strToDate(values.createDate))}</td>
            <tr>`;             
        }
        let numOfPage = Math.ceil((qnaTotal-1)/size);
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
                    <a href="#" class="page-link" onclick="getQnaList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getQnaList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                  
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
            paging +=`<li class="paging current">` 
            } else {
            paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getQnaList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getQnaList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getQnaList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }                         
            
        document.getElementById('qna-list_grid').innerHTML  =  qnaGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": qnaGrid;
        document.getElementById('qna-list-pagination').innerHTML = paging;
        document.getElementById('qna-list-total').innerHTML = '&nbsp;<strong>' +qnaTotal + '</strong>&nbsp;';
    });
  }).catch(error => console.log(error));
}

function getQna(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1];
  }
  console.log('id' + id);

  let url = baseUrl + "/qnas?id=" + id;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((qna) => {
      let qnaData = qna.data.qnas;
      // let qnaDataTotal = qna.data.total;
      
        if(qnaData.length > 0){
          let _qnaData = qnaData[0];
        //   let _type = _qnaData.category;
          let _state = _qnaData.state;           
          let _mobile = _qnaData.mobile ? (_qnaData.mobile).substr(0,3)+ '-' + (_qnaData.mobile).substr(3,4) +  '-' + (_qnaData.mobile).substr(7,4):"";
          ///// 기본 내용
          document.getElementById('qna-state').innerHTML =  _state ===2 ? "답변완료" :"답변대기";
          ///// 문의자
          document.getElementById('qna-name').innerHTML = _qnaData.name;
          document.getElementById('qna-email').innerHTML = _qnaData.email;
          document.getElementById('qna-mobile').innerHTML = _mobile;
          document.getElementById('qna-right').innerHTML = _qnaData.schoolId ? "대학생 인증 회원(" + _qnaData.schoolName + ")" : "";
          ///// 문의/신고 내용
          document.getElementById('qna-title').innerHTML = _qnaData.title;
          document.getElementById('qna-content').innerHTML = (_qnaData.content).replaceAll('\r\n','<br />');

          let imageGrid = "";
          for ( let i = 1 ; i< 6; i++){
            let fileName = 'file' + i.toString();
            let domId = 'qna-image-file-'+ i.toString();

            if (_qnaData[fileName] !== null){
              let imgSrc = _qnaData[fileName]
            imageGrid += `
                      <div class="list-item">
                      <a href="javascript:layerPopup.openPopup('imageTypeNoneTitlePopup', true);"><img src="${_qnaData[fileName]}" alt="" id="${domId}" onclick="pushPreview(${i})"/></a>
                      </div>
                    `;
            }
          }              
          document.getElementById('qna-image_grid').innerHTML = imageGrid;
      
          document.getElementById('qna-reply-date').innerHTML = dateToStr(strToDate(_qnaData.lastDate?_qnaData.lastDate:""))
          document.getElementById('qna-create-date').innerHTML = dateToStr(strToDate(_qnaData.createDate?_qnaData.createDate:""))
        //   document.getElementById('notice-popup-link').innerHTML = '<a href="javascript:void(0);" target="_blank" class="underline">_noticePopup.href</a>';
      
          ///// 답변
          console.log('_state' + _state)
          if ( _state === 2){
            document.getElementById("qna-replay-container").innerHTML= _qnaData.answer;
            document.getElementById("replay-button").style.display= 'none';
          }

          window.sessionStorage.setItem("qnaId",_qnaData.id);
        }
    })                    
  }).catch(error => console.log(error));
}

function deleteQna(_state,qnaId = null){
  console.log('qnaId' +qnaId);
  console.log('_stacte' +_state);
  let url = baseUrl + "/qna" ;
  let qna_id = qnaId === null ? parseInt(window.sessionStorage.getItem("qnaId")) : qnaId;
  // console.log()
  let params = {     
      id: qna_id,
      state: _state
  }
 
  async function post(request) {
  try {
     await fetch(request).then(response => {
        if(response.status === 200) {  // No content    
          document.getElementById("qna-alert-message").innerHTML = "<strong>삭제 되었어요.</strong>";
          location.href="javascript:layerPopup.openPopup('qnaAlertPopup', true)";   
          let okElement = document.getElementById("alert-OK");
          okElement.addEventListener("click", function (e) {                       
              location.href='./qna-list.html'     
          });                 
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

function deleteQnas(_state){
  console.log('changePopupsState state'+ _state)
  const checkboxes = document.querySelectorAll('.chk:checked');   
  const totalCnt = checkboxes.length;    
  // const stateText = _state === 1? '삭제': '비공개';
  if ( totalCnt === 0 ){
    // alert("선택하신 공지 팝업이 없습니다.");
    document.getElementById("qna-alert-message").innerHTML ='<strong>선택된 항목이 없습니다.</strong>';
    // document.getElementById("popup-alert-message").innerHTML = "선택하신 문의가 없습니다.";
    location.href= "javascript:layerPopup.openPopup('qnaAlertPopup', true);";
    return;
  } else {
    document.getElementById("qna-confirm-message").innerHTML ='<strong>선택한 문의/신고를 삭제하시겠어요? 삭제된 문의/신고 내용은 복구할 수 없습니다.</strong>';
    // document.getElementById("popup-alert-message").innerHTML = "선택하신 문의가 없습니다.";
    location.href= "javascript:layerPopup.openPopup('qnaConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {                       
      for(const checkbox of checkboxes){       
        deleteQna(_state,(checkbox.value).replace('/',''));
    }
    });     
  
  }
}

function replyQna( qnaId = null){/////qna-reply 
  let url = baseUrl + "/qna" ;
  let qna_id = qnaId === null ? parseInt(window.sessionStorage.getItem("qnaId")) : qnaId;
  let answer = document.getElementById("qna-reply").value;
  console.log('answer' + answer)
  let params = {     
      id: qna_id,
      answer: answer,
      state: 2
  }

  async function post(request) {
  try {
     await fetch(request).then(response => {
        if(response.status === 200) {  // No content    
          document.getElementById("qna-alert-message").innerHTML = "<strong>답변이 등록되었어요.</strong>";
          location.href="javascript:layerPopup.openPopup('qnaAlertPopup', true)";   
          let okElement = document.getElementById("alert-OK");
          okElement.addEventListener("click", function (e) {                       
              location.href='./qna-list.html'     
          });     
             
           return
        }
     }) 

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const replyQnaRequest = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

  post(replyQnaRequest);
}

function pushPreview(index){

  let domId = 'qna-image-file-'+ index.toString();

    console.log('domId' + domId);
  document.getElementById("qna-preview-image").src = document.getElementById(domId).src;
} 

function searchStart(e,type){
  if(e.keyCode === 13){  
      getQnaList(0,20,1);    
  }
}