/* 프론트-엔드 */

var lines = [];
lines[1] = ['설화명곡', '화원', '대곡', '진천', '월배', '상인', '월촌', '송현', '서부정류장', '대명', '안지랑', '현충로', '영대병원', '교대', '명덕', '반월당', '중앙로', '대구역', '칠성시장', '신천', '동대구', '동구청', '아양교', '동촌', '해안', '방촌', '용계', '율하', '신기', '반야월', '각산', '안심'];
lines[2] = ['문양', '다사', '대실', '강창', '계명대', '성서산업단지', '이곡', '용산', '죽전', '감삼', '두류', '내당', '반고개', '청라언덕', '반월당', '경대병원', '대구은행', '범어', '수성구청', '만촌', '담티', '연호', '대공원', '고산', '신매', '사월', '정평', '임당', '영남대'];
lines[3] = ['칠곡경대병원', '학정', '팔거', '동천', '칠곡운암', '구암', '태전', '매천', '매천시장', '팔달', '공단', '만평', '팔달시장', '원대', '북구청', '달성공원', '서문시장', '청라언덕', '남산', '명덕', '건들바위', '대봉교', '수성시장', '수성구민운동장', '어린이회관', '황금', '수성못', '지산', '범물', '용지'];

function applyData(line) {
    var now = new Date();
    var hour = now.getHours();
    var min = now.getMinutes();
    var _hour = hour;
    if (_hour < 10) _hour = '0' + _hour;
    var _min = min;
    if (_min < 10) _min = '0' + _min;
    var time = _hour + ':' + _min;

    var result = [];
    lines[line].forEach((e) => result.push({
        'station': e,
        'up': 0,
        'down': 0
    }));
    data[line + '호선'].forEach((e) => {
        var start = e.time[0].time;
        var end = e.time[e.time.length - 1].time;
        if (start > time) return;
        if (end < time) return;

        for (var n = e.time.length - 1; n >= 0; n--) {
            var tym = e.time[n].time;
            if (tym < time) {
                var sta = e.time[n].station;
                var index = lines[line].indexOf(sta);
                if (index == -1) console.log(JSON.stringify(e.time[n]));
                var train = Number(e.trainNo);
                if (train % 2 == 0) result[index].up = 1;
                else result[index].down = 1;
                break;
            }
        }
    });
    var ups = ['↑', '<i class=\'material-icons\'>&#xE535;</i>'];
    var downs = ['↓', '<i class=\'material-icons\'>&#xE535;</i>'];
    var color = ['', '#d93f5c', '#00aa80', '#ffb100'][line];
    var src = '<tr><td class=title colspan=4 style="color:' + color + ';" bgcolor=#EEEEEE>대구 ' + line + '호선</td></tr>';
    result.forEach((e) => {
        src += '<tr>';
        src += '<td class=metro>' + downs[e.down] + '</td>';
        src += '<td class=line style="background-color:' + color + ';"></td>';
        src += '<td class=metro>' + ups[e.up] + '</td>';
        src += '<td class=station>' + e.station + '</td>';
        src += '</tr>';
    });
    document.getElementById('data').innerHTML = src;
}



/* 백-엔드랑 비슷한 역할 하는 부분 */

var data = {};

function readData() {
    var req = new XMLHttpRequest();
    req.open("GET", "./대구_20220516.csv", false);
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            if (req.status === 200 || req.status == 0) {
                var allText = req.responseText;
                parseData(allText);
            }
        }
    }
    req.send(null);
}
readData();

function parseData(_data) {
    _data = _data.split('\n');
    _data.shift();
    var result = [[], [], []];
    var now = new Date();
    var day = now.getDay();
    if (day == 0) day = '휴일';
    else if (day == 6) day = '토요일';
    else day = '평일';

    var hour = now.getHours();
    var min = now.getMinutes();
    var _hour = hour;
    if (_hour < 10) _hour = '0' + _hour;
    var _min = min;
    if (_min < 10) _min = '0' + _min;
    var time = _hour + ':' + _min;

    data['1호선'] = [];
    data['2호선'] = [];
    data['3호선'] = [];

    _data.forEach((e) => {
        //열차번호,노선명,요일구분,정거장출발시각
        var datum = e.split(',');
        if (datum[2] != day) return;
        var train = datum[0];
        var line = datum[1];
        var tym = datum[3].split('+');

        var info = {};
        info.trainNo = train;
        info.time = [];
        tym.forEach((e) => {
            var _tym = e.split('-');
            info.time.push({
                'station': _tym[0],
                'time': _tym[1]
            })
        });
        data[line].push(info);
    });

}

