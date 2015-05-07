(function(){
Meteor.startup(function () {
  // code to run on server at startup
  return Meteor.methods({
    removeUser: function(username) {
      return Userlist.remove({_id:username});
    },
    insertUser: function(name,email) {
      return Userlist.insert({
       name:name,
       email:email,
       pendingTasks:[],
       dateCreated: new Date()});
    },
    insertTask:function(name,description, deadline, uid, assignedUserName) {
      return Tasklist.insert({
        name:name,
        description:description,
        deadline:deadline,
        completed:false,
        assignedUser:uid,
        assignedUserName:assignedUserName,
        dateCreated: new Date()
      });
    },
    updateUser:function(uid,tid) {
      return Userlist.update(
        {_id:uid},
        {$push:{pendingTasks: tid}}
        );
    },
    updateUserTasks:function(uid,tid) {
      return Userlist.update(
        {_id:uid},
        {$set :{pendingTasks: tid}}
        );
    },
    completeTask:function(uid) {
      return Tasklist.update(
        {_id:uid},
        {$set :{completed:true,assignedUser:'',assignedUserName:'unassigned' }}
        );
    },
    removeUserfromTask:function(uid) {
      return Tasklist.update(
        {_id:uid},
        {$set :{assignedUser:'',assignedUserName:'unassigned' }}
        );
    },
    removeTask: function(name) {
      return Tasklist.remove({_id:name});
    },
    updateTskName: function(tid,name){
      return Tasklist.update(
        {_id:tid},
        {$set :{name:name }}
        );
    },
    updateTskUser: function(tid,name, uid){
      return Tasklist.update(
        {_id:tid},
        {$set :{assignedUser:uid,assignedUserName:name }}
        );
    },
    updateTskDesc: function(tid,desc){
      return Tasklist.update(
        {_id:tid},
        {$set :{description:desc}}
        );
    },
    updateTskDed: function(tid,ded){
      return Tasklist.update(
        {_id:tid},
        {$set :{deadline:ded}}
        );
    }
  });
});

})();
