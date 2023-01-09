// 주어진 이름의 쿠키를 반환하는데,
// 조건에 맞는 쿠키가 없다면 undefined를 반환합니다.
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
      path: '/',
      // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
      ...options
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
}

let TODAY_INVITE_CNT = 0;

$(document).ready(function(){

    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var todayStr = year + month + day;
    var cnt = 0;

    var tmp = getCookie(todayStr);

    var callbackFnc = (function(){
        $.ajax({
            type:"get",
            url:"https://sheets.googleapis.com/v4/spreadsheets/15sKb-0S4JtrmlNMr5pOO32UXZRbV9LfXFdF88G5pn28/values/today!A2:D99999?key=AIzaSyDNnbhF4GFtmqah4kR_qHPFN9jq1oyEbdU",
            dataType:"json",
            success: function(data){
                var contentArr = data["values"];
    
                $.each(contentArr, function(idx){
                    var rowArr = contentArr[idx];
                    var date = rowArr[0];

                    if (todayStr == date) {
                        cnt++;
                        TODAY_INVITE_CNT = cnt;                                        
                    }
                });
    
                $("#todayTxt").html("TODAY : " + TODAY_INVITE_CNT);
            },
            error:function(){
                console.log("통신에러");
            }
        });
    })

    if (tmp == null || tmp == undefined) {
        setCookie(todayStr, "1", {secure: true, 'max-age': 3600});

        $.ajax({
            type: "GET",
            url: "https://script.google.com/macros/s/AKfycbwhRQemrT92M2vhDWeX76OYBveUde4PtsLka6rCYs-umlwkqXJ_90jSIFPmxUHdFkE/exec",
            data: {                
                "tmp"      : "test",
                "date"     : todayStr,
                "sheet"    : "today"
            },
            success: function(response){
                callbackFnc();
            },
            error : function() {

            }
        });
    } else {
        callbackFnc();
    }
});