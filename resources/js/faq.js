document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/etc/FAQ-list") >= 0) getFaqList(0,20);  
    else if(window.location.pathname.indexOf("/etc/FAQ-register-modify") >= 0) selectRegistModify();  
    else if(window.location.pathname.indexOf("/etc/FAQ-detail") >= 0)  getFaq();  
});

function getFaqList(currentPage, size){
    document.getElementById('faq-list_grid').innerHTML = "";

    let _keyword = document.getElementById('faq-search').value;
    console.log('_keyword' + _keyword);
    let faqState = document.getElementById('faq-state');
    let _filterState =  (faqState.options[faqState.selectedIndex]).value === 'all' ? null : (faqState.options[faqState.selectedIndex]).value ;    
    // let faqStatus = document.getElementById('faq-status');
    // let _filterStatus =  (bannerStatus.options[bannerStatus.selectedIndex]).value === 'all' ? null : (bannerStatus.options[bannerStatus.selectedIndex]).value ;    
    let faqCategory = document.getElementById('faq-category');
    let _filterCategory =  (faqCategory.options[faqCategory.selectedIndex]).value === 'all' ? null : (faqCategory.options[faqCategory.selectedIndex]).value ;    
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[1] = '';
    let _category = {}; _category[0] = '회원';_category[1] = '기사';_category[2] = '커뮤니티';
    
    let url = baseUrl + "/faqs?";
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
        // checkError(response.status);
        response.json().then((faqs) => {
            let faqGrid= "";
            let faqData = faqs.data.faqs;
            let _faqDataTotal = faqs.data.total;

            for( let i=0;  i < faqData.length ; i++){
            let values = faqData[i]
            faqGrid+=`<tr>
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
                <td><a href="./FAQ-detail.html?id=${values.id}" class="underline">${values.question}</a></td>            
                <td>${_category[values.category]}</td>                
                <td>${_state[values.state]}</td>                
                <td>${dateToStr(strToDate(values.createDate))}</td>
                <tr>`;             
            }
            let numOfPage = Math.ceil((_faqDataTotal)/size);
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
                        <a href="#" class="page-link" onclick="getFaqList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
            paging += `<li class="controller prev disabled">`;
            } else {
            paging += `<li class="controller prev">
                        <a href="#" class="page-link" onclick="getFaqList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                        
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                paging +=`<li class="paging current">` 
                } else {
                paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getFaqList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
            paging += `<li class="controller next disabled">`;
            } else {
            paging += `<li class="controller next">
                        <a href="#" class="page-link" onclick="getFaqList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
            paging += `<li class="controller last disabled">`;
            } else {
            paging += `<li class="controller last">
                        <a href="#" class="page-link" onclick="getFaqList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }                         
                
            document.getElementById('faq-list_grid').innerHTML  = faqGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": faqGrid;
            document.getElementById('faq-list-pagination').innerHTML = paging;
            document.getElementById('faq-list-total').innerHTML = '&nbsp;<strong>' +_faqDataTotal + '</strong>&nbsp;';
        });
    }).catch(error => console.log(error));
}

function getFaq(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('id' + id);

    let url = baseUrl + "/faqs?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
        checkError(response.status);
        response.json().then((faqs) => {
            let faqData = faqs.data.faqs;
            let faqDataTotal = faqs.data.total;
            
            if(faqData.length > 0){
                let _faqData = faqData[0];
                let _type = _faqData.category;
                let state = _faqData.state;           
                let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[1] = '';
                let _category = {}; _category[0] = '회원';_category[1] = '기사';_category[2] = '커뮤니티';

                document.getElementById('faq-state').innerHTML = _state[_faqData.state];
                document.getElementById('faq-category').innerHTML = _category[_faqData.category];
                document.getElementById('faq-question').innerHTML = _faqData.question;
                document.getElementById('faq-answer').innerHTML= (_faqData.answer).replaceAll('\n',"<br />");
            
                document.getElementById('faq-start-date').innerHTML = dateToStr(strToDate(_faqData.createDate?_faqData.createDate:""))
                console.log('faqId' + _faqData.id);
                window.sessionStorage.setItem("faqId",_faqData.id);
            }
        })                    
    }).catch(error => console.log(error));
}

function selectRegistModify(){
    let _faqId =window.sessionStorage.getItem("faqId");
    // console.log('_bannerId' + _bannerId);
    
    // console.log('num' + id)
    if ( _faqId === null){
        console.log('등록');
        document.getElementById('faq-regist').style.display = 'block';
        document.getElementById('faq-modify').style.display = 'none';
    } else {
        console.log('수정');
        document.getElementById('faq-regist').style.display = 'none';
        document.getElementById('faq-modify').style.display = 'block';
        
        // getNotification(_notificationId);
        let url = baseUrl + "/faqs?id=" + _faqId;
        fetch(url, headers.json_headers)     
        .then((response) => {
            checkError(response.status);
            response.json().then((faqs) => {
                // let notificaGrid= "";
                let faqData = faqs.data.faqs;
                let faqDataTotal = faqs.data.total;
                console.log('notificationData' + JSON.stringify(faqData));
                if(faqData.length > 0){
                let _faqData = faqData[0];
                let _state = _faqData.state;
                let _category = _faqData.category;
                let today = new Date();
                let createDate = new Date(_faqData.createDate);
                
        
                $('#faq-category option[value='+ _category +']').attr('selected', true);
                _state === 0 ? $(":radio[name='faq-state'][value='public']").prop('checked', true) :  $(":radio[name='faq-state'][value='private']").prop('checked', true);
                document.getElementById('faq-question').value = _faqData.question;
                document.getElementById('faq-answer').value = _faqData.answer;        
                }
            })                    
        }).catch(error => console.log(error));
        
        // window.sessionStorage.setItem("notification-id", id);
    }
}

function registFaq(){
    let category = document.getElementById("faq-category");
    let _category =  (category.options[category.selectedIndex]).value;
    console.log('_category' + _category);
    let _state =  $('input[name=faq-state]:checked').val() === 'private' ? 2 : $('input[name=faq-state]:checked').val() === 'reserved' ? 3 : 0;
    // let _postStartDate = document.getElementById('banner-start-date').value;
    // let _postEndDate = document.getElementById('banner-end-date').value;
    let _question = document.getElementById('faq-question').value;
    let _answer = document.getElementById('faq-answer').value;
    
    let url = baseUrl + "/faq/register" ;
    let params = {          
        // title: _title,   
        state: _state,         
        // category: _link,
        category: _category,
        question: _question,
        answer: _answer
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 201) {  // No content
                document.getElementById("faq-alert-message").innerHTML ='<strong>등록되었어요.</strong>';
                location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                    location.href = "./FAQ-list.html"
                });               
                // return;
                // location.href='./FAQ-list.html'
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

function modifyFaq(){
let category = document.getElementById("faq-category");
let _category =  (category.options[category.selectedIndex]).value;
console.log('_category' + _category);
let _state =  $('input[name=faq-state]:checked').val() === 'private' ? 2 : $('input[name=faq-state]:checked').val() === 'reserved' ? 3 : 0;
// let _postStartDate = document.getElementById('banner-start-date').value;
// let _postEndDate = document.getElementById('banner-end-date').value;
let _question = document.getElementById('faq-question').value;
let _answer = document.getElementById('faq-answer').value;
let _id =window.sessionStorage.getItem("faqId")
let url = baseUrl + "/faq" ;
let params = {          
    // title: _title,   
    id: _id,
    state: _state,         
    // category: _link,
    category: _category,
    question: _question,
    answer: _answer
}

async function post(request) {
try {
    await fetch(request).then(response => {
    console.log('modifyFaq 성공'+ response.status)
        if(response.status === 200) {  // No content
            location.href='./FAQ-list.html';
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

function changeFaqState(_state,faqId = null){
    console.log(' changeFaqState communityId' +faqId);
    let url = baseUrl + "/faq" ;
    let _faqId = faqId === null ? parseInt(window.sessionStorage.getItem("faqId")) : faqId;
    // console.log()
    let params = {     
        id:  _faqId,
        state: _state
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
                // location.href='./FAQ-list.html'
                if ( _state === 2){
                    document.getElementById("faq-alert-message").innerHTML ='<strong>비공개 상태로 변경되었어요.</strong>';
                    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
                    let okElement = document.getElementById("alert-OK");
                    okElement.addEventListener("click", function (e) {
                        location.href = "./FAQ-list.html"
                    });               
                    return;
                } else if( _state === 0){
                    document.getElementById("faq-alert-message").innerHTML ='<strong>공개 상태로 변경되었어요.</strong>';
                    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
                    let okElement = document.getElementById("alert-OK");
                    okElement.addEventListener("click", function (e) {
                        location.href = "./FAQ-list.html"
                    });               
                    return;
                } else if( _state === 1){
                    document.getElementById("faq-alert-message").innerHTML ='<strong>삭제가 완료되었어요.</strong>';
                    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
                    let okElement = document.getElementById("alert-OK");
                    okElement.addEventListener("click", function (e) {
                        location.href = "./FAQ-list.html"
                    });               
                    return;
                } 
                // return
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

function deleteFAQ(faqId = null){
    let url = baseUrl + "/faq" ;
    let faq_id = faqId === null ?window.sessionStorage.getItem("faqId") : faqId;
    console.log('faq_id' + faq_id)
    let params = {     
        id:  faq_id,
        state: 1
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
                document.getElementById("faq-alert-message").innerHTML ='<strong>삭제가 완료되었어요.</strong>';
                location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                    location.href = "./FAQ-list.html"
                });               
                return;
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

function checkFAQ(_state){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;
    
    if ( _state === 2){
        document.getElementById("faq-confirm-message").innerHTML ='<strong>선택한 FQA의 상태를  비공개로 변경하시겠어요?</strong>';
        location.href= "javascript:layerPopup.openPopup('faqConfirmPopup', true);";
        let okElement = document.getElementById("confirm-OK");
        okElement.addEventListener("click", function (e) {
            changeFaqState(2);
        });               
        return;
    } else if( _state === 1){
        document.getElementById("faq-confirm-message").innerHTML ='<strong>선택한 FQA의 상태를 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다.</strong>';
        location.href= "javascript:layerPopup.openPopup('faqConfirmPopup', true);";
        let okElement = document.getElementById("confirm-OK");
        okElement.addEventListener("click", function (e) {
            changeFaqState(1);
        });               
        return;
    } 
}

function changeFAQList( _state){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;

    if ( totalCnt === 0 ){
        if ( _state === 1){
            document.getElementById("faq-alert-message").innerHTML ='<strong>삭제할 항목을 선택해 주세요.</strong>';
            location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
            return;
        } else if( _state === 0){
            document.getElementById("faq-alert-message").innerHTML ='<strong>공개할 항목을 선택해 주세요.</strong>';
            location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
            return;
        } else if( _state === 2){
            document.getElementById("faq-alert-message").innerHTML ='<strong>비공개할 항목을 선택해 주세요.</strong>';
            location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
            return;
        }
    } 

    if ( _state === 2){
        document.getElementById("faq-confirm-message").innerHTML ='<strong>선택한 FQA의 상태를 비공개로 변경하시겠어요?</strong>';
        location.href= "javascript:layerPopup.openPopup('faqConfirmPopup', true);";
        let okElement = document.getElementById("confirm-OK");
        okElement.addEventListener("click", function (e) {
            for(const checkbox of checkboxes){            
                changeFaqState(_state,(checkbox.value).replace('/',''))
            }
            return;
        });               
        
    } else if( _state === 1){
        document.getElementById("faq-confirm-message").innerHTML ='<strong>선택한 FQA의 상태를 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다.</strong>';
        location.href= "javascript:layerPopup.openPopup('faqConfirmPopup', true);";
        let okElement = document.getElementById("confirm-OK");
        okElement.addEventListener("click", function (e) {
            for(const checkbox of checkboxes){                          
                deleteFAQ((checkbox.value).replace('/',''));              
            }
            return;
        });               
        
    } else if( _state === 0){
        document.getElementById("faq-confirm-message").innerHTML ='<strong>선택한 FQA의 상태를 공개로 변경하시겠어요?.</strong>';
        location.href= "javascript:layerPopup.openPopup('faqConfirmPopup', true);";
        let okElement = document.getElementById("confirm-OK");
        okElement.addEventListener("click", function (e) {
            for(const checkbox of checkboxes){            
                changeFaqState(_state,(checkbox.value).replace('/',''))
            }
            return;   
        });   
                
    }       
}

function checkInputFaq(type){ 
let category = document.getElementById("faq-category");
let _category =  (category.options[category.selectedIndex]).value;
let _question = document.getElementById('faq-question').value;
let _answer = document.getElementById('faq-answer').value;

if ( _category === 'all'){
    document.getElementById("faq-alert-message").innerHTML = "<strong>카테고리를 선택해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
    return;

} else if($('input[name="faq-state"]').is(":checked") === false){
    document.getElementById("faq-alert-message").innerHTML = "<strong>FAQ 상태를 체크해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
    return;

} else if (_question ===""){
    document.getElementById("faq-alert-message").innerHTML = "<strong>질문을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
    return;
} else if ( _answer ===""){
    document.getElementById("faq-alert-message").innerHTML = "<strong>답변을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('faqAlertPopup', true);";
    return;
} 

if (type === 1){
    registFaq();
} else {
    modifyFaq();
}
}

function goRegister(){
    window.sessionStorage.removeItem("faqId");
    location.href = "./FAQ-register-modify.html"
}

function searchStart(e,type){
    if(e.keyCode === 13){  
        getFaqList(0,20);    
    }
  }