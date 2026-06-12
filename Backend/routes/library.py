from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from model import db, Game, UserGame

library_bp = Blueprint('library', __name__, url_prefix='/library')


@library_bp.route('', methods=['GET'])
@jwt_required()
def get_library():
    user_id = get_jwt_identity()

    entries = UserGame.query.filter_by(user_id=user_id).all()

    result = []
    for entry in entries:
        result.append({
            'game_id': entry.game_id,
            'name': entry.game.name,
            'cover': entry.game.cover,
            'status': entry.status,
            'rating': entry.rating
        })

    return jsonify(result)


@library_bp.route('', methods=['POST'])
@jwt_required()
def add_to_library():
    user_id = get_jwt_identity()
    data = request.get_json()

    rawg_id = data.get('rawg_id')
    name = data.get('name')
    cover = data.get('cover')
    status = data.get('status', 'planned')
    rating = data.get('rating')

    if not rawg_id or not name:
        return jsonify({'error': 'rawg_id and name are required'})

    game = Game.query.filter_by(rawg_id=rawg_id).first()
    if not game:
        game = Game(rawg_id=rawg_id, name=name, cover=cover)
        db.session.add(game)
        db.session.commit()

    existing = UserGame.query.filter_by(user_id=user_id, game_id=game.id).first()
    if existing:
        return jsonify({'error': 'Game already in library'})

    user_game = UserGame(user_id=user_id, game_id=game.id, status=status, rating=rating)
    db.session.add(user_game)
    db.session.commit()

    return jsonify({'message': 'Game added to library'})


@library_bp.route('/<int:game_id>', methods=['PATCH'])
@jwt_required()
def update_library_entry(game_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    entry = UserGame.query.filter_by(user_id=user_id, game_id=game_id).first()
    if not entry:
        return jsonify({'error': 'Entry not found'})

    if 'status' in data:
        entry.status = data['status']
    if 'rating' in data:
        entry.rating = data['rating']

    db.session.commit()

    return jsonify({'message': 'Entry updated'})


@library_bp.route('/<int:game_id>', methods=['DELETE'])
@jwt_required()
def delete_library_entry(game_id):
    user_id = get_jwt_identity()

    entry = UserGame.query.filter_by(user_id=user_id, game_id=game_id).first()
    if not entry:
        return jsonify({'error': 'Entry not found'})

    db.session.delete(entry)
    db.session.commit()

    return jsonify({'message': 'Entry deleted'})