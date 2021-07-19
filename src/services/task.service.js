import firebase from "firebase/app";
import "firebase/database";


class TaskDataService {

  get_all_tasks(user) {
    return firebase.database().ref(`${user}/all_tasks`);
  }

  get_user_week(user, day) {
    return firebase.database().ref(`${user}/user_week`);
  }

  get_random_tasks(user){
    return firebase.database().ref(`${user}/random_tasks`)
  }

  get_user_obj(user) {
    return firebase.database().ref(`${user}`)
  }

  make_user_obj(user, displayName) {
    let ref = firebase.database().ref(`/`)
    console.log("SETTING NAME TO", displayName)
    return ref.child(user.uid).set({
      "all_tasks": {
      },
      "user_week": [
        { "checked": false, "tasks": [], "name": "sun" },
        { "checked": false, "tasks": [], "name": "mon" },
        { "checked": false, "tasks": [], "name": "tue" },
        { "checked": false, "tasks": [], "name": "wed" },
        { "checked": false, "tasks": [], "name": "thu" },
        { "checked": false, "tasks": [], "name": "fri" },
        { "checked": false, "tasks": [], "name": "sat" }
      ],
      "email": user.email,
      "displayName": displayName
    });
  }

  clearPastWeek(user, day_no) {
    //get user obj
    //for each day from 0 to <day_no , go through userweek in that day
    //if NOT checked
    //for each task
    //if task repeat, set complete false
    //else 
    //if expired then remove task
    //set day checked true
    let right_now = new Date()
    let uoref = firebase.database().ref(`${user}`)
    //console.log("starting")
    uoref.get().then((snap) => {
      if (snap.val() !== null) {
        let uobj = snap.val()
        for (let pd = 0; pd < 7; pd++) {
          if (!uobj['user_week'][pd]['checked']) {
            //console.log("checking day ",pd)
            if ('tasks' in uobj['user_week'][pd]) {
              let tasks_for_week = uobj['user_week'][pd]['tasks'].slice()
              tasks_for_week.map(id => {
                if (uobj['all_tasks'][id]['repeat']) {
                  firebase.database().ref(`${user}/all_tasks/${id}`).child('complete').set(false)
                  // uobj['all_tasks'][id]['complete'] = false
                } else {
                  if (right_now > new Date(uobj['all_tasks'][id]['expiry'])) {
                    this.delete(user, id)
                  }
                }
              })
            }
            firebase.database().ref(`${user}/user_week/${pd}`).child('checked').set(true)
          }
        }
      }
    })
  }

  create(task_object, uid, random) {

    if (random) {
      let randTaskRef = firebase.database().ref(`${uid}`);
      let key = randTaskRef.child("random_tasks").push(task_object);
    } else {
      let expiry = new Date()
      let task_d = parseInt(task_object['days'][task_object['days'].length - 1])

      let toDay = expiry.getDay()
      let d = expiry.getDate()
      let ddiff = task_d < toDay ? 14 + (task_d - toDay) : 7 + (task_d - toDay)

      expiry.setDate(ddiff + d)
      expiry.setHours(0)
      expiry.setMinutes(0)
      expiry.setSeconds(0)
      expiry.setMilliseconds(0)
      task_object['expiry'] = expiry.toString()
      let allTasksRef = firebase.database().ref(`${uid}/all_tasks`);
      let key = allTasksRef.push(task_object);
      task_object["days"].map(day => {
        this.addToDaytasks(uid, day, key.key)
        firebase.database().ref(`${uid}/user_week/${day}`).child('checked').set(false)
      })
    }

  }

  addToDaytasks(uid, day, key) {
    //console.log("add",day,key)
    let userWeekRef = firebase.database().ref(`${uid}/user_week/${day}/tasks`);
    let oldTasks = []
    userWeekRef.get().then((snap) => {
      if (snap.val() !== null) {
        oldTasks = snap.val()
        oldTasks.push(key)
        //console.log("adding",oldTasks)
        userWeekRef.set(oldTasks)
      } else {
        firebase.database().ref(`${uid}/user_week/${day}`).child('tasks').set([key])
      }
    })

  }

  deleteFromDaytasks(uid, day, key) {
    //console.log("delete",day,key)
    let userWeekRef = firebase.database().ref(`${uid}/user_week/${day}/tasks`);
    let oldTasks = []
    userWeekRef.get().then((snap) => {
      if (snap.val() !== null) {
        oldTasks = snap.val()
        //console.log("got", oldTasks)
        const index = oldTasks.indexOf(key);
        if (index > -1) {
          oldTasks.splice(index, 1);
        }
        //console.log("deleting",oldTasks)
        userWeekRef.set(oldTasks)
      }
    })

  }

  changeTaskStatus(user, key, status,random) {
    if(random){
      let randTaskRef = firebase.database().ref(`${uid}/random_tasks`);
      randTaskRef.child(key).update({ "complete": status })
    }else{
      let ref = firebase.database().ref(`${user}/all_tasks/${key}`);
    return ref.update({ "complete": status })
    }
    
  }

  daysChanged(oldD, newD) {
    let addDays = newD.filter(day => !(oldD.includes(day)))
    let delDays = oldD.filter(day => !(newD.includes(day)))
    return [addDays, delDays]
  }

  editTask(uid, key, task, random = false) {
    if (random) {
      let randTaskRef = firebase.database().ref(`${uid}/random_tasks`);
      randTaskRef.child(key).update(task)
    } else {
      let all_task_ref = firebase.database().ref(`${uid}/all_tasks`)
      all_task_ref.get().then((snapshot) => {
        if (snapshot.exists()) {
          //get userobj
          let all_tasks = snapshot.val()
          //check if days changed
          let [addDays, deleteDays] = this.daysChanged(all_tasks[key]['days'], task['days'])
          //update in all tasks
          if (task['time'] === undefined) { task['time'] = null }
          console.log("updating", key, task)
          all_task_ref.child(key).update(task)
          //for each in days added, add to user week
          //for each in days deleted, add to user week
          addDays.map(ad => {
            this.addToDaytasks(uid, ad, key)
          })
          deleteDays.map(ad => {
            this.deleteFromDaytasks(uid, ad, key)
          })
        }
      })
    }
  }

  delete(uid, key, random = false) {
    if (random) {
      let randTaskRef = firebase.database().ref(`${uid}/random_tasks`);
      randTaskRef.child(key).remove()
    }
    else {
      let all_task_ref = firebase.database().ref(`${uid}/all_tasks`)
      all_task_ref.get().then((snapshot) => {
        if (snapshot.exists()) {
          //get userobj
          let all_tasks = snapshot.val()

          //delete in all tasks
          all_task_ref.child(key).remove()

          //for each in days delete from user week
          all_tasks[key]['days'].map(ad => {
            this.deleteFromDaytasks(uid, ad, key)
          })
        }
      })
    }
  }

}

export default new TaskDataService();