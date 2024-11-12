// src/components/UserForm.js
import React, { useState, useEffect } from 'react';

const UserForm = ({ createUser, updateUser, editingUser, setEditingUser }) => {
  // Estado para los valores de nombre, email, y edad del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({}); // Estado para mensajes de error de validación

  // Efecto para actualizar los campos de entrada cuando se selecciona un usuario para edición
  useEffect(() => {
    if (editingUser) {
      // Si hay un usuario en edición, establece los valores en el formulario
      setName(editingUser.name);
      setEmail(editingUser.email);
      setAge(editingUser.age);
    }
  }, [editingUser]);

  // Validar el formato del correo electrónico
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validar todos los campos del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validación del campo de nombre (debe estar entre 2 y 20 caracteres)
    if (name.length < 2 || name.length > 20) {
      newErrors.name = 'El nombre debe tener entre 2 y 20 caracteres.';
    }

    // Validación de correo electrónico usando la función validateEmail
    if (!validateEmail(email)) {
      newErrors.email = 'Formato de correo electrónico no válido.';
    }

    // Validación del rango de edad (debe estar entre 0 y 120)
    if (age < 0 || age > 120) {
      newErrors.age = 'La edad debe estar entre 0 y 120.';
    }

    setErrors(newErrors); // Establecer los errores en el estado
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
    if (!validateForm()) return; // Si la validación falla, no se envía el formulario

    const user = { name, email, age: parseInt(age, 10) }; // Crear objeto usuario con los datos
    if (editingUser) {
      // Si se está editando un usuario existente, llama a updateUser
      updateUser({ ...user, id: editingUser.id });
    } else {
      // Si es un usuario nuevo, llama a createUser
      createUser(user);
    }

    // Limpiar el formulario después de enviar
    setName('');
    setEmail('');
    setAge('');
    setEditingUser(null); // Salir del modo de edición
    setErrors({}); // Limpiar mensajes de error
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de entrada para el nombre */}
      <input
        type="text"
        placeholder="Nombre (2-20 caracteres)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength="20"
        required
      />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>} {/* Mensaje de error para el nombre */}
      
      {/* Campo de entrada para el correo electrónico */}
      <input
        type="email"
        placeholder="Correo (máximo 30 caracteres)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength="30"
        required
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} {/* Mensaje de error para el correo */}
      
      {/* Campo de entrada para la edad */}
      <input
        type="number"
        placeholder="Edad (0-120)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>} {/* Mensaje de error para la edad */}
      
      {/* Botón de envío (crea o actualiza el usuario según el modo) */}
      <button type="submit" className="confirm-update-button">
        {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
      
      {/* Botón de cancelar (visible solo en modo de edición) */}
      {editingUser && (
        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="cancel-button"
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default UserForm;
