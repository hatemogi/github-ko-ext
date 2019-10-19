var 시간패턴 = [
    [/([\d+]) months ago/, "$1달 전"],
    [/a month ago/, "한달 전"],
    [/([\d+]) years ago/, "$1년 전"],
    [/a year ago/, "1년 전"],
    [/([\d+]) days ago/, "$1일 전"],
    [/a day ago/, "하루 전"],
    [/yesterday/, "어제"],
    [/([\d+]) hours ago/, "$1시간 전"],
    [/an hour ago/, "1시간 전"],
    [/([\d+]) minutes ago/, "$1분 전"],
    [/a minute ago/, "1분 전"],
    [/just now/, "방금"]
];
var 텍스트변환 = function (셀렉터, 패턴들) {
    document.querySelectorAll(셀렉터).forEach(function (n) {
        n.childNodes.forEach(function (c) {
            if (c.parentNode == n && c.nodeType == 3) {
                패턴들.forEach(function (_a) {
                    var 패턴 = _a[0], 번역 = _a[1];
                    if (패턴.test(c.data)) {
                        c.번역전 = c.data;
                        c.data = c.data.replace(패턴, 번역);
                    }
                });
            }
        });
    });
};
var 인풋값변환 = function (셀렉터, 패턴들) {
    document.querySelectorAll(셀렉터).forEach(function (n) {
        if (n.tagName == 'INPUT') {
            패턴들.forEach(function (_a) {
                var 패턴 = _a[0], 번역 = _a[1];
                if (패턴.test(n.value)) {
                    n.번역전 = n.value;
                    n.value = n.value.replace(패턴, 번역);
                }
            });
        }
    });
};
function 번역(인덱스, 셀렉터, 패턴들, 변환) {
    if (변환 === void 0) { 변환 = 텍스트변환; }
    return {
        인덱스: 인덱스,
        셀렉터: 셀렉터,
        번역패턴들: 패턴들,
        변환: 변환
    };
}
var 번역목록 = [
    번역("0000A", ".auth-form-header > h1", [[/Sign in to GitHub/, "GitHub 로그인"]]),
    번역("0000B", ".auth-form-body > label", [[/Username or email address/, "아이디 또는 이메일 주소"],
        [/Password/, "비밀번호"]]),
    번역("0000D", ".auth-form-body a", [[/Forgot password\?/, "비밀번호 찾기"]]),
    번역("0000E", ".auth-form-body input[type=submit]", [[/Sign in/, "로그인"]], 인풋값변환),
    번역("0000F", ".auth-form p", [[/New to GitHub\?/, "GitHub에 처음이신가요?"]]),
    번역("0000G", ".create-account-callout a", [[/Create an account/, "아이디 만들기"]]),
];
function 번역하기() {
    번역목록.forEach(function (정보) {
        정보.변환(정보.셀렉터, 정보.번역패턴들);
    });
}
window.addEventListener('load', 번역하기);
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    console.log("got message", message);
    if (message.action == "onCompleted") {
        번역하기();
    }
    response("done");
});
