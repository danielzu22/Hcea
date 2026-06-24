function initCustomSelects() {
    // Buscar todos los selects nativos con la clase filters-box__select
    const selects = document.querySelectorAll(".filters-box__select");

    selects.forEach(select => {
        // Evitar inicializar dos veces
        if (select.nextElementSibling && select.nextElementSibling.classList.contains("custom-select")) {
            return;
        }

        // Ocultar select nativo
        select.style.display = "none";

        // Crear wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("custom-select-wrapper");
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        // Crear custom select
        const customSelect = document.createElement("div");
        customSelect.classList.add("custom-select");
        wrapper.appendChild(customSelect);

        // Crear trigger (la cajita que se ve por defecto)
        const trigger = document.createElement("div");
        trigger.classList.add("custom-select__trigger");
        
        const triggerText = document.createElement("span");
        // Check if there are options
        if (select.options.length > 0) {
            triggerText.textContent = select.options[select.selectedIndex >= 0 ? select.selectedIndex : 0].text;
        } else {
            triggerText.textContent = "Seleccionar...";
        }
        trigger.appendChild(triggerText);
        
        const arrow = document.createElement("div");
        arrow.classList.add("arrow");
        trigger.appendChild(arrow);
        
        customSelect.appendChild(trigger);

        // Crear lista de opciones
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("custom-select__options");
        customSelect.appendChild(optionsContainer);

        // Llenar opciones
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement("span");
            customOption.classList.add("custom-select__option");
            if (option.selected) {
                customOption.classList.add("selected");
            }
            customOption.textContent = option.text;
            customOption.setAttribute("data-value", option.value);

            // Al hacer click en una opción
            customOption.addEventListener("click", function (e) {
                e.stopPropagation();
                // Desmarcar todas
                const siblings = this.parentNode.querySelectorAll(".custom-select__option");
                siblings.forEach(sib => sib.classList.remove("selected"));
                
                // Marcar esta
                this.classList.add("selected");
                
                // Actualizar texto en trigger
                triggerText.textContent = this.textContent;
                
                // Actualizar select nativo
                select.value = this.getAttribute("data-value");
                select.dispatchEvent(new Event('change'));

                // Cerrar menú
                customSelect.classList.remove("open");
            });

            optionsContainer.appendChild(customOption);
        });

        // Abrir/cerrar menú al hacer click en el trigger
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            // Cerrar otros custom selects abiertos
            document.querySelectorAll(".custom-select").forEach(cs => {
                if (cs !== customSelect) cs.classList.remove("open");
            });
            customSelect.classList.toggle("open");
        });
    });

    // Cerrar si se hace click fuera
    window.addEventListener("click", function (e) {
        if (!e.target.closest(".custom-select")) {
            document.querySelectorAll(".custom-select").forEach(cs => {
                cs.classList.remove("open");
            });
        }
    });
}

// Ejecutar scripts asegurándose de que el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
        initCustomSelects();
        initAutocomplete();
        initDynamicForms();
        initModalCriterios();
    });
} else {
    initCustomSelects();
    initAutocomplete();
    initDynamicForms();
    initModalCriterios();
}

// Función para el buscador simulado de interconsultas
function initAutocomplete() {
    const searchContainer = document.getElementById('interconsulta-search-container');
    const input = document.getElementById('interconsulta-input');
    const dropdown = document.getElementById('interconsulta-dropdown');
    const clearBtn = document.getElementById('interconsulta-clear');

    if (!input || !dropdown || !searchContainer) return;

    // Lista de muestra basada en las especialidades de la tabla
    const disciplines = [
        "Cardiología",
        "Cardiología Pediátrica",
        "Dermatología",
        "Lic. en Enfermería",
        "Medicina General",
        "Psiquiatría",
        "Traumatología",
        "Neurología",
        "Oftalmología",
        "Ginecología"
    ];

    function renderOptions(matches) {
        dropdown.innerHTML = '';
        if (matches.length === 0) {
            searchContainer.classList.remove('open');
            return;
        }

        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'add-interconsulta__dropdown-item';
            div.textContent = match;
            
            // Al hacer click en una sugerencia
            div.addEventListener('click', function(e) {
                e.stopPropagation();
                input.value = match;
                searchContainer.classList.remove('open');
                clearBtn.style.display = 'block';
            });
            
            dropdown.appendChild(div);
        });
        
        searchContainer.classList.add('open');
    }

    // Escuchar cuando el usuario escribe
    input.addEventListener('input', function() {
        const val = this.value.trim().toLowerCase();
        
        if (val.length > 0) {
            clearBtn.style.display = 'block';
            const matches = disciplines.filter(d => d.toLowerCase().includes(val));
            renderOptions(matches);
        } else {
            clearBtn.style.display = 'none';
            searchContainer.classList.remove('open');
        }
    });

    // Limpiar el input con la crucecita
    clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        input.value = '';
        this.style.display = 'none';
        searchContainer.classList.remove('open');
        input.focus();
    });

    // Abrir dropdown si hay texto al hacer focus
    input.addEventListener('focus', function() {
        const val = this.value.trim().toLowerCase();
        if (val.length > 0) {
            const matches = disciplines.filter(d => d.toLowerCase().includes(val));
            renderOptions(matches);
        }
    });

    // Cerrar si se hace click fuera del buscador
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('open');
        }
    });
}

// Función para manejar la inserción de formularios dinámicos
function initDynamicForms() {
    const btnAdd = document.getElementById('btn-add-interconsulta');
    const inputSearch = document.getElementById('interconsulta-input');
    const dynamicLayout = document.getElementById('dynamic-layout');
    const tabsContainer = document.getElementById('dynamic-tabs-container');
    const formsContainer = document.getElementById('dynamic-forms-container');

    if (!btnAdd || !inputSearch || !dynamicLayout || !tabsContainer || !formsContainer) return;

    let specialtyCounter = 0;

    btnAdd.addEventListener('click', function(e) {
        e.preventDefault();
        const specialtyName = inputSearch.value.trim();
        
        if (!specialtyName) {
            alert('Por favor, selecciona o escribe una especialidad primero.');
            return;
        }

        specialtyCounter++;
        const currentId = 'specialty-' + specialtyCounter;

        // Mostrar el layout si estaba oculto
        dynamicLayout.style.display = 'flex';

        // 1. Crear el Tab
        const tab = document.createElement('div');
        tab.className = 'vertical-tab';
        tab.setAttribute('data-target', currentId);
        tab.innerHTML = `
            <div class="vertical-tab__icon-box">
                <img src="images/iconos/Chequeado.svg" alt="Check">
            </div>
            <span class="vertical-tab__text">${specialtyName}</span>
        `;

        // 2. Crear el Formulario
        const form = document.createElement('div');
        form.className = 'specialty-form';
        form.id = currentId;
        
        // HTML del formulario igual al mockup
        form.innerHTML = `
            <div class="specialty-form__grid">
                <!-- Fila 1 -->
                <div class="specialty-form__group">
                    <label>Modalidad:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar modalidad</option>
                        <option value="presencial">Presencial</option>
                        <option value="telemedicina">Telemedicina</option>
                    </select>
                </div>
                <div class="specialty-form__group">
                    <label>Resolución en:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="urgencia">Urgencia</option>
                        <option value="policlinica">Policlínica</option>
                        <option value="otra" selected>Otra</option>
                    </select>
                </div>
                <div class="specialty-form__group">
                    <label>Seleccionar Depto:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar departamento</option>
                        <option value="montevideo">Montevideo</option>
                        <option value="canelones">Canelones</option>
                    </select>
                </div>
                <div class="specialty-form__group">
                    <label>Seleccionar UA:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar UA</option>
                        <option value="ua1">Unidad Asistencial 1</option>
                        <option value="ua2">Unidad Asistencial 2</option>
                    </select>
                </div>

                <!-- Fila 2 -->
                <div class="specialty-form__group span-2">
                    <label>Tipo de consulta:</label>
                    <div class="specialty-form__radio-group">
                        <label class="specialty-form__radio-label">
                            <input type="radio" name="tipo_consulta_${currentId}" value="primera" checked>
                            <span class="radio-custom"></span>
                            Primera vez
                        </label>
                        <label class="specialty-form__radio-label">
                            <input type="radio" name="tipo_consulta_${currentId}" value="seguimiento">
                            <span class="radio-custom"></span>
                            Seguimiento
                        </label>
                    </div>
                </div>
                <div class="specialty-form__group">
                    <label>Seguimiento cada:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar días</option>
                        <option value="15">15 días</option>
                        <option value="30" selected>30 días</option>
                        <option value="60">60 días</option>
                    </select>
                </div>

                <!-- Fila 3 y 4 -->
                <div class="specialty-form__group span-2">
                    <label>Motivo Interconsulta:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar motivo</option>
                        <option value="derivacion">Derivación</option>
                        <option value="interconsulta">Interconsulta</option>
                    </select>
                </div>
                
                <div class="specialty-form__group specialty-form__textarea-group">
                    <label>Datos clínicos relevantes:</label>
                    <textarea></textarea>
                </div>
            </div>

            <!-- Botón Eliminar -->
            <div class="specialty-form__footer">
                <button type="button" class="specialty-form__btn-delete" data-target="${currentId}">
                    <img src="images/iconos/Papelera.svg" alt="Eliminar"> Eliminar esta especialidad
                </button>
            </div>
        `;

        // 3. Añadir al DOM
        tabsContainer.appendChild(tab);
        formsContainer.appendChild(form);

        // 4. Lógica de activación
        function activateTab() {
            // Desactivar todos
            document.querySelectorAll('#dynamic-tabs-container .vertical-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#dynamic-forms-container .specialty-form').forEach(f => f.classList.remove('active'));
            
            // Activar este
            tab.classList.add('active');
            form.classList.add('active');
        }

        tab.addEventListener('click', activateTab);

        // Activar el nuevo tab recién creado
        activateTab();

        // 5. Inicializar Custom Selects en el nuevo formulario inyectado
        // Esto asume que initCustomSelects no duplica los wrappers si ya existen, 
        // pero como es HTML nuevo, es seguro llamarlo.
        initCustomSelects();

        // Escuchar radios de "Primera vez" y "Seguimiento" para abrir el modal
        const radioBtns = form.querySelectorAll('input[type="radio"]');
        radioBtns.forEach(radio => {
            radio.addEventListener('change', function() {
                if(this.checked) {
                    openModalCriterios();
                }
            });
        });

        // 6. Lógica de eliminar
        const deleteBtn = form.querySelector('.specialty-form__btn-delete');
        deleteBtn.addEventListener('click', function() {
            // Eliminar del DOM
            tab.remove();
            form.remove();

            // Si ya no quedan tabs, ocultar el layout completo
            if (tabsContainer.children.length === 0) {
                dynamicLayout.style.display = 'none';
            } else {
                // Activar el primer tab disponible
                const firstTab = tabsContainer.querySelector('.vertical-tab');
                if (firstTab) firstTab.click();
            }
        });

        // 7. Limpiar el input de búsqueda después de agregar
        inputSearch.value = '';
        const clearBtn = document.getElementById('interconsulta-clear');
        if (clearBtn) clearBtn.style.display = 'none';
    });
}

// ==========================================
// Modal de Criterios de Derivación
// ==========================================

function openModalCriterios() {
    const modal = document.getElementById('modal-criterios');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function initModalCriterios() {
    const modal = document.getElementById('modal-criterios');
    const btnClose = document.getElementById('modal-close-btn');
    const btnCancel = document.getElementById('modal-cancel-btn');
    const btnConfirm = document.getElementById('modal-confirm-btn');
    const cards = document.querySelectorAll('.criterio-card');
    const badgeStatus = document.getElementById('modal-badge-status');

    if (!modal) return;

    function closeModal() {
        modal.style.display = 'none';
    }

    if(btnClose) btnClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
    if(btnConfirm) btnConfirm.addEventListener('click', closeModal);

    // Seleccion múltiple
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateModalStatus();
        });
    });

    function updateModalStatus() {
        const selectedCount = document.querySelectorAll('.criterio-card.selected').length;
        
        // Limpiar clases
        badgeStatus.className = 'modal-criterios__badge';

        if (selectedCount === 0) {
            badgeStatus.textContent = "Sin selección";
            badgeStatus.classList.add('badge-none');
        } else if (selectedCount <= 1) {
            badgeStatus.textContent = "Derivación leve";
            badgeStatus.classList.add('badge-leve');
        } else if (selectedCount <= 3) {
            badgeStatus.textContent = "Derivación moderada";
            badgeStatus.classList.add('badge-moderada');
        } else {
            badgeStatus.textContent = "Derivación urgente";
            badgeStatus.classList.add('badge-grave');
        }
    }
    
    // Inicializar estado por defecto
    updateModalStatus();
}
