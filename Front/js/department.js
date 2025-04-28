const departmentForm = document.getElementById("departmentForm");
const departmentTable = document.getElementById("departmentTable");
const filterInput = document.getElementById("filterInput");
const editDepartmentModalEl = document.getElementById('editDepartmentModal');  // Modal de editar
const editDepartmentModal = new bootstrap.Modal(editDepartmentModalEl); // Instancia del modal de Bootstrap
const editDepartmentFormElement = document.getElementById("editDepartmentForm");
const updateDepartmentButton = document.getElementById("updateDepartmentButton");

const url = "http://localhost:8080/api/departments";  // URL de tu API (ajusta según tu servidor)

let departments = [];
let editingDepartmentId = null;

// Función para mostrar los departamentos
function displayDepartments(filteredDepartments = departments) {
  const departmentTableBody = departmentTable.querySelector("tbody");
  departmentTableBody.innerHTML = "";

  filteredDepartments.forEach((department) => {
    const row = departmentTableBody.insertRow();
    const nameCell = row.insertCell();
    const locationCell = row.insertCell();
    const actionsCell = row.insertCell();

    nameCell.textContent = department.name;
    locationCell.textContent = department.location || "";

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "btn btn-primary btn-sm me-2";
    editButton.addEventListener("click", () => showEditModal(department));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.addEventListener("click", () => deleteDepartment(department.departmentId));
    actionsCell.appendChild(deleteButton);
  });
}

// Función para obtener los departamentos desde la API
function getDepartments() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      departments = data;
      displayDepartments();  // Muestra la lista de departamentos
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al obtener los departamentos.");
    });
}

// Función para guardar un nuevo departamento o actualizar uno existente
function saveDepartment(event) {
  event.preventDefault();

  const department = {
    name: document.getElementById("name").value,
    location: document.getElementById("location").value,
  };

  const method = editingDepartmentId ? "PUT" : "POST";  // Si está editando, usa PUT
  const urlToUse = editingDepartmentId ? `${url}/${editingDepartmentId}` : url;  // Si está editando, agrega el ID al URL

  fetch(urlToUse, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  })
    .then((response) => {
      if (response.ok) {
        getDepartments(); // Refresca la lista de departamentos
        departmentForm.reset();
        editingDepartmentId = null; // Resetea el id del departamento editado
      } else {
        alert("Error al guardar el departamento.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al guardar el departamento.");
    });
}

// Función para mostrar el modal de edición con los datos del departamento
function showEditModal(department) {
  editingDepartmentId = department.departmentId;
  document.getElementById("editName").value = department.name;
  document.getElementById("editLocation").value = department.location || "";
  editDepartmentModal.show();
}

// Función para actualizar el departamento desde el modal
function updateDepartment() {
  const updatedDepartment = {
    name: document.getElementById("editName").value,
    location: document.getElementById("editLocation").value,
  };

  fetch(`${url}/${editingDepartmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedDepartment),
  })
    .then(() => {
      getDepartments();  // Refresca la lista de departamentos
      editDepartmentModal.hide();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al actualizar el departamento.");
    });
}

// Función para eliminar un departamento
function deleteDepartment(departmentId) {
  fetch(`${url}/${departmentId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        getDepartments();  // Refresca la lista de departamentos
      } else {
        alert("Error al eliminar el departamento.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al eliminar el departamento.");
    });
}

// Función de búsqueda de departamentos (por nombre)
filterInput.addEventListener("input", () => {
  const searchQuery = filterInput.value.toLowerCase();
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery)
  );
  displayDepartments(filteredDepartments);
});

// Escuchar el evento de envío del formulario para crear o editar un departamento
departmentForm.addEventListener("submit", saveDepartment);

// Escuchar el evento de click para actualizar un departamento desde el modal
updateDepartmentButton.addEventListener("click", updateDepartment);

// Obtener la lista de departamentos cuando se carga la página
getDepartments();
