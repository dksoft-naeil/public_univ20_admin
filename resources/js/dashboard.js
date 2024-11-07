document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/dashboard") >= 0) getSelectDateList();  
});
  
 /// banner ////////////////////////////////////////////////////////////////////////////////////
  function getDashboard(){       
    // getSelectDateList();
    // "pointSettleCount": 0,
    // "voiceAcceptedCount": 0,
    // "scheduleRequestCount": 0,
    // "reportCount": 0,
    // "poposalCount": 0,
    // "qnaCount": 0,

    // "todayUserCount": 0,
    // "todayVisitedCount": 4,
    // "todayMagazineCount": 15,
    // "todayVoiceCount": 0,
    // "todayCommunityCount": 0,
    // "todayScheduleCount": 0,
    // "todayVoiceOpenedCount": 0,
    // "todayStoryOpenedCount": 0,
    // "todayReportCount": 0,
    // "todayProposalCount": 0,
    // "todayQnaCount": 0,

    // "totalUserCount": 8,
    // "totalVisitCount": 4,
    // "totalMagazineCount": 44,
    // "totalVoiceCount": 21,
    // "totalCommunityCount": 22,
    // "totalScheduleCount": 1,
    // "totalVoiceOpenedCount": 2,
    // "totalStoryOpenedCount": 4,
    // "totlaReportCount": 1,
    // "totalProposalCount": 0,
    // "totalQnaCount": 1

    let _date = document.getElementById("dashboard-daily-data");
    let _filterState =  (_date.options[_date.selectedIndex]).value ;   

    let url = baseUrl + "/dashboard?date=" + _filterState ;

    fetch(url, headers.json_headers)
    .then((response) => {
      // checkError(response.status);
      response.json().then((dashboard) => {
        console.log('dashboard' + JSON.stringify(dashboard.data));
        
        let dashboardData = dashboard.data;
        console.log('dashboardData.todayScheduleCount' + dashboardData.todayScheduleCount);
        ///알람
        document.getElementById("dashboard-point-settle-count").innerHTML = '<strong class="value">'+dashboardData.pointSettleCount+'</strong>';
        document.getElementById("dashboard-voice-accepted-count").innerHTML = '<strong class="value">'+dashboardData.voiceAcceptedCount+'</strong>';
        document.getElementById("dashboard-schedule-request-count").innerHTML = '<strong class="value">'+dashboardData.scheduleRequestCount+'</strong>';
        document.getElementById("dashboard-report-count").innerHTML = '<strong class="value">'+dashboardData.reportCount+'</strong>';
        document.getElementById("dashboard-proposal-count").innerHTML = '<strong class="value">'+dashboardData.poposalCount+'</strong>';
        document.getElementById("dashboard-qna-count").innerHTML = '<strong class="value">'+dashboardData.qnaCount+'</strong>';

        ///일일 데이터
        document.getElementById("dashboard-today-user-count").innerHTML = '<strong class="value">'+dashboardData.todayUserCount+'</strong>';
        document.getElementById("dashboard-today-visited-count").innerHTML = '<strong class="value">'+dashboardData.todayVisitedCount+'</strong>';
        document.getElementById("dashboard-today-magazine-count").innerHTML = '<strong class="value">'+dashboardData.todayMagazineCount+'</strong>';
        document.getElementById("dashboard-today-voice-count").innerHTML = '<strong class="value">'+dashboardData.todayVoiceCount+'</strong>';
        document.getElementById("dashboard-today-community-count").innerHTML = '<strong class="value">'+dashboardData.todayCommunityCount+'</strong>';
        document.getElementById("dashboard-today-schedule-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';
        document.getElementById("dashboard-today-voice-opened-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';
        document.getElementById("dashboard-today-story-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';
        document.getElementById("dashboard-today-report-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';
        document.getElementById("dashboard-today-proposal-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';
        document.getElementById("dashboard-today-qna-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';


        //total 데이터
        document.getElementById("dashboard-total-user-count").innerHTML = '<strong class="value">'+dashboardData.totalUserCount+'</strong>';
        document.getElementById("dashboard-total-visited-count").innerHTML = '<strong class="value">'+dashboardData.totalVisitCount+'</strong>';
        document.getElementById("dashboard-total-qna-count").innerHTML = '<strong class="value">'+dashboardData.totalQnaCount+'</strong>';
        document.getElementById("dashboard-total-magazine-count").innerHTML = '<strong class="value">'+dashboardData.totalMagazineCount+'</strong>';
        document.getElementById("dashboard-total-voice-count").innerHTML = '<strong class="value">'+dashboardData.totalVoiceCount+'</strong>';
        document.getElementById("dashboard-total-community-count").innerHTML = '<strong class="value">'+dashboardData.totalCommunityCount+'</strong>';
        document.getElementById("dashboard-total-schedule-count").innerHTML = '<strong class="value">'+dashboardData.todayScheduleCount+'</strong>';

        document.getElementById("dashboard-total-voice-opened-count").innerHTML = '<strong class="value">'+dashboardData.totalVoiceOpenedCount+'</strong>';
        document.getElementById("dashboard-total-story-opened-count").innerHTML = '<strong class="value">'+dashboardData.totalStoryOpenedCount+'</strong>';
        document.getElementById("dashboard-total-report-count").innerHTML = '<strong class="value">'+dashboardData.totalReportCount+'</strong>';
        document.getElementById("dashboard-total-proposal-count").innerHTML = '<strong class="value">'+dashboardData.totalProposalCount+'</strong>';
        document.getElementById("dashboard-total-qna-count").innerHTML = '<strong class="value">'+dashboardData.totalQnaCount+'</strong>';
      })

     }).catch(error => console.log(error));
  }

  function getSelectDateList(){
    // dashboard-daily-data
    let today_year = (new Date()).getFullYear();
    let today_month = (new Date()).getMonth();
    let today_day = (new Date()).getDate();

    for ( let i = 1 ; i< today_day + 1; i++)
    {
      let _day1  = dateToStr((new Date(today_year,today_month,i))).substring(0,10);
      let _day2 = dateToStr1((new Date(today_year,today_month,i))).substring(0,10);
      let optionValue = '<option value='+ _day1 + '>' + _day2 + '</option>';
      $("select[id=dashboard-daily-data]").append(optionValue);
      if ( today_day === i){
        $('#dashboard-daily-data option[value='+ _day1 +']').attr('selected', true);
      }
    }
    getDashboard();
  }