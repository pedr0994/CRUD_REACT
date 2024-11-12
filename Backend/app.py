# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_cors import CORS
from sqlalchemy import text

# Cargar variables de entorno del archivo .env
load_dotenv()

# Inicializar Flask y configurar CORS
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos usando variables de entorno
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
db = SQLAlchemy(app)

# Modelo de usuario
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "age": self.age,
            "created_at": self.created_at
        }

with app.app_context():
    db.create_all()
    
    #  Verificar la conexion a la base de datos
    try:
        # Realizamos una consulta simple
        db.session.execute(text('SELECT 1'))
        print("Conexion a la base de datos exitosa")
    except Exception as e:
        print(f'Error al conectar a la base de datos: {e}')

# Ruta para obtener todos los usuarios
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({"error": "Error al obtener usuarios", "message": str(e)}), 500

# Ruta para crear un nuevo usuario
@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(name=data['name'], email=data['email'], age=data['age'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        return jsonify({"error": "Error al crear usuario", "message": str(e)}), 500

# Ruta para actualizar un usuario existente
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        user.name = data['name']
        user.email = data['email']
        user.age = data['age']
        db.session.commit()
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({"error": "Error al actualizar usuario", "message": str(e)}), 500

# Ruta para eliminar un usuario
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204
    except Exception as e:
        return jsonify({"error": "Error al eliminar usuario", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
