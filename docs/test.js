var debugLevel = null;
var myId = null;
var apiKey = 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c';
var peer = new Peer({ key: apiKey, /*debug: 3*/ });
var dc = null;

btnStart.onclick = evt => {
    dc = peer.connect(callTo.value);
    dcSetup(dc);
};

peer.on('open', id => {
    console.log('peer "onopen"');
    myIdDisp.textContent = myId = id;
    btnStart.style.display = '';
    getRmoteIds();
});

peer.on('connection', function (dc) {
    dcSetup(dc);
});

function dcSetup(dc) {
    inputMessage.style.display = '';
    inputMessage.onkeyup = evt => {
        if (evt.keyCode === 13) {
            if (inputMessage.value) {
                dc.send(inputMessage.value);
            }
            inputMessage.value = '';
        }
    }
    dc.on('data', function (data) {
        console.log('Received', data);
    });
    dc.on('open', function () {
        console.log('dc "onopen"');
    });
    // メッセージを送信
    dc.send('Hello!');
}

function getRmoteIds() {
    var getRemoteIdSIId = null;
    getRemoteIdSIId = setInterval(_ => {
        fetch(`https://skyway.io/active/list/${apiKey}`).then(res => res.json()).then(list => {
            var remoteIds = list.filter(memberId => memberId !== myId);
            if (remoteIds.length) {
                callTo.value = remoteIds[0];
                clearInterval(getRemoteIdSIId);
            }
        });
    }, 1000);
}
