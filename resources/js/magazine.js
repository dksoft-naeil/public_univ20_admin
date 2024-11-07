
  ///////////////////// 매거진 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/magazine/magazine-list") >= 0) getMagazineArticleList(0,20,null);  
    else if(window.location.pathname.indexOf("/magazine/magazine-campus-list") >= 0) getMagazineArticleList(0,20,0);  
    else if(window.location.pathname.indexOf("/magazine/magazine-lifestyle-list") >= 0) getMagazineArticleList(0,20,1);   
    else if(window.location.pathname.indexOf("/magazine/magazine-career-list") >= 0) getMagazineArticleList(0,20,2);  
    else if(window.location.pathname.indexOf("/magazine/magazine-article-detail") >= 0) getMagazineArticle(); 
    else if(window.location.pathname.indexOf("/magazine/magazine-article-modify") >= 0) modifyArticle();  
    else if(window.location.pathname.indexOf("/magazine/magazine-article-register") >= 0) goRegister();  
  });

  let editorId = ''; let editorName= '';  let category = {}; category[0] = '캠퍼스' ;category[1] = '라이프스타일'; category[2] = '커리어';
  var totalMagazine = 0;
  function getMagazineArticleList(currentPage, size, filterCategory){     
    new Promise(function(resolve) {
      setTimeout(function() {
       
        getMagazineBestArticleList( filterCategory)
        resolve();
      }, 50);
    })
      .then(function(prevName) {
        return new Promise(function(resolve) {
          setTimeout(function() {
            getMagazineCommonArticleList(currentPage, size, filterCategory)
            resolve();
          }, 500);
        });
      })
  
    window.sessionStorage.removeItem("magazineArticleId");
  }

  function getMagazineBestArticleList(filterCategory, filterYear='', filterMonth='',  filterStatus=0){
      // console.log('getMagazineList  page' + page)
      totalMagazine=0;
      document.getElementById('magazine-best-article_grid').innerHTML = "";
      window.sessionStorage.removeItem("magazineArticleId");
      let message;          
      let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '완료';
      let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
      let _keyword = document.getElementById('magazine-article-search').value;
      let magazineState = document.getElementById('magazine-article-state');
      let _filterState =  (magazineState.options[magazineState.selectedIndex]).value === 'all' ? null : (magazineState.options[magazineState.selectedIndex]).value ;   
      let magazineStatus = document.getElementById('magazine-article-status');
      let _filterStatus =  (magazineStatus.options[magazineStatus.selectedIndex]).value === 'all' ? null : (magazineStatus.options[magazineStatus.selectedIndex]).value ;    
      let _year = document.getElementById('magazine-article-year');
      let _filterYear = (_year.options[_year.selectedIndex]).value === 'all' ? null : (_year.options[_year.selectedIndex]).value
      let _month = document.getElementById('magazine-article-month');
      let _filterMonth = (_month.options[_month.selectedIndex]).value === 'all' ? null : (_month.options[_month.selectedIndex]).value
      // let _status= document.getElementById('magazine-article-status').value;
      let _category;

      // console.log('filterCategory' + filterCategory);
      let _filterCategory;   
      if (filterCategory === null ){
        _category = document.getElementById('magazine-article-category');
        _filterCategory = (_category.options[_category.selectedIndex]).value === 'all' ? null : (_category.options[_category.selectedIndex]).value
      }else{
        _filterCategory = filterCategory ;
      }

      let url = baseUrl + "/magazines?"; ////filter_year="+ filterYear +'&filter_month='+ filterMonth  +'&filter_category='+ filterCategory +'&filter_status='+ filterStatus + '&keyword=' + (_keyword === null ? '' : _keyword);
      url += "isRanking=1&sort=popularity";
  
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
      
      if ( _filterCategory !== null && _filterCategory !== undefined){   
        url +='&category='+ _filterCategory;
      }

      let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
      let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
      let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
      url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

      url += (_keyword === null ? '' : ('&keyword=' + _keyword));  
      url += '&offset='+ 0 +"&limit=" + 6;

      if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
        document.getElementById('magazine-best-article_grid').innerHTML = '';
        return
      } 
      else{
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
          response.json().then((magazineBestArticles) => {
            let bestArticles= "";
            
            totalMagazine = magazineBestArticles.data.total;
            // console.log('totalMagazine' + totalMagazine);
            // let paging= "";
            //console.log('magazineBestArticles' + JSON.stringify(magazineBestArticles))
            let _magazineBestArticles = magazineBestArticles.data.magazines;
          
            _magazineBestArticles?.map((values) =>
            {
              // console.log('${values.title}'+ values.title);
              let today = new Date();
              // let postState = today.getTime() < (new Date(values.startDate)).getTime() ? '대기중' : today.getTime() >  (new Date(values.endDate)).getTime()? '완료' : '게시중'
              let state = values.state === 2? '비공개':"공개";
              bestArticles+=`<tr class="best">
                        <td>
                          <div class="selector-cover checkbox solo">
                            <label class="label">
                              <input type="checkbox"  class="chk" onclick="itemCheck()" value=${values.id}/>
                              <span class="label-text">
                                  <span class="selector"></span>
                              </span>
                            </label>
                          </div>
                        </td>
                        <td>인기</td>                     
                        <td><a href="./magazine-article-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
      
                        <td>${category[values.category]}</td>
                        <td>${replacestr(values.name)}</td>
                        <td>${state}</td>
                        <td>${_status[values.status]}</td>
                        <td>${dateToStr(strToDate(values.startDate))}</td>
                        <td>${dateToStr(strToDate(values.createDate))}</td>
                      <tr>`;                                
            });           
            document.getElementById('magazine-best-article_grid').innerHTML = bestArticles;
            return magazineBestArticles.data.total;
          })
        }).catch(error => console.log(error));
      }
  }
  
  function getMagazineCommonArticleList( currentPage, size, filterCategory=null, filterYear='', filterMonth='', filterStatus=0){
      document.getElementById('magazine-article_grid').innerHTML = ""
      window.sessionStorage.removeItem("magazineArticleId");
      let message;          
      let category = {}; category[0] = '캠퍼스';category[1] = '라이프스타일';category[2] = '커리어';
      let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
      let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '완료';
      let _keyword = document.getElementById('magazine-article-search').value;
      let magazineState = document.getElementById('magazine-article-state');
      let _filterState =  (magazineState.options[magazineState.selectedIndex]).value === 'all' ? null : (magazineState.options[magazineState.selectedIndex]).value ;   
      let magazineStatus = document.getElementById('magazine-article-status');
      let _filterStatus =  (magazineStatus.options[magazineStatus.selectedIndex]).value === 'all' ? null : (magazineStatus.options[magazineStatus.selectedIndex]).value ;    
      let _year = document.getElementById('magazine-article-year');
      let _filterYear = (_year.options[_year.selectedIndex]).value === 'all' ? null : (_year.options[_year.selectedIndex]).value
      let _month = document.getElementById('magazine-article-month');
      let _filterMonth = (_month.options[_month.selectedIndex]).value === 'all' ? null : (_month.options[_month.selectedIndex]).value
     
      let url = baseUrl + "/magazines?";

      let _category;
      let _filterCategory;   
      if (filterCategory === null ){
        _category = document.getElementById('magazine-article-category');
        _filterCategory = (_category.options[_category.selectedIndex]).value === 'all' ? null : (_category.options[_category.selectedIndex]).value;
      }else{
        _filterCategory = filterCategory ;
      }

      url += "isRanking=0";
      if ( _filterState !== null){   
        url +='&state='+ _filterState;
      } else {
        if ( _filterStatus  === '-' ){
          url +='&state=2';
        } else if ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting'){
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

      if (_filterCategory !== null){
        url += '&category='+ _filterCategory;
      }

      let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
      let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
      let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
      url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';

      url += (_keyword === null ? '' : ('&keyword=' + _keyword));
      url += '&offset='+ currentPage *size +"&limit=" + size;

      if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
        document.getElementById('magazine-article_grid').innerHTML = '';
        document.getElementById('magazine-article-total').innerHTML = '<strong>'+ 0 + '</stron>';
        document.getElementById('magazine-article-pagination').innerHTML = '';
        return;
      } 
      else{
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
          response.json().then((magazineArticles) => {
            let commonArticles= "";  
            let paging= "";
            console.log('magazineArticles' + JSON.stringify(magazineArticles))
            let _magazineCommonArticles = magazineArticles?.data.magazines;
            let _magazineArticlesTotal = magazineArticles?.data.total;
            totalMagazine += _magazineArticlesTotal;
            let numOfPage = Math.ceil(_magazineArticlesTotal/size);
        
            let dataLen = _magazineCommonArticles.length;
            for( let i=0;  i < _magazineCommonArticles.length ; i++){
              let values = _magazineCommonArticles[i];
              let today = new Date();
              let postState = today.getTime() < (new Date(values.startDate)).getTime() ? '대기중' : today.getTime() >  (new Date(values.endDate)).getTime()? '완료' : '게시중'
              let magazinestate = values.state === 2? '비공개':"공개";
              commonArticles+=`
                                <tr>
                                  <td>
                                    <div class="selector-cover checkbox solo">
                                      <label class="label">
                                        <input type="checkbox"  class="chk" onclick="itemCheck()" value=${values.id}/>
                                        <span class="label-text">
                                            <span class="selector"></span>
                                        </span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>${values.id}</td>                     
                                  <td><a href="./magazine-article-detail.html?id=${values.id}" class="underline">${values.title}</a></td>                      
                                  <td>${category[values.category]}</td>
                                  <td>${values.name}</td>
                                  <td>${magazinestate}</td>   
                                  <td>${values.state === 2 ? '-' :_status[values.status]}</td>
                                  <td>${values.startDate?dateToStr(strToDate(values.startDate)):""}</td>
                                  <td>${dateToStr(strToDate(values.createDate))}</td>
                                <tr>`;                                
            };  

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
                            <a href="#" class="page-link" onclick="getMagazineCommonArticleList(0,`+size+`)">First</a>
                          </li>`
              }
              if (currentPage == 0){ 
                paging += `<li class="controller prev disabled">`;
              } else {
                paging += `<li class="controller prev">
                            <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                          </li>`
              }
                      
              for ( let page = startOfPage ; page< endOfPage; page++){             
                  if (page === (currentPage)){
                    paging +=`<li class="paging current">` 
                  } else {
                    paging +=`<li class="paging">` 
                  }                                              
                  paging += `<a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
              }      

              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller next disabled">`;
              } else {
                paging += `<li class="controller next">
                            <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                          </li>`
              }     
              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller last disabled">`;
              } else {
                paging += `<li class="controller last">
                            <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                          </li>`
              }       
            document.getElementById('magazine-article_grid').innerHTML = totalMagazine=== 0 ?  "<tr><td colspan='9'>데이터가 없습니다.</td></tr>" : commonArticles;
            document.getElementById('magazine-article-total').innerHTML = '<strong>'+ totalMagazine + '</stron>';
            document.getElementById('magazine-article-pagination').innerHTML = paging;
          });
        }).catch(error => console.log(error));
      }
  }
    
  function getMagazineArticle() {
    let domReferrer = document.referrer;
    // console.log(domReferrer.indexOf('/magazine/magazine-campus-list.html'))
    if (domReferrer.indexOf('/magazine/magazine-campus-list.html') !== -1){
      console.log('magazine/magazine-campus-list.html');
      let menuList = document.getElementsByClassName('sub-menu-item');
      for( let i = 0; i < menuList.length; i++ ){
				let section1 = menuList.item(i).innerHTML;
				console.log(section1);
        if ( '<a href="../magazine/magazine-campus-list.html">캠퍼스 기사</a>' === section1){
          menuList.item(i).classList.add("active");
        }
			}
    } else if (domReferrer.indexOf('/magazine/magazine-lifestyle-list.html') !== -1){
      console.log('magazine/magazine-lifestyle-list.html');
      let menuList = document.getElementsByClassName('sub-menu-item');
      for( let i = 0; i < menuList.length; i++ ){
				let section1 = menuList.item(i).innerHTML;
				console.log(section1);
        if ( '<a href="../magazine/magazine-lifestyle-list.html">라이프스타일 기사</a>' === section1){
          menuList.item(i).classList.add("active");
        }
			}
    } else if (domReferrer.indexOf('/magazine/magazine-career-list.html') !== -1){
      console.log('magazine/magazine-career-list.html');
      let menuList = document.getElementsByClassName('sub-menu-item');
      for( let i = 0; i < menuList.length; i++ ){
				let section1 = menuList.item(i).innerHTML;
				console.log(section1);
        if ( '<a href="../magazine/magazine-career-list.html">커리어 기사</a>' === section1){
          menuList.item(i).classList.add("active");
        }
			}
    } else {
      let menuList = document.getElementsByClassName('sub-menu-item');
      for( let i = 0; i < menuList.length; i++ ){
				let section1 = menuList.item(i).innerHTML;
				console.log(section1);
        if ( '<a href="../magazine/magazine-list.html">전체 기사</a>' === section1){
          menuList.item(i).classList.add("active");
        }
			}
    }



    let u = window.location.href;
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '완료';
    let id;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        id = pair[1];
    }

    let url = baseUrl + "/magazines?id=" + id //// sessionStorage.getItem('magazineArticleNum') ;
   
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((magazineData) => {
        let data1= "";
        let _magazineData = magazineData.data.magazines[0];
        console.log('magazineData' + JSON.stringify(_magazineData))
        // let _articleData
        let category = {}; category[0] = '캠퍼스';category[1] = '라이프스타일';category[2] = '커리어';
     
        //////기본 내용
        window.sessionStorage.setItem('magazineArticleId',_magazineData.id);
        document.getElementById('magazine-article-category').innerHTML = category[_magazineData.category];
        document.getElementById('magazine-article-editor').innerHTML = _magazineData.name;

        /// 상태
        let _state = _magazineData.state === 2 ? '비공개' : '공개';
        
        /// 게시
        let _postState = _magazineData.state === 2  ? '-' : _magazineData.state  === 0 ? "즉시 게시" : "예약 게시";

        document.getElementById('magazine-article-state').innerHTML = _state;
        document.getElementById('magazine-article-post-state').innerHTML = _postState;
        document.getElementById('magazine-article-post-status').innerHTML = _magazineData.state === 2? '-' :_status[_magazineData.status];
        document.getElementById('magazine-article-like-count').innerHTML = _magazineData.likeCount;
        document.getElementById('magazine-article-show-count').innerHTML = _magazineData.showCount;
        document.getElementById('magazine-article-start-date').innerHTML = dateToStr(strToDate(_magazineData.startDate));
        document.getElementById('magazine-article-create-date').innerHTML = dateToStr(strToDate(_magazineData.createDate));

        /// 본문
        document.getElementById('magazine-article-content').innerHTML = _magazineData.content;
        /// 제목 및 한 줄 소개
        document.getElementById('magazine-article-title').innerHTML = _magazineData.title;
        console.log('magazine-article-summary' +_magazineData.summary );
        document.getElementById('magazine-article-summary').innerHTML = _magazineData.summary;

        /// 슬라이드 이미지
        let slideGrid = "";
        for (let i =2 ; i< 12; i++){
          let filename = `file${i}`;
        
          if (_magazineData[filename] !== null)
          slideGrid += `
              <div class="form-group">
                <div class="form-row">
                  <div class="form-label">
                    <div class="label">이미지 ${i-1} 링크</div>
                  </div>
                  <div class="form-fleid">
                    <div class="col-group">
                      <div class="col-lg-12">
                        <div class="form-text p10 bg-softgrey">${_magazineData[filename]}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          `;
        }
        document.getElementById('magazine-article-image-link').innerHTML = slideGrid;
        
        /// 태그
        let tagArray = (_magazineData.tags)?.split(',');    
        console.log('tagArray' + tagArray);
        document.getElementById('magazine-article-tag-1').innerHTML = tagArray[0] === undefined ? "" : tagArray[0] ;                   
        document.getElementById('magazine-article-tag-2').innerHTML = tagArray[1] === undefined ? "" : tagArray[1] ;          
        document.getElementById('magazine-article-tag-3').innerHTML = tagArray[2] === undefined ? "" : tagArray[2] ;                 
        document.getElementById('magazine-article-related-1').innerHTML = _magazineData.url1;
        document.getElementById('magazine-article-related-2').innerHTML = _magazineData.url2;
        document.getElementById('magazine-article-first-image').src = _magazineData.file1;
        
        //// comment
        getMagazineArticleCommentList(0,20, _magazineData.id, 1);
        window.sessionStorage.setItem("magazineArticleId", _magazineData.id);
      });
    }).catch(error => console.log(error));
  }
  
  function getMagazineArticleCommentList(currentPage, size, magazineId, type) {
    let url = baseUrl + "/magazine-comments?magazineId=" + magazineId; 
    url += '&state=0';
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((articleComments) => {
        let articleCommentsGrid= "";         
        let paging= "";
        let articleCommentList = articleComments.data.comments;
        let articleCommentTotal = articleComments.data.total;
        let numOfPage = Math.ceil(articleCommentTotal/size);
  
        for( let i=0;  i < articleCommentList.length ; i++){
            let values = articleCommentList[i];
            articleCommentsGrid+=`<tr>`;
            if (type === 2){
              articleCommentsGrid+=`<td>
                                        <div class="selector-cover checkbox solo">
                                          <label class="label">
                                            <input type="checkbox"  class="chk" onclick="itemCheck()" value=${values.id}/>
                                            <span class="label-text">
                                                <span class="selector"></span>
                                            </span>
                                          </label>
                                        </div>
                                    </td>`
            }
            articleCommentsGrid+=`  <td>${values.id}</td>
                                    <td>${values.content}</td>
                                    <td>${values.likeCount}</td>
                                    <td>${values.name}</td>
                                    <td>${dateToStr(strToDate(values.createDate))}</td>
                                  <tr>`;                                
        };  
        
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
                      <a href="#" class="page-link" onclick="getMagazineCommonArticleList(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || numOfPage === 0) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || numOfPage === 0) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getMagazineCommonArticleList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       
        document.getElementById('magazine-article-comment_grid').innerHTML = articleCommentsGrid === "" ? "<tr><td colspan='6'>데이터가 없습니다.</td></tr>": articleCommentsGrid;
        document.getElementById('magazine-article-comment-total').innerHTML = '<strong>'+ articleCommentTotal + '</stron>';
        document.getElementById('magazine-article-comment-pagination').innerHTML = paging;
      });
    }).catch(error => console.log(error));

  }

  function modifyArticle(){
    let u = window.location.href;
    let _articleId;
    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        _articleId = pair[1];
    } else {
      _articleId =window.sessionStorage.getItem("magazineArticleId");
    }
   
    document.getElementById('magazine-article-modify').style.display = 'block';
    document.getElementById('magazine-article-comment-container').style.display = 'block';
    // document.getElementById('magazine-register-filezone').style.display = 'none';
    let url = baseUrl + "/magazines?id=" + _articleId;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((magazineArticle) => {
        let magazineArticleData = magazineArticle.data.magazines;
        // let noticeDataTotal = magazineArticle.data.total;
        //console.log('magazineArticleData' + JSON.stringify(magazineArticleData));
        if(magazineArticleData.length > 0){
          let _magazineArticleData = magazineArticleData[0];
          let _state = _magazineArticleData.state;
          let today = new Date();
          let startdate = new Date(_magazineArticleData.startDate);            
          
          ///// 기본 설정
          let _category = _magazineArticleData.category;
          $('#magazine-article-category option[value='+ _category +']').attr('selected', true);

          editorId = _magazineArticleData.userId;
          editorName = _magazineArticleData.name;
          document.getElementById('autocomplete01').value = editorName;

          /// 상태 
          if(_state === 0 || _state === 3) $(":radio[name=magazine-article-state][value='public']").attr('checked', true);
          else $(":radio[name=magazine-article-state][value='private']").attr('checked', true);
          
          /// 게시
          if(_state === 2){
            (new Date(_magazineArticleData.startDate) <= new Date(_magazineArticleData.lastDate)) ? 
              $(":radio[name='magazine-article-post-state'][value='immediately']").attr('checked', true) :
              $(":radio[name='magazine-article-post-state'][value='reserved']").attr('checked', true)
          }
          else{ 
            _state === 0 ?
              $(":radio[name='magazine-article-post-state'][value='immediately']").attr('checked', true) : 
              $(":radio[name='magazine-article-post-state'][value='reserved']").attr('checked', true);
          } 
          
          /// 게시일
          document.getElementById('magazine-article-post-start-date').value = dateToStr(strToDate(_magazineArticleData.startDate));

          ///// 제목 및 한 줄 소개
          document.getElementById('magazine-article-title').value = _magazineArticleData.title;
          document.getElementById('magazine-article-summary').value = _magazineArticleData.summary;

          ///// 본문
          editorInstance.html.insert(_magazineArticleData.content);

          ///// 태그
          let tagArray = (_magazineArticleData.tags)?.split(',');    
          console.log('tagArray' + tagArray);
          document.getElementById('magazine-article-tag-1').value = tagArray[0] === undefined ? "" : tagArray[0] ;                   
          document.getElementById('magazine-article-tag-2').value = tagArray[1] === undefined ? "" : tagArray[1] ;          
          document.getElementById('magazine-article-tag-3').value = tagArray[2] === undefined ? "" : tagArray[2] ;     
          
          ///// 기사 댓글
          getMagazineArticleCommentList(0,20, _magazineArticleData.id,2);
          
          ///// 비슷한 기사 더보기
          document.getElementById('fixUrl').value = _magazineArticleData.url1;
          document.getElementById('fixUrl02').value = _magazineArticleData.url2;

          //// 메인 이미지
          sendFileToDropzone(dropzone02, _magazineArticleData.file1);

          //// 슬라이드 이미지
          for (let i = 2; i< 12; i++){
            let fileName = 'file' + i.toString();
            if (_magazineArticleData[fileName] !== null){
              sendFileToDropzone(dropzone04, _magazineArticleData[fileName]);
            }
          }
        }

        url= baseUrl + "/users/all?state=0&grade=50";    
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
          response.json().then((response) => {       

            let users ='';
            for(let i = 0; i<response.data.users.length ; i++){
              users += `{id:"${response.data.users[i].id}", value:"${response.data.users[i].name}"},`;
            }

            const script = document.createElement("script");
            text = document.createTextNode( `
              $(document).ready(function() {
                // jquery-ui autocomplete 참고 - https://jqueryui.com/autocomplete/
                var managers = [${users}];
                var timer = null;
                $('#autocomplete01').autocomplete({
                  select: function(event, ui) {
                    if (ui.item.value == '') {
                      document.getElementById("magazine-alert-message").innerHTML ='<strong>권한이 있는 에디터만 매거진 기사를 수정할 수 있습니다.</strong>';                                       
                      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
                      // event.preventDefault();
                    }
                    else{
                      editorId = Number(ui.item.id);
                      editorName = ui.item.value;
                      //console.log('editor id ' + editorId);
                    }
                  },
                  source: managers,                          
                  delay: 150,
                  minLength: 1,
                  response: function(event, ui) {                   
                    if (!ui.content.length) {
                      var noResult = {
                        value: '',
                        label: $(this).val(),
                      };
                               
                      ui.content.push(noResult)
                    }
                  },
                  open: function(event, ui){
                    if(timer) {
                      clearTimeout(timer);
                      timer = null;
                    }
                  },
                  close: function(event, ui){
                    timer = setTimeout(function(){
                      $('#autocomplete01').val(editorName);
                    },3000);
                  }
                });

                $.ui.autocomplete.prototype._renderItem = function(ul, item) {
                  if (item.value) {
                    var t = String(item.value).replace(new RegExp(this.term, 'gi'), '<strong>$&</strong>');
                    return $('<li></li>')
                      .data('item.autocomplete', item)
                      .append('<div>' + t + '</div>')
                      .appendTo(ul);
                  } else {      
                    return $('<li></li>')
                    .data('item.autocomplete', item)
                    .append('<div class="no-result">' + '검색결과가 없습니다.' + '</div>')                                    
                    .appendTo(ul);        
                  }
                };
              }); `);
          // console.log('input name: noResult' + noResult);
          // if (noResult){
          //   document.getElementById("magazine-alert-message").innerHTML = "<strong>등록된 에디터가 아닙니다.</strong>"
          //   location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true)";
          //   return 
          // }
          script.appendChild(text);
          document.body.appendChild(script);

          });
        }).catch(error => console.log(error));
        
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

  function checkInput(type){
    console.log('checkInput');
    let category = document.getElementById("magazine-article-category");
    let _category = (category.options[category.selectedIndex]).value === 'all' ? null : (category.options[category.selectedIndex]).value ;    
    let summary = document.getElementById("magazine-article-summary").value;
    let title = document.getElementById("magazine-article-title").value;
    let postDate = document.getElementById("magazine-article-post-start-date").value;
    let tag1 = document.getElementById("magazine-article-tag-1").value;
    let tag2 = document.getElementById("magazine-article-tag-2").value;
    let tag3 = document.getElementById("magazine-article-tag-3").value;
    let _content = editorInstance.html.get();
    let _fixUrl = document.getElementById('fixUrl').value;
    let _fixUrl02 = document.getElementById('fixUrl02').value;

    console.log('_category' + _category);
    console.log('summary' + summary);
    console.log('title' + title);
    console.log('_fixUrl' + _fixUrl);
    console.log('_fixUrl02' + _fixUrl02);
    // magazine-article-state
    if ( _category === null){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>카테고리를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if ($('input[name="magazine-article-state"]').is(":checked") === false){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>기사 상태를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if (($('input[name="magazine-article-post-state"]').is(":checked") === false)){    
    // } else if ($('input[name=magazine-article-state]:checked').val() === 'public' && ($('input[name="magazine-article-post-state"]').is(":checked") === false)){    
      // if($('input[name="magazine-article-post-state"]').is(":checked") === false){
        document.getElementById("magazine-alert-message").innerHTML = "<strong>기사 게시를 체크해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
        return;    
     } else if ( mainFile === null){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>대표 이미지를 선택해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;    
    } else if ( title === ""){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>제목을 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if ( summary === ""){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>한 줄 소개를 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if ( _content === ""){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>본문을 작성해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if ( tag1 === "" && tag2 === "" && tag3 === ""){
      // document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>태그를 최소 1개 이상 입력해 주세요.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if (_fixUrl !== "" && !_fixUrl.includes('/html/views/magazine/feature.html?id=') && !_fixUrl.includes('/home/html/views/magazine/news.html?id=')){
      document.getElementById("magazine-alert-message").innerHTML = "<strong>비슷한 기사URL을 확인해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    } else if (_fixUrl02 !== "" &&  !_fixUrl02.includes('/html/views/magazine/feature.html?id=') && !_fixUrl02.includes('/home/html/views/magazine/news.html?id=')){
      document.getElementById("magazine-alert-message").innerHTML = "<strong>비슷한 기사URL2을 확인해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      return;
    }

    if ( type === 1){
      registMagazineArticle();
    } else{
      modifyMagazineArticle()
    }
  }
  
  async function registMagazineArticle() {     
    window.sessionStorage.removeItem("magazineArticleId");
    // 791put()
    //////기본 설정
    let _me = JSON.parse(window.localStorage.getItem("meInfo"));
    let category = document.getElementById("magazine-article-category");
    let _category = (category.options[category.selectedIndex]).value === 'all' ? null : (category.options[category.selectedIndex]).value ;   
    let _userId = editorId;
    let _state = $('input[magazine-article-state]:checked').val() === 'private' ? 2 :$('input[name=magazine-article-post-state]:checked').val() === 'immediately' ? 0: 3;
    let _postStartDate = dateToStr(strToDate(document.getElementById("magazine-article-post-start-date").value));
  
    //////제목 및 한 줄 소개
    let _title = document.getElementById("magazine-article-title").value;
    let _summary = document.getElementById("magazine-article-summary").value;

    //////본문
    let _editor = editorInstance.html.get();
  
    //////태그     
    let _tag1 = document.getElementById("magazine-article-tag-1").value;
    let _tag2 = document.getElementById("magazine-article-tag-2").value;
    let _tag3 = document.getElementById("magazine-article-tag-3").value;
    let _tag = _tag1 + ',' + _tag2 + ',' +  _tag3 ;
    ////// 비슷한 기사 더보기  
    let _fixUrl = document.getElementById("fixUrl").value;
    let _fixUrl02 = document.getElementById("fixUrl02").value;
  
    let url = baseUrl + "/magazine/register" ;

    let formData = new FormData();
    formData.append('state', _state);
    formData.append('category', _category);
    formData.append('userId', _userId);
    formData.append('title', _title);
    formData.append('summary', _summary);  
    formData.append('content', _editor);  
    formData.append('startDate', _postStartDate);
    formData.append('tags', _tag);
    formData.append('url1', _fixUrl);
    formData.append('url2', _fixUrl02);
  
    // 이미지
    if(mainFile)formData.append("files", mainFile, mainFile.name);
    for(let i=0; i<slideFiles?.length; i++) {
      formData.append("files", slideFiles[i], slideFiles[i].name);
      //console.log('slideFiles[i].name' + slideFiles[i].name);
    }

    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 201) {  // No content    
            return response.json();
          }
      })
      .then(data=>{
          //  console.log(data.data.magazine.id)
          location.href = './magazine-article-detail.html?id='+ data.data.magazine.id;
      })   
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    //console.log('headers.form_headers => ' + JSON.stringify(headers.form_headers));
    const magazineRequest = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,
      body: formData,
    });

    post(magazineRequest);
  }  

  async function modifyMagazineArticle() {
    let _userId = editorId;
    let _filtercategory = document.getElementById("magazine-article-category");  
    let _category =  (_filtercategory.options[_filtercategory.selectedIndex]).value === 'all' ? null : (_filtercategory.options[_filtercategory.selectedIndex]).value ;   
    let _state = $('input[name=magazine-article-state]:checked').val() === 'private' ? 2 :$('input[name=magazine-article-post-state]:checked').val() === 'immediately' ? 0: 3;

    let _tag1 = document.getElementById("magazine-article-tag-1").value;
    let _tag2 = document.getElementById("magazine-article-tag-2").value;
    let _tag3 = document.getElementById("magazine-article-tag-3").value;    
    let _title = document.getElementById("magazine-article-title").value;
    let _summary = document.getElementById("magazine-article-summary").value;  
    let _content = editorInstance.html.get();
    let _tag = _tag1 + ',' + _tag2 + ',' +  _tag3 ;   
    let _postStartDate = dateToStr(strToDate(document.getElementById("magazine-article-post-start-date").value));
    let _fixUrl = document.getElementById("fixUrl").value;
    let _fixUrl02 = document.getElementById("fixUrl02").value;

    url = baseUrl +"/magazine" ;       

    let _id = window.sessionStorage.getItem("magazineArticleId");

    let formData = new FormData();
    formData.append('id', _id);
    formData.append('state', _state);
    formData.append('category', _category);
    formData.append('userId', _userId);
    formData.append('title', _title);
    formData.append('summary', _summary);  
    formData.append('content', _content);  
    formData.append('startDate', _postStartDate);
    formData.append('tags', _tag);
    formData.append('url1', _fixUrl);
    formData.append('url2', _fixUrl02);

    if(isModifiedFiles){
      console.log('mainFile name' + mainFile?.name);
      if(mainFile)formData.append("files", mainFile, mainFile.name);

      for(let i=0; i<slideFiles?.length; i++) {
        // console.log('mainFile name' +  slideFiles[i]?.name);
        formData.append("files", slideFiles[i], slideFiles[i].name);
        console.log('slideFiles[i].name: ' + slideFiles[i].name);
      }
    }

    async function post(request) {
    try {
        const response = await fetch(request);  
        const result = await response.json();
        console.log("Success:", result);

        document.getElementById("magazine-alert-message").innerHTML ='<strong>수정이 완료되었습니다.</strong>';
        location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);"; 
        let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {
          // location.href="./magazine-list.html";
          location.href = './magazine-article-detail.html?id='+ _id;
        });          
      } catch (error) {
        console.error("Error:", error);
      }
    }

    const modifyRequest = new Request(url, {
      method: "POST",
      headers: headers.form_headers.headers,
      body: formData
    });

    post(modifyRequest);
  }  

  function changeMagazineArticleState(_state,magazineArticleId = null){
    console.log('magazineArticleId' + magazineArticleId);
    let url = baseUrl + "/magazine" ;
    let magazine_id = magazineArticleId === null ? parseInt(window.sessionStorage.getItem("magazineArticleId")) : magazineArticleId;
    // console.log()
    let params = {     
        id:  parseInt(magazine_id),
        state: _state
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
            magazineOK(_state);
          }
       }) 
      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changeMagazineStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeMagazineStateRequest);
  }

  function changeMagazineArticlesState(_state){
    console.log('changeMagazineArticlesState state'+ _state)
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    const stateText = _state === 1? '삭제': '비공개';
    const stateMessage = _state === 1? '<strong>선택한 기사를 삭제하시겠어요? 삭제된 기사는 복구할 수 없습니다.</strong>': '<strong>선택한 기사를 비공개로 변경하시겠어요?</strong>';
    let okMessage =  _state === 1? '<strong>삭제가 완료되었어요.</strong>': '<strong>비공개로 변경되었어요.</strong>';
    document.getElementById("magazine-alert-title").innerHTML =  okMessage;
    if ( totalCnt === 0 ){      
      document.getElementById("magazine-alert-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-alert-message").innerHTML ='<strong>선택한 기사가 없습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
      // return;
    }else{
      document.getElementById("magazine-confirm-title").innerHTML ='<strong>' +stateText+'</strong>';
      document.getElementById("magazine-confirm-message").innerHTML = stateMessage;
      location.href= "javascript:layerPopup.openPopup('magazineConfirmPopup', true);";   
      let okElement = document.getElementById("confirm-ok");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){       
            changeMagazineArticleState(_state,(checkbox.value).replace('/',''));
        }
      });
    }
   
  }

  function changeMagazineArticleCommentState(_state,magazineArticleCommentId = null){
    console.log('magazineArticleId' + magazineArticleCommentId);
    let url = baseUrl + "/magazine-comment" ;
    let magazineId =window.sessionStorage.getItem("magazineArticleId");
    // let magazineCommentId = magazineArticleCommentId === null ? parseInt(window.localStorage.getItem("magazineArticleId")) : magazineArticleCommentId;
    console.log('magazineArticleCommentId' + magazineArticleCommentId);
    let params = {     
        id:  magazineArticleCommentId,
        magazineId: magazineId,
        state: 1
    }
  
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content       
             location.href='./magazine-article-detail.html?id='+magazineId;       
             return
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changeMagazineCommentStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeMagazineCommentStateRequest);
  }

  function magazineCancel(){
    document.getElementById("magazine-confirm-message").innerHTML = "<strong>등록을 취소하시겠어요?</strong>"
    location.href= "javascript:layerPopup.openPopup('magazineConfirmPopup', true)";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href="./magazine-list.html";
    });
  }
  
  function magazineOK(type){ 
    console.log("magazine ok")
    if ( type === 1){
      document.getElementById("magazine-alert-message").innerHTML = "<strong>기사가 삭제되었습니다.</strong>";
    } else if ( type === 2){
      document.getElementById("magazine-alert-message").innerHTML = "<strong>기사가 비공개되었어요.</strong>";
    } else {
      document.getElementById("magazine-alert-message").innerHTML = "<strong>기사가 등록되었어요.</strong>";
    }
   
    location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true)";
    let okElement = document.getElementById("alert-OK");
    okElement.addEventListener("click", function (e) {
      location.href="./magazine-list.html";
    });
    return 
  }

  function goOK(){
    location.href="./magazine-list.html";
    return
  }

  function getMagazinePreview(){
    
    let _category = document.getElementById('magazine-article-category');
    document.getElementById("magazine-article-preview-title").innerHTML = category[(_category.options[_category.selectedIndex]).value];
    document.getElementById("magazine-article-preview-title").innerHTML = document.getElementById("magazine-article-title").value;
    document.getElementById("magazine-article-preview-summary").innerHTML = document.getElementById("magazine-article-summary").value;
    document.getElementById("magazine-article-preview-content").innerHTML =  editorInstance.html.get("editor");
    // document.getElementById("magazine-article-preview-tag1").innerHTML =  $("#magazine-article-tag-1").value;
    document.getElementById("magazine-article-preview-tag1").innerHTML =  document.getElementById("magazine-article-tag-1").value;
    document.getElementById("magazine-article-preview-tag2").innerHTML =   document.getElementById("magazine-article-tag-2").value;
    document.getElementById("magazine-article-preview-tag3").innerHTML =   document.getElementById("magazine-article-tag-3").value;
    // document.getElementById("magazine-article-preview-tag3").src =   document.getElementById("uploadImage").src;

    location.href= "javascript:layerPopup.openPopup('magazinePreviewPopup', true)";
  }

  function setToday(){
    console.log('setToday')
    const today = new Date();
    document.getElementById('magazine-article-post-start-date').value = dateToStr(today);
  }

  function checkChoice(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;    
    console.log('totalCnt' + totalCnt);
    if (totalCnt === 0){
      document.getElementById("magazine-alert-message").innerHTML = "<strong>선택된 댓글이 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
    } else {
      document.getElementById("magazineCommentConfirmMessage").innerHTML = "<strong>댓글을 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.</strong>";
      location.href= "javascript:layerPopup.openPopup('magazineCommentConfirmPopup', true);"; 
      let okElement = document.getElementById("confirm-ok");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){       
            changeMagazineArticleCommentState(1,(checkbox.value).replace('/',''));
        }
      });
    }
  }

  function checkDetailState(state){
    if ( state === 1){
      document.getElementById("magazine-confirm-message").innerHTML ='<strong>현재 기사를 삭제하시겠어요? 삭제된 기사는 복구할 수 없습니다.</strong>';
    } else {
      document.getElementById("magazine-confirm-message").innerHTML ='<strong>현재 기사 상태를 비공객로 변경하시겠어요?</strong>';
    }
   
    location.href= "javascript:layerPopup.openPopup('magazineConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      changeMagazineArticleState(state,null);
    });
  }

  function goRegister(){
    window.sessionStorage.removeItem("magazineArticleId");

    editorId = JSON.parse(window.localStorage.getItem("meInfo")).id;
    editorName = JSON.parse(window.localStorage.getItem("meInfo")).name;
    document.getElementById('autocomplete01').value = JSON.parse(window.localStorage.getItem("meInfo")).name;

    let  url= baseUrl + "/users/all?state=0&grade=50";    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {       

        let users ='';
        for(let i = 0; i<response.data.users.length ; i++){
          users += `{id:"${response.data.users[i].id}", value:"${response.data.users[i].name}"},`;
        }

        const script = document.createElement("script");
        text = document.createTextNode( `
          $(document).ready(function() {
            // jquery-ui autocomplete 참고 - https://jqueryui.com/autocomplete/
            var managers = [${users}];
            var timer = null;
            $('#autocomplete01').autocomplete({
              select: function(event, ui) {
                if (ui.item.value == '') {
                  // event.preventDefault();
                  document.getElementById("magazine-alert-message").innerHTML ='<strong>권한이 있는 에디터만 매거진 기사를 작성할 수 있습니다.</strong>';                                       
                  location.href= "javascript:layerPopup.openPopup('magazineAlertPopup', true);";
                  // event.preventDefault();
                }
                else{
                  editorId = Number(ui.item.id);
                  editorName = ui.item.value;
                  //console.log('editor id ' + editorId);
                }
              },
              source: managers,                          
              delay: 150,
              minLength: 1,
              response: function(event, ui) {
                if (!ui.content.length) {
                  var noResult = {
                    value: '',
                    label: $(this).val(),
                  };
                  ui.content.push(noResult);
                }
              },
              open: function(event, ui){
                if(timer) {
                  clearTimeout(timer);
                  timer = null;
                }
              },
              close: function(event, ui){
                timer = setTimeout(function(){
                  $('#autocomplete01').val(editorName);
                },3000);
              }
            });

            $.ui.autocomplete.prototype._renderItem = function(ul, item) {
              if (item.value) {
                var t = String(item.value).replace(new RegExp(this.term, 'gi'), '<strong>$&</strong>');
                return $('<li></li>')
                  .data('item.autocomplete', item)
                  .append('<div>' + t + '</div>')
                  .appendTo(ul);
              } else {
                return $('<li></li>')
                  .data('item.autocomplete', item)
                  .append('<div class="no-result">' + '검색결과가 없습니다.' + '</div>')
                  .appendTo(ul);
              }
            };
          }); `);
      
      script.appendChild(text);
      document.body.appendChild(script);

      });
    }).catch(error => console.log(error));
  }

   function cancelModify(){
    let _id = window.sessionStorage.getItem("magazineArticleId");
    location.href= "javascript:layerPopup.openPopup('magazineConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href='./magazine-article-detail.html?id='+_id;
    });
   }

  function searchStart(e,category=null){
    if(e.keyCode === 13){
      if ( category === null){
        getMagazineArticleList(0,20);
      } else {
        getMagazineArticleList(0,20,category);
      }      
    }
  }

