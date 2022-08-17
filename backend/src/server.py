from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
#Manage to password
import crypt

app = Flask(__name__)

# CONFIG
#Configuracion de Mongo    protocolo :// servidor / base de datos
app.config['MONGO_URI'] = 'mongodb://localhost/pythonreactdbusers'
mongo = PyMongo(app)

#Middlewares
CORS(app)       #Activar los cors 

#Apuntar a una coleccion dentro de Mongo -> users , si no existe la crea
db = mongo.db.users

# ROUTES
@app.route('/')
def home():
    return '<h1>Hola Mundo</h1>'

    #Get All Users
@app.route('/users',methods=['GET'])
def getAllUsers():
    users = []  
    for doc in db.find():   #Por cada registro se va a estar llenando la lista usuarios
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)

    #GetOneUser
@app.route('/users/<id>',methods=['GET'])
def getOneUser(id):
    user = db.find_one({'_id':ObjectId(id)})
    #return jsonify(user)       Id no es serializable -> se necesita el str(ObjetId)
    return jsonify({
        '_id':str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })

    #Post User
@app.route('/users', methods=['POST'])
def saveUser():
    #print(request.json)        Mostrar por consola el valor de la peticion POST en formato JSON

    #Encriptar contraseña antes de enviar a la DB
    passHash = crypt.crypt(request.json['password'],'s0/\/\P4$$w0rD')

    #Agregar registro a la DB
    user = db.insert_one({    
            "name": request.json['name'],
            "email": request.json['email'],
            "password": passHash
    })
    print(user.inserted_id)           #Mostrar por consola el Id de ese registro en la DB
    ################################################OJOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo###################################
    #print(ObjectId(str(id)))           is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string
    
    return jsonify(str(user.inserted_id))      #Retonar al front id de record en la DB

    #Delete User
@app.route('/users/<id>',methods=['DELETE'])
def deleteUser(id):
    db.delete_one({'_id':ObjectId(id)})
    print(id)
    return jsonify({'msg':'Deleted User'})
    #return '<p>Delete a User Id.{} </p>'.format(id)

    #Update a User
@app.route('/users/<id>',methods=['PUT'])
def updateUser(id):
    print(id)   #Obtener Id
    print(request.json)     #Obtener valores a actualizar

    #print("Como se recibe ",request.json['password'])

    #Encriptar contraseña antes de enviar a la DB
    passHash = crypt.crypt(request.json['password'],'s0/\/\P4$$w0rD')

    #print("Como se envia de nuevo: ",passHash)

    db.update_one({'_id': ObjectId(id)}, {'$set':{
        'name': request.json['name'],
        'email': request.json['email'],
        'password': passHash
    }})
    return jsonify({'msg':'Updated User'})
    #return '<p>Put a user Id. {}</p>'.format(id)



# START SERVER
if __name__ == '__main__':
    app.run(debug=True, port="5000")


#32.42