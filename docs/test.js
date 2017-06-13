var peer = new Peer({ key: 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c', /*debug: 3*/ });
var dc = null;

peer.on('open', id => {
    console.log('peer "onopen"');
    myIdDisp.textContent = id;
    btnStart.style.display = '';
    getRmoteIds();
});

peer.on('connection', function (dc) {
    dc.on('open', function () {
        inputMessage.style.display = '';
        inputMessage.onkeyup = evt => {
            if (evt.keyCode === 13) {
                if (inputMessage.value) {
                    dc.send(inputMessage.value);
                }
                inputMessage.value = '';
            }
        }
        console.log('dc "onopen"');
        dc.on('data', function (data) {
            console.log('Received', data);
        });
        // メッセージを送信
        conn.send('Hello!');
    });
});

btnStart.onclick = evt => {
    dc = peer.connect('dest-peer-id');
};

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