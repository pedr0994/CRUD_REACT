// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import ConfirmModal from './components/ConfirmModal';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = "http://127.0.0.1:5000/api";

const App = () => {
  // Estados principales del componente
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando
  const [userToUpdate, setUserToUpdate] = useState(null); // Usuario que se va a actualizar
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda para filtrar usuarios
  const [currentPage, setCurrentPage] = useState(1); // Página actual para paginación
  const [usersPerPage, setUsersPerPage] = useState(5); // Número de usuarios por página
  const [creationOrder, setCreationOrder] = useState('asc'); // Orden de creación (ascendente o descendente)
  const [ageOrder, setAgeOrder] = useState('asc'); // Orden por edad (ascendente o descendente)
  const [nameOrder, setNameOrder] = useState('asc'); // Orden alfabético por nombre (ascendente o descendente)
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('darkMode'); // Recuperar el tema almacenado
    return storedTheme === 'true';
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para mostrar/ocultar modal de confirmación
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar
  const [modalAction, setModalAction] = useState(''); // Acción de modal (delete o update)

  // Sincronizar el tema con localStorage cuando cambia darkMode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Obtener la lista de usuarios desde el backend usando fetchUsers
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data); // Establecer la lista de usuarios obtenidos
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al cargar los usuarios. Intente nuevamente.", { theme: darkMode ? 'dark' : 'light' });
    }
  }, [darkMode]);

  // Llamar a fetchUsers una vez al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Alternar entre tema claro y oscuro
  const toggleTheme = () => setDarkMode(!darkMode);

  // Crear usuario en el backend
  const createUser = async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, user);
      setUsers([...users, response.data]); // Agregar el usuario creado a la lista
      toast.success("Usuario creado con éxito!", { theme: darkMode ? 'dark' : 'light' });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error("Error al crear usuario. Verifique los datos.", { theme: darkMode ? 'dark' : 'light' });
    }
  };

  // Confirmar y ejecutar la actualización del usuario en el backend
  const confirmUpdateUser = async (updatedUser) => {
    if (!updatedUser) {
      console.error("No hay un usuario seleccionado para actualizar.");
      return;
    }
    try {
      const response = await axios.put(`${BASE_URL}/users/${updatedUser.id}`, updatedUser);
      setUsers(users.map((u) => (u.id === updatedUser.id ? response.data : u))); // Actualizar la lista de usuarios con el usuario modificado
      setIsModalOpen(false); // Cerrar el modal
      setEditingUser(null);
      setUserToUpdate(null);
      toast.success("Usuario actualizado con éxito!", { theme: darkMode ? 'dark' : 'light' });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("Error al actualizar usuario. Intente nuevamente.", { theme: darkMode ? 'dark' : 'light' });
    }
  };

  // Seleccionar usuario para edición
  const initiateEditUser = (user) => {
    setEditingUser(user);
    setUserToUpdate(user);
  };

  // Confirmar eliminación del usuario en el backend
  const handleDeleteUser = (id) => {
    const user = users.find((u) => u.id === id);
    setUserToDelete(user);
    setModalAction('delete'); // Establecer la acción a delete
    setIsModalOpen(true); // Abrir el modal de confirmación
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/users/${userToDelete.id}`);
      setUsers(users.filter((user) => user.id !== userToDelete.id)); // Filtrar el usuario eliminado de la lista
      setIsModalOpen(false);
      setUserToDelete(null);
      toast.success("Usuario eliminado con éxito!", { theme: darkMode ? 'dark' : 'light' });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar usuario. Intente nuevamente.", { theme: darkMode ? 'dark' : 'light' });
    }
  };

  // Cancelar la acción de modal
  const cancelModalAction = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
    setUserToUpdate(null);
    setEditingUser(null);
  };

// Filtrar usuarios según el término de búsqueda
const filteredUsers = users.filter((user) => {
  const searchLowerCase = searchTerm.toLowerCase();
  const userName = user.name ? user.name.toLowerCase() : '';
  const userEmail = user.email ? user.email.toLowerCase() : '';
  const userAge = user.age ? user.age.toString() : '';
  return (
    userName.includes(searchLowerCase) ||
    userEmail.includes(searchLowerCase) ||
    userAge.includes(searchLowerCase)
  );
});


  // Ordenar los usuarios filtrados por criterios específicos
  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => {
    if (creationOrder !== 'asc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (ageOrder !== 'asc') {
      return b.age - a.age;
    }
    return nameOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Alternar orden de creación entre ascendente y descendente
  const toggleCreationOrder = () => {
    setCreationOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Alternar orden de edad entre ascendente y descendente
  const toggleAgeOrder = () => {
    setAgeOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Alternar orden alfabético del nombre entre ascendente y descendente
  const toggleNameOrder = () => {
    setNameOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Configuración de paginación de usuarios
  const totalPages = Math.ceil(sortedFilteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedFilteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>CRUD de Usuarios</h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <input
        className="search-bar"
        type="text"
        placeholder="Buscar por nombre, correo o edad"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p className="total-users">
        Resultados encontrados: {filteredUsers.length} / Total de usuarios: {users.length}
      </p>
      <div className="sort-buttons">
        <button onClick={toggleNameOrder}>
          {nameOrder === 'asc' ? 'Nombre: A-Z' : 'Nombre: Z-A'}
        </button>
        <button onClick={toggleAgeOrder}>
          {ageOrder === 'asc' ? 'Edad: Menor a Mayor' : 'Edad: Mayor a Menor'}
        </button>
        <button onClick={toggleCreationOrder}>
          {creationOrder === 'asc' ? 'Más Reciente Primero' : 'Más Antiguo Primero'}
        </button>
      </div>
      <UserForm
        createUser={createUser}
        updateUser={confirmUpdateUser}
        editingUser={editingUser}
        setEditingUser={initiateEditUser}
      />
      <UserList
        users={currentUsers}
        setEditingUser={initiateEditUser}
        deleteUser={handleDeleteUser}
      />
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        
        <span>Página:</span>
        <select value={currentPage} onChange={handlePageChange}>
          {[...Array(totalPages).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
      
      <div>
        <span>Usuarios por página:</span>
        <select value={usersPerPage} onChange={handleUsersPerPageChange}>
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={modalAction === 'delete' ? confirmDeleteUser : () => confirmUpdateUser(userToUpdate)}
        onCancel={cancelModalAction}
        userName={
          modalAction === 'delete'
            ? userToDelete ? userToDelete.name : ''
            : userToUpdate ? userToUpdate.name : ''
        }
        darkMode={darkMode}
        actionType={modalAction}
      />
      <ToastContainer />
    </div>
  );
};

export default App;
