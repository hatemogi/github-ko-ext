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
    [/(a|1) minute ago/, "1분 전"],
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

function 변환함수<T>(선택함수: (es: Element[]) => T[],
                     속성변환: (노드: T, 번역패턴: 번역패턴) => void): 변환 {
    return (셀렉터, 패턴들) => {
        const 노드 = Array.from(document.querySelectorAll(셀렉터));
        선택함수(노드).forEach(해당노드 => {
            패턴들.forEach((번역패턴) => {
                속성변환(해당노드, 번역패턴);
            });
        });
    }
}

function 속성변환<T>(읽기: (n: T) => string, 쓰기: (n: T, s: string) => void) {
    return (노드: T, [패턴, 번역]: 번역패턴) => {
        const 원문 = 읽기(노드);
        if (원문 && 패턴.test(원문)) {
            쓰기(노드, 원문.replace(패턴, 번역));
        }
    };
}

const 텍스트변환: 변환 = 변환함수<Text>(
    // 하위 노드 중 텍스트 노드만 처리
    (es) => es.flatMap(e => Array.from(e.childNodes).filter(c => c.parentNode == e && c.nodeType == 3))
              .map(t => t as Text),
    속성변환(n => n.data, (n, s) => n.data = s));

const 인풋값변환: 변환 = 변환함수<HTMLInputElement>(
    // INPUT 노드만 처리
    (es) => es.filter(e => e.tagName == 'INPUT') as HTMLInputElement[],
    속성변환(i => i.value, (i, s) => i.value = s));

const 바탕값변환: 변환 = 변환함수<HTMLInputElement>(
    // INPUT 노드만 처리
    (es) => es.filter(e => e.tagName == 'INPUT') as HTMLInputElement[],
    속성변환(i => i.placeholder, (i, s) => i.placeholder = s));

const 비활성변환: 변환 = 변환함수(
    // INPUT 노드만 처리
    (es) => es.filter(e => e.tagName == 'INPUT') as HTMLInputElement[],
    (노드, [패턴, 번역]) => {
        if (노드.dataset && 노드.dataset.disableWith) {
            let 원문 = 노드.dataset.disableWith;
            if (패턴.test(원문)) {
                노드.dataset.disableWith = 원문.replace(패턴, 번역);
            }
        }
    });


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
    번역("0000E", ".auth-form-body input[type=submit]", [[/Sign in/, "로그인"]], 인풋값변환),
    번역("0000F", ".auth-form p", [[/New to GitHub\?/, "GitHub에 처음이신가요?"]]),
    번역("0000G", ".login-callout a", [[/Create an account/, "아이디 만들기"]]),
    번역("0000H", ".footer li a", [[/Terms/, "이용약관"], [/Privacy/, "개인정보보호정책"], [/Security/, "보안"], [/Contact GitHub/, "GitHub에 연락"]]),
    번역("0000I", ".auth-form .flash .container", [[/Incorrect username or password/, "아이디가 없거나 비밀번호가 틀립니다"]]),
    번역("0000J", ".auth-form-body input[type=submit]", [[/Signing in/, "로그인 중"]], 비활성변환),

    번역("0100A", "#forgot_password_form h1", [[/Reset your password/, "비밀번호 초기화"]]),
    번역("0100B", "#forgot_password_form label[for=email_field]", [[/Enter your email address .+\./, "이메일 주소를 입력하시면, 비밀번호를 초기화할 수 있는 링크를 보내드립니다."]]),
    번역("0100C", "#forgot_password_form input[name=email]", [[/Enter your email address/, "이메일을 여기 적으세요"]], 바탕값변환),
    번역("0100D", "#forgot_password_form input[type=submit]", [[/Send password reset email/, "비밀번호 초기화 이메일 보내기"]], 인풋값변환),

    번역("0300A", "form.js-site-search-form input[name=q]", [[/Search or jump to/, "검색 또는 바로가기"]], 바탕값변환),
    번역("0300B", "header nav a", [[/Pull requests/, "풀리퀘스트"], [/Issues/, "이슈"],
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
                                        [/Your codespaces/, "내 코드스페이스"],
                                        [/Your organizations/, "내 단체"],
                                        [/Your projects/, "내 프로젝트"],
                                        [/Your stars/, "내 스타"],
                                        [/Your gists/, "내 기스트"],
                                        [/Help/, "도움말"],
                                        [/Settings/, "설정"]]),
    번역("0301H", "details-menu button", [[/Feature preview/, "새 기능 미리보기"], [/Sign out/, "로그아웃"]]),
    번역("0301I", "details-menu a.dropdown-item", [[/Upgrade/, "업그레이드"]]),

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
    번역("0400L", ".dashboard-feed", [[/introduece yourself/, "자기소개를 해보세요"]]),
    번역("0400M", ".dashboard-feed", [[/The easiest way to introduce yourself on Github is by creating a README in a repository about you! You can start here/, "깃허브에서 여러분 자신을 소개하는 가장 쉬운 방법은 저장소에서 당신에 대한 리드미 파일을 만드는 것입니다! 이렇게 시작해보세요 :"]]),
    번역("0400N", ".dashboard-feed", [[/Discover interesting projects and people to populate your personal news feed/, "흥미로운 프로젝트들과 당신의 개인 뉴스피드를 채울 새로운 사람들을 찾아보세요"]]),

    번역("0401A", ".dashboard-sidebar details-menu span", [[/Switch dashboard context/, "대시보드 전환"],
                                                           [/Manage organizations/, "단체 관리하기"],
                                                           [/Create organization/, "단체 만들기"]]),
    번역("0500A", ".footer li a", [[/Status/, "상태"], [/Help/, "도움말"], [/Pricing/, "가격정책"],
                                   [/Training/, "교육"], [/Blog/, "블로그"], [/About/, "안내"]]),
    번역("0600A", "h1 span.Label", [[/Private/, "비공개"]]),
    번역("0600B", ".pagehead-actions span[data-menu-button]", [[/Watch/, "구독"], [/Unwatch/, "구독 취소"]]),
    번역("0600C", ".pagehead-actions .btn", [[/Star/, "스타"], [/Unstar/, "스타 취소"]]),
    번역("0600D", ".pagehead-actions .btn", [[/Fork/, "포크"], [/Sponsor/, "후원"]]),
    번역("0600E", ".UnderlineNav-body .UnderlineNav-item span[data-content]", [[/Code/, "코드"], [/Issues/, "이슈"], [/Pull requests/, "풀 리퀘스트"]]),
    번역("0600H", ".UnderlineNav-body .UnderlineNav-item span[data-content]", [[/Projects/, "프로젝트"], [/Wiki/, "위키"], [/Security/, "보안"],
                                               [/Insights/, "인사이트"], [/Settings/, "설정"], [/Actions/, "액션"]]),

    번역("0601A", ".pagehead-actions .select-menu-modal span", [[/Notifications/, "알림 설정"], [/Not watching/, "구독 해지"],
        [/Releases only/, "릴리스만 알림"], [/^\s*Watching\s*$/, "구독"], [/Ignoring/, "알리지 않음"]]),
    번역("0601C", ".pagehead-actions .select-menu-modal span.description",
        [[/Be notified only when participating or @mentioned/, "참여 중이거나 @멘션됐을 때만 알리기"],
         [/Be notified of new releases, and when participating or @mentioned/, "새 릴리스를 알리고, 참여 중 또는 @멘션됐을 때도 알림"],
         [/Be notified of all conversations/, "모두 알림"],
         [/Never be notified/, "아무것도 알리지 않기"]]),

    번역("0700A", ".repository-content summary em", [[/No description, website, or topics provided/, "설명, 웹사이트, 주제가 모두 없습니다."]]),
    번역("0700B", ".repository-content summary span", [[/Manage topics/, "주제 관리"]]),
    번역("0700C", ".repository-content span.btn", [[/Edit/, "편집"]]),
    번역("0700D", ".repository-content .numbers-summary a", [[/commit(s?)/, "커밋"]]),
    번역("0700E", ".file-navigation a[href] span", [[/branch(es)?/, "브랜치"], [/tag(s)?/, "태그"]]),
    번역("0700F", ".repository-content .numbers-summary a", [[/release(s?)/, "릴리스"], [/contributor(s?)/, "컨트리뷰터"],
                                                             [/environment(s?)/, "환경"], [/View license/, "라이선스 보기"],
                                                             [/package(s?)/, "패키지"]]),
    번역("0700G", ".repository-content .file-navigation details i", [[/Branch/, "브랜치"]]),
    번역("0700H", ".repository-content .file-navigation a", [[/New pull request/, "새 풀 리퀘스트 작성"]]),
    번역("0700I", ".repository-content .file-navigation button", [[/Create new file/, "새 파일 작성"]]),
    번역("0700J", ".repository-content .file-navigation a", [[/Upload files/, "파일 업로드"], [/Find file/, "파일 찾기"]]),
    번역("0700L", ".repository-content .file-navigation summary.btn", [[/Clone or download/, "클론 또는 다운로드"]]),
    번역("0700M", ".repository-content .commit-tease span", [[/Latest commit/, "최근 커밋"]]),
    번역("0700M", ".repository-content .commit-tease relative-time", 시간패턴),
    번역("0700N", ".repository-content .Details time-ago", 시간패턴),
    번역("0700O", ".repository-content .flash-messages .flash", [[/Add a README with an overview of your project/, "README 파일에 프로젝트 개요를 적어주세요"]]),
    번역("0700P", ".repository-content .flash-messages .flash a", [[/Add a README/, "README 추가"]]),

    번역("0701A", ".SelectMenu-modal span.SelectMenu-title", [[/Switch branches\/tags/, "브랜치나 태그로 전환"]]),
    번역("0701B", ".file-navigation tab-container input[type=text]", [[/Find or create a branch/, "브랜치 찾거나 만들기"]], 바탕값변환),
    번역("0701C", ".file-navigation tab-container button", [[/Branches/, "브랜치"], [/Tags/, "태그"]]),
    번역("0702A", ".file-navigation tab-container div", [[/Nothing to show/, "비어 있음"]]),

    번역("0703A", ".clone-options h4", [[/Clone with HTTPS/, "HTTPS로 클론"]]),
    번역("0703B", ".clone-options button", [[/Use SSH/, "SSH 사용"]]),
    번역("0703C", ".clone-options p", [[/Use Git or checkout with SVN using the web URL/, "Git이나 SVN으로 체크아웃할 때 쓰는 웹 URL"]]),
    번역("0703D", ".get-repo-modal-options a", [[/Open in Desktop/, "데스크탑으로 열기"], [/Download ZIP/, "ZIP으로 다운로드"]]),

    번역("0800A", ".repository-content .btn", [[/^(\s*)Filters(\s*)$/, "$1필터$2"]]),
    번역("0800B", ".repository-content a", [[/Labels/, "라벨"], [/Milestones/, "마일스톤"]]),
    번역("0800C", "a[href*='issues/new'] span", [[/New issue/, "새 이슈"]]),

    번역("0802A", ".repository-content .states a", [[/Open/, "열림"], [/Closed/, "닫힘"]]),
    번역("0802B", ".repository-content summary", [[/Author/, "작성자"], [/Label(s)?/, "라벨"], [/Projects/, "프로젝트"],
                                                  [/Milestones/, "마일스톤"], [/Reviews/, "리뷰"], [/Assignee/, "담당자"], [/Sort/, "정렬"]]),
    번역("0802C", ".repository-content .js-issue-row span.opened-by", [[/opened/, "열림"], [/^(\s*)by(\s*)$/, "$1작성자: $2"],
                                                                       [/was closed/, "닫음"]]),
    번역("0802D", ".repository-content .js-issue-row relative-time", 시간패턴),
    번역("0802E", ".repository-content a.issues-reset-query", [[/Clear current search query, filters, and sorts/, "현재 검색, 필터, 정렬 조건을 제거"]]),

    번역("0900A", ".repository-content #js-issues-search", [[/Search all labels/, "모든 라벨 검색"]], 바탕값변환),
    번역("0900B", ".repository-content button", [[/New label/, "새 라벨"]]),
    번역("0900C", ".repository-content span.js-labels-label", [[/^(\s*)labels(\s*)$/, "$1라벨$2"]]),
    번역("0900D", ".repository-content .js-label-list a.js-label-link span", [
        [/^(\s*)bug(\s*)$/, "$1버그$2"], [/^(\s*)duplicate(\s*)$/, "$1중복$2"], [/^(\s*)enhancement(\s*)$/, "$1개선$2"],
        [/^(\s*)good first issue(\s*)$/, "$1좋은 첫 이슈$2"], [/^(\s*)help wanted(\s*)$/, "$1도움필요$2"], [/^(\s*)invalid(\s*)$/, "$1부적절$2"],
        [/^(\s*)question(\s*)$/, "$1질문$2"], [/^(\s*)wontfix(\s*)$/, "$1진행안함$2"]]),
    번역("0900E", ".repository-content .js-label-list span", [
        [/Something isn't working/, "잘 안 되는 게 있음"],
        [/This issue or pull request already exists/, "해당 이슈나 풀 리퀘스트가 이미 있음"],
        [/New feature or request/, "새 기능 또는 요청"],
        [/Good for newcomers/, "새로 온 사람에게 좋음"],
        [/Extra attention is needed/, "각별한 주의 필요"],
        [/This doesn't seem right/, "이건 적절치 못함"],
        [/Further information is requested/, "추가 정보 필요"],
        [/This will not be worked on/, "이건 진행하지 않음"]]),
    번역("0900F", ".repository-content .js-label-list button", [
        [/^(\s*)Edit(\s*)$/, "$1편집$2"], [/^(\s*)Delete(\s*)$/, "$1삭제$2"]]),
    번역("0901A", ".repository-content details-menu .select-menu-title", [[/Sort/, "정렬"]]),
    번역("0901B", ".repository-content details-menu .select-menu-item-text", [
        [/Alphabetically/, "알파벳순"],
        [/Reverse alphabetically/, "알파벳순 거꾸로"],
        [/Most issues/, "이슈 많은 순서로"],
        [/Fewest issues/, "이슈 적은 순서로"]]),
    번역("1000A", ".repository-content a.btn-primary", [
        [/New milestone/, "새 마일스톤"], [/Create a Milestone/, "마일스톤 만들기"]]),
    번역("1000B", ".repository-content h3", [[/You haven’t created any Milestones/, "마일스톤을 아직 만들지 않으셨네요"]]),
    번역("1000C", ".repository-content p", [
        [/Use Milestones to create collections of Issues and Pull Requests for a particular release or project/,
        "마일스톤으로 특정 프로젝트나 릴리스를 위한 이슈나 풀 리퀘스트 묶어서 관리하세요"]]),
    번역("1000D", ".repository-content details-menu .select-menu-item-text", [
        [/Recently updated/, "최근 업데이트순"],
        [/Furthest due date/, "마감일 먼 순서"],
        [/Closest due date/, "마감일 가까운 순서"],
        [/Least complete/, "덜 끝난 순서"],
        [/Most complete/, "많이 끝난 순서"],
        [/Least issues/, "이슈 적은 순서로"]]),
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
        setTimeout(번역하기, 0);
    }
    response("done");
});

window.addEventListener('load', 번역하기);