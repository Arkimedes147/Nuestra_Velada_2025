document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const rolSelect = document.getElementById('rol');
    const camposLuchador = document.getElementById('camposLuchador');

    rolSelect.addEventListener('change', function() {
        if (this.value === 'luchador') {
            camposLuchador.style.display = 'block';
            document.getElementById('peso').required = true;
            document.getElementById('estatura').required = true;
            document.getElementById('estiloLucha').required = true;
        } else {
            camposLuchador.style.display = 'none';
            document.getElementById('peso').required = false;
            document.getElementById('estatura').required = false;
            document.getElementById('estiloLucha').required = false;
            // Clear values when switching away from luchador
            document.getElementById('peso').value = '';
            document.getElementById('estatura').value = '';
            document.getElementById('estiloLucha').value = '';
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Calcular edad
        const fechaNacimiento = new Date(data.fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        data.edad = edad;

        // Convertir tipos de datos para campos numéricos
        if (data.rol === 'luchador') {
            data.peso = parseFloat(data.peso);
            data.estatura = parseInt(data.estatura);
        }

        try {
            const response = await fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = '/confirmacion.html';
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert('Error al procesar el registro: ' + error.message);
            console.error('Error:', error);
        }
    });
});