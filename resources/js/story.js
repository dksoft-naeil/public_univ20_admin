document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/story/story-list") >= 0) getStoryList(0, 20);  
  else if(window.location.pathname.indexOf("/story/story-detail") >= 0) getStory();  
});
/// story ////////////////////////////////////////////////////////////////////////////////////
  function getStoryList(currentPage, size){       
    document.getElementById('story-list_grid').innerHTML = ""

    let storyYear = document.getElementById('story-year');
    let _filterYear =  (storyYear.options[storyYear.selectedIndex]).value === 'all' ? null : (storyYear.options[storyYear.selectedIndex]).value ;    
    let storyMonth = document.getElementById('story-month');
    let _filterMonth =  (storyMonth.options[storyMonth.selectedIndex]).value === 'all' ? null : (storyMonth.options[storyMonth.selectedIndex]).value ;    
    let _keyword = document.getElementById('story-search').value;

    let url = baseUrl + "/stories?" ;
    url +='&state=0,2';

    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

    if (_keyword !== null ){
      url += '&keyword=' + _keyword;
    }
    
    url += '&offset='+ currentPage *size +"&limit=" + size;
   ;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((stories) => {
        console.log('stories' + JSON.stringify(stories.data));
        let storyGrid= "";
        let storyData = stories.data.stories;
        let storyDataTotal = stories.data.total;
        let iteration = storyData.length > size ? size :  storyData.length;
        for( let i=0;  i < storyData.length ; i++){
          let values = storyData[i];
          storyGrid+=`<tr>
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
                        <td><a href="./story-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                        <td>${replacestr(values.name)}</td>
                        <td>${dateToStr(strToDate(values.createDate))}</td>
                        <td>${dateToStr(strToDate(values.createDate))}</td>
                        <td>${dateToStr(strToDate(values.createDate))}</td>
                      <tr>`;
        }
        let numOfPage = Math.ceil((storyDataTotal-1)/size);
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
                    <a href="#" class="page-link" onclick="getStoryList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
        paging += `<li class="controller prev disabled">`;
        } else {
        paging += `<li class="controller prev">
                    <a href="#" class="page-link" onclick="getStoryList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                  
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
            paging +=`<li class="paging current">` 
            } else {
            paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getStoryList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller next disabled">`;
        } else {
        paging += `<li class="controller next">
                    <a href="#" class="page-link" onclick="getStoryList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
        paging += `<li class="controller last disabled">`;
        } else {
        paging += `<li class="controller last">
                    <a href="#" class="page-link" onclick="getStoryList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }                         
        document.getElementById('story-list_grid').innerHTML  = storyGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": storyGrid;
        document.getElementById('story-list-pagination').innerHTML = paging;
        document.getElementById('story-list-total').innerHTML = '&nbsp;<strong>' +storyDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));
  }
  
  function getStory(){
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    ///0:연애, 1:진로, 2:일상, 3:우리학교
    // let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){//// && communityId != null){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    // else{
    //   id = notificationId;
    // }
    console.log('id' + id);

    let url = baseUrl + "/stories?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((stories) => {

        let storiesData = stories.data.stories;
        
        if(storiesData.length > 0){
          let _storyData = storiesData[0];
          let today = new Date();

          // 작성자
          document.getElementById('story-email').innerHTML = _storyData.email;        
          document.getElementById('story-mobile').innerHTML = _storyData.mobile;
          document.getElementById('story-name').innerHTML = _storyData.name;
          document.getElementById('story-nickname').innerHTML = _storyData.nickname;
          
          if(storiesData.length > 0){
            let _storyData = storiesData[0];
            let today = new Date();
  
            // 작성자
            document.getElementById('story-email').innerHTML = _storyData.email;        
            document.getElementById('story-mobile').innerHTML = _storyData.mobile?_storyData.mobile:"";
            document.getElementById('story-name').innerHTML = _storyData.name;
            document.getElementById('story-nickname').innerHTML = _storyData.nickname;
            
            ///제목 및 한 줄 소개
            document.getElementById('story-title').innerHTML = _storyData.title;
            document.getElementById('story-summary').innerHTML = _storyData.summary;
            document.getElementById('story-show-count').innerHTML = _storyData.showCount;
            document.getElementById('story-like-count').innerHTML = _storyData.likeCount;
            document.getElementById('story-create-date').innerHTML = dateToStr(strToDate(_storyData.createDate));
            document.getElementById('story-image-src').src = _storyData.file?_storyData.file:  "" ;

            let voiceList = [];
            for ( let i = 1; i < 11; i++){
              let columnName = 'voiceId' + i.toString();
              if (_storyData[columnName] !== null){
                voiceList.push(_storyData[columnName]);
              }
            }
            
            window.sessionStorage.setItem("storyId",_storyData.id)     
            getStoryVoice(voiceList);
          }                     
        }
      })
    }).catch(error => console.log(error));
  }

  ////// story관련 voice ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getStoryVoice(_voiceList){
    // let _storyId = window.sessionStorage.getItem("storyId");
    console.log('_voiceList' + _voiceList)

    let storyCommentGrid= "";
    let url = baseUrl + "/voices?id=" + _voiceList;
      
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((storyVoice) => {         
        let storyCommentData = storyVoice.data.voices;  
        let storyCommentTotal = storyVoice.data.total;  
        for ( let i = 0 ; i< storyCommentData.length ; i++){
          let values = storyCommentData[i];
          console.log('storyCommentData' + JSON.stringify(storyCommentData));
          storyCommentGrid+=`<tr>
              <td>${values.id}</td>
              <td>${values.title}</td>
              <td>${values.state === 0 ? '공개': '비공개' }</td>
              <td>${values.startDate? dateToStr(strToDate(values.startDate)):""}</td>
              <td>${values.createDate? dateToStr(strToDate(values.createDate)):""}</td>
            <tr>`;             
        }
        document.getElementById("story-comment-list_grid").innerHTML = storyCommentGrid;
        document.getElementById("story-comment-list-total").innerHTML = storyCommentTotal;
        console.log('storyCommentGrid' + storyCommentGrid);
      });
    }).catch(error => console.log(error));
  }
   
  function deleteCommunity(storyId = null){
    let story_id = storyId === null ?window.sessionStorage.getItem("storyId") : storyId;
    let reason = document.getElementById('reason');
    let _reason =  (reason.options[reason.selectedIndex]).value === 'all' ? null : (reason.options[reason.selectedIndex]).value ;   
    let _reasonMessage = "";

  
    console.log('_reason' + _reason)
    console.log('_reasonMessage'+_reasonMessage); console.log('_reason' + _reason)
   
    if ( parseInt(_reason) !== 3){
      _reasonMessage = reason.options[_reason].text;
    } else {
      _reasonMessage = document.getElementById("reason-etc").value;
    }
  
    let url = baseUrl + "/story" ;
   
    let params = {     
        id:  story_id,
        state: 1,
        reason:_reasonMessage
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
                // document.getElementById("community-alert-message").innerHTML = "<strong>삭제되었습니다.</strong>";
                // location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
                // let okElement = document.getElementById("alert-OK");
                // okElement.addEventListener("click", function (e) {
                //   location.href='./community-list-all.html';
                // });
            }
        }) 
  
        } catch (error) {
        console.error("Error:", error);
        }
    }
  
    const communityrequest = new Request(url, {
        method: "POST",
        headers: headers.json_headers.headers,
        body: JSON.stringify(params),
    });
  
    post(communityrequest);
  }

  function changeStoryList(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;        
    console.log('total' + totalCnt)
    if (totalCnt === 0 ){
      document.getElementById("storyAlertMessage").innerHTML = "<strong>선택하신 항목이 없습니다.</strong>";
      location.href="javascript:layerPopup.openPopup('storyAlertPopup', true);";
      return
    } else{

      location.href="javascript:layerPopup.openPopup('deleteReasonPopup', true);";
      selectReason('reason','reason-etc');
      let okElement = document.getElementById("reason-OK");
      okElement.addEventListener("click", function (e) {
        console.log('여기')
        for(const checkbox of checkboxes){        
          // console.log('checkbox.value' + (checkbox.value).replace('/',''));
          deleteCommunity((checkbox.value).replace('/',''))
       }

       document.getElementById("storyAlertMessage").innerHTML = "<strong>삭제되었습니다.</strong>";
       location.href="javascript:layerPopup.openPopup('storyAlertPopup', true);";
       let alertOkElement = document.getElementById("alert-OK");
       alertOkElement.addEventListener("click", function (e) {
          location.href="./story-list.html"
        });
      })
    }
  }

  function changeStory(){ 
      location.href="javascript:layerPopup.openPopup('deleteReasonPopup', true);";
      let okElement = document.getElementById("reason-OK");
      okElement.addEventListener("click", function (e) {
       deleteCommunity();

       document.getElementById("storyAlertMessage").innerHTML = "<strong>삭제되었습니다.</strong>";
       location.href="javascript:layerPopup.openPopup('storyAlertPopup', true);";
       let alertOkElement = document.getElementById("alert-OK");
       alertOkElement.addEventListener("click", function (e) {
          location.href="./story-list.html"
        });
      })
  }  

  function searchStart(e){
    if(e.keyCode === 13){
        getStoryList(0,20);
    }
  }