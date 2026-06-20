import os
import requests
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from model import db, User, Game, UserGame
from routes.library import library_bp
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rest.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'change-this-in-production'
app.config['RAWG_API_KEY'] = os.environ.get('RAWG_API_KEY', '1b95ba1e4ea74ce8bcb453c3e3c0b7b4')
app.register_blueprint(library_bp)
CORS(app)
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)       

with app.app_context():
    db.create_all()

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'})

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'})

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'})

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': token})
    else:
        return jsonify({'error': 'Invalid email or password'})

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'})
    return jsonify({'id': user.id, 'email': user.email})


@app.route('/api/games/search')
def search_games():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter q is required'})

    key = app.config['RAWG_API_KEY']
    if not key:
        return jsonify({'error': 'RAWG_API_KEY is not set. Add it to your environment variables.'})

    rawg_url = f"https://api.rawg.io/api/games?key={key}&search={query}&page_size=20"
    resp = requests.get(rawg_url)
    return jsonify(resp.json())


@app.route('/api/games/<int:rawg_id>')
def game_detail(rawg_id):
    key = app.config['RAWG_API_KEY']
    if not key:
        return jsonify({'error': 'RAWG_API_KEY is not set. Add it to your environment variables.'})

    rawg_url = f"https://api.rawg.io/api/games/{rawg_id}?key={key}"
    resp = requests.get(rawg_url)
    return jsonify(resp.json())


if __name__ == '__main__':
    app.run(debug=True)