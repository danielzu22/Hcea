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
    });
} else {
    initCustomSelects();
    initAutocomplete();
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
