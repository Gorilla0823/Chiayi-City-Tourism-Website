
var requestURL = 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?$format=JSON';
var request = new XMLHttpRequest();
request.open('GET', requestURL, true);
//request.responseType='json';
request.send(null);
request.onload=function(){
	result=JSON.parse(request.responseText);
	var sel=document.getElementById("sfs1");
	sel.options.length=0;
	for(i=0; i<result.length; i++){
		var opt=document.createElement('option');
		name=result[i]['StationName']['Zh_tw']+'('+result[i]['StationName']['En']+')';
		opt.innerHTML=name;
		opt.value=result[i]['StationID'];
		sel.appendChild(opt);
	}
	
	var sel=document.getElementById("sfs2");
	sel.options.length=0;
	for(i=0; i<result.length; i++){
		var opt=document.createElement('option');
		name=result[i]['StationName']['Zh_tw']+'('+result[i]['StationName']['En']+')';
		opt.innerHTML=name;
		opt.value=result[i]['StationID'];
		sel.appendChild(opt);
	}
	
	var sel=document.getElementById("sfs3");
	sel.options.length=0;
	for( i = 2019 ; i < 2050 ; i++ ){
		var opt=document.createElement('option');
		opt.innerHTML=i.toString();
		opt.value=i.toString();
		sel.appendChild(opt);
	}
	
	var sel=document.getElementById("sfs4");
	sel.options.length=0;
	for(i=1; i<13; i++){
		var opt=document.createElement('option');
		opt.innerHTML=i.toString();
		opt.value=i.toString();
		sel.appendChild(opt);
	}
	
	var sel=document.getElementById("sfs5");
	sel.options.length=0;
	for(i=1; i<32; i++){
		var opt=document.createElement('option');
		opt.innerHTML=i.toString();
		opt.value=i.toString();
		sel.appendChild(opt);
	}
	
	var sel=document.getElementById("sfs6");
	sel.options.length=0;
	for(i=0; i<23; i++){
		var opt=document.createElement('option');
		opt.innerHTML=i.toString()+':00';
		opt.value=i.toString()+':00';
		sel.appendChild(opt);
	}
}
