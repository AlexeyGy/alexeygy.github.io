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
            });
    });
}

//--- function usage ---// 
generateHeader();
generateFooter();