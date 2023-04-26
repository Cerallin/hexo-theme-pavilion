(function () {
    const menu_button = document.getElementById('menu-button');
    const menu = document.getElementById('menu-list');

    menu_button.onclick = function () {
        if (menu.hasAttribute('data-toggle'))
            menu.removeAttribute('data-toggle')
        else
            menu.setAttribute('data-toggle', true)
    }
})();
