import React from 'react'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import firebase from "firebase/app";
import "firebase/auth";

export default function SettingsPage() {

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
                <h1>I'll add more stuff in the future but I guess for now:</h1>
                <br /><br/>
                <Button variant="contained" color="primary" size="large" 
                onClick={() => {
                    firebase.auth().signOut();
                  }}>
                    Sign Out
                </Button>
            </Grid>
            <Grid item sm={3}></Grid>
        </Grid>
    )

}