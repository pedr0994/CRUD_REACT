// src/components/UserList.js
import React, { useState } from 'react';

const UserList = ({ users, setEditingUser, deleteUser }) => {
  // Estado para controlar qué nombres se expanden para mostrar completos
  const [expandedNames, setExpandedNames] = useState([]);

  // Alternar la expansión de un nombre completo al hacer clic en "Ver más" o "Ver menos"
  const toggleNameExpansion = (id) => {
    if (expandedNames.includes(id)) {
      // Si el nombre está expandido, lo eliminamos de la lista de nombres expandidos
      setExpandedNames(expandedNames.filter((expandedId) => expandedId !== id));
    } else {
      // Si el nombre no está expandido, lo agregamos a la lista de nombres expandidos
      setExpandedNames([...expandedNames, id]);
    }
  };

  // Truncar el nombre si es muy largo, con opción para ver el nombre completo
  const truncateName = (user) => {
    const { name, id } = user;
    if (expandedNames.includes(id)) {
      // Si el nombre está expandido, mostrar el nombre completo con opción de "Ver menos"
      return (
        <>
          {name}
          <button className="show-more" onClick={() => toggleNameExpansion(id)}>
            Ver menos
          </button>
        </>
      );
    }

    // Si el nombre tiene más de 10 caracteres, mostrar una versión truncada con "Ver más"
    if (name.length > 10) {
      return (
        <>
          {name.substring(0, 10)}...
          <button className="show-more" onClick={() => toggleNameExpansion(id)}>
            Ver más
          </button>
        </>
      );
    }

    // Si el nombre es corto, mostrarlo completo sin botón adicional
    return name;
  };

  return (
    <div className="user-list">
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* Mostrar el nombre (con posible truncado), email y edad del usuario */}
            <span>{truncateName(user)} - {user.email} - {user.age} años</span>
            <div>
              {/* Botón para iniciar la edición del usuario */}
              <button onClick={() => setEditingUser(user)}>Editar</button>
              {/* Botón para eliminar el usuario, llamando a la función deleteUser */}
              <button onClick={() => deleteUser(user.id)} className="delete-button">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
