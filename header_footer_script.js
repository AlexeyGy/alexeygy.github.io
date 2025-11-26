//--- function definitions ---//
function generateFooter() {
    document.addEventListener('DOMContentLoaded', function () {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            });
    });
}

function generateHeader() {
    document.addEventListener('DOMContentLoaded', function () {
        fetch('menu.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('nav-placeholder').innerHTML = data;
                const toggleBtn = document.getElementById('theme-toggle');

                const currentTheme = localStorage.getItem('theme');

                if (currentTheme) {
                    document.documentElement.setAttribute('data-theme', currentTheme);
                }

                toggleBtn.addEventListener('click', () => {
                    let theme = document.documentElement.getAttribute('data-theme');
                    if (theme === 'light') {
                        theme = 'dark';
                        document.documentElement.removeAttribute('data-theme');
                    } else {
                        theme = 'light';
                        document.documentElement.setAttribute('data-theme', 'light');
                    }
                    localStorage.setItem('theme', theme);
                });
            });
    });
}

//--- function usage ---// 
generateHeader();
generateFooter();