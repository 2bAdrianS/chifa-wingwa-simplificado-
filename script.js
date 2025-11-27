// --- NAVEGACIÓN SPA ---
// Función para navegar entre secciones
function navigateTo(section) {
    // Ocultar la sección de inicio agregando la clase 'd-none'
    document.getElementById('section-home').classList.add('d-none');
    // Ocultar la sección de CRUD agregando la clase 'd-none'
    document.getElementById('section-crud').classList.add('d-none');

    // Remover la clase 'active' del enlace de inicio
    document.getElementById('nav-home').classList.remove('active');
    // Remover la clase 'active' del enlace de CRUD
    document.getElementById('nav-crud').classList.remove('active');

    // Mostrar la sección seleccionada removiendo la clase 'd-none'
    document.getElementById(`section-${section}`).classList.remove('d-none');
    // Activar el enlace seleccionado agregando la clase 'active'
    document.getElementById(`nav-${section}`).classList.add('active');
}

// --- LÓGICA CRUD ---
// Array inicial de insumos con datos de prueba
let insumos = [
    // Objeto insumo 1: Arroz
    { id: 1, nombre: 'Arroz', categoria: 'Granos', stock: 50, unidad: 'kg' },
    // Objeto insumo 2: Pollo
    { id: 2, nombre: 'Pollo', categoria: 'Carnes', stock: 20, unidad: 'kg' },
    // Objeto insumo 3: Sillao
    { id: 3, nombre: 'Sillao', categoria: 'Salsas', stock: 10, unidad: 'lt' },
    // Objeto insumo 4: Huevos
    { id: 4, nombre: 'Huevos', categoria: 'Otros', stock: 100, unidad: 'und' },
    // Objeto insumo 5: Aceite
    { id: 5, nombre: 'Aceite', categoria: 'Líquidos', stock: 5, unidad: 'lt' }
];

// Variable para controlar el próximo ID a asignar
let nextId = 6;
// Bandera para saber si estamos en modo edición
let isEditing = false;

// Evento que se dispara cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar la tabla inicial con los insumos
    renderTable(insumos);
});

// Función para renderizar la tabla de insumos
function renderTable(data) {
    // Obtener referencia al cuerpo de la tabla
    const tbody = document.getElementById('insumosTableBody');
    // Limpiar el contenido actual de la tabla
    tbody.innerHTML = '';

    // Verificar si no hay datos
    if (data.length === 0) {
        // Mostrar mensaje de que no hay insumos
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3">No se encontraron insumos</td></tr>';
        // Salir de la función
        return;
    }

    // Iterar sobre cada insumo en los datos
    data.forEach(item => {
        // Crear la fila HTML para el insumo actual
        const row = `
            <tr>
                <!-- Columna ID -->
                <td>#${item.id}</td>
                <!-- Columna Nombre en negrita -->
                <td class="fw-bold">${item.nombre}</td>
                <!-- Columna Categoría con estilo de badge -->
                <td><span class="badge bg-light text-dark border">${item.categoria}</span></td>
                <!-- Columna Stock -->
                <td>${item.stock}</td>
                <!-- Columna Unidad -->
                <td>${item.unidad}</td>
                <!-- Columna Acciones (Editar/Eliminar) -->
                <td class="text-end no-print">
                    <!-- Botón Editar -->
                    <button class="btn btn-sm btn-outline-primary action-btn" onclick="editInsumo(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <!-- Botón Eliminar -->
                    <button class="btn btn-sm btn-outline-danger action-btn" onclick="deleteInsumo(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        // Agregar la fila al cuerpo de la tabla
        tbody.innerHTML += row;
    });
}

// Función para manejar el envío del formulario (Crear/Editar)
function handleFormSubmit(e) {
    // Prevenir el comportamiento por defecto del formulario (recarga)
    e.preventDefault();

    // Obtener valor del campo ID oculto
    const id = document.getElementById('insumoId').value;
    // Obtener valor del campo Nombre
    const nombre = document.getElementById('nombre').value;
    // Obtener valor del campo Categoría
    const categoria = document.getElementById('categoria').value;
    // Obtener valor del campo Stock
    const stock = document.getElementById('stock').value;
    // Obtener valor del campo Unidad
    const unidad = document.getElementById('unidad').value;

    // Verificar si estamos en modo edición
    if (isEditing) {
        // Buscar el índice del insumo a editar
        const index = insumos.findIndex(i => i.id == id);
        // Si se encontró el insumo
        if (index !== -1) {
            // Actualizar el objeto insumo en el array
            insumos[index] = { id: parseInt(id), nombre, categoria, stock: parseInt(stock), unidad };
            // Mostrar alerta de éxito
            alert('Insumo actualizado');
        }
    } else {
        // Crear nuevo objeto insumo
        const newInsumo = {
            // Asignar nuevo ID y aumentar el contador
            id: nextId++,
            // Asignar nombre
            nombre,
            // Asignar categoría
            categoria,
            // Asignar stock convertido a entero
            stock: parseInt(stock),
            // Asignar unidad
            unidad
        };
        // Agregar el nuevo insumo al array
        insumos.push(newInsumo);
    }

    // Volver a renderizar la tabla con los cambios
    renderTable(insumos);
    // Resetear el formulario
    resetForm();
}

// Función para eliminar un insumo
function deleteInsumo(id) {
    // Confirmar la acción con el usuario
    if (confirm('¿Eliminar insumo?')) {
        // Filtrar el array para remover el insumo con el ID dado
        insumos = insumos.filter(item => item.id !== id);
        // Renderizar la tabla actualizada
        renderTable(insumos);
        // Si el insumo eliminado estaba siendo editado, resetear formulario
        if (document.getElementById('insumoId').value == id) resetForm();
    }
}

// Función para cargar datos en el formulario para editar
function editInsumo(id) {
    // Buscar el insumo por ID
    const item = insumos.find(i => i.id === id);
    // Si existe el insumo
    if (item) {
        // Llenar campo ID oculto
        document.getElementById('insumoId').value = item.id;
        // Llenar campo Nombre
        document.getElementById('nombre').value = item.nombre;
        // Llenar campo Categoría
        document.getElementById('categoria').value = item.categoria;
        // Llenar campo Stock
        document.getElementById('stock').value = item.stock;
        // Llenar campo Unidad
        document.getElementById('unidad').value = item.unidad;

        // Cambiar título del formulario
        document.getElementById('formTitle').innerText = `Editar Insumo #${item.id}`;
        // Obtener botón de submit
        const btn = document.querySelector('#insumoForm button[type="submit"]');
        // Cambiar texto e icono del botón
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        // Cambiar color del botón a amarillo (warning)
        btn.classList.replace('btn-primary-custom', 'btn-warning');

        // Activar modo edición
        isEditing = true;
        // Desplazar la vista hacia el formulario suavemente
        document.getElementById('insumoForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para resetear el formulario a su estado inicial
function resetForm() {
    // Resetear campos del formulario HTML
    document.getElementById('insumoForm').reset();
    // Limpiar campo ID oculto
    document.getElementById('insumoId').value = '';
    // Restaurar título del formulario
    document.getElementById('formTitle').innerText = 'Registrar Nuevo Insumo';

    // Obtener botón de submit
    const btn = document.querySelector('#insumoForm button[type="submit"]');
    // Restaurar icono original
    btn.innerHTML = '<i class="fas fa-save"></i>';
    // Restaurar color original
    btn.classList.replace('btn-warning', 'btn-primary-custom');

    // Desactivar modo edición
    isEditing = false;
}

// Función para buscar insumos
function searchInsumo() {
    // Obtener término de búsqueda en minúsculas
    const term = document.getElementById('searchInput').value.toLowerCase();
    // Filtrar insumos que coincidan en nombre o categoría
    const filtered = insumos.filter(item =>
        item.nombre.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term)
    );
    // Renderizar tabla con resultados filtrados
    renderTable(filtered);
}

// Función para imprimir reporte
function printReport() {
    // Abrir diálogo de impresión del navegador
    window.print();
}
