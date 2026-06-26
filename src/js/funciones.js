function initCustomSelects() {
   
    const selects = document.querySelectorAll(".filters-box__select");

    selects.forEach(select => {
       
        if (select.nextElementSibling && select.nextElementSibling.classList.contains("custom-select")) {
            return;
        }

        select.style.display = "none";

        const wrapper = document.createElement("div");
        wrapper.classList.add("custom-select-wrapper");
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const customSelect = document.createElement("div");
        customSelect.classList.add("custom-select");
        wrapper.appendChild(customSelect);

        const trigger = document.createElement("div");
        trigger.classList.add("custom-select__trigger");
        
        const triggerText = document.createElement("span");
       
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

        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("custom-select__options");
        customSelect.appendChild(optionsContainer);

        Array.from(select.options).forEach(option => {
            const customOption = document.createElement("span");
            customOption.classList.add("custom-select__option");
            if (option.selected) {
                customOption.classList.add("selected");
            }
            customOption.textContent = option.text;
            customOption.setAttribute("data-value", option.value);

            customOption.addEventListener("click", function (e) {
                e.stopPropagation();
               
                const siblings = this.parentNode.querySelectorAll(".custom-select__option");
                siblings.forEach(sib => sib.classList.remove("selected"));

                this.classList.add("selected");

                triggerText.textContent = this.textContent;

                select.value = this.getAttribute("data-value");
                select.dispatchEvent(new Event('change'));

                customSelect.classList.remove("open");
            });

            optionsContainer.appendChild(customOption);
        });

        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
           
            document.querySelectorAll(".custom-select").forEach(cs => {
                if (cs !== customSelect) cs.classList.remove("open");
            });
            customSelect.classList.toggle("open");
        });
    });

    window.addEventListener("click", function (e) {
        if (!e.target.closest(".custom-select")) {
            document.querySelectorAll(".custom-select").forEach(cs => {
                cs.classList.remove("open");
            });
        }
    });
}

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

function initAutocomplete() {
    const searchContainer = document.getElementById('interconsulta-search-container');
    const input = document.getElementById('interconsulta-input');
    const dropdown = document.getElementById('interconsulta-dropdown');
    const clearBtn = document.getElementById('interconsulta-clear');

    if (!input || !dropdown || !searchContainer) return;

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

    clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        input.value = '';
        this.style.display = 'none';
        searchContainer.classList.remove('open');
        input.focus();
    });

    input.addEventListener('focus', function() {
        const val = this.value.trim().toLowerCase();
        if (val.length > 0) {
            const matches = disciplines.filter(d => d.toLowerCase().includes(val));
            renderOptions(matches);
        }
    });

    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchContainer.classList.remove('open');
        }
    });
}

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

        dynamicLayout.style.display = 'flex';

        const tab = document.createElement('div');
        tab.className = 'vertical-tab';
        tab.setAttribute('data-target', currentId);
        tab.innerHTML = `
            <div class="vertical-tab__icon-box">
                <img src="images/iconos/Chequeado.svg" alt="Check">
            </div>
            <span class="vertical-tab__text">${specialtyName}</span>
        `;

        const form = document.createElement('div');
        form.className = 'specialty-form';
        form.id = currentId;

        form.innerHTML = `
            <div class="specialty-form__grid">
                <!-- Fila 1 -->
                <div class="specialty-form__group">
                    <label>Modalidad:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar modalidad</option>
                        <option value="presencial">Presencial</option>
                        <option value="tele_asincronica">Tele-interconsulta asincrónica</option>
                        <option value="tele_sincronica">Tele-interconsulta sincrónica</option>
                    </select>
                </div>
                <div class="specialty-form__group">
                    <label>Resolución en:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="otra" selected>Otra</option>
                        <option value="propia">Propia</option>
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
                            <input type="radio" name="tipo_consulta_${currentId}" value="primera">
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
                        <option value="10">10 días</option>
                        <option value="30" selected>30 días</option>
                        <option value="60">2 meses</option>
                        <option value="90">3 meses</option>
                        <option value="180">6 meses</option>
                        <option value="360">12 meses</option>
                        <option value="720">24 meses</option>
                    </select>
                </div>

                <!-- Contenedor dinámico para el banner del Criterio -->
                <div class="criterio-result-container span-4" id="criterio-banner-${currentId}"></div>

                <!-- Fila 3 y 4 -->
                <div class="specialty-form__group span-2">
                    <label>Motivo Interconsulta:</label>
                    <select class="filters-box__select dynamic-select">
                        <option value="" disabled selected>Seleccionar motivo</option>
                        <option value="arritmia">Arritmia</option>
                    </select>
                </div>
                
                <div class="specialty-form__group specialty-form__textarea-group">
                    <label>Observaciones</label>
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

        tabsContainer.appendChild(tab);
        formsContainer.appendChild(form);

        function activateTab() {
           
            document.querySelectorAll('#dynamic-tabs-container .vertical-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#dynamic-forms-container .specialty-form').forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            form.classList.add('active');
        }

        tab.addEventListener('click', activateTab);

        activateTab();

        initCustomSelects();

        const radioBtns = form.querySelectorAll('input[type="radio"]');
        radioBtns.forEach(radio => {
            radio.addEventListener('change', function() {
                if(this.checked) {
                    openModalCriterios(currentId);
                }
            });
        });

        const deleteBtn = form.querySelector('.specialty-form__btn-delete');
        deleteBtn.addEventListener('click', function() {
           
            tab.remove();
            form.remove();

            if (tabsContainer.children.length === 0) {
                dynamicLayout.style.display = 'none';
            } else {
               
                const firstTab = tabsContainer.querySelector('.vertical-tab');
                if (firstTab) firstTab.click();
            }
        });

        inputSearch.value = '';
        const clearBtn = document.getElementById('interconsulta-clear');
        if (clearBtn) clearBtn.style.display = 'none';
    });
}

let modalStates = {};
let currentEditingFormId = null;

function openModalCriterios(formId) {
    const modal = document.getElementById('modal-criterios');
    if (modal) {
        currentEditingFormId = formId;
        const cards = document.querySelectorAll('.criterio-card');

        cards.forEach((card, index) => {
            card.classList.remove('selected');
            if (modalStates[formId] && modalStates[formId].includes(index)) {
                card.classList.add('selected');
            }
        });

        modal.dispatchEvent(new Event('modalOpened'));
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
        currentEditingFormId = null;
    }

    if(btnClose) btnClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
    
    if(btnConfirm) {
        btnConfirm.addEventListener('click', function() {
            if(currentEditingFormId) {
               
                const selectedIndexes = [];
                cards.forEach((card, index) => {
                    if (card.classList.contains('selected')) {
                        selectedIndexes.push(index);
                    }
                });
                modalStates[currentEditingFormId] = selectedIndexes;

                renderCriterioBanner(currentEditingFormId);
            }
            closeModal();
        });
    }

    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateModalStatus();
        });
    });

    function updateModalStatus() {
        const selectedCount = document.querySelectorAll('.criterio-card.selected').length;

        badgeStatus.className = 'modal-criterios__badge';

        if (selectedCount === 0) {
            badgeStatus.textContent = "Sin selección";
            badgeStatus.classList.add('badge-none');
        } else if (selectedCount <= 1) {
            badgeStatus.textContent = "Baja";
            badgeStatus.classList.add('badge-leve');
        } else if (selectedCount <= 3) {
            badgeStatus.textContent = "Media";
            badgeStatus.classList.add('badge-moderada');
        } else {
            badgeStatus.textContent = "Alta";
            badgeStatus.classList.add('badge-grave');
        }
    }

    modal.addEventListener('modalOpened', updateModalStatus);
}

function renderCriterioBanner(formId) {
    const container = document.getElementById(`criterio-banner-${formId}`);
    if (!container) return;
    
    const selectedIndexes = modalStates[formId] || [];
    if (selectedIndexes.length === 0) {
       
        container.innerHTML = '';
        return;
    }
    
    let estadoTexto = "Alta";
    let estadoClase = "status-alta";
    
    if (selectedIndexes.length <= 1) {
        estadoTexto = "Baja";
        estadoClase = "status-baja";
    } else if (selectedIndexes.length <= 3) {
        estadoTexto = "Media";
        estadoClase = "status-media";
    }
    
    container.innerHTML = `
        <div class="criterio-banner">
            <div class="criterio-banner__info">
                <div class="criterio-banner__icon">
                    <img src="images/iconos/Chequeado.svg" alt="Check">
                </div>
                <div class="criterio-banner__text">
                    Criterio de derivación: <span class="${estadoClase}">${estadoTexto}</span>
                </div>
            </div>
            <div class="criterio-banner__actions">
                <button type="button" class="criterio-banner__btn criterio-banner__btn--edit" onclick="openModalCriterios('${formId}')">
                    <img src="images/iconos/Lapiz.svg" alt="Editar"> Editar
                </button>
                <button type="button" class="criterio-banner__btn criterio-banner__btn--delete" onclick="deleteCriterioBanner('${formId}')">
                    <img src="images/iconos/Papelera.svg" alt="Eliminar"> Eliminar
                </button>
            </div>
        </div>
    `;
}

window.deleteCriterioBanner = function(formId) {
    const container = document.getElementById(`criterio-banner-${formId}`);
    if (container) {
        container.innerHTML = '';
    }

    if (modalStates[formId]) {
        delete modalStates[formId];
    }

    const form = document.getElementById(formId);
    if (form) {
        const radios = form.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
    }
};
