var debugLevel = null;
var myId = null;
var apiKey = 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c';
var peer = new Peer({ key: apiKey, /*debug: 3*/ });
var call = null;
var dc = null;

btnStart.onclick = evt => {
    dc = peer.connect(callTo.value);
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        localView.srcObject = stream;
        call = peer.call(callTo.value, stream);
        callSetup(call);
    });
    dcSetup(dc);
};

peer.on('open', id => {
    console.log('peer "onopen"');
    myIdDisp.textContent = myId = id;
    btnStart.style.display = '';
    getRmoteIds();
});

peer.on('call', call => {
    callSetup(call);
});

peer.on('connection', dc => {
    dcSetup(dc);
});

function callSetup(call) {
    if (!localView.srcObject) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            localView.srcObject = stream;
            call.answer(stream);
        });
    } else {
        call.answer(localView.srcobject);
    }
    call.on('stream', stream => {
        remoteView.srcObject = stream;
    });
}
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
        var div = docuemnt.createElement('div');
        div.textContent = data;
        messageContainer.insertBefore(div, messageContainer.firstChild);
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
