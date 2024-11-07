document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/point/point-list") >= 0) getPointList(0,20,0);  
    else if(window.location.pathname.indexOf("/point/point-detail") >= 0) getPoint();  
  });
  
var pointUserId ;

///// 포인트 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getPointList(currentPage, size, type =0){
    document.getElementById('point-list_grid').innerHTML = "";
    let url = baseUrl + "/points?";
    let pointState = document.getElementById('point-state');
    _filterState =  (pointState.options[pointState.selectedIndex]).value === 'all' ? null : (pointState.options[pointState.selectedIndex]).value ;    

    let domReferrer = document.referrer;
    console.log(domReferrer.indexOf('dashboard'))
    if ( domReferrer.indexOf('dashboard') !== -1 && (type === 0)){
      console.log('dashboard에서 오면');
      _filterState = 0;
      $('#point-state option[value=0]').attr('selected', true);
    } 
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    }     
   
    let _keyword = document.getElementById('point-search').value;
    let _state = {}; _state[0] = '입금신청';_state[1] = '입금완료';

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;
   ;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((points) => {
          let pointGrid= "";
          let pointData = points.data.points;
          let pointDataTotal = points.data.total;
          let iteration = pointData.length > size ? size :  pointData.length;
          console.log('manager-action notice list iteration' + iteration );
      for( let i=0;  i < pointData.length ; i++){
          let values = pointData[i]
          pointGrid+=`<tr>
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
              <td><a href="./point-detail.html?userId=${values.id}" class="underline">${replacestr(values.name)}</a></td>            
              <td>${(values.postVoicePoint).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</td>                
              <td>${(values.postReportPoint).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</td>                
              <td>${(values.point).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</td>             
              <td>${values.pointSettleState !== null? values.pointSettleState === 1 ?"입금완료":"입금신청" : "-"}</td>                
              <td>${values.pointSettleDate?dateToStr(strToDate(values.pointSettleDate)):""}</td>
              <td>${values.pointGainDate?dateToStr(strToDate(values.pointGainDate)):""}</td>
              <tr>`;             
          }

          let numOfPage = Math.ceil((pointDataTotal-1)/size);
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
                      <a href="#" class="page-link" onclick="getPointList(0,`+size+`)">First</a>
                      </li>`
          }
          if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
          } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getPointList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                      </li>`
          }
                  
          for ( let page = startOfPage ; page< endOfPage; page++){             
              if (page === (currentPage)){
              paging +=`<li class="paging current">` 
              } else {
              paging +=`<li class="paging">` 
              }                                              
              paging += `<a href="#" class="page-link" onclick="getPointList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
          }      

          if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
          } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getPointList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                      </li>`
          }     
          if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
          } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getPointList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                      </li>`
          }                         
              
          document.getElementById('point-list_grid').innerHTML  = pointGrid;          
          document.getElementById('point-list-pagination').innerHTML = paging;
          document.getElementById('point-list-total').innerHTML = '&nbsp;<strong>' +pointDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));

    function splitParam(paramName){
      _tempUrl = window.location.search.substring(1);
      var _tempArray = _tempUrl.split('&');
      for(var i = 0; _tempArray.length; i++) {
        var _keyValuePair = _tempArray[i].split('='); // '=' 을 기준으로 분리하기
        
        if(_keyValuePair[0] == paramName){ // _keyValuePair[0] : 파라미터 명
          // _keyValuePair[1] : 파라미터 값
          return _keyValuePair[1];
        }
      }
    }
  }

  function getPoint(){
    let u = window.location.href;
    let userId;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        userId = pair[1];
    }
    console.log('id' + userId);

    let url = baseUrl + "/points?userId=" + userId;
    window.sessionStorage.setItem('pointUserId',userId);
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((point) => {
        let pointData = point.data.points;
        
          if(pointData.length > 0){
            let _pointData = pointData[0];
            let state = _pointData.state;           
            let _state = {}; _state[0] = '입금신청';_state[1] = '입금완료';
            let _mobile = _pointData.mobile? _pointData.mobile.substring(0,3)+'-'+_pointData.mobile.substring(3,7) + '-' + _pointData.mobile.substring(7,13):"" ;
            document.getElementById('point-name').innerHTML =  _pointData.name;
            document.getElementById('point-nickname').innerHTML =  _pointData.nickname;
            document.getElementById('point-email').innerHTML =  _pointData.email;
            document.getElementById('point-mobile').innerHTML =  _mobile;
            document.getElementById('point-settlement-state').innerHTML =  _pointData.pointSettleState === 0 || _pointData.pointSettleState  === null ? '입금대기':"입금완료";
            document.getElementById('point-grade').innerHTML =  _pointData.schoolId? '대학생 인증 회원()':"";
            document.getElementById('complete-income').style.display =  (_pointData.pointSettleState ===1 )?  'block' : 'none' ;
            document.getElementById('save-account').style.display =  (_pointData.pointSettleState ===1 )?  'none' : 'block' ;
            document.getElementById('complete-income-guide').style.display =  (_pointData.pointSettleState ===1 )?  'none' : 'block' ;
            document.getElementById('point-bank-account').value =  _pointData.bankAccount;
            document.getElementById('point-bank-name').value =  _pointData.bankName;  
            pointUserId = _pointData.id                      
          }

          getSettlement(0,20,userId);

      })                    
    }).catch(error => console.log(error));
  }

  function getSettlement(currentPage =null, size=null, _userId){
    let url = baseUrl + "/settlements?userId=" + _userId;    

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((settlements) => {
        let settlementsGrid= "";
        let settlementsData = settlements.data.settlements;
        let settlementsDataTotal = settlements.data.total;
        let numOfPage = Math.ceil(settlementsDataTotal/size);
        let iteration = settlementsData.length > size ? size :  settlementsData.length;
        for( let i=0;  i < settlementsData.length ; i++){
          let values = settlementsData[i];
          let _point = (values.point).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          let _pointSum = (parseInt(values.postReportPoint) + parseInt(values.postVoicePoint)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          let _money = (values.money).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          settlementsGrid+=`<tr>
              <td>${values.id}</td>            
              <td>${_point}(${_pointSum})</td>
              <td>${_money}</td>    
              <td>${dateToStr(strToDate(values.lastDate))}</td>
            <tr>`;             
        }

        let startOfPage = Math.floor(currentPage/10)* 10;
        let endOfPage = (Math.floor(currentPage/10) + 1) * 10 ;
        if (numOfPage < endOfPage){
          endOfPage = numOfPage;
        }           
        paging =`<ul class="pagination">`;
        if (currentPage <= 0){ 
          paging += `<li class="controller first disabled">`;
        } else {
          paging += `<li class="controller first">
                      <a href="#" class="page-link" onclick="getSettlement(0,`+size+`,`+_userId +`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getSettlement(`+(currentPage-1)+`,`+ size +`,`+_userId + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getSettlement(`+page+`,`+ size +`,`+_userId + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getSettlement(`+(currentPage+1)+`,`+ size +`,`+_userId + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getSettlement(`+(numOfPage-1)+`,`+size +`,`+_userId + `)">Last</a>
                    </li>`
        }       

        document.getElementById('settlement-list_grid').innerHTML = settlementsGrid;        
        document.getElementById('settlement-pagination').innerHTML = paging;        
        // document.getElementById('settlement-list-total').innerHTML = '&nbsp;<strong>' + settlementsDataTotal + '</strong>&nbsp;';        
      })
    }).catch(error => console.log(error));
  }

  function downloadCheck(){
    let alertMessage = "<strong>다운로드할 데이터가 없습니다.</strong>";
    if (document.getElementById('point-list_grid').innerHTML === ""){
      document.getElementById("point-alert-message").innerHTML = alertMessage;
      location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
      return;
    } else {
      // document.getElementById("reasonFormPopupFile").innerHTML = alertMessage;
      location.href = "javascript:layerPopup.openPopup('reasonFormPopupFile', true)";
      // return;
    }
  }

  function getPointExcel(currentPage, size){
    let _keyword = document.getElementById('point-search').value;
    let pointState = document.getElementById('point-state');
    let _filterState =  (pointState.options[pointState.selectedIndex]).value === 'all' ? null : (pointState.options[pointState.selectedIndex]).value ;    
    let _state = {}; _state[0] = '입금신청';_state[1] = '입금완료';
    let downloadReason = document.getElementById("pointReason").value;
    
    let url = baseUrl + "/points/excel?";
    if ( _filterState !== null){   
        url +='&state='+ _filterState;
    }

    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

    // missionAlertMessage
    console.log('downloadReason' + downloadReason);
    console.log('downloadReason.length' + downloadReason.length)
    if (downloadReason === ""){
        document.getElementById("point-alert-message").innerHTML = "<strong>파일다운로드하는 사유를 입력해 주세요.</strong>";
        location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
        return;
    } else if (downloadReason.length < 2){
        document.getElementById("point-alert-message").innerHTML =  "<strong>두자 이상 입력해 주세요.</strong>";
        location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
        return;
    } 

    fetch(url, headers.excel_headers)
    .then((response) => {
        response.blob().then((points) => { 
            var filename = 'pointMemeber.xlsx';
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

  function guideIncomeComplete(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;       
    if ( totalCnt === 0 ){    
      document.getElementById("point-alert-message").innerHTML = "<strong>선택하신 사용자가 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('pointAlertPopup', true);";
      return;
    } else {
      document.getElementById("point-confirm-message").innerHTML = "<strong>포인트 입금완료를 안내하시겠어요?</strong>";
      location.href = "javascript:layerPopup.openPopup('pointConfirmPopup', true)";
      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){    
          changeUserPointSettlement((checkbox.value).replace('/',''));
        }
        document.getElementById("point-alert-message").innerHTML = "<strong>안내가 완료되었어요.</strong>";
        location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
        let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {            
          location.href = "./point-list.html";
        });
      });
    }
  }

 function saveBankAccount(){  
  // user 은행 정보 저장
  let bankname = document.getElementById("point-bank-name").value;
  let bankaccount= document.getElementById("point-bank-account").value;

  if (bankname === "" ) {
    console.log("은행명을 입력해 주세요.");
    document.getElementById("point-alert-message").innerHTML = "<strong>은행명을 입력해 주세요</strong>";
    location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
    return;
  } else  if (bankaccount === "" ) {
    document.getElementById("point-alert-message").innerHTML = "<strong>계좌번호를 입력해 주세요.</strong>";
    location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
    return;
  }

  // let 
  console.log('pointUserId' + pointUserId);
  let url = baseUrl + "/user" ;
  let params = {          
      id: pointUserId,
      bankName: bankname,         
      bankAccount: bankaccount
  }

  async function post(request) {
  try {
      await fetch(request).then(response => {
      // console.log('modifyFaq 성공'+ response.status)
          if(response.status === 200) {  // No content
              location.href='./point-detail.html?userId=' + pointUserId;
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

function selectChange(){
  location.href="./point-list.html?dashboard=0";
}

function changeUserPointSettlement(userId = null){
  let url = baseUrl + "/point" ;

  let params = {     
      userId:  userId,
      state: 1
  }

  async function post(request) {
  try {
    await fetch(request).then(response => {
        // console.log('_state' + _state);
        if(response.status === 200) {  // No content              
         
          return
        }
    }) 

    } catch (error) {
      console.error("Error:", error);
    }
  }

  const changeBannerStateRequest = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers, 
    body: JSON.stringify(params),
  });

  post(changeBannerStateRequest);
}

function checkDetail(){
  let _pointUserId = window.sessionStorage.getItem('pointUserId');
  document.getElementById("point-confirm-message").innerHTML = "<strong>포인트 입금완료를 안내하시겠어요?</strong>";
  location.href = "javascript:layerPopup.openPopup('pointConfirmPopup', true)";
  let okElement = document.getElementById("confirm-OK");
  okElement.addEventListener("click", function (e) {
    changeUserPointSettlement(_pointUserId);
    document.getElementById("point-alert-message").innerHTML = "<strong>안내가 완료되었어요.</strong>";
    location.href = "javascript:layerPopup.openPopup('pointAlertPopup', true)";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = './point-detail.html?userId='+_pointUserId;
    })
  })
}

function searchStart(e){
  if(e.keyCode === 13){
    getPointList(0,20);
  }
}

