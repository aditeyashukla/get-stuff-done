import firebase from "firebase/app";
import "firebase/database";


class TaskDataService {

    get_all_tasks(user) {
      return firebase.database().ref(`${user}/all_tasks`);
    }

    get_user_week(user,day){
        return firebase.database().ref(`${user}/user_week`);
    }

    get_user_obj(user){
        return firebase.database().ref(`${user}`)
    }

    make_user_obj(user){
        let ref = firebase.database().ref(`/`)
        return ref.child(user.uid).set({
          "all_tasks" : {
          },
          "user_week":[
            {"checked": false, "tasks": [], "name":"sun"},
            {"checked": false, "tasks": [], "name":"mon"},
            {"checked": false, "tasks": [], "name":"tue"},
            {"checked": false, "tasks": [], "name":"wed"},
            {"checked": false, "tasks": [], "name":"thu"},
            {"checked": false, "tasks": [], "name":"fri"},
            {"checked": false, "tasks": [], "name":"sat"}
          ],
          "email" : user.email,
          "displayName" : user.displayName
        });
    }
    
    clearPastWeek(user,day_no){
      //for each day from 0 to <day_no , go through userweek in that day
        //if NOT checked
          //for each task
            //if task repeat, set complete false
            //else 
              //remove task from user week day
              //remove day from task days
              //if days empty then remove task entirely
          //set day checked true
      
    }
  
    create(task_object,uid) {
      let allTasksRef = firebase.database().ref(`${uid}/all_tasks`);
      let key = allTasksRef.push(task_object);
      task_object["days"].map(day => {
        let userWeekRef = firebase.database().ref(`${uid}/user_week/${day}/tasks`);
        let oldTasks = []
        userWeekRef.on('value', (snap) => {
          if (snap.val() !== null) {
            console.log("tes", snap.val())
            oldTasks = snap.val()
          }
        });
        oldTasks.push(key.key)
        userWeekRef.set(oldTasks)

      })
    }
    
    changeTaskStatus(user,key,status){
      let ref = firebase.database().ref(`${user}/all_tasks/${key}`);
      return ref.update({"complete":status})
    }

    editTask(id,task){
      //get userobj
      //check if days changed
      //update in all tasks
      //if days changed
      //get day diff
      //for each in days added, add to user week
      //for each in days deleted, add to user week

      //   return db.child(key).update(value);
    }
    
    delete(key) {
      //get userobj
      //delete in all tasks
      //for each in days, delete from user week

      //return db.child(key).remove();
    }
  
  }
  
  export default new TaskDataService();