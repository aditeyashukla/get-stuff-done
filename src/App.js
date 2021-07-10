import React from 'react'
import './App.css';

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from './firebase';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";

//Material UI imports
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';

//Material Icons
import HomeIcon from '@material-ui/icons/Home';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SettingsIcon from '@material-ui/icons/Settings';

//Local Components
import LoginPage from './components/login/loginPage';
import HomePage from './components/homepage/homePage';

const useStyles = makeStyles({
  bottomNav: {
    width: '100%',
    backgroundColor:'#485051',
    position: 'absolute',
    bottom: 0
    
  },
  bottomNavIcon:{
  },
  mainPaper:{
    width: '90%',
    height: '88%',
    margin: '0% 5% 3% 5%',
    backgroundColor:'#2d2f2f'
  }
});

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const PageReturn = () => {
    switch(value){
      case 'home': 
        return <HomePage/>;
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
        return isSignedIn ? (<PageReturn/>) : (<LoginPage/>)
      }}
    </FirebaseAuthConsumer>
        </Paper>
      <BottomNavigation value={value} showLabel={false} onChange={handleChange} className={classes.bottomNav}>
      <BottomNavigationAction label="Home" value="home"  className={classes.bottomNavIcon} icon={<HomeIcon />} />
      <BottomNavigationAction label="Your Week" className={classes.bottomNavIcon} value="weekview" icon={<DateRangeIcon />} />
      <BottomNavigationAction label="Settings" className={classes.bottomNavIcon} value="settings" icon={<SettingsIcon />} />
    </BottomNavigation>
    
    </div>
    </FirebaseAuthProvider>
  );
}

export default App;
