import React from 'react'
import './App.css';

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from './firebase';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer
} from "@react-firebase/auth";

//Material UI imports
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import Fab from '@material-ui/core/Fab';

//Material Icons
import HomeIcon from '@material-ui/icons/Home';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';

//Fab menu
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

//Local Components
import LoginPage from './components/login/loginPage';
import HomePage from './components/homepage/homePage';

const useStyles = makeStyles({
  bottomNav: {
    width: '100%',
    backgroundColor: '#485051',
    position: 'absolute',
    bottom: 0

  },
  bottomNavIcon: {
  },
  mainPaper: {
    width: '90%',
    height: '98%',
    margin: '0% 5% 3% 5%',
    backgroundColor: '#2d2f2f'
  }
});

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState('home');

  const PageReturn = () => {
    switch (value) {
      case 'home':
        return <HomePage />;
      case 'weekview':
        return "week";
      case 'settings':
        return "settings";
      default:
        return 'home'
    }
  }
  
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <div className="App">
        <Paper className={classes.mainPaper} elevation={3}>

          {/* <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button> */}
          <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
              console.log(user)
              return isSignedIn ? (<PageReturn />) : (<LoginPage />)
            }}
          </FirebaseAuthConsumer>
          

          <Fab
            // mainButtonStyles={mainButtonStyles}
            // actionButtonStyles={actionButtonStyles}
            // style={style}
            icon={"☰"}
            // event={event}
            alwaysShowTitle={true}
          // onClick={}
          >

            <Action
              text="Add New Task"
            // onClick={handleEmailOnClick}
            >
              <AddIcon />
            </Action>

            <Action
              text="Home"
              onClick={(e) => setValue("home")}
            >
              <HomeIcon />
            </Action>

            <Action
              text="Your Week"
              onClick={(e) => setValue("weekview")}
            // onClick={handleEmailOnClick}
            >
              <DateRangeIcon />
            </Action>

            <Action
              text="Settings"
              onClick={(e) => setValue("settings")}
            >
              <SettingsIcon />
            </Action>

          </Fab>
        </Paper>

      </div>
    </FirebaseAuthProvider>
  );
}

export default App;
