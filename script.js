const EVENT_COPY = {
  notice: "댓글 이벤트에 참여하시면 50P를 드립니다. (하루 1번 참여 가능)",
  submitMessage: "미리보기용 프로토타입입니다. 댓글은 저장되지 않으며 포인트도 지급되지 않습니다."
};

const heroSlides = [...document.querySelectorAll("[data-hero-slide]")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeHeroSlide = 0;
let heroSlideTimer;

const showHeroSlide = (index) => {
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  activeHeroSlide = index;
};

const stopHeroSlideshow = () => {
  window.clearTimeout(heroSlideTimer);
};

const queueNextHeroSlide = (delay = 5000) => {
  stopHeroSlideshow();
  heroSlideTimer = window.setTimeout(() => {
    showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
    queueNextHeroSlide(6250);
  }, delay);
};

const updateHeroSlideshow = () => {
  stopHeroSlideshow();
  if (heroSlides.length < 2 || reducedMotionQuery.matches) {
    showHeroSlide(0);
    return;
  }
  queueNextHeroSlide();
};

updateHeroSlideshow();
reducedMotionQuery.addEventListener?.("change", updateHeroSlideshow);

const notice = document.querySelector("[data-event-notice]");
if (notice) {
  notice.textContent = EVENT_COPY.notice;
}

const commentForm = document.querySelector("#comment-form");
const commentStatus = document.querySelector("#comment-status");

if (commentForm && commentStatus) {
  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    commentStatus.textContent = EVENT_COPY.submitMessage;
  });
}

const commentItems = [...document.querySelectorAll("[data-comment-item]")];
const commentPageButtons = [...document.querySelectorAll("[data-comment-page]")];
const commentPreviousButton = document.querySelector("[data-comment-prev]");
const commentNextButton = document.querySelector("[data-comment-next]");
const commentsPerPage = 5;
const commentPageCount = Math.ceil(commentItems.length / commentsPerPage);
let activeCommentPage = 1;

const showCommentPage = (page) => {
  activeCommentPage = Math.min(Math.max(page, 1), commentPageCount || 1);
  const firstVisibleComment = (activeCommentPage - 1) * commentsPerPage;
  const lastVisibleComment = firstVisibleComment + commentsPerPage;

  commentItems.forEach((item, index) => {
    item.hidden = index < firstVisibleComment || index >= lastVisibleComment;
  });

  commentPageButtons.forEach((button) => {
    const isCurrentPage = Number(button.dataset.commentPage) === activeCommentPage;
    if (isCurrentPage) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (commentPreviousButton) {
    commentPreviousButton.disabled = activeCommentPage === 1;
  }
  if (commentNextButton) {
    commentNextButton.disabled = activeCommentPage === commentPageCount;
  }
};

if (commentItems.length) {
  commentPageButtons.forEach((button) => {
    button.addEventListener("click", () => showCommentPage(Number(button.dataset.commentPage)));
  });
  commentPreviousButton?.addEventListener("click", () => showCommentPage(activeCommentPage - 1));
  commentNextButton?.addEventListener("click", () => showCommentPage(activeCommentPage + 1));
  showCommentPage(1);
}
