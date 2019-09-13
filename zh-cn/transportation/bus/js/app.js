var data = ''; 
const list = document.getElementById('list');
const favorite = document.getElementById('favorite');
let OriginalList = ""; 

const xhr = new XMLHttpRequest();
xhr.open('get','https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Chiayi?$format=JSON');//
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    function showBusWay(items) {
        for (var i = 0; i < items.length; i++){
            OriginalList += 
            `<li class="list-group-item m-2" title="路線詳情">
                <a href="bus-way.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}&En=${items[i].SubRoutes[0].SubRouteName.En}" class="busLink">
                    <p class="display-3 text-primary bus-num"><i class="fas fa-bus-alt m-2"></i>${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
                   <p class="display-4 text-dark bus-way"><i class="fas fa-directions m-2"></i>${ items[i].SubRoutes[0].Headsign }</p>
                </a>
            </li>`
        }
        list.innerHTML = OriginalList;
    }
    showBusWay(data);
}       

