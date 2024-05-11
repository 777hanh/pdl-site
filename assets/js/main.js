const NAME_PROJECT = 'PDL';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */

const loadComponent = (selector, path) => {
    const content = localStorage.getItem(NAME_PROJECT + '-' + path);

    if (content) {
        document.querySelector(selector).innerHTML = content;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== content) {
                document.querySelector(selector).innerHTML = html;
                localStorage.setItem(NAME_PROJECT + '-' + path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event('template-loaded'));
        })
        .catch(() => {
            console.error(
                'Could not load ' + `%c${selector}` + '%c component.',
                'color: red;',
                'color: inherit;',
            );
        });
};

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener('template-loaded', initJsToggle);

function initJsToggle() {
    $$('.js-toggle').forEach((button) => {
        const target = button.getAttribute('toggle-target');
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains('hide');

            requestAnimationFrame(() => {
                $(target).classList.toggle('hide', !isHidden);
                $(target).classList.toggle('show', isHidden);
            });
        };
        // Ẩn box khi click ra ngoài
        document.onclick = function (e) {
            // Nếu click vào phần tử không thuộc target
            if (!e.target.closest(target)) {
                // Kiểm tra xem target có đang hiển thị không
                const isHidden = $(target).classList.contains('hide');
                // Nếu đang hiển thị thì ẩn đi
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

/**
 * JS Drag
 *
 * Cách dùng:
 * <div class="js-drag slider">
 *      <div class="item"></div>
 *      <div class="item"></div>
 * </div>
 */
function initDragJs() {
    let mouseDown = false;
    let startX, scrollLeft;

    $$('.js-drag').forEach((slider) => {
        const startDragging = (e) => {
            mouseDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const stopDragging = (e) => {
            mouseDown = false;
        };

        const move = (e) => {
            e.preventDefault();
            if (!mouseDown) {
                return;
            }
            const x = e.pageX - slider.offsetLeft;
            const scroll = x - startX;
            slider.scrollLeft = scrollLeft - scroll;
        };

        // Add the event listeners
        slider.addEventListener('mousemove', move, false);
        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);
    });
}
window.addEventListener('template-loaded', initDragJs);

// Slider
function initSlider() {
    let isMove = false;

    // Lấy danh sách các item trong carousel
    const carouselItems = document.querySelectorAll('.testimonials__slide');
    const paginationItems = document.querySelectorAll('.pagination__item');
    const arrCarouselItems = Array.from(carouselItems);

    // Xác định hành động khi nhấn nút next
    document.querySelector('.testimonials__slide-btn-next').addEventListener('click', () => {
        if (isMove) return;
        isMove = true;

        // Tìm item hiện tại có class 'active'
        let currentItem = document.querySelector('.testimonials__slide.active');
        if (!currentItem) {
            currentItem = carouselItems[0];
            currentItem.classList.add('active');
        }
        let currentActiveItemIndex = arrCarouselItems.indexOf(currentItem);

        // Tìm item kế tiếp của item hiện tại
        let nextItem = currentItem.nextElementSibling;
        if (!nextItem) nextItem = carouselItems[0];
        let nextActiveItemIndex = arrCarouselItems.indexOf(nextItem);

        // Thêm class 'carousel-item-start' vào current item và next item
        nextItem.classList.add('testimonials__slide-next');
        reflow(currentItem);
        currentItem.classList.add('testimonials__slide-start');
        nextItem.classList.add('testimonials__slide-start');

        nextItem.addEventListener(
            'transitionend',
            () => {
                nextItem.classList.remove('testimonials__slide-start', 'testimonials__slide-next');
                nextItem.classList.add('active');
                paginationItems[nextActiveItemIndex].classList.add('active');

                currentItem.classList.remove('active', 'testimonials__slide-start');
                paginationItems[currentActiveItemIndex].classList.remove('active');
            },
            { once: true },
        );

        isMove = false;
    });

    const reflow = (element) => {
        element.offsetHeight;
    };

    document.querySelector('.testimonials__slide-btn-prev').addEventListener('click', () => {
        if (isMove) return;

        isMove = true;
        // Tìm item hiện tại có class 'active'
        let currentItem = document.querySelector('.testimonials__slide.active');
        if (!currentItem) {
            currentItem = carouselItems[0];
            currentItem.classList.add('active');
        }
        let currentActiveItemIndex = arrCarouselItems.indexOf(currentItem);

        // Tìm item kế tiếp của item hiện tại
        let prevItem = currentItem.previousElementSibling;
        if (!prevItem) prevItem = carouselItems[carouselItems.length - 1];
        let prevActiveItemIndex = arrCarouselItems.indexOf(prevItem);

        // Thêm class 'carousel-item-prev' vào current item và prev item
        prevItem.classList.add('testimonials__slide-prev');
        reflow(currentItem);
        currentItem.classList.add('testimonials__slide-end');
        prevItem.classList.add('testimonials__slide-end');

        prevItem.addEventListener(
            'transitionend',
            () => {
                prevItem.classList.remove('testimonials__slide-end', 'testimonials__slide-prev');
                prevItem.classList.add('active');
                paginationItems[prevActiveItemIndex].classList.add('active');

                currentItem.classList.remove('active', 'testimonials__slide-end');
                paginationItems[currentActiveItemIndex].classList.remove('active');
            },
            { once: true },
        );

        isMove = false;
    });

    // loop
    let timer = '';
    loopCarousel();

    function loopCarousel() {
        if (isMove) return;
        isMove = true;
        // clearInterval(timer);
        timer = setInterval(() => {
            document.querySelector('.testimonials__slide-btn-next').click();
        }, 5000);
        isMove = false;
    }
}

window.addEventListener('template-loaded', initSlider);

// faq

function initFaq() {
    const faqButtons = $$('.faq__btn');

    faqButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const parent = button.closest('.faq__item');
            const content = parent.querySelector('.faq__a');
            const isHidden = content.classList.contains('hide');

            requestAnimationFrame(() => {
                content.classList.toggle('hide', !isHidden);
                content.classList.toggle('show', isHidden);
            });
        });
    });
}
window.addEventListener('template-loaded', initFaq);
