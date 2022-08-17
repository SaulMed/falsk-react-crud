import React, { useState, useEffect } from 'react';

//React-Hot-Toast
import toast, { Toaster } from 'react-hot-toast';

const API = process.env.REACT_APP_BACKEND;

export const Users = () => {

    //Estado de la aplicacion
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Editar
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');

    //Listado
    const [users, setUsers] = useState([]);

    //Una ves montado el componente , ejecutar la siguiente funcion
    useEffect(() => {
        getUsers();
    }, [])

    const cleanInputs = () => {
        setName('');
        setEmail('');
        setPassword('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Obtener data del State
        //console.log(name, email, password);

        if (!editing) {    // AGREGANDO USUARIO
            try {
                const toastLoad = toast.loading("Loading...")
                //Realizar peticion asincrona con metodo POST al backend a traves de fetch
                const res = await fetch(`${API}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });
                const data = await res.json();
                console.log(data);
                toast.dismiss(toastLoad)
                toast.success("User added successfully!")
            } catch (Err) {
                console.log(Err)
                toast.error("Error in the action.")
            }
        } else {      //EDITAR USUARIO
            try {
                const toastLoad = toast.loading("Loading...")
                const res = await fetch(`${API}/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({  //Establecer formato tipo JSON
                        name,
                        email,
                        password
                    })
                });
                const data = await res.json();
                console.log(data);
                toast.dismiss(toastLoad)
                //Establecer el Estado de Editing en False y resetear el estado de id
                setEditing(false);
                setId('');
                toast.success("User updated successfully!")
            }catch (Err){
                console.log(Err)
                toast.error("Error in the action.")
            }
        }


        //Una ves enviada la data , refrescar el listado
        await getUsers();
        //Limpiar los inputs del formulario
        cleanInputs();
    }

    const getUsers = async () => {
        try {
            //Realizar peticion GET al backend para obtener listado de usuarios
            const res = await fetch(`${API}/users`);
            const data = await res.json();
            //Asignar data al estado "users"
            setUsers(data);
            //console.log(data);
        } catch (Err) {
            console.log(Err);
        }
    }

    const editUser = async (id) => {
        //Realizar peticion al Backend para obtener un unico user
        const res = await fetch(`${API}/users/${id}`, {
            method: 'GET'
        });
        const data = await res.json();
        //console.log(data);

        //Cambiar estado de Edit y asignar id al estado
        setEditing(true);
        setId(id);


        //enviar data al formulario
        setName(data.name);
        setEmail(data.email);
        setPassword(data.password);

    }

    const deleteUser = async (id) => {
        let r = window.confirm("Are you sure to delete this User?")

        if (r) {
            try {
                const toastLoad = toast.loading("Loading...")
                //Realizar peticion tipo DELETE al backend para borrar registro
                const res = await fetch(`${API}/users/${id}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                console.log(data);
                //Volver a cargar el listado de usuarios
                await getUsers();
                toast.dismiss(toastLoad)
                //Lanzar notificacion
                toast.success('User deleted successfully!')
            } catch (Err) {
                console.log("Error: " + Err);
                toast.error("Error in the action.")
            }
        }else{
                //Lanzar notificacion
                toast.success('User No deleted yet!')
        }
    }

    return (
        <div className="row">

            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body bg-dark">
                    <div className="form-group m-2">
                        <input
                            autoFocus
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            className="form-control"
                            placeholder="Name"
                            required
                        ></input>
                    </div>
                    <div className="form-group m-2">
                        <input
                            type="email"
                            onChange={e => 
                                setEmail(e.target.value)
                            }
                            value={email}
                            className="form-control"
                            placeholder="Email"
                            required
                        ></input>
                    </div>
                    <div className="form-group m-2">
                        <input
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            placeholder="Password"
                            required
                        ></input>
                    </div>
                    <button className="btn btn-success btn-block m-4">
                        {editing ? 'Update' : 'Create'}
                    </button>
                </form>
            </div>

            <div className="col-md-8 table-responsive">
                <table className="table table-dark table-hover table-striped table-borderless text-center table-condensed">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map(user => (
                                <tr key={user._id}>
                                    <th>{user.name}</th>
                                    <th>{user.email}</th>
                                    <th>{user.password}</th>
                                    <th>
                                        <button
                                            onClick={() => editUser(user._id)}
                                            className="btn btn-info btn-sm btn-block">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="btn btn-danger btn-sm btn-block">
                                            Delete
                                        </button>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <Toaster />
        </div>
    )
}