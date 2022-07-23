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
    번역("0400L", ".dashboard-feed", [[/introduce yourself/, "자기소개를 해보세요"]]),

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

// settings 일부변경중
    번역("1100A", 'nav[aria-label="Personal settings"] span', [[/Account settings/, "계정 설정"]]),
    번역("1100B", 'nav[aria-label="Personal settings"] a', [[/Profile/, "프로필"], [/Account$/, "계정"], [/Appearance/, "테마"], [/Account security/, "계정 보안"], [/Billing & plans/, "결제 및 플랜"],
                                                [/Security log/, "보안 로그"], [/Security & analysis/, "보안 분석"], [/Emails/, "이메일"],
                                                [/Notifications/, "알림"], [/Scheduled reminders/, "정기 재촉"], [/SSH and GPG keys/, "SSH와 GPG키"], [/Repositories/, "저장소"], [/Packages/, "패키지"],
                                                [/Organizations/, "단체"], [/Saved replies/, "저장된 댓글"], [/Applications/, "애플리케이션"]]),
    번역("1100C", 'nav[aria-label="Developer settings"] a', [[/Developer settings/, "개발자 설정"]]),
    번역("1100C", 'nav[aria-label="Moderation settings"] span', [[/Moderation settings/, "중재 설정"]]),
    번역("1100C", 'nav[aria-label="Moderation settings"] a', [[/Blocked users/, "차단된 사용자"], [/Interaction limits/, "임시 소통 제한"]]),
    번역("1100E", ".col-md-9.col-12 h2", [[/Public profile/, "공개 프로필"], [/Change username/, "계정명 변경"], [/Export account data/, "계정 데이터 내보내기"], [/Successor settings/, "후속 설정"], [/Theme preferences/, "선호 테마 선택하기"]]),
    번역("1100G", ".col-12.col-md-4 label", [[/Profile picture/, "프로필 사진"]]),
    번역("1100H", ".col-md-9.col-12 summary", [[/Change username/, "계정명 변경"]]),
    번역("1100H", ".col-md-9.col-12 h2", [[/Delete account/, "계정 삭제"]]),
    번역("1100I", ".col-md-9.col-12 p", [[/Looking to manage account security settings/, "계정 보안 설정을 관리하는 법을 찾고 계신가요?"], [/Export all repositories and profile metadata for/, "다음 계정에 있는 모든 저장소와 메타데이터를 내보냅니다 : "], [/Exports will be available for 7 days/, "내보내기는 7일간 유효합니다"]
    , [/Choose how GitHub looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes./, "GitHub의 테마를 선택해주세요. 테마 하나를 선택하거나 시스템과 동기화하여 낮/밤 테마를 자동 전환할 수 있습니다"], [/Once you delete your account, there is no going back. Please be certain/, "한 번 계정을 삭제하시면 돌이킬 수 없습니다. 신중히 결정하세요"]]),
    번역("1100J", ".col-md-9.col-12 h3", [[/Theme mode/, "테마 모드"]]),

    // 테마모드를 single theme로 설정한 경우
    번역("1100J", ".d-flex.flex-items-center.mt-2.mb-4 span", [[/GitHub will use your selected theme/, "GitHub는 선택하신 테마를 사용합니다"]]),
    번역("1100J", ".d-flex.gutter-condensed.flex-wrap span", [[/Default light/, "기본 밝은 테마"]]),
    번역("1100J", ".d-flex.gutter-condensed.flex-wrap span", [[/Default dark/, "기본 어두운 테마"]]),
    번역("1100J", ".d-flex.gutter-condensed.flex-wrap span", [[/Dark dimmed/, "어둡고 흐린 테마"]]),

    // 테마모드를 Sync with system으로 설정한 경우
    번역("1100K", ".col-md-9.col-12 span", [[/GitHub theme will match your system active settings/, "깃허브 테마를 당신의 시스템 상태에 맞춰 변경합니다"]]),
    번역("1100K", ".col-md-5.mr-0.mr-md-3.mb-3.mb-md-0 h4", [[/Day theme/, "밝은 테마"]]),
    번역("1100K", ".col-md-5 h4", [[/Night theme/, "어두운 테마"]]),
    번역("1100K", ".color-text-secondary.mb-3.f6", [[/This theme will be active when your system is set to “dark mode”/, "이 테마는 시스템이 '어두운 테마'로 설정되어있을 때 활성화됩니다"], [/This theme will be active when your system is set to “light mode”/, "이 테마는 시스템이 '밝은 테마'로 설정되어있을 때 활성화됩니다"]]),
    번역("1100K", ".js-setting-toggle h2", [[/Emoji skin tone preference/, "이모티콘 피부톤 선택"]]),
    번역("1100K", ".text-bold.mb-2", [[/Preferred default emoji skin tone/, "기본 이모티콘 피부색"]]),



    // Explorer 페이지 대부분 변경완료
    번역("1200A", ".container-lg.mx-auto.p-responsive a", [[/Explore/, "탐색"], [/Topics/, "주제"], [/Trending/, "트렌드"], [/Collections/, "컬렉션"], [/Events/, "이벤트"], [/GitHub Sponsors/, "깃허브 스폰서"], [/Get email updates/, "이메일 업데이트"]]),
    번역("1200B", ".border-top.px-3 a", [[/starred topics/, "스타 받은 토픽"]]),
    번역("1200C", ".border-top.p-3 a", [[/starred repository/, "스타 받은 저장소"]]),
    번역("1200D", ".Box-header.d-flex a", [[/Trending repositories/, "뜨는 저장소"], [/Trending developers/, "뜨는 개발자"]]),
    번역("1200E", ".col-md-8.col-lg-6.py-4 h1", [[/Here's what we found based on your interests/, "당신의 관심사를 기반으로 찾은 내용입니다"]]),
    번역("1200F", ".border.my-4 h2", [[/Based on repositories you’ve viewed/, "열람한 저장소 기반 추천입니다"],
                                      [/Based on topics you've starred/, "스타를 준 주제 기반 추천입니다"],
                                      [/Based on repositories you’ve starred/, "스타를 준 저장소 기반 추천입니다"],
                                      [/Based on people you follow/, "팔로우하는 사람 기반 추천입니다"]]),
    번역("1200G", ".border-top.p-3 a", [[/See more matching repositories/, "더 많은 추천 저장소 보기"]]),
    번역("1200H", ".button_to button", [[/Star/, "스타"]]),
    번역("1200I", ".Box-footer a", [[/See more trending repositories/, "뜨는 저장소 더 보기"], [/See more trending developers/, "뜨는 개발자 더 보기"]]),
    번역("1200J", ".col-md-8.col-lg-6.py-4 h2", [[/That's everything we found for you, for now/, "여기까지가 현재 당신을 위해 찾은 모든 것입니다."]]),
    번역("1200J", ".col-md-8.col-lg-6.py-4 p", [[/Come back soon to see what we find next,/, "우리가 다음에 무엇을 찾을 수 있는지 확인하기 위해 곧 다시 돌아오시거나,"]]),
    번역("1200J", ".col-md-8.col-lg-6.py-4 > span", [[/or/, ""]]),
    번역("1200J", ".col-md-8.col-lg-6.py-4 span a", [[/get email updates/, "이메일로 소식을 받아보세요"]]),

// My repositories 저장소 상단, 버튼, 등 수정
    번역("1300A", 'nav[aria-label="User profile"] a', [[/Overview/, "개요"], [/Repositories/, "저장소"], [/Projects/, "프로젝트"], [/Packages/, "패키지"]]),
    번역("1300B", ".js-profile-editable-area button", [[/Edit profile/, "프로필 수정하기"]]),
    번역("1300B", ".mb-3 a", [[/follower(s?)/, "팔로워"], [/following/, "팔로잉"]]),
    번역("1300C", ".mt-4 h2", [[/Popular repositories/, "인기 있는 저장소들"]]),
    번역("1300D", "form.width-full input[name=q]", [[/Find a repository/, "저장소 찾아보기"]], 바탕값변환),
    번역("1300D", 'form[aria-label="Repositories"] .d-flex.flex-wrap span', [[/^Type$/, "타입"], [/Language/, "언어"], [/Sort/, "정렬"]]),
    번역("1300D", 'form[aria-label="Repositories"] .SelectMenu-modal span', [[/Select type/, "타입 선택"], [/Select language/, "언어 선택"], [/Select order/, "정렬 기준"]]),
    번역("1300D", 'form[aria-label="Repositories"] .SelectMenu-list span', [[/All/, "모두"], [/Public/, "공개"], [/Private/, "비공개"], [/Sources/, "소스"], [/Forks/, "포크"], [/Archived/, "아카이브"], [/Mirrors/, "미러"], [/Last updated/, "최신 업데이트"], [/Name/, "이름"], [/Stars/, "스타"], [/^Script/, "스크립트"]]),
    번역("1300D", ".d-flex.flex-items-start a", [[/New/, "새 저장소"]]),
    번역("1300E", ".BtnGroup button", [[/Previous/, "이전"], [/Next/, "다음"]]), //Previous와 Next가 버튼과 링크로 서로 전환될 때를 대비
    번역("1300E", ".BtnGroup a", [[/Previous/, "이전"], [/Next/, "다음"]]),
    번역("1300F", "#repo-content-pjax-container > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div > div > h2 > a", [[/Contributors/, "기여자"]]),

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