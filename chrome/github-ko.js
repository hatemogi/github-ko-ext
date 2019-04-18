const 시간번역 = [
    [/([\d+]) months ago/, "$1달 전"],
    [/([\d+]) years ago/, "$1년 전"],
    [/an year ago/, "1년 전"],
    [/([\d+]) days ago/, "$1일 전"],
    [/a day ago/, "하루 전"],
    [/([\d+]) hours ago/, "$1시간 전"],
    [/an hour ago/, "1시간 전"],
    [/([\d+]) minutes ago/, "$1분 전"],
    [/a minute ago/, "1분 전"],
    [/just now/, "방금"]
];

const patterns = [
    {base: "nav a", replaces: [
        [/Repositories/, "저장소"],
        [/Pull requests/, "풀 리퀘스트"],
        [/Issues/, "이슈"],
        [/Marketplace/, "장터"],
        [/Explore/, "탐색"],
        [/Overview/, "개요"],
        [/Projects/, "프로젝트"],
        [/Stars/, "스타"],
        [/Followers/, "팔로워"],
        [/Following/, "팔로잉"],
        [/People/, "멤버"]
    ]},
    {base: "details-menu a,button,span", replaces: [
        [/Your repositories/, "내 저장소"],
        [/Your profile/, "내 프로필"],
        [/Your GitHub profile/, "내 깃헙 프로필"],
        [/Your projects/, "내 프로젝트"],
        [/Your stars/, "내 스타"],
        [/Your gists/, "내 기스트"],
        [/Starred gists/, "스타 기스트"],
        [/Help/, "도움말"],
        [/Settings/, "설정"],
        [/Sign out/, "로그아웃"],
        [/Set your status/, "내 상태 설정"],
        [/New repository/, "저장소 만들기"],
        [/Import repository/, "저장소 가져오기"],
        [/New gist/, "기스트 만들기"],
        [/New organization/, "단체 만들기"],
        [/New project/, "프로젝트 만들기"]
    ]},
    {base: "div.footer a", replaces: [
        [/Terms/, "이용약관"],
        [/Privacy/, "개인정보보호"],
        [/Security/, "보안"],
        [/Status/, "깃헙상태"],
        [/Contact GitHub/, "깃헙에 연락"],
        [/Pricing/, "가격"],
        [/Training/, "교육"],
        [/Blog/, "블로그"],
        [/Shop/, "상점"],
        [/Help/, "도움말"],
        [/About/, "안내"]
    ]},
    {base: ".application-main h2", replaces: [
        [/Popular repositories/, "인기 저장소"],
        [/Repositories/, "저장소"]
    ]},
    {base: "div.js-repos-container button", replaces: [
        [/Show more/, "더보기"]
    ]},
    {base: "#choose-pinned-repositories summary", replaces: [
        [/Customize your pins/, "직접 고르기"]
    ]},
    {base: "nav.reponav span,a", replaces: [
        [/Code/, "코드"],
        [/Issues/, "이슈"],
        [/Pull requests/, "풀 리퀘스트"],
        [/Wiki/, "위키"],
        [/Insights/, "통계"],
        [/Settings/, "설정"]
    ]},
    {base: "ul.pagehead-actions span,button,summary", replaces: [
        [/Watch/, "구독"],
        [/Unwatch/, "구독취소"],
        [/Star/, "스타"],
        [/Unstar/, "스타취소"],
        [/Fork/, "포크"]
    ]},
    {base: "summary i", replaces: [
        [/Branch/, "브랜치"]
    ]},
    {base: 'form.js-site-search-form div', replaces: [
        [/Jump to/, "이동"]
    ]},
    {base: '.file-navigation,.repository-content a,button,summary,clipboard-copy', replaces: [
        [/New pull request/, "풀 리퀘스트 작성"],
        [/Create new file/, "새 파일 만들기"],
        [/Upload files/, "파일 업로드"],
        [/Find file/i, "파일 검색"],
        [/Copy path/i, "경로 복사"],
        [/Blame/, "블레임"],
        [/Raw/, "원본"],
        [/History/, "이력"],
        [/Clone or download/, "클론 또는 다운로드"]
    ]},
    {base: 'ul.numbers-summary li a', replaces: [
        [/commit(s)?/, "커밋"],
        [/branch(es)?/, "브랜치"],
        [/release(s)?/, "릴리스"],
        [/environment(s)?/, "배포환경"],
        [/contributor(s)?/, "컨트리뷰터"],
        [/View license/, "라이선스 보기"]
    ]},
    {base: 'table.files time-ago', replaces: 시간번역},
    {base: '.h-card h2', replaces: [
        [/Organizations/, "단체"]
    ]},
    {base: '.dashboard relative-time', replaces: 시간번역},
    {base: 'span.select-menu-title', replaces: [
        [/Switch branches\/tags/, "브랜치나 태그 전환"]
    ]},
    {base: 'li.select-menu-tab button', replaces: [
        [/Branches/, "브랜치"],
        [/Tags/, "태그"]
    ]}
];

function 번역하기() {
    const q = document.querySelectorAll.bind(document);
    patterns.forEach(({ base, replaces }) => {
        Array.from(q(base)).forEach(n => {
            Array.from(n.childNodes).forEach(c => {
                replaces.forEach(([패턴, 번역]) => {
                    if (c.nodeType == 3 && 패턴.test(c.data)) {
                        c.data = c.data.replace(패턴, 번역);
                    }
                });
            });
        });
    });
    const 검색 = q('input[data-hotkey="s,/"]');
    검색 && 검색[0] && (검색[0].placeholder = "검색 또는 찾아가기");
}

window.addEventListener('load', 번역하기);

chrome.runtime.onMessage.addListener(function(message, sender, response) {
    console.log("got message", message);
    번역하기();
    response("done");
});