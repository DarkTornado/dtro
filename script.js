/* 프론트-엔드 */

var lines;
fetch("./station_list.json")
    .then((response) => response.json())
    .then((data) => {
        lines = data;
    });

function applyData(line) {
    var now = new Date();
    var hour = now.getHours();
    if (hour == 0) hour = 24;
    var min = now.getMinutes();
    var sec = now.getSeconds();
	var time = 60 * 60 * hour + 60 * min + sec;

    var result = [];
    lines[line].forEach((e) => result.push({
        'station': e,
        'up': 0,
        'down': 0
    }));
    data[line + '호선'].forEach((e) => {
        var start = time2sec(e.time[0].time);
        var end = time2sec(e.time[e.time.length - 1].time);
        if (start > time) return;
        if (end < time) return;

        for (var n = e.time.length - 2; n >= 0; n--) {
            var tym = time2sec(e.time[n].time);
            if (tym < time) {
                var sta = e.time[n + 1].station;
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
    fetch("./대구.csv")
        .then((response) => response.text())
        .then((data) => {
            parseData(data);
        });
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

function time2sec(time) {
    var t = time.split(':');
    t[0] = Number(t[0]);
    if(t[0]==0) t[0] = 24;
    return t[0] * 60 * 60 + Number(t[1]) * 60 + Number(t[2]);
}

