// --- NAVEGACIÓN SPA ---
function navigateTo(section) {
    // Ocultar todo
    document.getElementById('section-home').classList.add('d-none');
    document.getElementById('section-crud').classList.add('d-none');

    // Desactivar links
    document.getElementById('nav-home').classList.remove('active');
    document.getElementById('nav-crud').classList.remove('active');

    // Mostrar seleccionado
    document.getElementById(`section-${section}`).classList.remove('d-none');
    document.getElementById(`nav-${section}`).classList.add('active');
}

// --- LÓGICA CRUD ---
let insumos = [
    { id: 1, nombre: 'Arroz', categoria: 'Granos', stock: 50, unidad: 'kg' },
    { id: 2, nombre: 'Pollo', categoria: 'Carnes', stock: 20, unidad: 'kg' },
    { id: 3, nombre: 'Sillao', categoria: 'Salsas', stock: 10, unidad: 'lt' },
    { id: 4, nombre: 'Huevos', categoria: 'Otros', stock: 100, unidad: 'und' },
    { id: 5, nombre: 'Aceite', categoria: 'Líquidos', stock: 5, unidad: 'lt' }
];

let nextId = 6;
let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    renderTable(insumos);
});

function renderTable(data) {
    const tbody = document.getElementById('insumosTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3">No se encontraron insumos</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = `
            <tr>
                <td>#${item.id}</td>
                <td class="fw-bold">${item.nombre}</td>
                <td><span class="badge bg-light text-dark border">${item.categoria}</span></td>
                <td>${item.stock}</td>
                <td>${item.unidad}</td>
                <td class="text-end no-print">
                    <button class="btn btn-sm btn-outline-primary action-btn" onclick="editInsumo(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn" onclick="deleteInsumo(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('insumoId').value;
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const stock = document.getElementById('stock').value;
    const unidad = document.getElementById('unidad').value;

    if (isEditing) {
        const index = insumos.findIndex(i => i.id == id);
        if (index !== -1) {
            insumos[index] = { id: parseInt(id), nombre, categoria, stock: parseInt(stock), unidad };
            alert('Insumo actualizado');
        }
    } else {
        const newInsumo = {
            id: nextId++,
            nombre,
            categoria,
            stock: parseInt(stock),
            unidad
        };
        insumos.push(newInsumo);
    }

    renderTable(insumos);
    resetForm();
}

function deleteInsumo(id) {
    if (confirm('¿Eliminar insumo?')) {
        insumos = insumos.filter(item => item.id !== id);
        renderTable(insumos);
        if (document.getElementById('insumoId').value == id) resetForm();
    }
}

function editInsumo(id) {
    const item = insumos.find(i => i.id === id);
    if (item) {
        document.getElementById('insumoId').value = item.id;
        document.getElementById('nombre').value = item.nombre;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('stock').value = item.stock;
        document.getElementById('unidad').value = item.unidad;

        document.getElementById('formTitle').innerText = `Editar Insumo #${item.id}`;
        const btn = document.querySelector('#insumoForm button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
        btn.classList.replace('btn-primary-custom', 'btn-warning');

        isEditing = true;
        // No scroll needed in SPA if visible, but good practice
        document.getElementById('insumoForm').scrollIntoView({ behavior: 'smooth' });
    }
}

function resetForm() {
    document.getElementById('insumoForm').reset();
    document.getElementById('insumoId').value = '';
    document.getElementById('formTitle').innerText = 'Registrar Nuevo Insumo';

    const btn = document.querySelector('#insumoForm button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-save"></i>';
    btn.classList.replace('btn-warning', 'btn-primary-custom');

    isEditing = false;
}

function searchInsumo() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = insumos.filter(item =>
        item.nombre.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term)
    );
    renderTable(filtered);
}

function printReport() {
    window.print();
}
