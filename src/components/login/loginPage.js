import React from 'react'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import firebase from "firebase/app";
import "firebase/auth";

import TextField from '@material-ui/core/TextField';

export default function LoginPage(props) {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    return (
        <Grid
            style={{ height: '100%' }}
            container spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item sm={3}></Grid>
            <Grid item sm={6} className={'text-stack'}>
                <h1>Log in or something</h1>
                <br /><br />
                <TextField
                    id="filled-name"
                    label="Username"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    variant="filled"
                />
                <br />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <Button variant="contained" color="primary" size="large"
                    onClick={() => {
                        firebase.auth().signInWithEmailAndPassword(email, password)
                            .then((userCredential) => {
                                // Signed in
                                var user = userCredential.user;
                                
                                props.setUser(user)
                                // ...
                            })
                            .catch((error) => {
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log(errorCode, errorMessage)
                            });

                        // const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                        // firebase.auth().signInWithRedirect(googleAuthProvider);
                    }}>
                    Sign In 
                </Button>
            </Grid>
            <Grid item sm={3}></Grid>
        </Grid>
    )

}