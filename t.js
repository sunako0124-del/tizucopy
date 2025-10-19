
//グーグルマップを開く
function gmap() {
if (document.getElementById("POLNO").value>0){} else {alert('マーカーを選択してから押すと、グーグルマップで現在地からの経路が表示されます。');return;}
var glat = document.getElementById("LAT").value;
  var glng = document.getElementById("LNG").value;

window.open("https://www.google.com/maps?q=" + glat + "," + glng);
}

var db;
   var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
      if (indexedDB) {
      // データベースを削除したい場合はコメントを外します。
      //indexedDB.deleteDatabase("mydb");
      var openRequest = indexedDB.open("mydb", 1.0);
       openRequest.onupgradeneeded = function(event) {
// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
        db = event.target.result;
           var store = db.createObjectStore("mystore", { keyPath: "mykey"});
              store.createIndex("myvalueIndex", "myvalue");

      }
          openRequest.onsuccess = function(event) {


//マーカークリックイベント
         db = event.target.result;
        }
      } else {
        window.alert("このブラウザではIndexed DataBase API は使えません。");
              }

function markerClick(e){
  ck();
  //マーカーから値をもらう
  POLNO.value = e.sourceTarget.options.customID;            
  LAT.value = e.latlng.lat;
  LNG.value = e.latlng.lng;
  ima();
  map.setView([e.latlng.lat, e.latlng.lng]);

  //現在地取得
  GPS();
  //接地抵抗クリア 
  setti1.value = "";
  //接地抵抗に移動
  document.getElementById('setti1').focus()
  //DBから値をもらう
  getValue(event); 

}

// 接地抵抗が入力済みなら取得する
 function getValue(event) {
  var key = document.getElementById("POLNO").value;
  //var result = document.getElementById("result");             
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");                  
  var request = store.get(key);
  var element = document.getElementById( "tutibox" ) ;
  var radioNodeList = element.tuti ;

  request.onsuccess = function (event) {  

    if (event.target.result === undefined) {} else {
      //値あり
      var aaa = Number(event.target.result.myvalue)
      //0だったらヌル数字だったら数字
      if(aaa===0){setti1.value ="";} else {
      setti1.value = aaa;
      biko.value = event.target.result.mybiko
      etc.value = event.target.result.myetc
      IV.value = event.target.result.myIV
      BRK.value = event.target.result.myBRK
      TIK2.value = event.target.result.myTIK2
      TIK3.value = event.target.result.myTIK3
      SUTE.value = event.target.result.mySUTE
      BSY.value = event.target.result.myBSY
      radioNodeList[event.target.result.mytuti].checked = true ;
      }
    }
    Bsyu();  //単独の時B種を表示する
  }
}

//登録  
function setValue(event) {
  var key = document.getElementById("POLNO").value;
  var value = 999 //Number(document.getElementById("setti1").value);
  var LAT = Number(document.getElementById("LAT").value);
  var LNG = Number(document.getElementById("LNG").value);

  var GLAT = Number(document.getElementById("GLAT").value);
  var GLNG = Number(document.getElementById("GLNG").value);

  var now = document.getElementById("noww").value;
  var etc =  1 //document.getElementById("etc").value;
  var BSY = Number(document.getElementById("BSY").value);
  var IV = document.getElementById("IV").value;//No.
  var BRK = document.getElementById("BRK").value;//内容
  var TIK2 = document.getElementById("TIK2").value;//期限
  var TIK3 = document.getElementById("TIK3").value;
  var SUTE = document.getElementById("SUTE").value;

  //チェック
  if (key >0){} else {alert('マーカーをクリックしてから登録してください!!');return;}
  if (value == 0){
    alert('接地抵抗が未入力です');document.getElementById('setti1').focus();return;
  } 
  if (etc >= 4 && BSY == 0 ) {
    alert('単独接地の時は、A種とB種必須入力です。単独だけど1極しかない時は、単独接地を選択せずにそのまま入力してください。');document.getElementById('BSY').focus();return;
  } 
   
  // form要素を取得 
  var element = document.getElementById( "tutibox" ) ;
  // form要素内のラジオボタングループ(name="tuti")を取得
  var radioNodeList = element.tuti ;
  // 選択状態の値(value)を取得 (Bが選択状態なら"b"が返る)
  var tuti = radioNodeList.value ;
  var biko = document.getElementById("biko").value;
  //                  
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore")
  var request = store.put({ mykey: key, myvalue: value, myBSY: BSY, myLAT: LAT, myLNG: LNG, mytuti: tuti, mybiko: biko, myGLAT: GLAT, myGLNG: GLNG, mynow: now ,myetc:etc, myIV:IV, myBRK:BRK, myTIK2:TIK2, myTIK3:TIK3, mySUTE:SUTE});
  //登録  電柱NO,緯度,経度,接地測定値,B種,舗装,メモ,メモ2,測定緯度,測定経度,測定日時,IV→作業番号,ボルコン→内容,蓄力２号→期限,蓄力３号
  //key,myLAT.myLNG.myvalu.myBSY.mytuti.mybiko.myetc.myGLAT.myGLNG.mynow.myIV.myBRK.myTIK2.myTIK3
  
  MAK();

  //入力欄リセット
	document.getElementById("POLNO").value = "";
	document.getElementById("setti1").value = "";
	document.getElementById("biko").value = "";

  radioNodeList[0].checked = true ;

	document.getElementById("etc").selectedIndex = 0;
  document.getElementById("BSY").value = "";
  document.getElementById("IV").value = "";
  document.getElementById("BRK").value = "";
  document.getElementById("TIK2").value = "";
  document.getElementById("TIK3").value = "";
  document.getElementById("SUTE").value = ""; 
  
  ck0();
  currentWatchReset();
   request.onsuccess = function (event) {

   }
}

// LDBからマーカ
function MAKall(event) {
  return new Promise(function(resolve) {
    var result = document.getElementById("result");                   
    var transaction = db.transaction(["mystore"], "readwrite");
    var store = transaction.objectStore("mystore");
    var request = store.openCursor();


    //マーカーレイヤー削除
    MI.clearLayers();
    KAN.clearLayers();
    moji.clearLayers();

    request.onsuccess = function (event) {
      //リストがなかったら終了  
      if(event.target.result == null) {
      resolve()   
      return;
      }
      var cursor = event.target.result;
      var data = cursor.value;
      var divIcon3 = L.divIcon({
        html: data.mykey.slice( -4 ),
        className: 'divicon2',
        iconSize: [0,0],
      
        iconAnchor: [0,28]
      });
  
      moji.addLayer(L.marker([data.myLAT, data.myLNG], {icon: divIcon3,customID: data.mykey}).on('click', function(e) { markerClick(e);}));

      //値が入ってたら完了（グレー）、未入力ピンク
      if(data.myvalue>0){
        
      //L.marker([data.myLAT, data.myLNG],{icon:myIcon2,customID: data.mykey}).addTo(KAN).on('click', function(e) { markerClick(e);});
      KAN.addLayer(
            L.circleMarker([data.myLAT, data.myLNG],{
          color: '#fdfdfd',
          weight: 1,
          opacity: 1,
          fillColor: '#534f4f',
          fillOpacity: 1,
          radius: 10,
          
          customID: data.mykey })

        .on('click', function(e) { markerClick(e);})
      );
      } else {
        
        MI.addLayer(
          L.circleMarker([data.myLAT, data.myLNG],{
            color: '#fdfdfd',
            weight: 1,
            opacity: 1,
            fillColor: '#fa04b0',
            fillOpacity: 1,
            radius: 10,
            
          customID: data.mykey})

        .on('click', function(e) { markerClick(e);})
        );
      }

     cursor.continue();
    }
  })
}

// LDBからマーカ
function MAK() {
  var key = document.getElementById("POLNO").value;
  var value = Number(document.getElementById("setti1").value);
  var LAT = Number(document.getElementById("LAT").value);
  var LNG = Number(document.getElementById("LNG").value);

KAN.eachLayer((layer)=> {if (key === layer.options.customID) {KAN.removeLayer(layer);}});
MI.eachLayer((layer)=> {if (key === layer.options.customID) {MI.removeLayer(layer);}});

  if (value >0) {
    KAN.addLayer(L.circleMarker([LAT, LNG],{
    color: '#fdfdfd',weight: 2,opacity: 1,fillColor: '#534f4f',fillOpacity: 1,radius: 10,customID: key })
    .on('click', function(e) { markerClick(e);})
    );
  }else{
    MI.addLayer(L.circleMarker([LAT, LNG],{
    color: '#fdfdfd',weight: 2,opacity: 1,fillColor: '#fa04b0',fillOpacity: 1,radius: 10,customID: key})
    .on('click', function(e) { markerClick(e);})
    );
  }
}

//マーカーが全部入るイメージ
function zenb(){
map.fitBounds(MI.getBounds());   
};



function ck(){
let element = document.getElementById('pop-up');
element.checked = true;
}
function ck0(){
let element = document.getElementById('pop-up');
element.checked = false;
}

//現在地
function GPS() {
	function success(pos) {
		GLAT.value = pos.coords.latitude;
		GLNG.value = pos.coords.longitude;

	}
  function error(err) {
		alert('位置情報を取得できませんでした。');
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	  if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
  	}
}

//現在地
function currentWatch() {
	function success(pos) {
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		map.setView([ lat,lng ]);
		// 現在地に表示するマーカー
		if (curMarker) {
			map.removeLayer(curMarker);
		}
		curMarker = L.marker([lat, lng],{icon:myIcon3}).addTo(map);
	}
	function error(err) {
		alert('位置情報を取得できませんでした。');
	}
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	if (watch_id == 0) {
		watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
	}
}

function currentWatchReset() {
	if (watch_id > 0) {
		navigator.geolocation.clearWatch(watch_id);
		watch_id = 0;
	}
	if (curMarker) {
		map.removeLayer(curMarker);
		curMarker = null;
	}
}


//待つタイプ
async function mikan(){
await MAKall();
await map.fitBounds(MI.getBounds());   
};
async function kanryo(){
await MAKall();
await map.fitBounds(KAN.getBounds());   
};
	
//現在時刻
function ima() {
  const D = new Date();
  const year = D.getFullYear();
  const month = D.getMonth() + 1;
  const date = D.getDate();
  const hour = D.getHours();
  const minute = D.getMinutes();
  const second = D.getSeconds();
  noww.value =  year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
}

function Bsyu(){
const etc = document.getElementById("etc").value
const st = document.getElementById("setti1").value
if (etc == '7'){
document.getElementById('BSY').style.visibility = 'visible';
document.getElementById('asyu').style.visibility = 'visible';
document.getElementById('bsyu').style.visibility = 'visible';
document.getElementById('asyu').value = 'D種';
document.getElementById('bsyu').value = 'A種';
    }else{
if (etc >= '4'){
document.getElementById('BSY').style.visibility = 'visible';
document.getElementById('asyu').style.visibility = 'visible';
document.getElementById('bsyu').style.visibility = 'visible';
document.getElementById('asyu').value = 'A種';
document.getElementById('bsyu').value = 'B種';
    }else{
    document.getElementById('BSY').style.visibility = 'hidden';
document.getElementById('asyu').value = '';
document.getElementById('bsyu').value = '';
    document.getElementById('asyu').style.visibility = 'hidden';
    document.getElementById('bsyu').style.visibility = 'hidden';
  }}

if (etc === '1' && st !== '999'){
  document.getElementById('setti1').value = '999';
  }
  if (etc != '1' && st == "999"){
    document.getElementById('setti1').value = null;
    }
}
