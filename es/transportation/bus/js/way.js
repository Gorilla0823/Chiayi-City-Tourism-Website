var goData = '';
var backData = '';

var goBtn = document.getElementById('go');
var backBtn = document.getElementById('back');
var busList = document.getElementById('bus-way-list');

goBtn.addEventListener('click', getGoJson, false);
backBtn.addEventListener('click', getBackJson, false);

var helper = {
    getParameterByName: function (name, url) {
        var regex, results;
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
        results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
};
let roadLine = helper.getParameterByName("En"); //取得 路線中文名稱
// console.log(roadLine);
var GoUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Chiayi?$filter=RouteName%2FEn%20eq%20%27${roadLine}%27%20and%20Direction%20eq%20%270%27&$orderby=StopSequence%20asc&$format=JSON`;
// console.log(GoUrl);
var BackUrl = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Chiayi?$filter=RouteName%2FEn%20eq%20%27${roadLine}%27%20and%20Direction%20eq%20%271%27&$orderby=StopSequence%20asc&$format=JSON`;

var address = document.getElementById('now-position'); //為了渲染成路線號
if(roadLine=='市區1路') 
address.innerHTML = `No. Downtown 1 Road`;
else if(roadLine=='市區7路') 
address.innerHTML = `No. Downtown 7 Road`;
else if(roadLine=='66')
address.innerHTML = `No. 66`;
else 
address.innerHTML = `No. `+roadLine;
var updata; //記錄要渲染的路線資

/* 判斷去程回程 */
var check = 'go';

function checkWay() {
    if (check == "go"){
        getGoJson();
    }
    else{
        getBackJson();
    }
    
}
checkWay();

/* 首次執行，先渲染出 去程回程路線選擇按鈕 */
// function choseBtn(){
//     var xhr = new XMLHttpRequest();
//     xhr.open('get', GoUrl);
//     xhr.send(null);
//     xhr.onload = function () {
//             goData = JSON.parse(xhr.responseText);
//             const len = goData.length;
//             for (var i = 0; i < len; i++) {
//                 goBtn.innerHTML = `往 ${goData[len - 1].StopName.En}`;
//                 backBtn.innerHTML = `往 ${goData[0].StopName.En}`;
//             }
//         }
// }
// choseBtn();

/* 去程資料 */
function getGoJson(){
    clearInterval(getBackJson); // 讓畫面不會渲染出 回程路線
    check = "go";

    var xhr = new XMLHttpRequest();
    xhr.open('get', GoUrl);
    xhr.send(null);
    xhr.onload = function () {
        goData = JSON.parse(xhr.responseText);
        // console.log(goData);

        update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {
                goBtn.innerHTML = `To ${items[len - 1].StopName.En}`;
                backBtn.innerHTML = `To ${items[0].StopName.En}`;

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成Minutes鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 Over
                    str +=
                        `<li class="bus-state">
                            <div class="station over">
                                <div class="time">Over</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                } else if (items[i].EstimateTime < 0){ //末班駛離
                    str +=
                        `<li class="bus-state">
                            <div class="station stop">
                                <div class="time">Last departure</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">Inbound</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一Minutes
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">${Time}Minute</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <div class="station">
                                <div class="time">${Time}Minutes</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                }
                busList.innerHTML = str;
            }
            // console.log(1);
        }
        update(goData);
    }
    // setInterval(getGoJson, 30000);
}


/* 回程資料 */
function getBackJson() {
    clearInterval(getGoJson); // 讓畫面不會渲染出 去程路線
    check = "back";
    
    var xhr = new XMLHttpRequest();
    xhr.open('get', BackUrl);
    xhr.send(null);
    xhr.onload = function () {
        backData = JSON.parse(xhr.responseText);

        update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成Minutes鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 Over
                    str +=
                        `<li class="bus-state">
                            <div class="station over">
                                <div class="time">Over</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                } else if (items[i].EstimateTime < 0) { //末班駛離
                    str +=
                        `<li class="bus-state">
                            <div class="station stop">
                                <div class="time">Last departure</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">Inbound</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一Minutes
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time"> ${Time} Minute</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <div class="station">
                                <div class="time">${Time}Minutes</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.En}</div>
                        </li>`
                }
                busList.innerHTML = str;
            }
        }
        update(backData);
    }
    // setInterval(getBackJson, 30000);
}

setInterval(checkWay, 30000);
