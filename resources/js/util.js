
  /////////////////////////////////// util ///////////////////////////////////////////////////////////////////////////////////////////
  function strToDate(str) { 
    let dateString = str;
    if(str.indexOf('-') < 0 && str.length === 12 && !isNaN(Number(str)))
        dateString = str.slice(0,4) +'-'+ str.slice(4,6) + '-' + str.slice(6,8) + ' ' + str.slice(8,10) + ':' + str.slice(10,12);
  
    return !isNaN(Date.parse(dateString))? new Date(dateString) : null;
    }
  
  function dateToStr(date){
    if(isNaN(Date.parse(date))) return '';
  
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    //let second = date.getSeconds();
  
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    //second = second >= 10 ? second : '0' + second;
  
    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  }

  function dateToStr1(date){
    if(isNaN(Date.parse(date))) return '';
  
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    //let second = date.getSeconds();
  
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    //second = second >= 10 ? second : '0' + second;
  
    return date.getFullYear() + '.' + month + '.' + day + ' ' + hour + ':' + minute;
  }
  
  function dateToNumber(date){
    if(isNaN(Date.parse(date))) return '';
  
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    //let second = date.getSeconds();
  
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    //second = second >= 10 ? second : '0' + second;
  
    let str = date.getFullYear().toString() + month.toString() +  day.toString() + hour.toString() +  minute.toString();
    return parseInt(str);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function allCheck(){
    document.querySelector('#checkAll');
        const isChecked = checkAll.checked;      
        if(isChecked){
            const checkboxes = document.querySelectorAll('.chk');
    
            for(const checkbox of checkboxes){
                checkbox.checked = true;
            }
        }
        else{
            const checkboxes = document.querySelectorAll('.chk');
            for(const checkbox of checkboxes){
                checkbox.checked = false;
            }
        }
  }
  
  function itemCheck(){
    const checkboxes = document.querySelectorAll('.chk');   
    for(const checkbox of checkboxes){
        const totalCnt = checkboxes.length;        
        const checkedCnt = document.querySelectorAll('.chk:checked').length;
      
        if(totalCnt == checkedCnt){
            document.querySelector('#checkAll').checked = true;
        }
        else{
            document.querySelector('#checkAll').checked = false;
        }
    }
  }
  
  function replacestr(str){
    let _str = str[0];
    for ( let i = 0; i < str.length - 2; i++){
      
        _str += '*';
    }
    _str += str[str.length-1]
    return _str
  }

  function selectReason(domReason, domEtc){
    console.log('삭제 이유 선택');///community-reason
    // let reason = document.getElementById('community-reason');
    let reason = document.getElementById(domReason);
    let _reason =  (reason.options[reason.selectedIndex]).value === 'all' ? null : (reason.options[reason.selectedIndex]).value ;   
    console.log('reason' + _reason);
    if (parseInt(_reason) === 3 ){
      document.getElementById(domEtc).style.display = 'block';
    } else {
      document.getElementById(domEtc).style.display = 'none';
    }
  }