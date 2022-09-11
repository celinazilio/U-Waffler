// a_registro
function llamado() {
    const name = document.getElementById('inputNombre').value;
    sessionStorage.setItem('nombreUsuario', name);
}

// span, secciones
window.onload = function () {
    document.getElementById('bienvUsuario').innerText = ", " + sessionStorage.getItem('nombreUsuario') + " ";
};
