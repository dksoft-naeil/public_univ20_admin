
  /// community ////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    if(window.location.pathname.indexOf("/community/community-list-all") >= 0) getCommunityList(0,20);  
    // else if(window.location.pathname.indexOf("/community/community-school-list") >= 0) getCommunitySchoolList(0,20);  
    else if(window.location.pathname.indexOf("/community/community-list-daily") >= 0) getCommunityDailyList(0,20);  
    else if(window.location.pathname.indexOf("/community/community-list-course") >= 0) getCommunityCourseList(0,20);  
    else if(window.location.pathname.indexOf("/community/community-list-romance") >= 0) getCommunityRomanceList(0,20,0);  
    else if(window.location.pathname.indexOf("/community/community-list-school") >= 0) getCommunitySchoolList(0,20,0);  
    else if(window.location.pathname.indexOf("/community/community-detail") >= 0) getCommunity();  
    else if(window.location.pathname.indexOf("/community/community-modify") >= 0) getCommunityModify();  
    else if(window.location.pathname.indexOf("/community/notice-list") >= 0) getCommunityNotice(0,20);  
    else if(window.location.pathname.indexOf("/community/notice-register-modify") >= 0) selectRegistModify();  
    else if(window.location.pathname.indexOf("/community/notice-detail") >= 0) getCommunity();    
  }); 
 
  let editorId = ''; let editorName= ''; 

  function getCommunityList(currentPage, size, filterCategory=null, filterStatus=null){       
      console.log('category ' + filterCategory);
      document.getElementById('community-list_grid').innerHTML = ""
      document.getElementById('checkAll').checked = false;
      // window.sessionStorage.setItem("communityId");

      let communityYear = document.getElementById('community-year');
      let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
      let communityMonth = document.getElementById('community-month');
      let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;    
      let communityCategory = document.getElementById('community-category');
      let _filterCategory =  (communityCategory.options[communityCategory.selectedIndex]).value === 'all' ? null : (communityCategory.options[communityCategory.selectedIndex]).value ;   
      let communityState = document.getElementById('community-state');
      let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
      let communityStatus = document.getElementById('community-status');
      let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;  
      let communitySort = document.getElementById('community-sort');
      let _filterSort =  (communitySort.options[communitySort.selectedIndex]).value === 'all' ? null : (communitySort.options[communitySort.selectedIndex]).value ;  
      
      let _keyword = document.getElementById('community-search').value;
      ///0:open, 1:delete, 2:private 3:reserved
      let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '공개';_state[1] = '';
      let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
      // console.log('manager-action banner list page' + page );
      ///0:연애, 1:진로, 2:일상, 3:우리학교
      let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';

      console.log('fileState => ' + _filterState);
  
      let url = baseUrl + "/communities?";
      url += _filterCategory !== null ? '&category='+ _filterCategory : '';
    
      if ( _filterState !== null){   
        url +='&state='+ _filterState;
      } else {
        if ( _filterStatus  === '-' ){
          url +='&state=2';
        } else if ( _filterStatus === 'ongoing' ){
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

      if ( _filterSort !== null){   
        if (_filterSort === '1'){
          url +='&isRanking=1&sort=popularity';
        } else {
          url +='&isRanking=0&sort=recent';
        }
      }
     
      url += (_keyword === null ? '' : ('&keyword=' + _keyword));

      let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
      let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
      let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
      url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
      
      url += '&offset='+ currentPage *size +"&limit=" + size;
      
      if(( _filterState === '0' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
        document.getElementById('community-list_grid').innerHTML  = '';          
        document.getElementById('community-list-pagination').innerHTML = '';
        document.getElementById('community-list-total').innerHTML = '&nbsp;<strong>' +0 + '</strong>&nbsp;';
        return
      } 
      else{
       ;
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
          response.json().then((communities) => {
            console.log('communities' + JSON.stringify(communities.data));
            let communityGrid= "";
            let communityData = communities.data.communities;
            let communitiesDataTotal = communities.data.total;
            let numOfPage = Math.ceil(communitiesDataTotal/size);
            let iteration = communityData.length > size ? size :  communityData.length;
            
            console.log('manager-action banner list iteration' + iteration );
            for( let i=0;  i < communityData.length ; i++){
              let values = communityData[i];
              let state = values.state === 2? '비공개':"공개";
              communityGrid+=`<tr>
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
                                <td><a href="./community-detail.html?id=${values.id}" class="underline">${values.title}</a></td>                        
                                <td>${_category[values.category]}</td>
                                <td>${values.penName? values.penName :""}</td>
                                <td>${state}</td>
                                <td>${values.state === 2 ? '-': _status[values.status]}</td>
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
                            <a href="#" class="page-link" onclick="getCommunityList(0,`+size+`)">First</a>
                          </li>`
              }
              if (currentPage == 0){ 
                paging += `<li class="controller prev disabled">`;
              } else {
                paging += `<li class="controller prev">
                            <a href="#" class="page-link" onclick="getCommunityList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                          </li>`
              }
                      
              for ( let page = startOfPage ; page< endOfPage; page++){             
                  if (page === (currentPage)){
                    paging +=`<li class="paging current">` 
                  } else {
                    paging +=`<li class="paging">` 
                  }                                              
                  paging += `<a href="#" class="page-link" onclick="getCommunityList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
              }      

              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller next disabled">`;
              } else {
                paging += `<li class="controller next">
                            <a href="#" class="page-link" onclick="getCommunityList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                          </li>`
              }     
              if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
                paging += `<li class="controller last disabled">`;
              } else {
                paging += `<li class="controller last">
                            <a href="#" class="page-link" onclick="getCommunityList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                          </li>` 
              }       
                      
            // console.log('noticeGrid' + noticeGrid)
            document.getElementById('community-list_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='8'>데이터가 없습니다.</td></tr>": communityGrid;          
            document.getElementById('community-list-pagination').innerHTML = paging;
            document.getElementById('community-list-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
          });
        }).catch(error => console.log(error));
      }
  }

  function getCommunitySchoolList(currentPage, size, filterStatus=null){       
    document.getElementById('community-list-school_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let communityYear = document.getElementById('community-school-year');
    let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
    let communityMonth = document.getElementById('community-school-month');
    let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;      
    let communityState = document.getElementById('community-state');
    let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
    let communityStatus = document.getElementById('community-status');
    let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;  
    let communitySort = document.getElementById('community-sort');
    let _filterSort =  (communitySort.options[communitySort.selectedIndex]).value === 'all' ? null : (communitySort.options[communitySort.selectedIndex]).value ;  
      
    let _keyword = document.getElementById('community-school-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    // let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';  
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
    let url = baseUrl + "/communities?";
    url += '&category=3'; 
    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
    
    // url += _filterCategory !== null ? '&category='+ _filterCategory : '';
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' ){
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

    if ( _filterSort !== null){   
      if (_filterSort === '1'){
        url +='&isRanking=1&sort=popularity';
      } else {
        url +='&isRanking=0&sort=recent';
      }
    }
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    if(( _filterState === '0' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('community-list-school_grid').innerHTML  = '';          
      document.getElementById('community-list-school-pagination').innerHTML = '';
      document.getElementById('community-list-school-total').innerHTML = '&nbsp;<strong>' +0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((communities) => {
          console.log('banners' + JSON.stringify(communities.data));
          let communityGrid= "";
          let communityData = communities.data.communities;
          let communitiesDataTotal = communities.data.total;
          let numOfPage = Math.ceil(communitiesDataTotal/size);
          let iteration = communityData.length > size ? size :  communityData.length;
          console.log('manager-action banner list iteration' + iteration );
          for( let i=0;  i < communityData.length ; i++){
            let values = communityData[i]
            console.log('${values.id}' + values.id)
            communityGrid+=`<tr>
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
                              <td><a href="./community-detail.html?id=${values.id}" class="underline">${values.title}</a></td>      
                              <td>${values.schoolName? values.schoolName : ""}</td>
                              <td>${values.penName?values.penName :""}</td>
                              <td>${values.state === 2 ? '비공개' : "공개"}</td> 
                              <td>${values.state === 2 ? '-': _status[values.status]}</td>            
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
                          <a href="#" class="page-link" onclick="getCommunitySchoolList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getCommunitySchoolList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getCommunitySchoolList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getCommunitySchoolList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getCommunitySchoolList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                    
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('community-list-school_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": communityGrid;
          document.getElementById('community-list-school-pagination').innerHTML = paging;
          document.getElementById('community-list-school-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function getCommunityDailyList(currentPage, size, filterStatus=null){       
    document.getElementById('community-list-daily_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let communityYear = document.getElementById('community-daily-year');
    let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
    let communityMonth = document.getElementById('community-daily-month');
    let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;      
    let communityState = document.getElementById('community-state');
    let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
    let communityStatus = document.getElementById('community-status');
    let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;  
    let communitySort = document.getElementById('community-sort');
    let _filterSort =  (communitySort.options[communitySort.selectedIndex]).value === 'all' ? null : (communitySort.options[communitySort.selectedIndex]).value ;           
    let _keyword = document.getElementById('community-daily-search').value;
    
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료'; 
    let url = baseUrl + "/communities?";
    url += '&category=2'; 
    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
    
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' ){
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

    if ( _filterSort !== null){   
      if (_filterSort === '1'){
        url +='&isRanking=1&sort=popularity';
      } else {
        url +='&isRanking=0&sort=recent';
      }
    }
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    if(( _filterState === '0' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('community-list-daily_grid').innerHTML  = '';          
      document.getElementById('community-list-daily-pagination').innerHTML = '';
      document.getElementById('community-list-daily-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((communities) => {
          console.log('banners' + JSON.stringify(communities.data));
          let communityGrid= "";
          let communityData = communities.data.communities;
          let communitiesDataTotal = communities.data.total;
          let numOfPage = Math.ceil(communitiesDataTotal/size);
          let iteration = communityData.length > size ? size :  communityData.length;
          console.log('manager-action banner list iteration' + iteration );

          for( let i=0;  i < communityData.length ; i++){
            let values = communityData[i]
            console.log('${values.id}' + values.id)
            communityGrid+=`<tr>
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
                              <td><a href="./community-detail.html?id=${values.id}" class="underline">${values.title}</a></td>

                              <td>${values.penName?values.penName :""}</td>
                              <td>${values.state === 2 ? '비공개': '공개'}</td>    
                              <td>${values.state === 2 ? '-': _status[values.status]}</td>         
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
                          <a href="#" class="page-link" onclick="getCommunityDailyList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getCommunityDailyList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getCommunityDailyList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getCommunityDailyList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getCommunityDailyList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                    
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('community-list-daily_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": communityGrid;
          document.getElementById('community-list-daily-pagination').innerHTML = paging;
          document.getElementById('community-list-daily-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function getCommunityRomanceList(currentPage, size, filterStatus=null){       
    document.getElementById('community-list-romance_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let communityYear = document.getElementById('community-romance-year');
    let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
    let communityMonth = document.getElementById('community-romance-month');
    let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;      
    let communityState = document.getElementById('community-state');
    let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
    let communityStatus = document.getElementById('community-status');
    let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;  
    let communitySort = document.getElementById('community-sort');
    let _filterSort =  (communitySort.options[communitySort.selectedIndex]).value === 'all' ? null : (communitySort.options[communitySort.selectedIndex]).value ;  
      
    let _keyword = document.getElementById('community-romance-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '공개';_state[1] = '';  
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료';
    let url = baseUrl + "/communities?";
    url += '&category=0'; 
    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
    // url += _filterCategory !== null ? '&category='+ _filterCategory : '';
  
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' ){
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

    if ( _filterSort !== null){   
      if (_filterSort === '1'){
        url +='&isRanking=1&sort=popularity';
      } else {
        url +='&isRanking=0&sort=recent';
      }
    }
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    if(( _filterState === '0' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('community-list-romance_grid').innerHTML  = '';          
      document.getElementById('community-list-romance-pagination').innerHTML = '';
      document.getElementById('community-list-romance-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((communities) => {
          console.log('banners' + JSON.stringify(communities.data));
          let communityGrid= "";
          let communityData = communities.data.communities;
          let communitiesDataTotal = communities.data.total;
          let numOfPage = Math.ceil(communitiesDataTotal/size);
          let iteration = communityData.length > size ? size :  communityData.length;
          console.log('manager-action banner list iteration' + iteration );
          for( let i=0;  i < communityData.length ; i++){          
            let values = communityData[i]
            console.log('${values.id}' + values.id)
            communityGrid+=`<tr>
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
                              <td><a href="./community-detail.html?id=${values.id}" class="underline">${values.title}</a></td>
                              <td>${values.penName?values.penName :""}</td>
                              <td>${values.state === 2 ? '비공개': '공개'}</td>          
                              <td>${values.state === 2 ? '-': _status[values.status]}</td>      
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
                          <a href="#" class="page-link" onclick="getCommunityRomanceList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getCommunityRomanceList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getCommunityRomanceList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getCommunityRomanceList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getCommunityRomanceList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                    
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('community-list-romance_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": communityGrid;
          document.getElementById('community-list-romance-pagination').innerHTML = paging;
          document.getElementById('community-list-romance-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function getCommunityCourseList(currentPage, size, filterStatus=null){       
    document.getElementById('community-list-course_grid').innerHTML = ""
    document.getElementById('checkAll').checked = false;

    let communityYear = document.getElementById('community-course-year');
    let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
    let communityMonth = document.getElementById('community-course-month');
    let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;      
    let communityState = document.getElementById('community-state');
    let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
    let communityStatus = document.getElementById('community-status');
    let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;  
    let communitySort = document.getElementById('community-sort');
    let _filterSort =  (communitySort.options[communitySort.selectedIndex]).value === 'all' ? null : (communitySort.options[communitySort.selectedIndex]).value ;  
      
    let _keyword = document.getElementById('community-course-search').value;
    ///0:open, 1:delete, 2:private 3:reserved
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = ''; 
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료'; 
    let url = baseUrl + "/communities?";
    url += '&category=1'; 
    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url += _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' ){
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

    if ( _filterSort !== null){   
      if (_filterSort === '1'){
        url +='&isRanking=1&sort=popularity';
      } else {
        url +='&isRanking=0&sort=recent';
      }
    }
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));
    url += '&offset='+ currentPage *size +"&limit=" + size;

   ;
    if(( _filterState === '0' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('community-list-course_grid').innerHTML  = '';          
      document.getElementById('community-list-course-pagination').innerHTML = '';
      document.getElementById('community-list-course-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((communities) => {
          console.log('banners' + JSON.stringify(communities.data));
          let communityGrid= "";
          let communityData = communities.data.communities;
          let communitiesDataTotal = communities.data.total;
          let numOfPage = Math.ceil(communitiesDataTotal/size);
          let iteration = communityData.length > size ? size :  communityData.length;
          console.log('manager-action banner list iteration' + iteration );
          for( let i=0;  i < communityData.length ; i++){
            let values = communityData[i]
            console.log('${values.id}' + values.id)
            communityGrid+=`<tr>
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
                <td><a href="./community-detail.html?id=${values.id}" class="underline">${values.title}</a></td>

                <td>${values.penName?values.penName :""}</td>
                <td>${values.state === 2 ? '비공개': '공개'}</td>    
                <td>${values.state === 2 ? '-': _status[values.status]}</td>           
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
                          <a href="#" class="page-link" onclick="getCommunityCourseList(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getCommunityCourseList(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getCommunityCourseList(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getCommunityCourseList(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getCommunityCourseList(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                    
          // console.log('noticeGrid' + noticeGrid)
          document.getElementById('community-list-course_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='7'>데이터가 없습니다.</td></tr>": communityGrid;   
          document.getElementById('community-list-course-pagination').innerHTML = paging;
          document.getElementById('community-list-course-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function getCommunity(){
    let _state = {}; _state[0] = '공개';_state[2] = '비공개';_state[3] = '예약';_state[1] = '';
    ///0:연애, 1:진로, 2:일상, 3:우리학교
    let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
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

    let url = baseUrl + "/communities?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((community) => {

        let communitiesData = community.data.communities;
        
        if(communitiesData.length > 0){
          let _communityData = communitiesData[0];
          let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료'; 

          window.sessionStorage.setItem("communityId",_communityData.id);
          window.sessionStorage.setItem("communityCategory",_communityData.id);

          let _state = '공개';
          let today = new Date();
          let startdate = new Date(_communityData.startDate);
          let _mobile = _communityData.mobile ? _communityData.mobile.substring(0,3)+'-'+_communityData.mobile.substring(3,7) + '-' + _communityData.mobile.substring(7,13) : "" ;
          console.log('today' +today );
          console.log('mobile => ' + _communityData.mobile  + ' parase => ' + _mobile);

          document.getElementById('community-category').innerHTML = _category[_communityData.category];
          
          /// 상태
          _state = (_communityData.state === 2) ? '비공개' : (_communityData.state === 0 || _communityData.state === 3) ? '공개' : '';
          document.getElementById('community-state').innerHTML = _state;
          document.getElementById('community-status').innerHTML = _communityData.state === 2 ? '-' : _status[_communityData.status];

          document.getElementById('community-like-count').innerHTML = _communityData.likeCount;
          document.getElementById('community-show-count').innerHTML = _communityData.showCount;
          document.getElementById('community-name').innerHTML = _communityData.name;
          document.getElementById('community-nickname').innerHTML = _communityData.nickname;
          document.getElementById('community-email').innerHTML = _communityData.email;
          document.getElementById('community-title').innerHTML = _communityData.title;
          document.getElementById('community-mobile').innerHTML = _mobile;
          document.getElementById('community-grade').innerHTML = _communityData?.schoolId ? '대학생 인증 회원 ' : '일반회원';
          document.getElementById('community-content').innerHTML = _communityData.content;        
          document.getElementById('community-create-date').innerHTML = dateToStr(strToDate(_communityData.createDate?_communityData.createDate:""));
        
          getCommunityComment(0,20);
        }
      })                    
    }).catch(error => console.log(error));
  }

  function changeCommunityDetailState(_state, communityId = null){
    console.log('communityId' +communityId);
    let url = baseUrl + "/community" ;
    let _communityId = communityId === null ? parseInt(window.sessionStorage.getItem("communityId")) : communityId;
    console.log('communityid ' +_communityId )
    let params = {     
        id:  _communityId,
        state: _state
    }
   /////// category :1
   console.log('changeCommunityState')
    async function post(request) {
    try {
       await fetch(request).then(response => {
          if(response.status === 200) {  // No content   
            if ( _state === 0){
              document.getElementById("community-alert-message").innerHTML ='<strong>공개로 변경되었습니다.</strong>';
            } else if ( _state ===2){
              document.getElementById("community-alert-message").innerHTML ='<strong>비공개로 변경되었습니다.</strong>';
            } else {
              document.getElementById("community-alert-message").innerHTML ='<strong>삭제되었습니다.</strong>';
            }
            location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href="./community-list-all.html" ; 
            });
            //  return             
          }
       }) 

      } catch (error) {
        console.error("Error:", error);
      }
    }

    const changeCommunityStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeCommunityStateRequest);
}

  function changeCommunityState(_state, communityId = null){
    console.log('communityId' +communityId);
    let url = baseUrl + "/community" ;
    let _communityId = communityId === null ? parseInt(window.sessionStorage.getItem("communityId")) : communityId;
    console.log('communityid ' +_communityId )
    let params = {     
        id:  _communityId,
        state: _state
    }
   /////// type :1
   console.log('changeCommunityState')
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

    const changeCommunityStateRequest = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    post(changeCommunityStateRequest);
  }

  function deleteCommunity(category,communityId = null){
    let community_id = communityId === null ?window.sessionStorage.getItem("communityId") : communityId;
    let reason = document.getElementById('community-reason');
    let _reason =  (reason.options[reason.selectedIndex]).value === 'all' ? null : (reason.options[reason.selectedIndex]).value ;   
    let _reasonMessage = "";
    
    console.log('category' + category)
    console.log('_reason' + _reason)
    console.log('_reasonMessage'+_reasonMessage); console.log('_reason' + _reason)
  
    if ( parseInt(_reason) !== 3){
      _reasonMessage = reason.options[_reason].text;
    } else {
      _reasonMessage = document.getElementById("community-reason-etc").value;
    }

    let url = baseUrl + "/community" ;
  
    let params = {     
        id:  community_id,
        state: 1,
        reason:_reasonMessage
    }
   
    async function post(request) {
    try {
        await fetch(request).then(response => {
            if(response.status === 200) {  // No content       
                document.getElementById("community-alert-message").innerHTML = "<strong>삭제되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  if ( category === 0){
                    location.href='./community-list-romance.html';
                  } else if ( category === 1){
                    location.href='./community-list-course.html';
                  } else if ( category === 2){
                    location.href='./community-list-daily.html';
                  } else if ( category === 3){
                    location.href='./community-list-school.html';
                  } else {
                    location.href='./community-list-all.html';
                  }
                });
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

  function changeCommunityList(category,state){
      const checkboxes = document.querySelectorAll('.chk:checked');   
      console.log('checkboxes' + JSON.stringify(checkboxes));
      const totalCnt = checkboxes.length;        
      
      console.log('totalCnt' + totalCnt);
      if (totalCnt ===0 ){
        document.getElementById("community-alert-message").innerHTML = "<strong>선택하신 항목이 없습니다.</strong>";
        location.href="javascript:layerPopup.openPopup('communityAlertPopup', true);";
        return
      } else {
        console.log('changeCommunityList ===> 여기')
        for(const checkbox of checkboxes){
          changeCommunityState(state,(checkbox.value).replace('/',''))
        }
        if ( state === 2){
          document.getElementById("community-alert-message").innerHTML ='<strong>비공개로 변경되었습니다.</strong>';
          location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";                 
        } else {
          document.getElementById("community-alert-message").innerHTML ='<strong>공개로 변경되었습니다.</strong>';
          location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
        }
        let okElement = document.getElementById("alert-OK");
        okElement.addEventListener("click", function (e) {         
          if (category === 0){
            location.href='./community-list-romance.html';
          } else if ( category === 1){
            location.href='./community-list-course.html';
          } else if ( category === 2){
            location.href='./community-list-daily.html';
          } else if (category === 3){
            location.href='./community-list-school.html';
          } else if (category === 5){
            location.href='./notice-list.html';      
          } else {
            location.href='./community-list-all.html'; 
          }
        });        
      }
  }

  function showReasonPopup(){
    document.getElementById("community-reason-etc").style.display = 'none';
  }

  function getCommunityModify(){
    ///0:연애, 1:진로, 2:일상, 3:우리학교
    let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
    let id = window.sessionStorage.getItem("communityId")

    let url = baseUrl + "/communities?id=" + id;
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((community) => {

        let communitiesData = community.data.communities;
        
        if(communitiesData.length > 0){
          let _communityData = communitiesData[0];
          
          let _state = '공개';
          let _postState = '즉시 게시';

          let today = new Date();
          let startdate = new Date(_communityData.startDate);
          console.log('today' +today );
          console.log('_communityData.state' + _state[_communityData.state] );

          document.getElementById('community-category').innerHTML = _category[_communityData.category];

          /// 상태
          if (_communityData.state === 2) _state = '비공개';
          else if (_communityData.state === 0 || _communityData.state === 3) _state = '공개';
          document.getElementById('community-state').innerHTML =_state;

          /// 게시
          if(_communityData.state === 2) (new Date(_communityData.startDate) <= new Date(_communityData.lastDate)) ? _postState = '즉시 게시' : _postState = '예약 게시'; 
          else _communityData.state === 0 ? _postState = '즉시 게시' : _postState = '예약 게시';

          document.getElementById('community-like-count').innerHTML = _communityData.likeCount;
          document.getElementById('community-show-count').innerHTML = _communityData.showCount;
          document.getElementById('community-name').innerHTML = _communityData.name;
          document.getElementById('community-nickname').innerHTML = _communityData.nickname;
          document.getElementById('community-title').innerHTML = _communityData.title;
          document.getElementById('community-content').innerHTML = _communityData.content;        
          document.getElementById('community-create-date').innerHTML = dateToStr(strToDate(_communityData.createDate?_communityData.createDate:""));
        
        window.sessionStorage.setItem("communityId",_communityData.id)     
        getCommunityCommentModify(0,20);
        }
      
      })                    
    }).catch(error => console.log(error));
  }

  function cancelCommunityModify(){
    console.log('수정 취소')
    document.getElementById("community-confirm-message").innerHTML = "<strong>수정을 취소하시겠어요?</strong>";
    location.href="javascript:layerPopup.openPopup('communityConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      let _communityId = window.sessionStorage.getItem("communityId");
      location.href="./community-detail.html?id=" + _communityId ; 
    });
  }

  function completeCommunityModify(){
    console.log('수정 완료')
    document.getElementById("community-alert-message").innerHTML = "<strong>글이 수정되었어요.</strong>";
    location.href="javascript:layerPopup.openPopup('communityAlertPopup', true);";
    let okElement = document.getElementById("alert-OK");
    okElement.addEventListener("click", function (e) {
      let _communityId = window.sessionStorage.getItem("communityId");
      location.href="./community-detail.html?id=" + _communityId ; 
    });
  }

  function checkState(category,_state){

    const checkboxes = document.querySelectorAll('.chk:checked');   
    const totalCnt = checkboxes.length;
    // let okElement;
    let _communityId = window.sessionStorage.getItem("communityId");
    console.log('totalCnt' + totalCnt);
    console.log('_state' + _state);
    if (totalCnt ===0 ){
      document.getElementById("community-alert-message").innerHTML = "<strong>선택하신 항목이 없습니다.</strong>";
      location.href="javascript:layerPopup.openPopup('communityAlertPopup', true);";
      // return
    } else {
      console.log('여기는 ' + _state);
    if ( _state === 2){
      console.log('checkState ' + _state)
      document.getElementById("community-confirm-message").innerHTML = "<strong>선택한 글 상태를 비공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('communityConfirmPopup', true);";
    
    } else if ( _state === 0){
      console.log('checkState ' + _state)
      document.getElementById("community-confirm-message").innerHTML = "<strong>선택한 글 상태를 공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('communityConfirmPopup', true);";
    
    } else {
      console.log('checkState ' + _state)
      selectReason('community-reason','community-reason-etc');
      location.href= "javascript:layerPopup.openPopup('deleteReasonPopup', true);";
      
    }
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      console.log('2 ok click');
      if (_state  === 0){
        changeCommunityList(category,0);
      } else if ( _state ===2){
        changeCommunityList(category,2);
      }
    });
    let reasonOkElement = document.getElementById("reason-ok");
    reasonOkElement.addEventListener("click", function (e) {
      console.log('삭제');
      let deleteReason = document.getElementById("community-reason");
      let deleteReasonEtc = document.getElementById("community-reason-etc").value;
      if((deleteReason.options[deleteReason.selectedIndex]).value === 'all'){
        document.getElementById("community-alert-message").innerHTML ='<strong>삭제 사유를 선택해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
        return;
      } else if ((deleteReason.options[deleteReason.selectedIndex]).value === '3' && (deleteReasonEtc === "")){
        document.getElementById("community-alert-message").innerHTML ='<strong>기타 이유를 입력해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
        return;
      }

      for(const checkbox of checkboxes){
        console.log('삭제========>' + checkbox.value);
        deleteCommunity(category,(checkbox.value).replace('/',''))
      }
      document.getElementById("community-alert-message").innerHTML ='<strong>삭제되었습니다.</strong>';
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
    });
  }
  }
  
  function checkPopup(_state){
    if ( _state === 2){
      console.log('checkState ' + _state)
      document.getElementById("community-confirm-message").innerHTML = "<strong>선택한 글 상태를 비공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('communityConfirmPopup', true);";
    
    } else if ( _state === 0){
      console.log('checkState ' + _state)
      document.getElementById("community-confirm-message").innerHTML = "<strong>선택한 글 상태를 공개로 변경하시겠어요?</strong>";
      location.href= "javascript:layerPopup.openPopup('communityConfirmPopup', true);";
     
    } else {
      console.log('checkState ' + _state)
      location.href= "javascript:layerPopup.openPopup('deleteReasonPopup', true);";
      
    }
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      console.log('2 ok click')
      if (_state  === 0){
        changeCommunityDetailState(0);
      } else if ( _state ===2){
        changeCommunityDetailState(2);
      } 
    });
    
    selectReason('community-reason','community-reason-etc');
    let reasoOkElement = document.getElementById("reason-ok");
    reasoOkElement.addEventListener("click", function (e) {
      let deleteReason = document.getElementById("community-reason");
      let deleteReasonEtc = document.getElementById("community-reason-etc").value;
      if((deleteReason.options[deleteReason.selectedIndex]).value === 'all'){
        document.getElementById("community-alert-message").innerHTML ='<strong>삭제 사유를 선택해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
        return;
      } else if ((deleteReason.options[deleteReason.selectedIndex]).value === '3' && (deleteReasonEtc === "")){
        document.getElementById("community-alert-message").innerHTML ='<strong>기타 이유를 입력해 주세요.</strong>';
        location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
        return;
      }

      deleteCommunity();
    });

  }

  ////// community comment ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getCommunityComment(currentPage,size){
    let _communityId = window.sessionStorage.getItem("communityId");
    let url = baseUrl + "/community-comments?state=0,2,3&communityId=" + _communityId;
    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((communities) => {
        let communitCommentGrid= "";
        let communityCommentData = communities.data.comments;
        let communityCommentDataTotal = communities.data.total;
        let numOfPage = Math.ceil(communityCommentDataTotal/size);
        let iteration = communityCommentData.length > size ? size :  communityCommentData.length;
        console.log('communityCommentDataTotal'+communityCommentDataTotal)
        for( let i=0;  i < communityCommentData.length ; i++){
          let values = communityCommentData[i]
          communitCommentGrid+=`<tr>
                                  <td>${values.id}</td>
                                  <td>${values.content}</td>
                                  <td>${values.likeCount?values.likeCount:0 }</td>
                                  <td>${replacestr(values.penName)}</td>    
                                  <td>${dateToStr(strToDate(values.createDate))}</td>
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
                      <a href="#" class="page-link" onclick="getCommunityComment(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getCommunityComment(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getCommunityComment(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getCommunityComment(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getCommunityComment(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       

        document.getElementById('community-comment-list_grid').innerHTML = communitCommentGrid === "" ? "<tr><td colspan='5'>데이터가 없습니다.</td></tr>": communitCommentGrid;
        document.getElementById('community-comment-pagination').innerHTML = paging;        
        document.getElementById('community-comment-list-total').innerHTML = '&nbsp;<strong>' +communityCommentDataTotal + '</strong>&nbsp;';        
      })
    }).catch(error => console.log(error));
  }

  function getCommunityCommentModify(currentPage = 0,size=20){
    let _communityId = window.sessionStorage.getItem("communityId");
    console.log()
    let url = baseUrl + "/community-comments?state=0,2,3&communityId=" + _communityId;
    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((communities) => {
        let communitCommentGrid= "";
        let communityCommentData = communities.data.comments;
        let communityCommentDataTotal = communities.data.total;
        let numOfPage = Math.ceil(communityCommentDataTotal/size);
        let iteration = communityCommentData.length > size ? size :  communityCommentData.length;
        console.log('communityCommentDataTotal'+communityCommentDataTotal)
        for( let i=0;  i < communityCommentData.length ; i++){
          let values = communityCommentData[i]
          communitCommentGrid+=`<tr>
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
                                <td>${values.content}</td>
                                <td>${values.likeCount?values.likeCount:0 }</td>
                                <td>${values.penName}</td>    
                                <td>${dateToStr(strToDate(values.createDate))}</td>
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
                      <a href="#" class="page-link" onclick="getCommunityCommentModify(0,`+size+`)">First</a>
                    </li>`
        }
        if (currentPage == 0){ 
          paging += `<li class="controller prev disabled">`;
        } else {
          paging += `<li class="controller prev">
                      <a href="#" class="page-link" onclick="getCommunityCommentModify(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                    </li>`
        }
                
        for ( let page = startOfPage ; page< endOfPage; page++){             
            if (page === (currentPage)){
              paging +=`<li class="paging current">` 
            } else {
              paging +=`<li class="paging">` 
            }                                              
            paging += `<a href="#" class="page-link" onclick="getCommunityCommentModify(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
        }      

        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller next disabled">`;
        } else {
          paging += `<li class="controller next">
                      <a href="#" class="page-link" onclick="getCommunityCommentModify(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                    </li>`
        }     
        if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
          paging += `<li class="controller last disabled">`;
        } else {
          paging += `<li class="controller last">
                      <a href="#" class="page-link" onclick="getCommunityCommentModify(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                    </li>`
        }       

        document.getElementById('community-comment-list_grid').innerHTML = communitCommentGrid === "" ? "<tr><td colspan='6'>데이터가 없습니다.</td></tr>": communitCommentGrid;  
        document.getElementById('community-comment-pagination').innerHTML = paging;        
        document.getElementById('community-comment-list-total').innerHTML = '&nbsp;<strong>' +communityCommentDataTotal + '</strong>&nbsp;';        
      })
    }).catch(error => console.log(error));
  }
  
  function changeCommunityCommentState(){
    const checkboxes = document.querySelectorAll('.chk:checked');   
    console.log('checkboxes' + JSON.stringify(checkboxes));
    const totalCnt = checkboxes.length;        
    
    console.log('totalCnt' + totalCnt);
    if (totalCnt ===0 ){
      document.getElementById("community-alert-message").innerHTML = "<strong>선택하신 항목이 없습니다.</strong>";
      location.href="javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return
    } else {
      console.log('changeCommunityList ===> 여기')

      document.getElementById("community-confirm-message").innerHTML = "<strong>삭제하시겠습니까?</strong>";
      location.href="javascript:layerPopup.openPopup('communityConfirmPopup', true);";

      let okElement = document.getElementById("confirm-OK");
      okElement.addEventListener("click", function (e) {
        for(const checkbox of checkboxes){
          deleteCommunityComment((checkbox.value).replace('/',''))
        }
      });   
     
    }
  }

  ////// community notice/////////////////////////////////////
  function getCommunityNotice(currentPage, size, filterCategory=null, filterStatus=null){ 
    // 0:연애, 1:진로, 2:일상, 3:우리학교
    let _category = {}; _category[0] = '연애';_category[1] = '진로';_category[2] = '일상';_category[3] = '우리학교';
    let _status = {}; _status['ongoing'] = '게시중';_status['waiting'] = '대기중';_status['finishing'] = '게시종료'; 
    let communityYear = document.getElementById('community-year');
    let _filterYear =  (communityYear.options[communityYear.selectedIndex]).value === 'all' ? null : (communityYear.options[communityYear.selectedIndex]).value ;    
    let communityMonth = document.getElementById('community-month');
    let _filterMonth =  (communityMonth.options[communityMonth.selectedIndex]).value === 'all' ? null : (communityMonth.options[communityMonth.selectedIndex]).value ;      
    let communityCategory = document.getElementById('community-notice-category');
    let _filterCategory =  (communityCategory.options[communityCategory.selectedIndex]).value === 'all' ? null : (communityCategory.options[communityCategory.selectedIndex]).value ;   
    let communityState = document.getElementById('community-notice-state');
    let _filterState =  (communityState.options[communityState.selectedIndex]).value === 'all' ? null : (communityState.options[communityState.selectedIndex]).value ;  
    let _keyword = document.getElementById('community-notice-search').value;
    let communityStatus = document.getElementById('community-notice-status');
    let _filterStatus =  (communityStatus.options[communityStatus.selectedIndex]).value === 'all' ? null : (communityStatus.options[communityStatus.selectedIndex]).value ;            
    let url = baseUrl + "/communities?type=0";

    if ( _filterState !== null){   
      url +='&state='+ _filterState;
    } else {
      if ( _filterStatus  === '-' ){
        url +='&state=2';
      } else if ( _filterStatus === 'ongoing' ){
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
      url +='&category='+ _filterCategory;
    }
    let _Year  = _filterYear === null ? (new Date()).getFullYear() : _filterYear ;
    let _startMonth  = _filterMonth ? parseInt(_filterMonth) - 1 : 0;
    let _endMonth  = _filterMonth ? parseInt(_startMonth) + 1 : 12;
    url +=  _filterYear || _filterMonth ? ('&startCreateDate=' + (new Date(_Year,_startMonth,1)).toISOString() + '&endCreateDate=' + (new Date(_Year,_endMonth, 0)).toISOString()) : '';
    url += (_keyword === null ? '' : ('&keyword=' + _keyword));

    if(( _filterState === '0,3' &&  _filterStatus === '-')|| ( _filterState === '2' && ( _filterStatus  === 'ongoing' || _filterStatus  === 'waiting' ))){
      document.getElementById('community-notice_grid').innerHTML  = '';          
      document.getElementById('community-notice-pagination').innerHTML = '';
      document.getElementById('community-notice-total').innerHTML = '&nbsp;<strong>' + 0 + '</strong>&nbsp;';
      return
    } 
    else{
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((communities) => {
          console.log('community' + JSON.stringify(communities.data));
          let communityGrid= "";
          let communityData = communities.data.communities;
          let communitiesDataTotal = communities.data.total;
          let numOfPage = Math.ceil(communitiesDataTotal/size);
          let iteration = communityData.length > size ? size :  communityData.length;
              
          for( let i=0;  i < communityData.length ; i++){
            let values = communityData[i]
            let today = new Date();
            let state = values.state === 2? '비공개':"공개";
            communityGrid+=`<tr>
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
                              <td><a href="./notice-detail.html?id=${values.id}" class="underline">${values.title}</a></td>                
                              <td>${_category[values.category]}</td>             
                              <td>${values.name?values.name:""}</td>
                              <td>${state}</td>             
                              <td>${values.state === 2 ? '-' : _status[values.status]  }</td>             
                              <td>${dateToStr(strToDate(values.startDate))}</td>
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
                          <a href="#" class="page-link" onclick="getCommunityNotice(0,`+size+`)">First</a>
                        </li>`
            }
            if (currentPage == 0){ 
              paging += `<li class="controller prev disabled">`;
            } else {
              paging += `<li class="controller prev">
                          <a href="#" class="page-link" onclick="getCommunityNotice(`+(currentPage-1)+`,`+ size + `)">Previous</a>
                        </li>`
            }
                    
            for ( let page = startOfPage ; page< endOfPage; page++){             
                if (page === (currentPage)){
                  paging +=`<li class="paging current">` 
                } else {
                  paging +=`<li class="paging">` 
                }                                              
                paging += `<a href="#" class="page-link" onclick="getCommunityNotice(`+page+`,`+ size + `)">`+ (page+1) +`</a></li>`;
            }      

            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller next disabled">`;
            } else {
              paging += `<li class="controller next">
                          <a href="#" class="page-link" onclick="getCommunityNotice(`+(currentPage+1)+`,`+ size + `)">Previous</a>
                        </li>`
            }     
            if ((currentPage+1) === numOfPage || (numOfPage === 0)) { 
              paging += `<li class="controller last disabled">`;
            } else {
              paging += `<li class="controller last">
                          <a href="#" class="page-link" onclick="getCommunityNotice(`+(numOfPage-1)+`,`+ size + `)">Last</a>
                        </li>`
            }       
                    
          document.getElementById('community-notice_grid').innerHTML  = communityGrid === "" ? "<tr><td colspan='9'>데이터가 없습니다.</td></tr>": communityGrid;      
          document.getElementById('community-notice-pagination').innerHTML = paging;
          document.getElementById('community-notice-total').innerHTML = '&nbsp;<strong>' +communitiesDataTotal + '</strong>&nbsp;';
        });
      }).catch(error => console.log(error));
    }
  }

  function cancelNotice(){
    location.href= "javascript:layerPopup.openPopup('communityConfirmPopup', true);";
    let okElement = document.getElementById("confirm-OK");
    okElement.addEventListener("click", function (e) {
      location.href = './notice-list.html';
    });       
    return;
  }

  function deleteCommunityComment(commentId){
    let _communityId = window.sessionStorage.getItem('communityId');
    let url = baseUrl + "/community-comment" ;
    console.log('commentId' + commentId);
    let params = {             
        id: commentId,
        communityId: _communityId,
        state : 1            
    }
    
    async function post(request) {
    try {
        await fetch(request).then(response => {
        console.log('modifyFaq 성공'+ response.status)
            if(response.status === 200) {  // No content
              document.getElementById("community-alert-message").innerHTML ='<strong>삭제가 완료되었습니다.</strong>';
              location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);"; 
              let okElement = document.getElementById("alert-OK");
              okElement.addEventListener("click", function (e) {
                location.href='./community-modify.html?id='+ _communityId;
              });                
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

  function checkInput(type){    
    let category = document.getElementById("community-notice-category");
    let _category =  (category.options[category.selectedIndex]).value;
    let _postStartDate = document.getElementById('community-notice-post-date').value;
    let _title = document.getElementById('community-notice-title').value;
    let _writer = document.getElementById('autocomplete01').value;
    let _content = document.getElementById('editor').value;

    // let _content = document.getElementById('editor').value;
    // let _state =  $('input[name=banner-state]:checked').val() === 'private' ? 2 : $('input[name=banner-state]:checked').val() === 'reserved' ? 3 : 0;
    if ( _category === 'all'){
      document.getElementById("community-alert-message").innerHTML = "<strong>카테고리를 선택해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } else if(_writer === ""){
      document.getElementById("community-alert-message").innerHTML = "<strong>작성자를 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } else if($('input[name="community-notice-state"]').is(":checked") === false){
      document.getElementById("community-alert-message").innerHTML = "<strong>공지 상태를 체크해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } else if ($('input[name=community-notice-state]:checked').val() === 'public' && ($('input[name="community-notice-post-state"]').is(":checked") === false)){
        document.getElementById("community-alert-message").innerHTML = "<strong>공지 게시를 체크해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return
    } else if (_postStartDate ===""){
      document.getElementById("community-alert-message").innerHTML = "<strong>게시 기간을 선택해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } else if (_title ===""){
      document.getElementById("community-alert-message").innerHTML = "<strong>제목을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } else if ( _content ===""){
      document.getElementById("community-alert-message").innerHTML = "<strong>내용을 입력해 주세요.</strong>";
      location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
      return;
    } 

    if (type === 1){
      registerCommunityNotice();
    } else {
      modifyCommunityNotice();
    }
  }

  function registerCommunityNotice(){
    let url= baseUrl + "/users/all?state=0&grade=50,100&name=" + (document.getElementById("autocomplete01").value.length > 0 ? document.getElementById("autocomplete01").value : ' ');    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {     

        let _me = JSON.parse(window.localStorage.getItem("meInfo"));
        let category = document.getElementById("community-notice-category");
        let _category =  (category.options[category.selectedIndex]).value;
        let _userId = document.getElementById("autocomplete01").value.length > 0?response.data.users[0].id:_me.id;
        let _state =  $('input[name=community-notice-state]:checked').val() === 'private' ? 2 : $('input[name=community-notice-post-state]:checked').val() === 'immediately' ? 0: 3;  
        let _postStartDate = document.getElementById('community-notice-post-date').value;   
        let _title = document.getElementById('community-notice-title').value;
        let _editor = document.getElementById('editor').value;
      
        console.log('_editor' + _editor);
        console.log('_state' + _state);
        let url = baseUrl + "/community/register" ;
        let params = {      
            type : 0,
            category: _category,
            userId: _userId,
            state: _state,
            title: _title,
            content: _editor,
            startDate: _postStartDate,
        }
      
        async function post(request) {
        try {
          await fetch(request).then(response => {
              if(response.status === 201) {  // No content        
                document.getElementById("community-alert-message").innerHTML = "<strong>공지가 등록되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
                let okElement = document.getElementById("alert-OK");
                okElement.addEventListener("click", function (e) {
                  location.href ="./notice-list.html"
                });
                // return
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

      });
    }).catch(error => console.log(error));
  }

  function selectRegistModify(){
    let _communityId = window.sessionStorage.getItem("communityId");
    console.log('_communityId' + _communityId);
  
    // console.log('num' + id)
    if ( _communityId === null){
      console.log('등록');

      editorId = JSON.parse(window.localStorage.getItem("meInfo")).id;
      editorName = JSON.parse(window.localStorage.getItem("meInfo")).name;
      document.getElementById('autocomplete01').value = JSON.parse(window.localStorage.getItem("meInfo")).name;

      document.getElementById('community-notice-register').style.display = 'block';
      document.getElementById('community-notice-modify').style.display = 'none';
      document.getElementById('community-notice-comment').style.display = 'none';
      // document.getElementById('banner-pc-modify-frame').style.display = 'none';
      // document.getElementById('banner-mobile-modify-frame').style.display = 'none';
    } else {
      console.log('수정');
      // document.getElementById('banner-regist').style.display = 'none';
      document.getElementById('community-notice-modify').style.display = 'block';
      document.getElementById('community-notice-register').style.display = 'none';
      document.getElementById('community-notice-comment').style.display = 'block';
    
      let url = baseUrl + "/communities?id=" + _communityId;
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((community) => {

          let communityData = community.data.communities;
          let communityDataTotal = community.data.total;
          //console.log('communityData' + JSON.stringify(communityData));

          if(communityData.length > 0){
            let _communityData = communityData[0];
            let _state = _communityData.state;
            let today = new Date();
            let startdate = new Date(_communityData.startDate);

            $('#community-notice-category option[value=2]').attr('selected', true);

            /// 상태 
            if(_state === 0 || _state === 3) $(":radio[name='community-notice-state'][value='public']").attr('checked', true);
            else $(":radio[name='community-notice-state'][value='private']").attr('checked', true);

            /// 게시
            if(_state === 2){
              (new Date(_communityData.startDate) <= new Date(_communityData.lastDate)) ? 
                $(":radio[name='community-notice-post-state'][value='immediately']").attr('checked', true) :
                $(":radio[name='community-notice-post-state'][value='reserved']").attr('checked', true);;  
            }
            else{ 
              _state === 0 ? 
                $(":radio[name='community-notice-post-state'][value='immediately']").attr('checked', true) :
                $(":radio[name='community-notice-post-state'][value='reserved']").attr('checked', true);;  
            } 

            editorId = _communityData.userId;
            editorName = _communityData.name;
            document.getElementById('autocomplete01').value = editorName;

            document.getElementById('community-notice-title').value = _communityData.title;  
            console.log('_notificationData.startDate' + _communityData.startDate)
            document.getElementById('community-notice-post-date').value = dateToStr(strToDate(_communityData.startDate));

            editorInstance.html.insert(_communityData.content);
          }
        })                    
      }).catch(error => console.log(error));
      getCommunityCommentModify(0,20)
      // window.sessionStorage.setItem("notification-id", id);
    }
    
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
                  event.preventDefault();
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
                console.log();
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

  function goRegister(){
    window.sessionStorage.removeItem("communityId")
  }

  function modifyCommunityNotice(){
    let category = document.getElementById("community-notice-category");
    let _category =  (category.options[category.selectedIndex]).value;

    let _userId = editorId

    let _status = $('input[name=community-notice-state]:checked').val() === 'private' ? 2 : $('input[name=community-notice-post-state]:checked').val() === 'immediately' ? 0: 3;  
    //console.log('state => ' + $('input[name=notice-state]:checked').val() + ' ' +  _status);
    let _postStartDate = document.getElementById('community-notice-post-date').value;  
    let _title = document.getElementById('community-notice-title').value;
    // let _editor = editorInstance.html.get();
    let _editor = document.getElementById('editor').value;
    let communityId = window.sessionStorage.getItem("communityId")
    console.log('_editor' + _editor);
    let url = baseUrl + "/community" ;
    let params = {      
        id: communityId,
        type : 0,
        category: _category,
        userId: _userId,
        state: _status,
        title: _title,
        content: _editor,
        startDate: _postStartDate,
    }
  
    async function post(request) {
    try {
      await fetch(request).then(response => {
          if(response.status === 200) {  // No content        
            document.getElementById("community-alert-message").innerHTML = "<strong>공지가 수정되었습니다.</strong>";
            location.href= "javascript:layerPopup.openPopup('communityAlertPopup', true);";
            let okElement = document.getElementById("alert-OK");
            okElement.addEventListener("click", function (e) {
              location.href ="./notice-list.html"
            });
            // return
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

  function setToday(){
    console.log('setToday')
    const today = new Date();
    document.getElementById('community-notice-post-date').value = dateToStr(today);
    datepicker.setDate(today)
  }

  function searchStart(e,type){
    if(e.keyCode === 13){
       if ( type === 0){
        getCommunityRomanceList(0,20);
       } else if ( type === 1){
        getCommunityCourseList(0,20);
      } else if ( type === 2){
        getCommunityDailyList(0,20);
      } else if ( type === 3){
        getCommunitySchoolList(0,20);
      } else if ( type === 4){
        getCommunityList(0,20);
      } else if ( type === 5){
        getCommunityNotice(0,20);
      }        
    }
  }