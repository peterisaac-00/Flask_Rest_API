from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password_hash = db.Column(db.String(50))

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rawg_id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(30))
    cover = db.Column(db.String(250)) 

class UserGame(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20))
    rating = db.Column(db.Integer)

#test