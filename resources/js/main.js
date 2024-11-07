  /// main ////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/main/highlight-detail") >= 0) getHighlight();  
    else if(window.location.pathname.indexOf("/main/highlight-register-modify") >= 0) selectRegistModify();  
    else if(window.location.pathname.indexOf("/main/main-board") >= 0) getMainList();   
    else if(window.location.pathname.indexOf("/main/trend-detail") >= 0) getTrendDetailList();  
    else if(window.location.pathname.indexOf("/main/trend-register-modify") >= 0) getTrendList(0,20); 
    else if(window.location.pathname.indexOf("/main/webzine-detail") >= 0) getStory();  
    else if(window.location.pathname.indexOf("/main/webzine-register-modify") >= 0) getStoryList(0,20);  
    else if(window.location.pathname.indexOf("/main/youtube-shorts-detail") >= 0) getShortsDetailList(); 
    else if(window.location.pathname.indexOf("/main/youtube-shorts-register-modify") >= 0) getShortsList();  
  });
  
  function getMainList(){       
     /////// highlight article: 0
     /////// campus editor article: 1
     /////// story:2
     /////// youtube shorts:3   
     getMainHighlight();
     getMainTrendList();
     getMainStoryList(1);
     getMainShortsList();
  }

   /// 하이라이트  ////////////////////////////////////////////////////////////////////////////////////
  function getMainHighlight(){ 
    let url = baseUrl + "/mains?category=0&state=0";

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((highlight) => {
        let highlightData = highlight.data.mains;
        
        if(highlightData.length > 0){
            let _highlightData = highlightData[0];
            console.log('_highlightData.file' + _highlightData);              
            document.getElementById('main-highlight-title').innerHTML = _highlightData.title;
            document.getElementById('main-highlight-summary').innerHTML = _highlightData.summary;              
            document.getElementById('main-highlight-href').href ="./highlight-detail.html?id=" +_highlightData.id ;              
            document.getElementById('main-highlight-img').src = _highlightData.file;   

            document.getElementById("main-highlight-regist").style.display = 'none';
            document.getElementById("main-highlight-modify").style.display = 'block';
            window.sessionStorage.setItem("highlightId",_highlightData.id);
        } else {
            document.getElementById("main-highlight-regist").style.display = 'block';
            document.getElementById("main-highlight-modify").style.display = 'none';
          window.sessionStorage.setItem("highlightState", false);
        };
      });
    }).catch(error => console.log(error));
  }

  function getHighlight(){
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
      id =window.sessionStorage.getItem('highlightId');
    }

    let url = baseUrl + "/mains?id=" +id //// sessionStorage.getItem('magazineArticleNum') ;
   
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((highlight) => {
        let data1= "";
        let _highlight = highlight.data.mains[0];
        let _highlightMagazine = _highlight.magazine;
        //console.log('highlightData' + JSON.stringify(_highlight));
           
        if (_highlight){               
          document.getElementById('main-highlight-title').innerHTML =_highlight.title;
          document.getElementById('main-highlight-summary').innerHTML =_highlight.summary;
          document.getElementById('main-highlight-create-date').innerHTML = new Date(_highlight.createDate).toLocaleString();
          document.getElementById('main-highlight-views').innerHTML = _highlightMagazine ? _highlightMagazine.showCount : 0;
          document.getElementById('main-highlight-img').src =_highlight.file;
         
          console.log('link'+ _highlight.link);
          $('#main-highlight-href a').attr("href",_highlight.link);
          $('#main-highlight-href a').text(_highlight.link);
          
          window.sessionStorage.setItem('highlightId',_highlight.id);
        }
      });
    }).catch(error => console.log(error));
  }

  function checkHighlightInput(type /* type 1 등록, 2 수정 */){
    let _title = document.getElementById('main-highlight-title').value;
    let _summary = document.getElementById('main-highlight-summary').value;
    let _link = document.getElementById('fixUrl').value;
  

     if (_title ===""){
      document.getElementById("hightlightAlertMessage").innerHTML = "<strong>제목을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('highlightAlertPopup', true);";
      return;
    } else if (_summary ===""){
      document.getElementById("hightlightAlertMessage").innerHTML = "<strong>전문을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('highlightAlertPopup', true);";
      return;
    } else if (highlightFile === null && type===1){
      document.getElementById("hightlightAlertMessage").innerHTML = "<strong>대표이미지를 등록해 주세요. </strong>";
      location.href= "javascript:layerPopup.openPopup('highlightAlertPopup', true);";
      return; 
    } else if (highlightModifyFile === null && type===2){
      document.getElementById("hightlightAlertMessage").innerHTML = "<strong>대표이미지를 등록해 주세요. </strong>";
      location.href= "javascript:layerPopup.openPopup('highlightAlertPopup', true);";
      return; 
    } else if (_link === ""){
      document.getElementById("hightlightAlertMessage").innerHTML = "<strong>기사 링크를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('highlightAlertPopup', true);";
      return;
    }   
    if (type === 1){
      registMainHighlight();
    } else {
      modifyMainHighlight();
    }
  }

  function registMainHighlight(){   
    let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let _title = document.getElementById('main-highlight-title').value;
    let _summary = document.getElementById('main-highlight-summary').value;
    let _fixUrl = document.getElementById('fixUrl').value;
    let today = new Date();

    let url = baseUrl + "/main/register" ; 
    
    let formData = new FormData();
    formData.append('state', 0);
    formData.append('category', 0);
    formData.append('userId', _me.id);
    formData.append('title', _title);
    formData.append('summary', _summary);  
    formData.append('link', _fixUrl);  
   
    if(highlightFile)formData.append("file", highlightFile, highlightFile.name);

    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 201) {  // No content    
            success(0);
          }
      }); 
    } catch (error) {
      console.error("Error:", error);
    }}
    
    const highlightRequest = new Request(url, {
        method: "POST",
        headers: headers.form_headers.headers,
        body:formData,
    });
    
    post(highlightRequest);
  }
 
  function modifyMainHighlight(){
    let _highlightId =window.sessionStorage.getItem("highlightId");
    let _title = document.getElementById('main-highlight-title').value;
    let _summary = document.getElementById('main-highlight-summary').value;
    let _fixUrl = document.getElementById('fixUrl').value;
    console.log('_highlightId' + _highlightId);

    let url = baseUrl + "/main" ;   
  
    let formData = new FormData();
    formData.append('id', _highlightId);
    formData.append('title', _title);
    formData.append('summary', _summary);  
    formData.append('link', _fixUrl);  
    
    if(isModifiedFiles && highlightModifyFile) formData.append("file", highlightModifyFile, highlightModifyFile.name);

    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content    
            success(0);
          }
      }); 
    } catch (error) {
      console.error("Error:", error);
    }}
    
    const highlightRequest = new Request(url, {
        method: "POST",
        headers: headers.form_headers.headers,
        body:formData,
    });
    
    post(highlightRequest);
  }

  function selectRegistModify(){
    let _highlightId = window.sessionStorage.getItem("highlightId");

    // if ( !_highlightId){
    //   console.log('등록');
    //   document.getElementById('highlight-regist').style.display = 'block';
    //   document.getElementById('highlight-modify').style.display = 'none';
    //   document.getElementById('main-highlight-modify').style.display = 'none';
    //   document.getElementById('hightlight-modify-cancel').style.display = 'none';
    // } else {
    //   console.log('수정');
    //   document.getElementById('highlight-regist').style.display = 'none';
    //   document.getElementById('highlight-modify').style.display = 'block';
    //   document.getElementById('main-highlight-register').style.display = 'none';
    //   document.getElementById('hightlight-regist-cancel').style.display = 'none';

      let url = baseUrl + "/mains?category=0&state=0&id="+ _highlightId;
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((highlights) => {
          let highlightData = highlights.data.mains;
          console.log('highlightData' + JSON.stringify(highlightData));   
          if (highlightData.length >0){      
            let _highlightData = highlightData[0];
            document.getElementById('main-highlight-title').value = _highlightData.title;
            document.getElementById('main-highlight-summary').value = _highlightData.summary;        
            document.getElementById('fixUrl').value = _highlightData.link; 
            document.getElementById('highlight-regist').style.display = 'none';
            document.getElementById('highlight-modify').style.display = 'block';
            document.getElementById('main-highlight-register').style.display = 'none';
            document.getElementById('hightlight-regist-cancel').style.display = 'none';
            if(_highlightData.file) sendFileToDropzone(dropzone02, _highlightData.file);
          }else {
            document.getElementById('highlight-regist').style.display = 'block';
            document.getElementById('highlight-modify').style.display = 'none';
            document.getElementById('main-highlight-modify').style.display = 'none';
            document.getElementById('hightlight-modify-cancel').style.display = 'none';
          }
        })                    
      });
    // }

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

  ///// voice. 트렌드 기사 ////////////////////////////////////////////////////////////////////////////////////
  function getMainTrendList(){      
    console.log('getMainTrendList');
    let url = baseUrl + "/mains?state=0,2,3&category=1";
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((mainTrend) => {
        let mainTrendData = mainTrend.data.mains;
        let mainTrendDataTotal = mainTrendData.length;
        
        //console.log('mainTrendData' + JSON.stringify(mainTrendData));
        //console.log('mainTrendDataTotal' + mainTrendDataTotal);
        let trend_grid = "";
        if (mainTrendDataTotal > 0) {
            for ( let i = 0 ; i < mainTrendDataTotal; i++){
              let mainData = mainTrendData[i].magazine ? mainTrendData[i].magazine : mainTrendData[i].voiceMagazine;
              let _mainTrendData = mainTrendData[i];
              console.log('mainData=======>' + JSON.stringify(mainData))
            trend_grid += `<div class="list-item">
                              <a href="${mainTrendData[i].link}">
                              <div class="thumbnail">
                                  <div class="thumb-inner"><img src=${mainData.file !== null ? mainData.file : ""} /></div>
                              </div>
                              <div class="info-area">
                                  <div class="title" >${mainData.title}</div>
                                  <div class="sub-text" >${mainData.summary}</div>
                                  <div class="user-info" >
                                    <div class="user">${mainData.name}</div>
                                    <div class="date">${mainData.createDate}</div>
                                  </div>
                              </div>
                              </a>
                            </div>`;
            }
            //console.log('trend_grid' + trend_grid)
            document.getElementById("main-trend_grid").innerHTML = trend_grid;
            document.getElementById("main-trend-regist").style.display = 'none';
            document.getElementById("main-trend-modify").style.display = 'block';
        } else {  
            document.getElementById("main-trend-regist").style.display = 'block';
            document.getElementById("main-trend-modify").style.display = 'none';
        }
      })
    }).catch(error => console.log(error));   
  }

  function getTrendDetailList(){      
    console.log('getMainTrendList');
    let url = baseUrl + "/mains?state=0,2,3&category=1";

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((mainTrend) => {
        let mainTrendData = mainTrend.data.mains;
        let mainTrendDataTotal = mainTrendData.length;
        
        console.log('mainTrendData' + JSON.stringify(mainTrendData));
        console.log('mainTrendDataTotal' + mainTrendDataTotal);
        let trend_grid = "";
        if (mainTrendDataTotal > 0) {
            for ( let i = 0 ; i < mainTrendDataTotal; i++){
              let trendData = mainTrendData[i];
              let _mainTrendData = mainTrendData[i];

            //  let link = voiceData.link;
              console.log('voiceData' + _mainTrendData.link);
              trend_grid += ` <div class="col-lg-6">
              <div class="panel">
                <div class="panel-title">
                  <strong class="title">기사 0${i+1}</strong>
                </div>
                <div class="form-container">
                  <div class="form-group">
                    <div class="form-row">
                      <div class="form-label pt0">
                        <div class="label">기사 링크</div>
                      </div>
                      <div class="form-fleid">
                        <div class="col-group">
                          <div class="col-lg-12">
                            <div class="form-text"><a href="${trendData.link}" target="_blank" class="underline">${trendData.link}</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-row">
                      <div class="form-label pt0">
                        <div class="label">조회수</div>
                      </div>
                      <div class="form-fleid">
                        <div class="col-group">
                          <div class="col-lg-12">
                            <div class="form-text">${trendData.showCount}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-row">
                      <div class="form-label pt0">
                        <div class="label">등록일</div>
                      </div>
                      <div class="form-fleid">
                        <div class="col-group">
                          <div class="col-lg-12">
                            <div class="form-text">${dateToStr(strToDate(trendData.createDate))}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
            }
            console.log('trend_grid' + trend_grid)
            document.getElementById("main-trend_grid").innerHTML = trend_grid;
          //  document.getElementById("main-trend-regist").style.display = 'none';
          //  document.getElementById("main-trend-modify").style.display = 'block';
        } else {  
            document.getElementById("main-trend-regist").style.display = 'block';
            document.getElementById("main-trend-modify").style.display = 'none';
        }
      })
    }).catch(error => console.log(error));
  }
  
  function getTrendList(currentPage, size, filterCategory=null, filterStatus=null){       
    document.getElementById('main-trend_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    // get mains
    let _keyword = document.getElementById('main-trend-search').value;
    let _category = {}; _category[0] = '캠퍼스';_category[1] = '라이프스타일';_category[2] = '커리어';
  
    let url = baseUrl + "/main/recommand-magazines?";
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((result) => {
        console.log('magazines' + JSON.stringify(result.data));
        let magazineGrid= "";
        let magazinesData = result.data.magazines;

        let _magazinesDataTotal = result.data.total;
        let numOfPage = Math.ceil(_magazinesDataTotal/size);
        let iteration = magazinesData.length > size ? size :  magazinesData.length;
        console.log('magazine list iteration' + iteration );

        // for( let i = _magazinesDataTotal - currentPage*size;  iteration > 0; iteration--, i--){
        for( let i=0;  i < magazinesData.length ; i++){
          let values = magazinesData[i];
          let href = values.type === 'magazine'? `"../magazine/magazine-article-detail.html?id=${values.id}"` : `"../voice/all-article-editing-publish-detail.html?id=${values.id}"`;

          magazineGrid+=`<tr>
              <td>
                <div class="selector-cover checkbox solo">
                  <label class="label">
                    <input type="checkbox" name="banner-short" class="chk" onclick="itemCheck()" value=${values.num}/>
                    <span class="label-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </td>
              <td>${values.num}</td>
              <td><a href=`+href+` class="underline">${values.title}</a></td>
              <td>${values.type === 'magazine' ? '매거진' : '글쓰는 20대'}</a></td>
              <td>${values.type === 'magazine' ? _category[values.category] : '-'}</td>                      
              <td>${replacestr(values.name)}</td>
              <td>${dateToStr(strToDate(values.date))}</td>
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
                      <a href="#" class="page-link" onclick="getTrendList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getTrendList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getTrendList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getTrendList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage ) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getTrendList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       
                  
        // console.log('noticeGrid' + noticeGrid)
        document.getElementById('main-trend_grid').innerHTML  = magazineGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": magazineGrid;         
        document.getElementById('main-trend-pagination').innerHTML = paging;
        document.getElementById('main-trend-total').innerHTML = '&nbsp;<strong>' + _magazinesDataTotal + '</strong>&nbsp;';
        
      });
    }).catch(error => console.log(error));
    
    // trands
    url = baseUrl + "/mains?state=0,2,3&category=1";
   ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((mainTrend) => {
        let mainTrendData = mainTrend.data.mains;
        mainTrendData.sort(function (a, b) {
          if(a.hasOwnProperty('id')){
            return a.id - b.id;
          }
        });

        for (let i = 0 ; i < mainTrendData.length; i++){
          if(i < mainTrendData.length){
            let id = '0' + (i+1).toString();
            let _mainTrendData = mainTrendData[i];
            console.log('_mainTrendData id : ' + _mainTrendData.id);
            
            document.getElementById("mainId-" + id).value = _mainTrendData.id;
            document.getElementById('fixUrl' + id).value = _mainTrendData.link;
          }
        }

        if(mainTrendData.length > 0){
            /// 수정
          document.getElementById("main-trend-regist").style.display = 'none';
          document.getElementById("main-trend-modify").style.display = 'block';
          document.getElementById("main-trend-regist-cancel").style.display = 'none';
        } else {   
          /// 등록
          document.getElementById("main-trend-regist").style.display = 'block';
          document.getElementById("main-trend-modify").style.display = 'none';
          document.getElementById("main-trend-modify-cancel").style.display = 'none';
        }
      })
    }).catch(error => console.log(error));
  }

  function setTrand(choice){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;      
   
    if (totalCnt === 0){
       document.getElementById("webzine-alert-message").innerHTML = " <strong>한개 이상의 기사를 선택하여야 합니다. </strong>";
       location.href = "javascript:layerPopup.openPopup('trendAlertPopup', true);";
       return;
    } else if (totalCnt  > 1){
       document.getElementById("webzine-alert-message").innerHTML = " <strong>최대 1개만 선택가능합니다. </strong>";
       location.href = "javascript:layerPopup.openPopup('trendAlertPopup', true);";   
       return  
    } 
     
    let id = '0' + choice;

    let checkValue = (checkboxes[0].value).replace('/',''); //trendItem.id;

    let trendId = checkValue % 100000000;
    console.log('trendId ' + trendId);

    let path = appPath + '/' + (checkValue < 500000000 ? "html/views/magazine/feature.html?id=" : "html/views/voice/detail.html?id=") + trendId 

    isModifiedTrands[choice-1] = true;
    document.getElementById("fixUrl" + id).value = path;
  }

  function checkInputTrendArticle(){
     let fix01 = document.getElementById("fixUrl01").value;
     let fix02 = document.getElementById("fixUrl02").value;
     let fix03 = document.getElementById("fixUrl03").value;

     if (fix01 ==="" && fix02 ==="" && fix03 === ""){
      document.getElementById("webzine-alert-message").innerHTML ='<strong>기사 링크  최소 1개 이상 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('trendAlertPopup', true);";
     } 

     registMainTrendList();
  }

  function registMainTrendList(){   
    let updateCount = 0;
    for (let i = 0; i < 3; i++){
      let id = '0' + (i+1).toString();
      if (isModifiedTrands[i] === true) updateCount++;
    }
   console.log('update count => ' + updateCount);

    let updatedCount = 0;
    for (let i = 0; i < 3; i++){
      let id = '0' + (i+1).toString();
      if (isModifiedTrands[i] === true){
        console.log('isModifiedTrands' + isModifiedTrands[i])
        let mainId = document.getElementById("mainId-" + id).value;
        let fixUrl = (document.getElementById("fixUrl" + id).value).split('=');
        //console.log('fixUrlpe => ' + fixUrl[0]);
        
        let type = fixUrl[0].indexOf('/magazine/') > 0 ? 0 : fixUrl[0].indexOf('/voice/') > 0 ? 1 : null;
        let trendId = fixUrl[1];
        let path = appPath + '/' + (type === 0 ? "html/views/magazine/feature.html?id=" : "html/views/voice/detail.html?id=") + trendId;
        if(type === null ) return;
        //console.log('type => ' + type + ' trendId => ' + trendId + ' path => ' + path);

        let url = "" ;
            
        let formData = new FormData();

        if (!mainId){ //// 등록
          url = baseUrl + "/main/register";
            
          formData.append('state', 0);
          formData.append('category', 1);
          formData.append('title', isModifiedTrands[i].title);
          formData.append('summary', isModifiedTrands[i].summary);
          formData.append('showCount',  isModifiedTrands[i].showCount);
          formData.append('category', 1);
          formData.append('linkId', trendId);  
          formData.append('link', path);  
        } 
        else {   
          url = baseUrl + "/main";
          
          //// 수정
          if(trendId){
            formData.append('id', mainId);
            formData.append('state', 0);
            formData.append('linkId', trendId);  
            formData.append('link', path);  
          }
          //// 삭제
          else{
            formData.append('id', mainId);
            formData.append('state', 1);
          }
        }         
        
        // console.log('params' + JSON.stringify(params));
        async function post(request) {
          try {
            await fetch(request).then(response => {
              updatedCount++;
              if(updateCount <= updatedCount) 
                success(1);
            }) 
          } catch (error) {
            console.error("Error:", error);
          }
        }
        
        const request1 = new Request(url, {
            method: "POST",
            headers: headers.form_headers.headers,
            body:formData,
        });
        
        post(request1);   
      }
    }
  }

  ///// story. 대학생 매거진 ////////////////////////////////////////////////////////////////////////////////////
  function getMainStoryList(choice){   

    let url = baseUrl + "/mains?category=2&state=0,2,3";
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((story) => {
          let mainData = story.data.mains;
        //  let highlightDataTotal = story.data.total;
          if(mainData.length > 0){
            let _mainData = mainData[0];

            let _state = _mainData.state;
            let _title = _mainData.title;
            let _summary = _mainData.summary;
            let _name = _mainData?.story?.name;
            let _createDate = _mainData.createDate;
            let _file = _mainData?.story?.file?_mainData.story.file:"" ;
            let _id = _mainData.id;
            let _startDate = _mainData.startDate;
            let _endDate = _mainData.endDate;
            let _link = _mainData.link;

            if (choice === 1){
              document.getElementById("main-story-title").innerHTML = _title;
              document.getElementById("main-story-summary").innerHTML = _summary;
              document.getElementById("main-story-name").innerHTML = _name;
              document.getElementById("main-story-create-date").innerHTML = new Date(_createDate).toLocaleDateString();
              document.getElementById("main-story-img").src = _file;

              if(_state === 2) {
                document.getElementById("main-story-state-public").classList.remove("active");
                document.getElementById("main-story-state-private").classList.add("active");
              }
              else{
                document.getElementById("main-story-state-private").classList.remove("active");
                document.getElementById("main-story-state-public").classList.add("active");
              } 
            } else{

              /// 상태
              if(_state === 0 || _state === 3) $(":radio[name='main-story-state'][value='public']").attr('checked', true);
              else $(":radio[name='main-story-state'][value='private']").attr('checked', true);
              
              /// 게시
              if(_state === 2){
                (new Date(_mainData.startDate) <= new Date(_mainData.lastDate)) ? 
                  $(":radio[name='main-story-post-state'][value='immediately']").attr('checked', true) : 
                  $(":radio[name='main-story-post-state'][value='reserved']").attr('checked', true);   
              }
              else{ 
                _state === 0 ? 
                  $(":radio[name='main-story-post-state'][value='immediately']").attr('checked', true) : 
                  $(":radio[name='main-story-post-state'][value='reserved']").attr('checked', true);   
              } 
              
              /// 게시일
              document.getElementById("main-story-start-date").value = dateToStr(strToDate(_startDate));
              document.getElementById("main-story-end-date").value = dateToStr(strToDate(_endDate));
              document.getElementById("main-webzine-regist-cancel").style.display = 'none';
              document.getElementById("fixUrl").value = _link;
              window.sessionStorage.setItem('mainStoryId',_mainData.id )
            }
          
            document.getElementById("main-webzine-regist").style.display = 'none';
            document.getElementById("main-webzine-modify").style.display = 'block';
          

            window.sessionStorage.setItem("storyId",_id);
         
          } else {
            
            document.getElementById("main-webzine-regist").style.display = 'block';
            document.getElementById("main-webzine-modify").style.display = 'none';
            document.getElementById("main-webzine-modify-cancel").style.display = 'none';
          }
      });                    
    }).catch(error => console.log(error));
  }
  
  function getStory(){
    let storyId =window.sessionStorage.getItem("storyId");
    // console.log('getStory');
    let url = baseUrl + "/mains?id=" + storyId;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((mainStory) => {
        let mainStoryData = mainStory.data.mains[0];
        let _state = mainStoryData.state;
        let _postState = '즉시 게시';

        /// 상태
        if (mainStoryData.state === 2) _state = '비공개';
        else if (mainStoryData.state === 0 || mainStoryData.state === 3) _state = '공개';
        document.getElementById('main-stroy-state').innerHTML =_state;

        /// 게시
        if(mainStoryData.state === 2) (new Date(mainStoryData.startDate) <= new Date(mainStoryData.lastDate)) ? _postState = '즉시 게시' : _postState = '예약 게시'; 
        else mainStoryData.state === 0 ? _postState = '즉시 게시' : _postState = '예약 게시';
        document.getElementById('main-stroy-post-state').innerHTML = _postState;
        
        document.getElementById("main-story-create-date").innerHTML = dateToStr(strToDate(mainStoryData.createDate || ''));
        document.getElementById("main-story-post-start-date").innerHTML = dateToStr(strToDate(mainStoryData.startDate));
        document.getElementById("main-story-post-end-date").innerHTML = dateToStr(strToDate(mainStoryData.endDate));
        document.getElementById("main-story-like-count").innerHTML = mainStoryData.story.showCount;
        
        $('#main-story-link a').attr("href",mainStoryData.link);
        $('#main-story-link a').text(mainStoryData.link);

      })
    }).catch(error => console.log(error));
  }

  function getStoryList(currentPage, size, filterCategory=null, filterStatus=null){       
    document.getElementById('main-story_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let _keyword = document.getElementById('main-story-search').value;
    let url = baseUrl + "/stories?state=0,2,3" ; 
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;
    // ;

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((stories) => {
        console.log('stories' + JSON.stringify(stories.data));
        let storiesGrid= "";
        let storiesData = stories.data.stories;
        let storiesDataTotal = stories.data.total;
        let numOfPage = Math.ceil(storiesDataTotal/size);
        let iteration = storiesData.length > size ? size :  storiesData.length;
        console.log('stories list iteration' + iteration );
        for( let i=0;  i < storiesData.length ; i++){
          let values = storiesData[i];
          let href = "";
        
          storiesGrid+=`<tr>
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
                          <td><a href="../story/story-detail.html?id=${values.id}" class="underline">${values.title}</a></td>                                    
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
                  
        // console.log('noticeGrid' + noticeGrid)
        document.getElementById('main-story_grid').innerHTML  = storiesGrid;          
        document.getElementById('main-story-pagination').innerHTML = paging;
        document.getElementById('main-story-total').innerHTML = '&nbsp;<strong>' + storiesDataTotal + '</strong>&nbsp;';
      });
    }).catch(error => console.log(error));

    getMainStoryList(2);
  }

  function checkInputStoryArticle(type /* type 1 등록, 2 수정 */){
    let _storyStartDate = document.getElementById("main-story-start-date").value;
    let _stroyEndDate = document.getElementById("main-story-end-date").value;
    let fixUrl = document.getElementById("fixUrl").value;
   
    if ($('input[name="main-story-state"]').is(":checked") === false){
      document.getElementById("webzine-alert-message").innerHTML ='<strong>웹진 상태를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('webzineAlertPopup', true);";
    } else if ($('input[name="main-story-post-state"]').is(":checked") === false){
      document.getElementById("webzine-alert-message").innerHTML ='<strong>웹진 게시를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('webzineAlertPopup', true);";
    } else if (_storyStartDate === "" || _stroyEndDate === ""){
      document.getElementById("webzine-alert-message").innerHTML ='<strong>게시 기간을 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('webzineAlertPopup', true);";
    } else if (fixUrl === ""){
      document.getElementById("webzine-alert-message").innerHTML ='<strong>웹진 링크를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('webzineAlertPopup', true);";
    }

    if (type === 1){     
      registMainStory(1);
    } else {
      registMainStory(2);
    }
  }

  function registMainStory(type){      
    let domValue = document.getElementById('fixUrl').value;
    let _storyId, storyId;
    // console.log('registMainTrendList domUrl' +domValue);
    if (document.getElementById('fixUrl').value !== ""){
        _storyId = (document.getElementById('fixUrl').value).split('=');
        storyId = _storyId[1];
    }      

    let url = baseUrl + "/stories?id=" + storyId;
    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((story) => {
        let today = new Date();
        let storyData = story.data.stories[0];
        let _title = storyData.title;
        let _summary =  storyData.summary;
        // let _file = voiceData.file;
        let _linkId = storyId;
        let _link = appPath + '/' + 'html/views/voice/detail.html?id=' + storyId;
        let _state =  $('input[name=main-story-state]:checked').val() === 'private' ? 2 : $('input[name=main-story-state]:checked').val() === 'reserved' ? 3 : 0;
        let _startDate = document.getElementById("main-story-start-date").value;
        let _endDate = document.getElementById("main-story-end-date").value;;

        let voiceUrl = "" ;
        let params = "";
        if (type === 1){ //// 등록
            voiceUrl = baseUrl + "/main/register";
            console.log('등록 url' + voiceUrl);
            params = {      
              state: _state,                     
              category: 2,
              title: _title,       
              summary: _summary,       
              // file: _file,
              linkId: _linkId,
              link: _link,
              //  file: _file,
              startDate: _startDate,
              endDate: _endDate
          }
        } else {   //// 수정
            voiceUrl = baseUrl + "/main";
            // console.log('수정 story_id' + story_id);
            let story_id = window.sessionStorage.getItem('storyId');
            params = {     
              id:  story_id,
              state: _state,                     
              category: 2,
              title: _title,       
              summary: _summary,       
              // file: _file,
              linkId: _linkId,
              link: _link,
              //  file: _file,
              startDate: _startDate,
              endDate: _endDate
          }
        }         
        
        async function post(request) {
        try {
            await fetch(request).then(response => {
                if(response.status === 201 || response.status === 200) {   
                  // location.href='./현황.html'
                  success(2);
                }
            }) 
        
            } catch (error) {
            console.error("Error:", error);
            }
        }
        
        const request1 = new Request(voiceUrl, {
            method: "POST",
            headers: headers.json_headers.headers,
            body: JSON.stringify(params),
        });
        
        post(request1);
      })       
    }).catch(error => console.log(error));
  }

  function registStory(type){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;      
  
    if (totalCnt === 0){
      document.getElementById("webzine-alert-message").innerHTML = " <strong>한개 이상의 기사를 선택하여야 합니다. </strong>";
      location.href = "javascript:layerPopup.openPopup('webzineAlertPopup', true);";
      return
    } else if (totalCnt  > 1){
      document.getElementById("webzine-alert-message").innerHTML = " <strong>최대 1개만 선택가능합니다. </strong>";
      location.href = "javascript:layerPopup.openPopup('webzineAlertPopup', true);";     
      return
    } else {
      let storyId = (checkboxes[0].value).replace('/','');       
      document.getElementById("fixUrl").value = appPath + "/html/views/voice/detail.html?id=" + storyId;
    }
  }

  function changeStoryState(_state){
    let _storyId =window.sessionStorage.getItem("storyId");
    let url = baseUrl + "/mains?id=" + _storyId;
   
    fetch(url, headers.json_headers)  
    .then((response) => {
      checkError(response.status);
      response.json().then((story) => {
        let storyUrl = baseUrl + "/main";
        // console.log('수정 url' + voiceUrl);
        params = {     
          id: parseInt(_storyId),
          state: _state,
          category: 2          
      }
        
      async function post(request) {
      try {
          await fetch(request).then(response => {
              if(response.status === 200) {  // No content
                  if(_state === 2) {
                    document.getElementById("main-story-state-public").classList.remove("active");
                    document.getElementById("main-story-state-private").classList.add("active");
                  }
                  else{
                    document.getElementById("main-story-state-private").classList.remove("active");
                    document.getElementById("main-story-state-public").classList.add("active");
                  } 
                  return
              }
          }) 
      
          } catch (error) {
          console.error("Error:", error);
          }
      }
      
      const request1 = new Request(storyUrl, {
          method: "POST",
          headers: headers.json_headers.headers,
          body: JSON.stringify(params),
      });
      
      post(request1);
      })       
    }).catch(error => console.log(error));
  }

  ///// 유튜브 쇼츠 ////////////////////////////////////////////////////////////////////////////////////
  function getMainShortsList(){   
    console.log('getMainShortsList');
    let url = baseUrl + "/mains?category=3&state=0";

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((shorts) => {
        let shortsData = shorts.data.mains;
        // let highlightDataTotal = shorts.data.total;
        
        if(shortsData.length > 0){
          let shortsGrid = "";
          for( let i = 0; i< shortsData.length  ; i++){
            let short = shortsData[i];
            shortsGrid += `<div class="list-item">
                              <a href="./youtube-shorts-detail.html">
                                <div class="thumbnail">
                                  <div class="thumb-inner"><img src="${short.file}" alt="" /></div>
                                </div>
                                <div class="info-area">
                                  <div class="title">쇼츠0${i+1}</div>
                                  <div class="date">${dateToStr(strToDate(short.createDate))}</div>
                                </div>
                              </a>
                            </div>`;
          }          
            document.getElementById("main-shorts_grid").innerHTML = shortsGrid;
            document.getElementById("main-shorts-regist").style.display = 'none';
            document.getElementById("main-shorts-modify").style.display = 'block';
        } else {
            document.getElementById("main-shorts-regist").style.display = 'block';
            document.getElementById("main-shorts-modify").style.display = 'none';
        }
      }) 
    }).catch(error => console.log(error));
  }

  function getShortsDetailList(){
    console.log('getMainShortsList');
    let url = baseUrl + "/mains?category=3&state=0";

    fetch(url, headers.json_headers)   
    .then((response) => {
      checkError(response.status);
      response.json().then((shorts) => {
        let shortsData = shorts.data.mains;
        // let highlightDataTotal = shorts.data.total;
        
        if(shortsData.length > 0){
          let shortsGrid = "";
          for( let i = 0; i< shortsData.length  ; i++){
            let short = shortsData[i];
            shortsGrid += `<div class="col-lg-6">
                              <div class="panel">
                                <div class="panel-title">
                                  <strong class="title">쇼츠0${i+1}</strong>
                                </div>
                                <div class="form-container">
                                  <div class="form-group">
                                    <div class="form-row">
                                      <div class="form-label pt0">
                                        <div class="label">대표 이미지</div>
                                      </div>
                                      <div class="form-fleid">
                                        <div class="col-group">
                                          <div class="col-lg-12">
                                            <img src="${short.file}" alt="" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <div class="form-row">
                                      <div class="form-label pt0">
                                        <div class="label">쇼츠 링크</div>
                                      </div>
                                      <div class="form-fleid">
                                        <div class="col-group">
                                          <div class="col-lg-12">
                                            <div class="form-text"><a href="${short.link}" target="_blank" class="underline">${short.link}</a></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <div class="form-row">
                                      <div class="form-label pt0">
                                        <div class="label">조회수</div>
                                      </div>
                                      <div class="form-fleid">
                                        <div class="col-group">
                                          <div class="col-lg-12">
                                            <div class="form-text">${short.showCount}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <div class="form-row">
                                      <div class="form-label pt0">
                                        <div class="label">등록일</div>
                                      </div>
                                      <div class="form-fleid">
                                        <div class="col-group">
                                          <div class="col-lg-12">
                                            <div class="form-text">${new Date(short.createDate).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>`;
          }          
            document.getElementById("main-shorts_grid").innerHTML = shortsGrid;
          //  document.getElementById("main-shorts-regist").style.display = 'none';
          //  document.getElementById("main-shorts-modify").style.display = 'block';
        } else {
            document.getElementById("main-shorts-regist").style.display = 'block';
            document.getElementById("main-shorts-modify").style.display = 'none';
        }
      }) 
    }).catch(error => console.log(error));
  }

  function getShortsList(){
    let url = baseUrl + "/mains?category=3&state=0";
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((shorts) => {
        let shortsData = shorts.data.mains;
        console.log('shortsData ' + JSON.stringify(shortsData));
        setTimeout(()=> {
            for( let i = 0; i < shortsData.length; i++){
              let id = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();

              document.getElementById("mainId-" + id).value = shortsData[i].id;
              
              if(shortsData[i].file) {
                if(id === '01')sendFileToDropzone(dropzone01,shortsData[i].file);
                else if(id === '02')sendFileToDropzone(dropzone02,shortsData[i].file);
                else if(id === '03')sendFileToDropzone(dropzone03,shortsData[i].file);
                else if(id === '04')sendFileToDropzone(dropzone04,shortsData[i].file);
                else if(id === '05')sendFileToDropzone(dropzone05,shortsData[i].file);
                else if(id === '06')sendFileToDropzone(dropzone06,shortsData[i].file);
                else if(id === '07')sendFileToDropzone(dropzone07,shortsData[i].file);
                else if(id === '08')sendFileToDropzone(dropzone08,shortsData[i].file);
                else if(id === '09')sendFileToDropzone(dropzone09,shortsData[i].file);
                else if(id === '10')sendFileToDropzone(dropzone10,shortsData[i].file);
              }

              let linkPath = shortsData[i]?.link ? shortsData[i]?.link.split('/') : '';
              document.getElementById("fixUrl" + id).value = linkPath[linkPath.length-1];
              document.getElementById("main-shorts-" + id).style.display = 'block';
            }

            if(shortsData.length >= 10) document.getElementById("ain-shors-add").style.display = 'none';
            
        }, 100);
      }); 
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

  function registerShorts(){
    let count = 0, newCount = 0; modifyCount = 0;
    for(i=0; i<10; i++){
      let id = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();
      if(document.getElementById("main-shorts-" + id).style.display === 'block'){
        count++;  
        if(!document.getElementById("mainId-" + id).value) newCount++;
        else if(isModifiedShorts[i] || isModifiedFiles[i]) modifyCount++;
        
        if(!shortsFiles[i] || !document.getElementById("fixUrl" + id).value){
          $('.popup-common-title strong').replaceWith('<strong>입력을 마무리 하셔야 등록이 가능합니다.</strong>');
          layerPopup.openPopup('youtubeAlertPopup', true);
          return;
        }
      }
      else break;
    }

    if(count <= 0){
      $('.popup-common-title strong').replaceWith('<strong>최소 하나이상 입력하셔야 합니다.</strong>');
      layerPopup.openPopup('youtubeAlertPopup', true);
      return;
    }

    if(newCount === 0 && modifyCount === 0 && removedShorts.length === 0){
      $('.popup-common-title strong').replaceWith('<strong>동기화 대상이 없습니다.</strong>');
      layerPopup.openPopup('youtubeAlertPopup', true);
      return;
    }

    // 삭제
    console.log('deleted => ' + JSON.stringify(removedShorts));
    for(let i=0; i<removedShorts.length; i++){
      let url = baseUrl + "/main"; 

      let formData = new FormData();
      formData.append('id', removedShorts[i]);
      formData.append('state', 1);

      async function post(request) {
        try {
          await fetch(request).then(response => {
          }); 
        } catch (error) {
          console.error("Error:", error);
        }
      }
          
      const shortsDelete = new Request(url, {
          method: "POST",
          headers: headers.form_headers.headers,
          body:formData,
      });
      
      post(shortsDelete);
    }

    // 생성 및 업데이트
    if(newCount === 0 && modifyCount === 0) return success(3);

    let createdCount = 0;
    let modifiedCount = 0;
    for(i=0; i<10; i++){
      let id = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();
      if(document.getElementById("main-shorts-" + id).style.display === 'block'){
        
        // 생성
        if(!document.getElementById("mainId-" + id).value){
          let url = baseUrl + "/main/register" ; 

          let formData = new FormData();
          formData.append('category', 3);
          formData.append('state', 0);
          formData.append('link', 'https://www.youtube.com/shorts/' +  document.getElementById("fixUrl" + id).value);
          formData.append('file', shortsFiles[i], shortsFiles[i].name);

          async function create_post(request) {
            try {
              await fetch(request).then(response => {
                  createdCount++;
                  if(newCount <= createdCount && modifyCount <= modifiedCount){
                    success(3)
                  } 
              }); 
            } catch (error) {
              console.error("Error:", error);
            }
          }
            
          const shortsRegister = new Request(url, {
              method: "POST",
              headers: headers.form_headers.headers,
              body:formData,
          });
          
          create_post(shortsRegister);
        }
        else if(isModifiedShorts[i] || isModifiedFiles[i]){
          let mainId = document.getElementById("mainId-" + id).value;

          let url = baseUrl + "/main"; 

          let formData = new FormData();
          formData.append('id', mainId);
          if(isModifiedShorts[i]) formData.append('link', 'https://www.youtube.com/shorts/' +  document.getElementById("fixUrl" + id).value);
          if(isModifiedFiles[i]) formData.append('file', shortsFiles[i], shortsFiles[i].name);

          async function modify_post(request) {
            try {
              await fetch(request).then(response => {
                modifiedCount++;
                if(newCount <= createdCount && modifyCount <= modifiedCount){
                  success(3)
                } 
              }); 
            } catch (error) {
              console.error("Error:", error);
            }
          }
              
          const shortsModify = new Request(url, {
              method: "POST",
              headers: headers.form_headers.headers,
              body:formData,
          });
          
          modify_post(shortsModify);
        }
      }
    }
  }

  function addShort(){
    for(let i = 0; i < 10; i++){
      let id = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();
     
      if(document.getElementById("main-shorts-" + id).style.display === 'none'){
        if(i>0){
          let prevId = i < 9 ? ('0' + (i).toString()) : (i).toString();
          if(!shortsFiles[i-1] || !document.getElementById("fixUrl" + prevId).value){
            $('.popup-common-title strong').replaceWith('<strong>입력을 마무리 하셔야 추가가 가능해요.</strong>');
            layerPopup.openPopup('youtubeAlertPopup', true);
            return;
          }
        }

        document.getElementById("main-shorts-" + id).style.display = 'block';
        return;
      }
    }
    document.getElementById("main-shors-add").style.display = 'none';
  }

  function deleteShort(index){
    let id = index < 9 ? ('0' + (index+1).toString()) : (index+1).toString();
    let lastIndex = index;
    for(i=9; i>index; i--){
      let checkId = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();
      if(shortsFiles[i] || document.getElementById("fixUrl" + checkId).value){
        lastIndex = i;
        break;
      }
    }

    // delete
    removedShorts.push(document.getElementById("mainId-" + id).value);

    // shift
    for(let i=lastIndex; i>index; i--){
      let prevId = i < 9 ? ('0' + (i).toString()) : (i).toString();
      let nextId = i < 9 ? ('0' + (i+1).toString()) : (i+1).toString();
      console.log('prevId => ' + prevId + ' nextId => ' + nextId);

      let prevDropzone = null;
        if(prevId === '01')      prevDropzone = dropzone01;
        else if(prevId === '02') prevDropzone = dropzone02;
        else if(prevId === '03') prevDropzone = dropzone03;
        else if(prevId === '04') prevDropzone = dropzone04;
        else if(prevId === '05') prevDropzone = dropzone05;
        else if(prevId === '06') prevDropzone = dropzone06;
        else if(prevId === '07') prevDropzone = dropzone07;
        else if(prevId === '08') prevDropzone = dropzone08;
        else if(prevId === '09') prevDropzone = dropzone09;

      if(shortsFiles[i]){
        prevDropzone?.emit("addedfile", shortsFiles[i], true);
        prevDropzone?.emit("thumbnail", shortsFiles[i], shortsFiles[i]);
        prevDropzone?.emit("accept", shortsFiles[i]);
        prevDropzone?.emit("complete", shortsFiles[i]);
        shortsFiles[i-1] = shortsFiles[i];
      }
      else if(shortsFiles[i-1]) {
        prevDropzone?.emit("removedfile", shortsFiles[i-1]);
        prevDropzone?.emit("complete", shortsFiles[i]);
      }

      document.getElementById("fixUrl" + prevId).value = document.getElementById("fixUrl" + nextId).value;
    } 
     
    // last closed
    let lastId = lastIndex < 9 ? ('0' + (lastIndex+1).toString()) : (lastIndex+1).toString();
    if(shortsFiles[lastIndex]){
      let lastDropzone = null;
      if(lastId === '01')      lastDropzone = dropzone01;
      else if(lastId === '02') lastDropzone = dropzone02;
      else if(lastId === '03') lastDropzone = dropzone03;
      else if(lastId === '04') lastDropzone = dropzone04;
      else if(lastId === '05') lastDropzone = dropzone05;
      else if(lastId === '06') lastDropzone = dropzone06;
      else if(lastId === '07') lastDropzone = dropzone07;
      else if(lastId === '08') lastDropzone = dropzone08;
      else if(lastId === '09') lastDropzone = dropzone09;
      lastDropzone.emit("removedfile", shortsFiles[lastIndex]);
    }

    document.getElementById("fixUrl" + lastId).value = '';
    document.getElementById("main-shorts-" + lastId).style.display = 'none';
  }

  ///// 팝업 ////////////////////////////////////////////////////////////////////////////////////////////
  function success(category=null /*0:하이라이트 1캠퍼스 트랜드 2:대학생 매거진 3:쇼츠*/){
    if(category === 0) {
      $('.popup-common-title strong').replaceWith('<strong>하이라이트 기사가 등록/수정되었어요.<strong>');
      layerPopup.openPopup('highlightConfirmPopup', true);
    }
    else if(category === 1) {
      $('.popup-common-title strong').replaceWith('<strong>추천! 캠퍼스 에디터 기사가 등록/수정되었어요.<strong>');
      layerPopup.openPopup('trendConfirmPopup', true);
    }
    else if(category === 2) {
      $('.popup-common-title strong').replaceWith('<strong>대학생이 만든 매거진이 등록/수정되었어요.</strong>');
      layerPopup.openPopup('webzineConfirmPopup', true);
    }
    else if(category === 3) {
      $('.popup-common-title strong').replaceWith('<strong>유튜브 쇼츠가 등록/수정되었어요.<strong>');
      layerPopup.openPopup('youtubeConfirmPopup', true);
    }
  }

  function cancel(type,category=null /*category==>0:하이라이트 1캠퍼스 트랜드 2:대학생 매거진 3:쇼츠 , type ==> 1: 등록 2: 수정*/){
    console.log('type' + type);
    if(type === 1){
      $('.popup-common-title strong').replaceWith('<strong>등록을 취소하시겠어요?</strong>');
    } else {
      $('.popup-common-title strong').replaceWith('<strong>수정을 취소하시겠어요?</strong>');
    }
    if(category === 0) {     
      layerPopup.openPopup('highlightConfirmPopup', true);
    }
    else if(category === 1) {          
      layerPopup.openPopup('trendConfirmPopup', true);
    }
    else if(category === 2) {   
      layerPopup.openPopup('webzineConfirmPopup', true);
    }
    else if(category === 3) {    
      layerPopup.openPopup('youtubeConfirmPopup', true);
    }
  }

  function cancelOK(category=null /*0:하이라이트 1캠퍼스 트랜드 2:대학생 매거진 3:쇼츠*/){ 
    if(category === 0) {
      let id =  window.sessionStorage.getItem('highlightId');
      location.href = "highlight-detail.html?id=" + id;
    }
    else if(category === 1) {
      let id =  window.sessionStorage.getItem('highlightId');
      location.href = "trend-detail.html";
    }
    else if(category === 2) {
      location.href = "webzine-detail.html";
    }
    else if(category === 3) {
      location.href = "youtube-shorts-detail.html";
    }
    else location.href = "main-board.html";
  }

  function setTodayWebzine(){
    console.log('setToday')
    const today = new Date();
    document.getElementById('main-story-start-date').value = dateToStr(today);
    // document.getElementById('main-story-end-date').value = dateToStr(today);
  }

  function searchStart(e){
    if(e.keyCode === 13){
      getStoryList(0,20);
    }
  }