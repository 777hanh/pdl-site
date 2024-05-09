const NAME_PROJECT = 'PDL';

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
