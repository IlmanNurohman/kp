document.addEventListener("DOMContentLoaded", () => {
  const wasteSearchInput = document.getElementById("waste-search");
  const suggestionsContainer = document.getElementById("suggestions");
  const selectedWastesContainer = document.getElementById("selected-wastes");
  const showFormButton = document.getElementById("show-form-button");
  const formContainer = document.getElementById("jobsheet-form");
  const accordionContainer = document.getElementById("accordion-container");

  let selectedWastes = [];
  let wasteData = [];

  // Fetch Waste Data
  async function fetchWasteData() {
    try {
      const response = await fetch("https://wm-be.dev.pituku.id/waste", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer 123", // Ganti dengan token yang benar
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      wasteData = data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Show Suggestions
  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    suggestions.forEach((suggestion) => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";

      const label = document.createElement("span");
      label.textContent = `${suggestion.waste_name} (${suggestion.unit})`;
      div.appendChild(label);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          selectedWastes.push(suggestion);
        } else {
          selectedWastes = selectedWastes.filter(
            (waste) => waste.waste_name !== suggestion.waste_name
          );
        }
        updateSelectedWastes();
      });
      div.appendChild(checkbox);

      suggestionsContainer.appendChild(div);
    });
    suggestionsContainer.style.display =
      suggestions.length > 0 ? "block" : "none";
  }

  function updateSelectedWastes() {
    renderWasteForms(); // Render the forms when the wastes are updated
  }

  function renderWasteForms() {
    accordionContainer.innerHTML = ""; // Clear the accordion container
    selectedWastes.forEach((waste, index) => {
      // Create a new accordion section for each waste
      const accordionSection = document.createElement("div");
      accordionSection.className = "accordion-section";

      // Create the accordion header
      const accordionHeader = document.createElement("h3");
      accordionHeader.textContent = `${waste.waste_name} (${waste.unit})`;
      accordionHeader.className = "accordion-header";
      accordionSection.appendChild(accordionHeader);

      // Create the accordion panel
      const panel = document.createElement("div");
      panel.className = "panel";

      // Add form fields to the panel
      const table = document.createElement("table");
      table.innerHTML = `
        <tr>
          <td>Nama Limbah</td>
          <td><input type="text" name="wasteName-${index}" value="${
        waste.waste_name
      }" readonly required></td>
        </tr>
        <tr>
          <td>Unit</td>
          <td>
            <select name="unit-${index}" required>
              <option value="kg" ${
                waste.unit === "kg" ? "selected" : ""
              }>kg</option>
              <option value="liter" ${
                waste.unit === "liter" ? "selected" : ""
              }>liter</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Jumlah</td>
          <td><input type="number" name="quantity-${index}" placeholder="Masukan Jumlah Limbah" required></td>
        </tr>
        <tr>
          <td>Harga Satuan</td>
          <td><input type="number" name="unitPrice-${index}" value="${
        waste.waste_price
      }" readonly required></td>
        </tr>
        <tr>
          <td>Total Harga Client</td>
          <td><input type="number" name="totalClientPrice-${index}" placeholder="Masukan Total Harga Client" required></td>
        </tr>
        <tr>
          <td>Biaya</td>
          <td><input type="number" name="cost-${index}" placeholder="Masukan Biaya" required></td>
        </tr>
        <tr>
          <td>Total Biaya</td>
          <td><input type="number" name="totalCost-${index}" placeholder="Masukan Total Biaya" required></td>
        </tr>
        <tr>
          <td>Pemrosesan Armada</td>
          <td><input type="text" name="fleetProcessing-${index}" placeholder="Masukan Pemrosesan Armada" required></td>
        </tr>
        <tr>
          <td>Estimasi Keuntungan</td>
          <td><input type="number" name="profitEstimation-${index}" placeholder="Masukan Estimasi Keuntungan" required></td>
        </tr>
        <tr>
          <td>GPM</td>
          <td><input type="number" name="profitEstimation-${index}" placeholder="GPM" required></td>
        </tr>
      `;

      // Append table to panel
      panel.appendChild(table);

      // Append panel to accordion section
      accordionSection.appendChild(panel);

      // Append accordion section to accordion container
      accordionContainer.appendChild(accordionSection);

      // Add event listener to toggle accordion
      accordionHeader.addEventListener("click", () => {
        panel.classList.toggle("active");
        accordionHeader.classList.toggle("active");
      });
    });

    formContainer.style.display = selectedWastes.length > 0 ? "block" : "none";
  }

  wasteSearchInput.addEventListener("input", () => {
    const inputValue = wasteSearchInput.value.toLowerCase();
    if (inputValue) {
      const filteredSuggestions = wasteData.filter((item) =>
        item.waste_name.toLowerCase().includes(inputValue)
      );
      showSuggestions(filteredSuggestions);
    } else {
      suggestionsContainer.style.display = "none";
    }
  });

  fetchWasteData();
});
