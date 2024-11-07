document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/ad-banner/ad-banner-list") >= 0) getBannerList(0, 20);  
  else if(window.location.pathname.indexOf("/ad-banner/ad-banner-board") >= 0) getBannerCurrentStat();  
  else if(window.location.pathname.indexOf("/ad-banner/ad-banner-detail") >= 0) getBanner();   
  else if(window.location.pathname.indexOf("/ad-banner/ad-banner-modify") >= 0) selectRegistModify();  
  else if(window.location.pathname.indexOf("/ad-banner/ad-banner-register") >= 0) selectRegistModify();  
});
  
  /// banner ////////////////////////////////////////////////////////////////////////////////////
  function getBannerList(currentPage, size, filterCategory=null, filterStatus=null){       
    let bannerState = document.getElementById('banner-state');
    let _filterState =  (bannerState.options[bannerState.selectedIndex]).value === 'all' ? null : (bannerState.options[bannerState.selectedIndex]).value ;    
    let bannerStatus = document.getElementById('banner-status');
    let _filterStatus =  (bannerStatus.options[bannerStatus.selectedIndex]).value === 'all' ? null : (bannerStatus.options[bannerStatus.selectedIndex]).value ;    
    let bannerCategory = document.getElementById('banner-category');
    let _filterCategory =  (bannerCategory.options[bannerCategory.selectedIndex]).value === 'all' ? null : (bannerCategory.options[bannerCategory.selectedIndex]).value ;    
    let _keyword = document.getElementById('banner-search').value; 
  

    document.getElementById('banner-list_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;
    window.sessionStorage.removeItem("bannerId");
    
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';

    ///category(0:main 1:mypage 2:magazine 3:magazine_detail 4:voice 5:voice_detail 6:community 7:community_detail
    let _category = {}; _category[0] = '메인';_category[1] = '마이페이지';_category[2] = '매거진 목록';_category[3] = '매거진 기사';_category[4] = "글 쓰는 20대 목록";_category[5] = "글 쓰는 20대 기사";_category[6] = "커뮤니티 메인";_category[7] = "커뮤니티 글";_category['undefined'] = "목록";

    
    let url = baseUrl + "/banners?" ;

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

    let u = window.location.href;
    let category;
    
    if(u.indexOf("?") > 0 && (_filterCategory === null || _filterCategory === "")){//// && communityId != null){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        category = pair[1];
        url +='&category='+ category;
        document.getElementById("banner-page-title").innerHTML = _category[category];
        document.getElementById("banner-page-dept-name").innerHTML = _category[category];
        console.log('category 1');
    } else if (_filterCategory !== null && _filterCategory != ""){
        url +='&category='+ _filterCategory;
        document.getElementById("banner-page-title").innerHTML = _category[_filterCategory];
        document.getElementById("banner-page-dept-name").innerHTML = _category[_filterCategory];
        console.log('category 2');
    } else {
        document.getElementById("banner-page-title").innerHTML = '목록';
        document.getElementById("banner-page-dept-name").innerHTML = '목록';
        console.log('category 3');
    }
    console.log('category' + category);
    console.log('_filterCategory' + _filterCategory);
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ; 
    if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ||  _filterStatus  === 'finishing' ))){
      document.getElementById('banner-list_grid').innerHTML  = "<tr><td colspan='9'>데이터가 없습니다.</td></tr>";
      document.getElementById('banner-list-pagination').innerHTML = '';
      document.getElementById('banner-list-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((banners) => {
          console.log('banners' + JSON.stringify(banners.data));
          let bannerGrid= "";
          let bannerData = banners.data.banners;
          let _bannerDataTotal = banners.data.total;
          let numOfPage = Math.ceil(_bannerDataTotal/size);

          for( let i=0;  i < bannerData.length ; i++){
            let values = bannerData[i];
            let bannerState = values.state === 2? '비공개':"공개";
            bannerGrid+=`<tr>
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
                <td><a href="./ad-banner-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                <td>${_category[values.category]}</td>           
                <td>${bannerState}</td>                
                <td>${_status[values.status]}</td>                
                <td>${values.startDate?dateToStr(strToDate(values.startDate)):""}</td>
                <td>${values.endDate?dateToStr(strToDate(values.endDate)):""}</td>
                <td>${values.createDate?dateToStr(strToDate(values.createDate)):""}</td>
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
                          <a href="#" class="page-link" onclick="getBannerList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getBannerList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getBannerList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0) ) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getBannerList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
          
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getBannerList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                      
            document.getElementById('banner-list_grid').innerHTML  = bannerGrid === "" ? "<tr><td colspan='9'>데이터가 없습니다.</td></tr>": bannerGrid;
            document.getElementById('banner-list-pagination').innerHTML = paging;
            document.getElementById('banner-list-total').innerHTML = '&nbsp;<strong>' +_bannerDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function checkInput(type){  
    let category = document.getElementById("banner-category");
    let _category =  (category.options[category.selectedIndex]).value;
    let _postStartDate = document.getElementById('banner-post-start-date').value;
    let _postEndDate = document.getElementById('banner-post-end-date').value;
    let _title = document.getElementById('banner-title').value;
    let _link = document.getElementById('banner-link').value;

    if ( _category === 'all'){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>배너위치를 선택해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if($('input[name="banner-state"]').is(":checked") === false){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>배너 상태를 체크해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if (($('input[name="banner-post-state"]').is(":checked") === false)){
        document.getElementById("adbannerAlertMessage").innerHTML = "<strong>배너 게시를 체크해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return
    } else if (_postStartDate ===""){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>게시 기간를 선택해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if (_title ===""){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>제목을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if ((type === 1 && !pcFile) || (type === 2 && !pcModifyFile)){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>PC배너 이미지를 등록해 주세요. </strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if ((type === 1 && !moFile) || (type === 2 && !moModifyFile)){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>모바일 배너 이미지를 등록해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if (_link === ""){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>연결 링크를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else if (_postStartDate > _postEndDate){
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>시작날짜는 끝날짜보다 앞서야 합니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    }
    if (type === 1){
      registBanner();
    } else {
      modifyBanner();
    }
  }

  function registBanner(){
    let category = document.getElementById("banner-category");
    let _category =  (category.options[category.selectedIndex]).value;
    let _state =  $('input[name=banner-state]:checked').val() === 'private' ? 2 : $('input[name=banner-state]:checked').val() === 'reserved' ? 3 : 0;
    let _postStartDate = dateToStr(strToDate(document.getElementById('banner-post-start-date').value));
    let _postEndDate = dateToStr(strToDate(document.getElementById('banner-post-end-date').value));
    let _title = document.getElementById('banner-title').value;
    let _link = document.getElementById('banner-link').value;

    let url = baseUrl + "/banner/register" ;

    console.log('pcFile' + JSON.stringify(pcFile));
    console.log('moFile' + JSON.stringify(moFile));

    let formData = new FormData();
    formData.append('title', _title);
    formData.append('state', _state);
    formData.append('category', _category);
    formData.append('href', _link);
    formData.append('startDate', _postStartDate);
    formData.append('endDate', _postEndDate);

    if(pcFile)formData.append("files", pcFile, pcFile.name);
    if(moFile)formData.append("files", moFile, moFile.name);

    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 201) {  // No content    
              document.getElementById("adbannerAlertMessage").innerHTML = "<strong>배너가 등록되었습니다.</strong>";
              location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href = './ad-banner-list.html';
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
      headers: headers.form_headers.headers, 
      body: formData,
    });

    post(request1);
  }

  function modifyBanner(){
    let category = document.getElementById("banner-category");
    let _category =  (category.options[category.selectedIndex]).value;
    let _state =  $('input[name=banner-state]:checked').val() === 'private' ? 2 : $('input[name=banner-post-state]:checked').val() === 'reserved' ? 3 : 0;
    let _postStartDate = dateToStr(strToDate(document.getElementById('banner-post-start-date').value));
    let _postEndDate = dateToStr(strToDate(document.getElementById('banner-post-end-date').value));
    let _title = document.getElementById('banner-title').value;
    let _link = document.getElementById('banner-link').value;
    let _id =window.sessionStorage.getItem('bannerId');

    let url = baseUrl + "/banner" ;
    let formData = new FormData();
    formData.append('id', _id);
    formData.append('title', _title);
    formData.append('state', _state);
    formData.append('category', _category);
    formData.append('href', _link);
    formData.append('startDate', _postStartDate);
    formData.append('endDate', _postEndDate);

    if(isModifiedFiles){
      formData.append("files", pcModifyFile, pcModifyFile.name);
      formData.append("files", moModifyFile, moModifyFile.name);
    }

    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content
              document.getElementById("adbannerAlertMessage").innerHTML = "<strong>배너가 수정되었습니다.</strong>";
              location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href='./ad-banner-detail.html?id='+ window.sessionStorage.getItem("bannerId");
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
      headers: headers.form_headers.headers, 
      body: formData,
    });

    post(request1);
  }

  function getBanner(){
    let u = window.location.href;
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }
    console.log('num' + id)
    if ( id === null){
      id = sessionStorage.getItem('id');
    }
    let url = baseUrl + "/banners?id=" +id;
   
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((banner) => {
        let data1= "";
        let bannerData = banner.data.banners[0];
        let _state = '공개';
        let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';

        console.log('bannerData' + JSON.stringify(bannerData))
    
        let _category = {}; _category[0] = '메인';_category[1] = '마이페이지';_category[2] = '매거진 목록';_category[3] = '매거진 기사';_category[4] = "20's voice 목록";_category[5] = "20's voice 기사";_category[6] = "커뮤니티 메인";_category[7] = "커뮤니티 글";
      
        if (bannerData){              

          document.getElementById('banner-category').innerHTML = _category[bannerData.category];

          /// 상태
          if (bannerData.state === 2) {
            _state = '비공개';
            _postState = '-';
          } else if (bannerData.state === 0) {
            _state = '공개';
            _postState = '즉시 게시';
          } else if (bannerData.state === 3) {
            _state = '공개';
            _postState = '예약 게시';
          }
          document.getElementById('banner-state').innerHTML =_state;
          document.getElementById('banner-post-state').innerHTML = _postState;
          document.getElementById('banner-post-status').innerHTML = bannerData.state === 2 ? '-' :_status[bannerData.status];
          
          document.getElementById('banner-start-date').innerHTML = dateToStr(strToDate(bannerData.startDate));
          document.getElementById('banner-end-date').innerHTML =  dateToStr(strToDate(bannerData.endDate));
          document.getElementById('banner-create-date').innerHTML =  dateToStr(strToDate(bannerData.endDate));
          document.getElementById('banner-link').innerHTML = '<a href=' +bannerData.href  + 'target="_blank" class="underline">' + bannerData.href + '</a>';
          document.getElementById('banner-title').innerHTML = bannerData.title;
          document.getElementById('banner-show-count').innerHTML = bannerData.showCount;
          document.getElementById('banner-pc-image').src = bannerData.file1;
          document.getElementById('banner-mobile-image').src = bannerData.file2;
          document.getElementById('banner-detail-title').innerHTML = _category[bannerData.category] + ' 배너 상세';
          document.getElementById('banner-detail-sub-title').innerHTML = _category[bannerData.category] + ' 배너 상세';

          window.sessionStorage.setItem('bannerId',bannerData.id);
        }
      });
    }).catch(error => console.log(error));
  }

  function getBannerCurrentStat(){
    let url = baseUrl + "/banners?";
    //
    let mainUrl = url +'state=0,2,3&category=0';  
    //
    fetch(mainUrl, headers.json_headers)  
    .then((response) => {
      checkError(response.status);
      response.json().then((mainData) => {
        let mainGrid= "";
        console.log('bannerData' + JSON.stringify(mainData))
        let mainList = mainData.data.banners;
        let mainTotal = mainData.data.total;
        if (mainTotal > 0){
          mainList.map((values) =>
          {          
            mainGrid += `<div class="banner-list-item">
                            <a href="./ad-banner-detail.html?id=${values.id}">
                              <span class="title">${values.title}</span>
                              <span class="date">${values.createDate}</span>
                            </a>
                          </div>`
          })
        } else {
          mainGrid+= `<div class="empty-data">
                        <div class="text">등록된 배너가 없습니다.</div>
                      </div>`;
        }

        document.getElementById('banner-main-list').innerHTML = mainGrid;  
        if ( mainTotal > 0){
          document.getElementById('banner-main-total').innerHTML = "<strong>현재 &nbsp;"+mainTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";
          document.getElementById('banner-main-regist_button').style.display = 'none';
        } else {       
          document.getElementById('banner-main-regist_button').style.display = 'flex';
          document.getElementById('banner-main-list_button').style.display = 'none';          
        }
      });
    }).catch(error => console.log(error));

    // 마이페이지 배너
    let mypageUrl = url +'state=0,2,3&category=1';  
   
    fetch(mypageUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((mypageData) => {
        let mypageGrid= "";
        console.log('bannerData' + JSON.stringify(mypageData))
        let mypageList = mypageData.data.banners;
        let mypageTotal = mypageData.data.total;
      if (mypageTotal > 0){
        mypageList.map((values) =>
        {          
          mypageGrid += `<div class="banner-list-item">
                          <a href="./ad-banner-detail.html?id=${values.id}">
                            <span class="title">${values.title}</span>
                            <span class="date">${values.createDate}</span>
                          </a>
                        </div>`
        })
        } else {
          mypageGrid+= `<div class="empty-data">
                        <div class="text">등록된 배너가 없습니다.</div>
                        </div>`;
        }
        
        document.getElementById('banner-mypage-list').innerHTML = mypageGrid;   
        if(mypageTotal > 0){
          document.getElementById('banner-mypage-total').innerHTML = "<strong>&nbsp;"+mypageTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";   
          document.getElementById('banner-mypage-regist_button').style.display = 'none';  
        } else {
          document.getElementById('banner-mypage-regist_button').style.display = 'flex';
          document.getElementById('banner-mypage-list_button').style.display = 'none';
        } 
      });
    }).catch(error => console.log(error));

    // 매거진 목록 배너
    let magazineUrl = url +'state=0,2,3&category=2';  
    console.log('magazineUrl' + magazineUrl)
    fetch(magazineUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((magazineData) => {
        let magazineGrid= "";
        let magazineList = magazineData.data.banners;
        let magazineTotal = magazineData.data.total;
      if (magazineTotal > 0){
        magazineList.map((values) =>
        {          
          magazineGrid += `<div class="banner-list-item">
                            <a href="./ad-banner-detail.html?id=${values.id}">
                              <span class="title">${values.title}</span>
                              <span class="date">${values.createDate}</span>
                            </a>
                          </div>`
        })
      } else {
        magazineGrid+= `<div class="empty-data">
                          <div class="text">등록된 배너가 없습니다.</div>
                        </div>`;
      }

        document.getElementById('banner-magazine-list').innerHTML = magazineGrid;     
        if (magazineTotal > 0){
          document.getElementById('banner-magazine-total').innerHTML = "<strong>&nbsp;"+ magazineTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";  
          document.getElementById('banner-magazine-regist_button').style.display = 'none';  
        } else {
          document.getElementById('banner-magazine-regist_button').style.display = 'flex';
          document.getElementById('banner-magazine-list_button').style.display = 'none';
        } 
      });
    }).catch(error => console.log(error));

    // 매거진 기사 배너
    let magazineArticleUrl = url +'state=0,2,3&category=3';  
   
    fetch(magazineArticleUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((magazineArticleData) => {
        let magazineArticleGrid= "";
        console.log('magazineArticleData' + JSON.stringify(magazineArticleData))
        let magazineArticleList = magazineArticleData.data.banners;
        let magazineArticleTotal = magazineArticleData.data.total;
        if (magazineArticleTotal > 0){
          magazineArticleList.map((values) =>
          {          
            magazineArticleGrid += `<div class="banner-list-item">
                                      <a href="./ad-banner-detail.html?id=${values.id}">
                                        <span class="title">${values.title}</span>
                                        <span class="date">${values.createDate}</span>
                                      </a>
                                    </div>`
          });
        } else {
          magazineArticleGrid+= `<div class="empty-data">
                                  <div class="text">등록된 배너가 없습니다.</div>
                                </div>`;
          }
          document.getElementById('banner-magazine-article-list').innerHTML = magazineArticleGrid;      
        if (magazineArticleTotal > 0){
          document.getElementById('banner-magazine-article-total').innerHTML = "<strong>&nbsp;"+magazineArticleTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";   
          document.getElementById('banner-magazine-article-regist_button').style.display = 'none';  
        } else {
          document.getElementById('banner-magazine-article-regist_button').style.display = 'flex';
          document.getElementById('banner-magazine-article-list_button').style.display = 'none';
        }  
      });
    }).catch(error => console.log(error));

    // 20's voice 목록 배너
    let voiceUrl = url +'state=0,2,3&category=4';  

    fetch(voiceUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((voiceData) => {
        let voiceGrid= "";
        console.log('voiceData' + JSON.stringify(voiceData))
        let voiceList = voiceData.data.banners;
        let voiceTotal = voiceData.data.total;
        if (voiceTotal > 0){
          voiceList.map((values) =>
          {          
            voiceGrid += `<div class="banner-list-item">
                            <a href="./ad-banner-detail.html?id=${values.id}">
                              <span class="title">${values.title}</span>
                              <span class="date">${values.createDate}</span>
                            </a>
                          </div>`
          })
        } else {
          voiceGrid+= `<div class="empty-data">
                        <div class="text">등록된 배너가 없습니다.</div>
                      </div>`;
        }

        document.getElementById('banner-voice-list_grid').innerHTML = voiceGrid;     
        if (voiceTotal > 0){
          document.getElementById('banner-voice-total').innerHTML = "<strong>&nbsp;"+voiceTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";    
          document.getElementById('banner-voice-regist_button').style.display = 'none';  
        } else {
          document.getElementById('banner-voice-regist_button').style.display = 'flex';
          document.getElementById('banner-voice-list_button').style.display = 'none';
        }   
          
      });
    }).catch(error => console.log(error));

    // 20's voice 기사 배너
    let voiceArticleUrl = url +'state=0,2,3&category=5';  
    fetch(voiceArticleUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((voiceArticleData) => {
        let voiceArticleGrid = "";
        console.log('voiceArticleData' + JSON.stringify(voiceArticleData))
        let voiceArticleList = voiceArticleData.data.banners;
        let voiceArticleTotal = voiceArticleData.data.total;
        if (voiceArticleTotal > 0){
          voiceArticleList.map((values) =>
          {          
            voiceArticleGrid += `<div class="banner-list-item">
                                  <a href="./ad-banner-detail.html?id=${values.id}">
                                    <span class="title">${values.title}</span>
                                    <span class="date">${values.createDate}</span>
                                  </a>
                                </div>`
          })
        } else {
          voiceArticleGrid+= `<div class="empty-data">
                        <div class="text">등록된 배너가 없습니다.</div>
                      </div>`;
        }
        document.getElementById('banner-voice-article-list_grid').innerHTML = voiceArticleGrid;     
        console.log('voiceArticleTotal' + voiceArticleTotal)  ;
        if (voiceArticleTotal > 0){
          console.log('voiceArticleTotal' + voiceArticleTotal)  ;
          document.getElementById('banner-voice-article-total').innerHTML = "<strong>&nbsp;"+voiceArticleTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다."; 
          document.getElementById('banner-voice-article-regist_button').style.display = 'none';  
        } else {
          document.getElementById('banner-voice-article-regist_button').style.display = 'flex';
          document.getElementById('banner-voice-article-list_button').style.display = 'none';
        }
      });
    }).catch(error => console.log(error));

    // community main 배너
    let communityUrl = url +'state=0,2,3&category=6';  
   
    fetch(communityUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((communityData) => {
        let communityGrid = "";
        console.log('communityData' + JSON.stringify(communityData))
        let communityList = communityData.data.banners;
        let communityTotal = communityData.data.total;
        if (communityTotal > 0){
          communityList.map((values) =>
          {          
            communityGrid += `<div class="banner-list-item">
                                <a href="./ad-banner-detail.html?id=${values.id}">
                                  <span class="title">${values.title}</span>
                                  <span class="date">${values.createDate}</span>
                                </a>
                              </div>`
          })
        } else {
          communityGrid+= `<div class="empty-data">
                            <div class="text">등록된 배너가 없습니다.</div>
                          </div>`;
        }
        document.getElementById('banner-community-list_grid').innerHTML = communityGrid;
        //  document.getElementById('banner-voice-article-list').innerHTML = voiceArticlerid;        
        if (communityTotal > 0){
          document.getElementById('banner-community-total').innerHTML = "<strong>&nbsp;"+communityTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";    
          document.getElementById('banner-community-regist_button').style.display = 'none';  
        } else {
        document.getElementById('banner-community-regist_button').style.display = 'flex';
        document.getElementById('banner-community-list_button').style.display = 'none';
        }     
      });
    }).catch(error => console.log(error));

    // community article 배너
    let communityDetailUrl = url +'state=0,2,3&category=7';  
   
    fetch(communityDetailUrl, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((communityDetailData) => {
        let communityDetailGrid = "";
        console.log('communityDetailData' + JSON.stringify(communityDetailData))
        let communityDetalList = communityDetailData.data.banners;
        let communityDetalTotal = communityDetailData.data.total;
        if (communityDetalTotal > 0){
        communityDetalList.map((values) =>
        {          
          communityDetailGrid += `<div class="banner-list-item">
                                    <a href="./ad-banner-detail.html?id=${values.id}">
                                    <span class="title">${values.title}</span>
                                    <span class="date">${values.createDate}</span>
                                    </a>
                                  </div>`
        })
      } else {
        communityDetailGrid+= `<div class="empty-data">
                                <div class="text">등록된 배너가 없습니다.</div>
                              </div>`;
      }
        document.getElementById('banner-community-detail-list_grid').innerHTML = communityDetailGrid;      
        
          if (communityDetalTotal > 0){
            document.getElementById('banner-community-detail-total').innerHTML = "<strong>&nbsp;"+communityDetalTotal+ "&nbsp;</strong>개의 배너가 운영 중입니다.";   
            document.getElementById('banner-community-detail-regist_button').style.display = 'none';  
          } else {
            document.getElementById('banner-community-detail-regist_button').style.display = 'flex';
            document.getElementById('banner-community-detail-list_button').style.display = 'none';
          }      
      });
    }).catch(error => console.log(error));
  }

  function modifyBannerState(category, state){
    // let _category = {}; _category[0] = '메인 배너 목록';_category[1] = '마이페이지 목록';_category[2] = '매거진 목록';_category[3] = '매거진 기사';_category[4] = "20's voice 목록";_category[5] = "20's voice 기사 목록";_category[6] = "커뮤니티 메인 목록";_category[7] = "커뮤니티 글 목록";_category['undefined'] = "목록";

    // category list 가져오기
    let filterState ;
    console.log('state' + state);
    console.log('category' + category);
    let domPublic = "";
    let domPrivate = "";

    switch (category) {
      case 0:
        domPublic = "banner-main-public";
        domPrivate = "banner-main-private";
        break;
      case 1:
        domPublic = "banner-mypage-public";
        domPrivate = "banner-mypage-private";
        break;
      case 2:
        domPublic = "banner-magazine-public";
        domPrivate = "banner-magazine-private";
        break;
      case 3:
        domPublic = "banner-article-public";
        domPrivate = "banner-article-private";
        break;
      case 4:
        domPublic = "banner-voice-list-public";
        domPrivate = "banner-voice-list-private";
        break;
      case 5:
        domPublic = "banner-voice-article-public";
        domPrivate = "banner-voice-article-private";
        break;
      case 6:
        domPublic = "banner-community-main-public";
        domPrivate = "banner-community-main-private";
        break; 
      case 7:
        domPublic = "banner-community-detail-public";
        domPrivate = "banner-community-detail-private";
        break;  
    }
    console.log('domPublic'+domPublic);
    console.log('domPrivate'+domPrivate);

    if (state === 0){
      filterState = '2'; 
      document.getElementById(domPublic).classList.add('active');
      document.getElementById(domPrivate).classList.remove('active');
    } else {
      filterState = '0,3';
      document.getElementById(domPrivate).classList.add('active');
      document.getElementById(domPublic).classList.remove('active');
    }

    console.log('filterState'+filterState);
    console.log('filterState'+state);
    let bannerUrl = baseUrl + "/banners?";
    bannerUrl += 'category='+category+ '&state=' + filterState;  
    console.log('bannerUrl' + bannerUrl)
    fetch(bannerUrl, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((bannerData) => {
          console.log('communityDetailData' + JSON.stringify(bannerData))
          let bannerList = bannerData.data.banners;
          let bannerTotal = bannerData.data.total;
          bannerList.map((values) =>
          {          
            let url = baseUrl + "/banner" ;
            let params = {          
                id: values.id,
                state: state,         
            }
          
            async function post(request) {
            try {
              await fetch(request).then(response => {
                //  if(response.status === 204) {  // No content
                //       location.href='./현황.html'
                //       return 
                //   }
              }) 
          
              } catch (error) {
                console.error("Error:", error);
              }
            }
          
            const modifyStateRequest = new Request(url, {
              method: "POST",
              headers: headers.json_headers.headers, 
              body: JSON.stringify(params)
            });
          
            post(modifyStateRequest);
          })
        });
      }).catch(error => console.log(error));

  }

  function selectRegistModify(){
    let _bannerId =window.sessionStorage.getItem("bannerId");
    console.log('_bannerId' + _bannerId);
  
    // console.log('num' + id)
    if ( _bannerId === null){
      console.log('등록');
      document.getElementById('banner-regist').style.display = 'block';
     
    } else {
      console.log('수정');
   
      document.getElementById('banner-modify').style.display = 'block';
    
      // getNotification(_notificationId);
      let url = baseUrl + "/banners?id=" + _bannerId;
      fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
          response.json().then((banners) => {

            let bannerData = banners.data.banners;
            let bannerDataTotal = banners.data.total;
            console.log('bannerData' + JSON.stringify(bannerData));
            if(bannerData.length > 0){
              let _bannerData = bannerData[0];
              let _state = _bannerData.state;
              let today = new Date();
              let startdate = new Date(_bannerData.startDate);

              $('#banner-category option[value='+ _bannerData.category +']').attr('selected', true);
              
              /// 상태
              (_state === 0 ||  _state === 3) ? $(":radio[name='banner-state'][value='public']").attr('checked', true) : $(":radio[name='banner-state'][value='private']").attr('checked', true);

              /// 게시
              if(_state === 2){
                (new Date(_bannerData.startDate) <= new Date(_bannerData.lastDate)) ? 
                  $(":radio[name='banner-post-state'][value='immediately']").attr('checked', true)  : 
                  $(":radio[name='banner-post-state'][value='reserved']").attr('checked', true);
              }
              else{ 
                _state === 0 ?
                  $(":radio[name='banner-post-state'][value='immediately']").attr('checked', true)  : 
                  $(":radio[name='banner-post-state'][value='reserved']").attr('checked', true);
              } 

              /// 게시일         
              document.getElementById('banner-post-start-date').value = dateToStr(strToDate(_bannerData.startDate));
              document.getElementById('banner-post-end-date').value = dateToStr(strToDate(_bannerData.endDate));

              /// 본문
              document.getElementById('banner-title').value = _bannerData.title;
              document.getElementById('banner-link').value = _bannerData.href;
              // document.getElementById('notification-content').value = _bannerData.content;   
              
              if(_bannerData.file1) sendFileToDropzone(dropzonePc02, _bannerData.file1);
              if(_bannerData.file2) sendFileToDropzone(dropzoneMo02, _bannerData.file2);
            }
          })                    
        }).catch(error => console.log(error));

      // window.sessionStorage.setItem("notification-id", id);
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

  function changeBannerState(_state,bannerId = null){
    console.log('popupId' +bannerId);
    let url = baseUrl + "/banner" ;
    let banner_id = bannerId === null ? parseInt(window.sessionStorage.getItem("bannerId")) : bannerId;
    // console.log()
    let params = {     
        id:  banner_id,
        state: _state
    }

    async function post(request) {
    try {
      await fetch(request).then(response => {
          console.log('_state' + _state);
          if(response.status === 200) {  // No content     
            let okMessage = "";
            if (_state === 1){
              okMessage = "<strong>삭제가 완료되었습니다.</strong>";
            } else if (_state === 2){
              okMessage = "<strong>비공개 상태로 변경되었어요.</strong>";
            } else {
              okMessage = "<strong>공개 상태로 변경되었어요.</strong>";
            }
            document.getElementById("adbannerAlertMessage").innerHTML = okMessage;
            location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
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

  function changeBannersState(_state){
    console.log('changePopupsState state'+ _state)
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    const stateText = _state === 1? '삭제': _state === 2 ? '비공개' : '공개';
    if ( totalCnt === 0 ){    
      document.getElementById("adbannerAlertMessage").innerHTML = "<strong>선택하신 배너가 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerAlertPopup', true);";
      return;
    } else {
      if(_state === 0){
        document.getElementById("adbannerConfirmMessage").innerHTML = "<strong>선택한 배너 상태를 공개로 변경하시겠어요?</strong>";
        location.href= "javascript:layerPopup.openPopup('adbannerConfirmPopup', true);";
      } else if(_state === 1){
        document.getElementById("adbannerConfirmMessage").innerHTML = "<strong>선택한 배너를 삭제하시겠어요?. 삭제된 배너는 복구할 수 없습니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('adbannerConfirmPopup', true);";
      } else {
        document.getElementById("adbannerConfirmMessage").innerHTML = "<strong>선택한 배너 상태를 비공개로 변경하시겠어요?</strong>";
        location.href= "javascript:layerPopup.openPopup('adbannerConfirmPopup', true);";
      }
      window.sessionStorage.setItem("bannerState",_state);
      console.log('_state' + _state);
    }
  }

  function progressBannerState(){
  }

  function cancelBanner(type){
    if(type === 1){
      document.getElementById("adbannerConfirmMessage").innerHTML = "<strong>등록을 취소하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerConfirmPopup', true);";
    } else if(type === 2){
      document.getElementById("adbannerConfirmMessage").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('adbannerConfirmPopup', true);";
    }
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = './ad-banner-list.html';
    });
    return
  }

  function bannerOK(){
    location.href='./ad-banner-list.html'      
  }

  function confirmState(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const _state = window.sessionStorage.getItem("bannerState");
    const totalCnt = checkboxes.length;    
    for(const checkbox of checkboxes){       
        changeBannerState(parseInt(_state),(checkbox.value).replace('/',''));
    }
  }

  function setToday(){
    console.log('setToday')
    const today = new Date();
    // document.getElementById('banner-post-end-date').value = dateToStr(today);
    document.getElementById('banner-post-start-date').value = dateToStr(today);
    datepicker.setDate(today);
    // datepicker2.setDate(today);
  }

  function searchStart(e){
    if(e.keyCode === 13){
      getBannerList(0,20);
    }
  }