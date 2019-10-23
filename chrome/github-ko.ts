type 번역패턴 = [RegExp, string];

const 시간패턴: 번역패턴[] = [
    [/(\d+) months ago/, "$1달 전"],
    [/a month ago/, "한달 전"],
    [/(\d+) years ago/, "$1년 전"],
    [/a year ago/, "1년 전"],
    [/(\d+) days ago/, "$1일 전"],
    [/a day ago/, "하루 전"],
    [/yesterday/, "어제"],
    [/(\d+) hours ago/, "$1시간 전"],
    [/1 hour ago/, "1시간 전"],
    [/an hour ago/, "1시간 전"],
    [/(\d+) minutes ago/, "$1분 전"],
    [/a minute ago/, "1분 전"],
    [/(\d+) seconds ago/, "$1초 전"],
    [/just now/, "방금"]
];

type 변환 = (셀렉터: string, 패턴들: 번역패턴[]) => void;

interface 번역정보 {
    인덱스: string;
    셀렉터: string;
    번역패턴들: 번역패턴[];
    변환: 변환;
}

function 변환함수(선택함수: (es: Array<Element>) => Array<any>,
                속성키: string): 변환 {
    return (셀렉터: string, 패턴들: 번역패턴[]) => {
        const 노드 = Array.from(document.querySelectorAll(셀렉터));
        선택함수(노드).forEach(해당노드 => {
            패턴들.forEach(([패턴, 번역]: 번역패턴) => {
                let 원문 = 해당노드[속성키];
                if (패턴.test(원문)) {
                    해당노드.번역전 = 원문;
                    해당노드[속성키] = 원문.replace(패턴, 번역);
                }
            });
        });
    }
}

const 텍스트변환: 변환 = 변환함수(
    // 하위 노드 중 텍스트 노드만 처리
    (es) => es.flatMap(e =>
        Array.from(e.childNodes).filter(c => c.parentNode == e && c.nodeType == 3)),
    "data");

const 인풋값변환: 변환 = 변환함수(
    // INPUT 노드만 처리
    (es) => es.filter(e => e.tagName == 'INPUT'),
    "value");

const 바탕값변환: 변환 = 변환함수(
    // INPUT 노드만 처리
    (es) => es.filter(e => e.tagName == 'INPUT'),
    "placeholder");

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
    번역("0100C", "#forgot_password_form input[name=email]", [[/Enter your email address/, "이메일을 여기 적으세요"]], 바탕값변환),
    번역("0100D", "#forgot_password_form input[type=submit]", [[/Send password reset email/, "비밀번호 초기화 이메일 보내기"]], 인풋값변환),

    번역("0300A", "form.js-site-search-form input[name=q]", [[/Search or jump to/, "검색 또는 바로가기"]], 바탕값변환),
    번역("0300B", "header nav a", [[/Pull requests/, "풀 리퀘스트"], [/Issues/, "이슈"],
                                    [/Marketplace/, "마켓"], [/Explore/, "탐색"],
                                    [/Dashboard/, "대시보드"], [/Sign out/, "로그아웃"]]),
    번역("0300B", "header nav button", [[/Sign out/, "로그아웃"]]),
    번역("0300F", "details-menu > a", [[/New repository/, "저장소 만들기"],
                                        [/Import repository/, "저장소 가져오기"],
                                        [/New gist/, "기스트 만들기"],
                                        [/New organization/, "단체 만들기"],
                                        [/New project/, "새 프로젝트 만들기"]]),
    번역("0300G", "details-menu span", [[/This repository/, "현재 저장소"]]),
    번역("0300H", "details-menu > a", [[/New issue/, "새 이슈 쓰기"]]),

    번역("0301A", "details-menu a", [[/Signed in as/, "로그인 아이디:"]]),
    번역("0301B", "details-menu span", [[/Set status/, "상태 설정"]]),
    번역("0301C", "details-menu > a", [[/Your profile/, "프로필"],
                                        [/Your repositories/, "내 저장소"],
                                        [/Your projects/, "내 프로젝트"],
                                        [/Your stars/, "내 스타"],
                                        [/Your gists/, "내 기스트"],
                                        [/Help/, "도움말"],
                                        [/Settings/, "설정"]]),
    번역("0301H", "details-menu button", [[/Feature preview/, "새 기능 미리보기"], [/Sign out/, "로그아웃"]]),

    번역("0400A", ".dashboard-sidebar h2", [[/Repositories/, "저장소"]]),
    번역("0400B", ".dashboard-sidebar h2 a", [[/New/, "만들기"]]),
    번역("0400C", ".dashboard-sidebar input[type=text]", [[/Find a repository/, "저장소 검색"]], 바탕값변환),
    번역("0400D", ".dashboard-sidebar button", [[/Show more/, "더 보기"]]),
    번역("0400E", ".dashboard-sidebar h2", [[/Your teams/, "소속팀"]]),
    번역("0400F", ".dashboard-sidebar p.notice", [[/You don’t belong to any teams yet/, "소속된 팀이 없습니다"]]),
    번역("0400G", "#dashboard relative-time", 시간패턴),
    번역("0400H", "#dashboard a", [[/(\d+) repositories/, "$1 저장소"], [/(\d+) followers/, "$1 팔로워"], [/(\d+) issue(s?) need(s?) help/, "도와줄 이슈 $1건"]]),
    번역("0400I", "#dashboard button", [[/Follow/, "팔로우"], [/Star/, "스타"], [/Unstar/, "스타취소"]]),
    번역("0400J", "aside.team-left-column h2", [[/Explore repositories/, "추천 저장소"]]),
    번역("0400K", "aside.team-left-column a", [[/Explore more/, "더 살펴보기"]]),

    번역("0401A", ".dashboard-sidebar details-menu span", [[/Switch dashboard context/, "대시보드 전환"],
                                                           [/Manage organizations/, "단체 관리하기"],
                                                           [/Create organization/, "단체 만들기"]]),
    번역("0500A", ".footer li a", [[/Status/, "상태"], [/Help/, "도움말"], [/Pricing/, "가격정책"],
                                   [/Training/, "교육"], [/Blog/, "블로그"], [/About/, "안내"]]),
    번역("0600A", ".repohead h1 span", [[/Private/, "비공개"]]),
    번역("0600B", ".repohead .pagehead-actions span[data-menu-button]", [[/Watch/, "구독"], [/Unwatch/, "구독취소"]]),
    번역("0600C", ".repohead .pagehead-actions button", [[/Star/, "스타"], [/Unstar/, "스타취소"]]),
    번역("0600D", ".repohead .pagehead-actions .btn", [[/Fork/, "포크"]]),
    번역("0600E", ".repohead a.reponav-item span", [[/Code/, "코드"], [/Issues/, "이슈"], [/Pull requests/, "풀리퀘스트"]]),
    번역("0600H", ".repohead a.reponav-item", [[/Projects/, "프로젝트"], [/Wiki/, "위키"], [/Security/, "보안"],
                                               [/Insights/, "인사이트"], [/Settings/, "설정"]]),
    번역("0700A", ".repository-content summary em", [[/No description, website, or topics provided/, "설명, 웹사이트, 주제가 모두 없습니다."]]),
    번역("0700B", ".repository-content summary span", [[/Manage topics/, "주제 관리"]]),
    번역("0700C", ".repository-content span.btn", [[/Edit/, "편집"]]),
    번역("0700D", ".repository-content .numbers-summary a", [[/commit(s?)/, "커밋"]]),
    번역("0700E", ".repository-content .numbers-summary a", [[/branch(es)?/, "브랜치"]]),
    번역("0700F", ".repository-content .numbers-summary a", [[/release(s?)/, "릴리스"], [/contributor(s?)/, "컨트리뷰터"]]),
    번역("0700G", ".repository-content .file-navigation details i", [[/Branch/, "브랜치"]]),
    번역("0700H", ".repository-content .file-navigation a", [[/New pull request/, "풀 리퀘스트 작성"]]),
    번역("0700I", ".repository-content .file-navigation button", [[/Create new file/, "새 파일 작성"]]),
    번역("0700J", ".repository-content .file-navigation a", [[/Upload files/, "파일 업로드"], [/Find file/, "파일 찾기"]]),
    번역("0700L", ".repository-content .file-navigation summary.btn", [[/Clone or download/, "클론 또는 다운로드"]]),
    번역("0700M", ".repository-content .commit-tease span", [[/Latest commit/, "최근 커밋"]]),
    번역("0700M", ".repository-content .commit-tease relative-time", 시간패턴),
    번역("0700N", ".repository-content .files time-ago", 시간패턴),
    번역("0700O", ".repository-content .flash-messages .flash", [[/Add a README with an overview of your project/, "README 파일에 프로젝트 개요를 적어주세요"]]),
    번역("0700P", ".repository-content .flash-messages .flash a", [[/Add a README/, "README 추가"]]),

    번역("0701A", ".file-navigation span.select-menu-title", [[/Switch branches\/tags/, "브랜치나 태그로 전환"]]),
    번역("0701B", ".file-navigation tab-container input[type=text]", [[/Find or create a branch/, "브랜치 찾거나 만들기"]], 바탕값변환),
    번역("0701C", ".file-navigation tab-container button", [[/Branches/, "브랜치"], [/Tags/, "태그"]]),
    번역("0702A", ".file-navigation tab-container div", [[/Nothing to show/, "비어 있음"]]),

    번역("0703A", ".clone-options h4", [[/Clone with HTTPS/, "HTTPS로 클론"]]),
    번역("0703B", ".clone-options button", [[/Use SSH/, "SSH 사용"]]),
    번역("0703C", ".clone-options p", [[/Use Git or checkout with SVN using the web URL/, "Git이나 SVN으로 체크아웃할 때 쓰는 웹 URL"]]),
    번역("0703D", ".get-repo-modal-options a", [[/Open in Desktop/, "데스크탑으로 열기"], [/Download ZIP/, "ZIP으로 다운로드"]]),

];

function 번역하기() {
    const startedAt: number = new Date().getTime();
    번역목록.forEach((정보: 번역정보) => {
        정보.변환(정보.셀렉터, 정보.번역패턴들);
    });
    const elapsed: number = new Date().getTime() - startedAt;
    console.log(`번역시간: ${elapsed}ms`);
}

declare var chrome: any;

chrome.runtime.onMessage.addListener(function (message: any, sender: any, response: any) {
    // console.log("got message", message);
    if (message.action == "onCompleted") {
        번역하기();
    }
    response("done");
});

window.addEventListener('load', function () {
  번역하기();

  function 시간요소검사(): Boolean {
    const 시간요소 = document.querySelectorAll('[datetime]');
    const 정규식 = /[a-z]/i;

    for (let i = 0; i < 시간요소.length; i++) {
      if (
        정규식.test(시간요소[i].innerHTML)
      ) return true;
    }

    return false;
  }

  setInterval(() => {
    if (시간요소검사()) {
      console.log("날짜 데이터 변화감지, 다시 번역중...");
      번역하기();
    }
  }, 50);
});
