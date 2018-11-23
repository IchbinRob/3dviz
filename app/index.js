import './index.css';

import App from './scripts/App';

document.getElementById('play').addEventListener('click', () => {
    window.app = new App(document.getElementById('quality').options[document.getElementById('quality').selectedIndex].value);
    document.getElementById('home').style.display = "none"
})

