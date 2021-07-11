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
        // let tasks = []
        return firebase.database().ref(`${user}`)
        // .on("value", e=>{
        //     let uobj = e.val()
            
        //     let tasks_for_day = uobj['user_week'][day]['tasks'].filter(e=>{
        //         console.log(e, typeof(e))
        //         return e
        //     })
            
        //     console.log(tasks_for_day)
        //     // if(tasks_for_day !== null){
        //         tasks = tasks_for_day.map(tsk=>uobj['all_tasks'][tsk])
        //     //}
        //     console.log(tasks)
            
        // });
        
        // return tasks
        // let dayTasks =  firebase.database().ref(`${user}/user_week/${day}/tasks`).on("value", e=>{
        //     e.forEach((item) => {
        //     let key = item.val();
        //     //tasks.push(alltasks[key])
        // });
        // });
        //let alltasks = firebase.database().ref(`${user}/all_tasks`);
        // 
        
        // return tasks
    }
  
    // create(Task) {
    //   return db.push(Task);
    // }
  
    // update(key, value) {
    //   return db.child(key).update(value);
    // }
  
    // delete(key) {
    //   return db.child(key).remove();
    // }
  
    // deleteAll() {
    //   return db.remove();
    // }
  }
  
  export default new TaskDataService();