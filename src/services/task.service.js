import firebase from "firebase/app";
import "firebase/database";


class TaskDataService {

  get_all_tasks(user) {
    return firebase.database().ref(`${user}/all_tasks`);
  }

  get_user_week(user, day) {
    return firebase.database().ref(`${user}/user_week`);
  }

  get_user_obj(user) {
    return firebase.database().ref(`${user}`)
  }

  make_user_obj(user) {
    let ref = firebase.database().ref(`/`)
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
      "displayName": user.displayName
    });
  }

  clearPastWeek(user, day_no) {
    //get user obj
    //for each day from 0 to <day_no , go through userweek in that day
    //if NOT checked
    //for each task
    //if task repeat, set complete false
    //else 
    //remove task from user week day
    //remove day from task days
    //if days empty then remove task entirely
    //set day checked true
    //console.log("getting reff",user)
    let uoref = firebase.database().ref(`${user}`)
    //console.log("starting")
    uoref.get().then((snap) => {
      if (snap.val() !== null) {
        let uobj = snap.val()
        let actu_day = day_no === 0 ? 7 : day_no
        for(let pd=0;pd<actu_day;pd++){
          if(!uobj['user_week'][pd]['checked']){
            console.log("checking day ",pd)
            if('tasks' in uobj['user_week'][pd]){
              let tasks_for_week = uobj['user_week'][pd]['tasks'].slice()
              tasks_for_week.map(id=>{
                if(uobj['all_tasks'][id]['repeat']){
                  uobj['all_tasks'][id]['complete'] = false
                }else{
                  const index = uobj['user_week'][pd]['tasks'].indexOf(id);
                  if (index > -1) {
                    uobj['user_week'][pd]['tasks'].splice(index, 1);
                  }
                  const index_of_day = uobj['all_tasks'][id]['days'].indexOf(pd);
                  if (index_of_day > -1) {
                    uobj['all_tasks'][id]['days'].splice(index_of_day, 1);
                  }
                  if(uobj['all_tasks'][id]['days'].length < 1){
                    const index_of_task = uobj['all_tasks'].indexOf(id);
                    if (index_of_task > -1) {
                      uobj['all_tasks'].splice(index_of_task, 1);
                    }
                  }
                }
              })
            }
            uobj['user_week'][pd]['checked'] = true
            //set day 
          let rev_pd = pd === 7 ? 0 : pd
          console.log("set day",rev_pd,uobj['user_week'][pd])
          firebase.database().ref(`${user}/user_week/`).child(rev_pd.toString()).set(uobj['user_week'][pd])
          }
          
        }
        //set all tasks
        //console.log("set all tasks",uobj['all_tasks'])
        uoref.child('all_tasks').set(uobj['all_tasks'])
      }
    })
  }

  create(task_object, uid) {
    let allTasksRef = firebase.database().ref(`${uid}/all_tasks`);
    let key = allTasksRef.push(task_object);
    task_object["days"].map(day => {
      this.addToDaytasks(uid, day,key.key)
    })
  }

  addToDaytasks(uid, day, key) {
    console.log("add",day,key)
    let userWeekRef = firebase.database().ref(`${uid}/user_week/${day}/tasks`);
    let oldTasks = []
    userWeekRef.get().then((snap) => {
      if (snap.val() !== null) {
        oldTasks = snap.val()
        oldTasks.push(key)
        console.log("adding",oldTasks)
        userWeekRef.set(oldTasks)
      }else{
        firebase.database().ref(`${uid}/user_week/${day}`).child('tasks').set([key])
      }
    })
    
  }

  deleteFromDaytasks(uid, day, key) {
    console.log("delete",day,key)
    let userWeekRef = firebase.database().ref(`${uid}/user_week/${day}/tasks`);
    let oldTasks = []
    userWeekRef.get().then((snap) => {
      if (snap.val() !== null) {
        oldTasks = snap.val()
        console.log("got", oldTasks)
        const index = oldTasks.indexOf(key);
        if (index > -1) {
          oldTasks.splice(index, 1);
        }
        console.log("deleting",oldTasks)
        userWeekRef.set(oldTasks)
      }
    })

  }

  changeTaskStatus(user, key, status) {
    let ref = firebase.database().ref(`${user}/all_tasks/${key}`);
    return ref.update({ "complete": status })
  }

  daysChanged(oldD, newD) {
    let addDays = newD.filter(day => !(oldD.includes(day)))
    let delDays = oldD.filter(day => !(newD.includes(day)))
    return [addDays, delDays]
  }

  editTask(uid, key, task) {
    let all_task_ref = firebase.database().ref(`${uid}/all_tasks`)
    all_task_ref.get().then((snapshot) => {
      if (snapshot.exists()) {
        //get userobj
        let all_tasks = snapshot.val()
        //check if days changed
        let [addDays, deleteDays] = this.daysChanged(all_tasks[key]['days'], task['days'])
        //update in all tasks
        
        all_task_ref.child(key).set(task)
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

  delete(uid, key) {
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

export default new TaskDataService();