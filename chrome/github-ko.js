window.addEventListener("load", () => {
    const $ = document.querySelectorAll.bind(document);
    Array.from($("nav a")).forEach(e => {
        if (e.innerText.trim() == "Pull requests") {
            e.innerText = "풀 리퀘스트";
        } else if (e.innerText.trim() == "Issues") {
            e.innerText = "이슈";
        } else if (e.innerText.trim() == "Marketplace") {
            e.innerText = "장터";
        } else if (e.innerText.trim() == "Explore") {
            e.innerText = "탐색";
        }
    });

    Array.from($("details-menu a,button,span")).forEach(e => {
        if (e.innerText.trim() == "Your repositories") {
            e.innerText = "내 저장소";
        } else if (e.innerText.trim() == "Your profile") {
            e.innerText = "내 프로필";
        } else if (e.innerText.trim() == "Your projects") {
            e.innerText = "내 프로젝트";
        } else if (e.innerText.trim() == "Your stars") {
            e.innerText = "내 스타";
        } else if (e.innerText.trim() == "Your gists") {
            e.innerText = "내 기스트";
        } else if (e.innerText.trim() == "Help") {
            e.innerText = "도움말";
        } else if (e.innerText.trim() == "Settings") {
            e.innerText = "설정";
        } else if (e.innerText.trim() == "Sign out") {
            e.innerText = "로그아웃";
        } else if (e.innerText.trim() == "Set your status") {
            e.innerText = "내 상태 설정";
        }
    });

    Array.from($("div.footer a")).forEach(e => {
        if (e.innerText.trim() == "Terms") {
            e.innerText = "이용약관";
        } else if (e.innerText.trim() == "Privacy") {
            e.innerText = "개인정보보호";
        } else if (e.innerText.trim() == "Security") {
            e.innerText = "보안";
        } else if (e.innerText.trim() == "Status") {
            e.innerText = "깃헙상태";
        } else if (e.innerText.trim() == "Contact GitHub") {
            e.innerText = "깃헙에 연락";
        } else if (e.innerText.trim() == "Pricing") {
            e.innerText = "가격";
        } else if (e.innerText.trim() == "Training") {
            e.innerText = "교육";
        } else if (e.innerText.trim() == "Blog") {
            e.innerText = "블로그";
        } else if (e.innerText.trim() == "About") {
            e.innerText = "안내";
        }

    })

});