document.addEventListener("DOMContentLoaded", function () {
    // Buscar todos los selects nativos con la clase filters-box__select
    const selects = document.querySelectorAll(".filters-box__select");

    selects.forEach(select => {
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
        triggerText.textContent = select.options[select.selectedIndex].text;
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
        trigger.addEventListener("click", function () {
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
});
