  const doctorForm = document.getElementById("doctorForm");
  const doctorTable = document.getElementById("doctorTable");
  const filterInput = document.getElementById("filterInput");
  const editDoctorModalEl = document.getElementById('editDoctorModal');  // Modal de editar
  const editDoctorModal = new bootstrap.Modal(editDoctorModalEl); // Instancia del modal de Bootstrap
  const editDoctorFormElement = document.getElementById("editDoctorForm");
  const updateDoctorButton = document.getElementById("updateDoctorButton");

  const url = "http://localhost:8080/api/doctors";

  let doctors = [];
  let editingDoctorId = null;

  // Función para mostrar los doctores
  function displayDoctors(filteredDoctors = doctors) {
    const doctorTableBody = doctorTable.querySelector("tbody");
    doctorTableBody.innerHTML = "";

    filteredDoctors.sort((a, b) => a.doctorId - b.doctorId);

    filteredDoctors.forEach((doctor) => {
      const row = doctorTableBody.insertRow();
      const nameCell = row.insertCell();
      const specialtyCell = row.insertCell();
      const phoneCell = row.insertCell();
      const emailCell = row.insertCell();
      const addressCell = row.insertCell();
      const actionsCell = row.insertCell();

      nameCell.textContent = doctor.name;
      specialtyCell.textContent = doctor.specialty;
      phoneCell.textContent = doctor.phone || "";
      emailCell.textContent = doctor.email || "";
      addressCell.textContent = doctor.address || "";

      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.className = "btn btn-primary btn-sm me-2";
      editButton.addEventListener("click", () => showEditModal(doctor));
      actionsCell.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.addEventListener("click", () => deleteDoctor(doctor.doctorId));
      actionsCell.appendChild(deleteButton);
    });
  }

  // Función para obtener los doctores desde la API
  function getDoctors() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        doctors = data;
        displayDoctors();
      })
      .catch((error) => console.error("Error:", error));
  }

  // Función para guardar un nuevo doctor
  function saveDoctor(event) {
    event.preventDefault();

    const doctor = {
      name: document.getElementById("name").value,
      specialty: document.getElementById("specialty").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
    };

    const method = editingDoctorId ? "PUT" : "POST";
    const urlToUse = editingDoctorId ? `${url}/${editingDoctorId}` : url;

    fetch(urlToUse, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!editingDoctorId) {
          doctors.push(data);
        } else {
          const index = doctors.findIndex((d) => d.doctorId === data.doctorId);
          doctors[index] = data;
        }
        displayDoctors();
        doctorForm.reset();
        editingDoctorId = null;
        document.querySelector('button[type="submit"]').textContent = "Guardar Doctor";
      })
      .catch((error) => console.error("Error:", error));
  }

  // Función para mostrar el modal de edición
  function showEditModal(doctor) {
    editingDoctorId = doctor.doctorId;
    document.getElementById("editName").value = doctor.name;
    document.getElementById("editSpecialty").value = doctor.specialty;
    document.getElementById("editPhone").value = doctor.phone || "";
    document.getElementById("editEmail").value = doctor.email || "";
    document.getElementById("editAddress").value = doctor.address || "";
    editDoctorModal.show();
  }

  // Función para actualizar un doctor
  function updateDoctor() {
    const updatedDoctorData = {
      name: document.getElementById("editName").value,
      specialty: document.getElementById("editSpecialty").value,
      phone: document.getElementById("editPhone").value,
      email: document.getElementById("editEmail").value,
      address: document.getElementById("editAddress").value,
    };

    fetch(`${url}/${editingDoctorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDoctorData),
    })
      .then((response) => response.json())
      .then((data) => {
        const index = doctors.findIndex((d) => d.doctorId === data.doctorId);
        doctors[index] = data;
        displayDoctors();
        editDoctorModal.hide();
        editingDoctorId = null;
      })
      .catch((error) => console.error("Error:", error));
  }

  // Función para eliminar un doctor
  function deleteDoctor(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este doctor?")) {
      fetch(`${url}/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          doctors = doctors.filter((d) => d.doctorId !== id);
          displayDoctors();
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  // Función para filtrar doctores por nombre
  filterInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm)
    );
    displayDoctors(filteredDoctors);
  });

  doctorForm.addEventListener("submit", saveDoctor);
  updateDoctorButton.addEventListener("click", updateDoctor);

  getDoctors();
