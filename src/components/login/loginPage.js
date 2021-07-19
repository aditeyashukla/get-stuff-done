import React from 'react'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import firebase from "firebase/app";
import "firebase/auth";

import TaskDataService from '../../services/task.service';

export default function LoginPage(props) {
    const [create, setCreate] = React.useState(false)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    return (
        <Grid
            style={{ height: '100%' }}
            container spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            {/* <Grid item sm={1}></Grid> */}
            <Grid item sm={6} className={'text-stack'}>
                <h1>{create ? "Create An Account" : "Log in or something"}</h1>
                <br />
                {create &&
                    <TextField
                        id="filled-name"
                        label="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        variant="filled"
                    />}
                <br /> <br />
                <TextField
                    id="filled-name"
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    variant="filled"
                />
                <br /><br />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br /><br /><br />
                {create ?
                    <>
                        <Button variant="contained" color="primary" size="large"
                            onClick={() => {
                                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                                    .then(() => {
                                        // Existing and future Auth states are now persisted in the current
                                        // session only. Closing the window would clear any existing state even
                                        // if a user forgets to sign out.
                                        // ...
                                        // New sign-in will be persisted with session persistence.
                                        firebase.auth().createUserWithEmailAndPassword(email, password)
                                            .then((userCredential) => {
                                                // Signed in
                                                var user = userCredential.user;
                                                //props.setUser(user)
                                                TaskDataService.make_user_obj(user, name)
                                                // ...
                                            })
                                            .catch((error) => {
                                                var errorCode = error.code;
                                                var errorMessage = error.message;
                                                setError(errorMessage)
                                                console.log(errorCode, errorMessage)
                                            });
                                    })
                                    .catch((error) => {
                                        // Handle Errors here.
                                        var errorCode = error.code;
                                        var errorMessage = error.message;
                                        setError(errorMessage)
                                        console.log(errorCode, errorMessage)
                                    });
                            }}>
                            Create Account
                        </Button>
                        <br /><br />
                        <Button variant="outlined" color="primary" size="large"
                            onClick={() => setCreate(false)}
                        >
                            Nah lol I wanna sign in
                        </Button>
                    </>
                    :
                    <>
                        <Button variant="contained" color="primary" size="large"
                            onClick={() => {
                                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                                    .then(() => {
                                        // Existing and future Auth states are now persisted in the current
                                        // session only. Closing the window would clear any existing state even
                                        // if a user forgets to sign out.
                                        // ...
                                        // New sign-in will be persisted with session persistence.
                                        firebase.auth().signInWithEmailAndPassword(email, password)
                                            .then((userCredential) => {
                                                // Signed in
                                                var user = userCredential.user;
                                                //props.setUser(user)
                                                //TaskDataService.make_user_obj(user, name)
                                                // ...
                                            })
                                            .catch((error) => {
                                                var errorCode = error.code;
                                                var errorMessage = error.message;
                                                setError(errorMessage)
                                                console.log(errorCode, errorMessage)
                                            });
                                    })
                                    .catch((error) => {
                                        // Handle Errors here.
                                        var errorCode = error.code;
                                        var errorMessage = error.message;
                                        setError(errorMessage)
                                        console.log(errorCode, errorMessage)
                                    });
                            }}>
                            Sign In
                        </Button>
                        <br /><br />
                        <Button variant="outlined" color="primary" size="large"
                            onClick={() => setCreate(true)}
                        >
                            Create New Account
                        </Button>
                        <br /><br />
                        <p className="text-stack">{error}</p>
                    </>

                }


            </Grid>
            
        </Grid>
    )

}