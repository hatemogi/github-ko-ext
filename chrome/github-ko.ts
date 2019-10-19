
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

const 바탕값변환: 변환 = function(셀렉터: string, 패턴들: 번역패턴[]) {
    document.querySelectorAll(셀렉터).forEach((n: any) => {
        if (n.tagName == 'INPUT') {
            패턴들.forEach(([패턴, 번역]: 번역패턴) => {
                if (패턴.test(n.placeholder)) {
                    n.번역전 = n.placeholder;
                    n.placeholder = n.placeholder.replace(패턴, 번역);
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
    번역("0000H", ".footer li a", [[/Terms/, "이용약관"], [/Privacy/, "개인정보보호정책"], [/Security/, "보안"], [/Contact GitHub/, "GitHub에 연락"]]),

    번역("0100A", "#forgot_password_form h1", [[/Reset your password/, "비밀번호 초기화"]]),
    번역("0100B", "#forgot_password_form label[for=email_field]", [[/Enter your email address .+\./, "이메일 주소를 입력하시면, 비밀번호를 초기화할 수 있는 링크를 보내드립니다."]]),
    번역("0100C", "#forgot_password_form input[name=email]", [[/Enter your email address/, "비밀번호를 여기 적으세요"]], 바탕값변환),
    번역("0100D", "#forgot_password_form input[type=submit]", [[/Send password reset email/, "비밀번호 초기화 이메일 보내기"]], 인풋값변환),

    번역("0300A", "form.js-site-search-form input[name=q]", [[/Search or jump to/, "검색 또는 바로가기"]], 바탕값변환),
    번역("0300B", "header nav a", [[/Pull requests/, "풀 리퀘스트"], [/Issues/, "이슈"],
                                    [/Marketplace/, "마켓"], [/Explore/, "탐색"]]),
    번역("0300F", "details-menu > a", [[/New repository/, "저장소 만들기"],
                                        [/Import repository/, "저장소 가져오기"],
                                        [/New gist/, "기스트 만들기"],
                                        [/New organization/, "단체 만들기"],
                                        [/New project/, "새 프로젝트 만들기"]]),
    번역("0301A", "details-menu a", [[/Signed in as/, "로그인 아이디:"]]),
    번역("0301B", "details-menu span", [[/Set status/, "상태 설정"]]),
    번역("0301C", "details-menu > a", [[/Your profile/, "내 프로필"],
                                        [/Your repositories/, "내 저장소"],
                                        [/Your projects/, "내 프로젝트"],
                                        [/Your stars/, "내 스타"],
                                        [/Your gists/, "내 기스트"],
                                        [/Help/, "도움말"],
                                        [/Settings/, "설정"]]),
    번역("0301H", "details-menu button", [[/Feature preview/, "신기능 미리보기"], [/Sign out/, "로그아웃"]]),

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