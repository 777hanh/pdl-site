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
