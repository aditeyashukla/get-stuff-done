//app.js
import React from 'react'
import './App.css';

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from './firebase';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer
} from "@react-firebase/auth";


//Material UI imports
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';


//Material Icons
import HomeIcon from '@material-ui/icons/Home';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import SelectAllIcon from '@material-ui/icons/SelectAll';

//Fab menu
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

//Time picker
import TimePicker from 'react-time-picker';

//Local Components
import LoginPage from './components/login/loginPage';
import HomePage from './components/homepage/homePage';
import WeekView from './components/weekview/weekViewPage';
import SettingsPage from './components/settings/settingsPage';
import RandomTasksPage from './components/randomTasks/randomTaskPage';

import TaskDataService from './services/task.service';

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
    height: '100vh',
    margin: '0% 5% 3% 5%',
    boxShadow:'none',
    backgroundColor: '#2d2f2f',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollBehavior: 'smooth'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalPaper: {
    backgroundColor: '#4c4c4c',
    color: '#ffffff',
    padding: '0 5% 5% 5%',
    boxShadow: '5px 5px #8888880d',
    borderRadius: '6px',
    textAlign: 'center',
    fontFamily: 'Maven Pro'
  },
  form: {
    color: '#ffffff'
  },
  weekdays: {
    color: '#a9e3f3',
    background: '#616161',
    '&:hover': {
      color: '#616161',
      background: '#a9e3f3',
    },
  }
});

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState('home');

  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalTaskName, setmodalTaskName] = React.useState("")
  const [modalRepeating, setModalRepeating] = React.useState(false)
  const [modalDays, setModalDays] = React.useState(dayObjwithToday())
  const [modalTime, setModalTime] = React.useState(null)
  const [modalError, setModalError] = React.useState("")
  const [taskEdit, setTaskEdit] = React.useState(false)
  const [editTaskID, setEditTaskID] = React.useState("")
  const [ taskRandom, setTaskRandom] = React.useState(false)
  const [clearedWeek, setWeekClear] = React.useState(false)

  const PageReturn = (user) => {
    console.log("AAA")
    switch (value) {
      case 'home':
        return <HomePage key={"home"} user={user} />;
      case 'weekview':
        return "week";
      case 'settings':
        return "settings";
      default:
        return 'home'
    }
  }

  const ColouredCheckbox = withStyles({
    root: {
      color: '#a9e3f3',
      '&$checked': {
        color: '#a9e3f3',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  async function deleteTask(e, uid){
    e.preventDefault()
    setModalError("")
    let random = value === "random"
    TaskDataService.delete(uid, editTaskID, random);
    setModalOpen(false)
    setTaskRandom(false)
  }

  async function addNewTask(e, uid) {
    e.preventDefault()
    setModalError("")
    let dayList = Object.keys(modalDays).filter(key => modalDays[key])
    let random = dayList.length < 1;
    if(value === "random"){random = true}
    let task_object = {
      "name": modalTaskName,
      "repeat": modalRepeating,
      "days": dayList,
      "time": modalTime,
      "complete": false,
      "random": random,
    }
    if(taskEdit){
      TaskDataService.editTask(uid, editTaskID, task_object, random)
    }else{
      console.log("creating", task_object,random)
      TaskDataService.create(task_object,uid,random)
    }
    setModalOpen(false)
    setTaskRandom(false)
  }

  function dayObjwithToday(){
    let day_bp = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
    let today = new Date()
    day_bp[today.getDay()] = true
    return day_bp
  }

  function clearModal() {
    setmodalTaskName("");
    setModalRepeating(false);
    setModalDays(dayObjwithToday())
    setModalTime(null)
    setModalError("")
  }
  
  return (

    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <div className="App">
        <Paper className={classes.mainPaper} >

          
          <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
              if(isSignedIn && !clearedWeek){
                let day = (new Date()).getDay().toString()
                //CLEAR WEEK
                console.log("CLEARING WEEK")
                TaskDataService.clearPastWeek(user.uid, day)
                setWeekClear(true)
              }
              return isSignedIn ? (<>
                {value === "home" &&
                <HomePage key={"home"} user={user} open={setModalOpen} setName={setmodalTaskName}
                setRep={setModalRepeating} setDays={setModalDays} setTime={setModalTime} setEdit={setTaskEdit}
                setEditTaskID={setEditTaskID} />
                }
                {value === "weekview" &&
                  <WeekView key={"home"} user={user} open={setModalOpen} setName={setmodalTaskName}
                  setRep={setModalRepeating} setDays={setModalDays} setTime={setModalTime} setEdit={setTaskEdit}
                  setEditTaskID={setEditTaskID} />
                }
                {value === "random" &&
                  <RandomTasksPage
                  key={"home"} user={user} open={setModalOpen} setName={setmodalTaskName}
                  setRep={setModalRepeating} setDays={setModalDays} setTime={setModalTime} setEdit={setTaskEdit}
                  setEditTaskID={setEditTaskID} setTaskRandom={setTaskRandom}
                  />
                }
                {value === "settings" &&
                  <SettingsPage/>
                }
                
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
                    onClick={e => { setTaskEdit(false); clearModal(); setModalOpen(true) }}
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
                    text="Random Tasks"
                    onClick={(e) => setValue("random")}
                  // onClick={handleEmailOnClick}
                  >
                    <SelectAllIcon />
                  </Action>

                  <Action
                    text="Settings"
                    onClick={(e) => setValue("settings")}
                  >
                    <SettingsIcon />
                  </Action>

                </Fab>

                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={modalOpen}
                  onClose={e => setModalOpen(false)}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={modalOpen}>
                    <div className={classes.ModalPaper}>
                      <h2 id="transition-modal-title">{taskEdit ? "Edit Task" : "Add New Task"}</h2>
                      <form onSubmit={addNewTask}>
                        <FormControl fullWidth>
                          <TextField className={classes.form} id="standard-basic" label="Task Title" required value={modalTaskName} onChange={e => setmodalTaskName(e.target.value)} />
                          
                          {!(taskRandom || value === "random") &&
                            <>
                            <br />
                          <FormControlLabel
                            control={<ColouredCheckbox checked={modalRepeating}
                              onChange={e => setModalRepeating(e.target.checked)}
                              name="checkedB"
                              color="primary" />}
                            label="Repeat Every Week"
                          />
                            <br />
                          <ButtonGroup color="primary" className={classes.weekdays} id={"aa"} aria-label="outlined primary button group">
                            <Button onClick={e => setModalDays({ ...modalDays, 1: !modalDays[1] })} variant={modalDays[1] ? "contained" : "outlined"}>M</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 2: !modalDays[2] })} variant={modalDays[2] ? "contained" : "outlined"}>T</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 3: !modalDays[3] })} variant={modalDays[3] ? "contained" : "outlined"}>W</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 4: !modalDays[4] })} variant={modalDays[4] ? "contained" : "outlined"}>Th</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 5: !modalDays[5] })} variant={modalDays[5] ? "contained" : "outlined"}>F</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 6: !modalDays[6] })} variant={modalDays[6] ? "contained" : "outlined"}>S</Button>
                            <Button onClick={e => setModalDays({ ...modalDays, 0: !modalDays[0] })} variant={modalDays[0] ? "contained" : "outlined"}>S</Button>
                          </ButtonGroup>
                          <br />
                          <TimePicker disableClock format={"h:m a"} className={"timepick"} clearIcon={<ClearIcon />}
                            value={modalTime}
                            onChange={e => setModalTime(e)}
                          />
                          </>
                          }
                          <br />
                          <Button type="submit" onClick={e => addNewTask(e, user.uid)} className={classes.weekdays} variant={"contained"}>{taskEdit ? "Edit Task" : "Add Task"}</Button>
                          <br />
                          {taskEdit &&
                          <Button type="submit" onClick={e => deleteTask(e, user.uid)} className={classes.weekdays} color="primary" variant={"outlined"}>Delete Task</Button>
                          }
                          <p>{modalError}</p>
                        </FormControl>
                      </form>
                    </div>
                  </Fade>
                </Modal>

              </>) : (<LoginPage />)
            }}
          </FirebaseAuthConsumer>
        </Paper>
      </div>
    </FirebaseAuthProvider>
  );
}

export default App;
