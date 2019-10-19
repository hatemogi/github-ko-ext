
type 번역패턴 = [RegExp, string];

const 시간패턴: 번역패턴[] = [
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

type 변환 = (셀렉터: string, 패턴들: 번역패턴[]) => void;

interface 번역정보 {
    인덱스: string;
    셀렉터: string;
    번역패턴들: 번역패턴[];
    변환: 변환;
}

const 텍스트변환: 변환 = function(셀렉터: string, 패턴들: 번역패턴[]) {
    document.querySelectorAll(셀렉터).forEach((n: HTMLElement) => {
        n.childNodes.forEach((c: any) => {
            if (c.parentNode == n && c.nodeType == 3) {
                패턴들.forEach(([패턴, 번역]: 번역패턴) => {
                    if (패턴.test(c.data)) {
                        c.번역전 = c.data;
                        c.data = c.data.replace(패턴, 번역);
                    }
                });
            }
        });
    });
}

const 인풋값변환: 변환 = function(셀렉터: string, 패턴들: 번역패턴[]) {
    document.querySelectorAll(셀렉터).forEach((n: any) => {
        if (n.tagName == 'INPUT') {
            패턴들.forEach(([패턴, 번역]: 번역패턴) => {
                if (패턴.test(n.value)) {
                    n.번역전 = n.value;
                    n.value = n.value.replace(패턴, 번역);
                }
            });
        }
    });
}

function 번역(인덱스: string, 셀렉터: string, 패턴들: 번역패턴[], 변환: 변환 = 텍스트변환): 번역정보 {
    return {
        인덱스: 인덱스,
        셀렉터: 셀렉터,
        번역패턴들: 패턴들,
        변환: 변환
    }
}

const 번역목록: 번역정보[] = [
    번역("0000A", ".auth-form-header > h1", [[/Sign in to GitHub/, "GitHub 로그인"]]),
    번역("0000B", ".auth-form-body > label", [[/Username or email address/, "아이디 또는 이메일 주소"],
                                              [/Password/, "비밀번호"]]),
    번역("0000D", ".auth-form-body a", [[/Forgot password\?/, "비밀번호 찾기"]]),
    번역("0000E", ".auth-form-body input[type=submit]", [[/Sign in/, "로그인"]], 인풋값변환 ),
    번역("0000F", ".auth-form p", [[/New to GitHub\?/, "GitHub에 처음이신가요?"]]),
    번역("0000G", ".create-account-callout a", [[/Create an account/, "아이디 만들기"]]),
];

function 번역하기() {
    번역목록.forEach((정보: 번역정보) => {
        정보.변환(정보.셀렉터, 정보.번역패턴들);
    });
}

window.addEventListener('load', 번역하기);

declare var chrome: any;

chrome.runtime.onMessage.addListener(function(message: any, sender: any, response: any) {
    console.log("got message", message);
    if (message.action == "onCompleted") {
        번역하기();
    }
    response("done");
});