(function(){// sortData : function(sorter, val ,bool){
//   if(sorter =='name'){
//     Pages.set({
//       perPage:10,
//       table:{ fields:['name','assignedUserName']},
//       sort:{name:val},
//       filters:{completed:bool}
//       });
//   }
//   if(sorter == 'deadline'){
//     Pages.set({
//       perPage:10,
//       table:{ fields:['name','assignedUserName']},
//       sort:{deadline:val},
//       filters:{completed:bool}
//       });
//   }
//   if(sorter == 'dateCreated'){
//     Pages.set({
//       perPage:10,
//       table:{ fields:['name','assignedUserName']},
//       sort:{dateCreated:val},
//       filters:{completed:bool}
//       });
//   }
//   if(sorter == 'assignedUserName'){
//     Pages.set({
//       perPage:10,
//       table:{ fields:['name','assignedUserName']},
//       sort:{assignedUserName:val},
//       filters:{completed:bool}
//       });
//   }
//
// }
//
// if (Meteor.isClient) {
  // counter starts at 0
  // Session.setDefault('counter', 0);


    // .get(function () {
    //   this.response.end('get request\n');
    // })
    // .post(function () {
    //   this.response.end('post request\n');
    // });
//
//   $(document).ready( function(){
//
//   });
//
//
//
//
//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });
//
//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//     return Meteor.methods({
//       removeUser: function(username) {
//      return Userlist.remove({name:username});}});
//   });
// }
// Userlist.attachSchema(new Schema({
//   name: {
//     type: String,
//     label: "Name",
//     index: true,
//     unique: true,
//     optional: false
//   },
//
//   email: {
//     type: String,
//     regEx: SimpleSchema.RegEx.Email,
//     index: true,
//     unique: true,
//     optional: false
//
//   },
//   pendingTasks:[String],
//   dateCreated: {
//     type: Date,
//       autoValue: function() {
//         if (this.isInsert) {
//           return new Date();
//         } else if (this.isUpsert) {
//           return {$setOnInsert: new Date()};
//         } else {
//           this.unset();
//         }
//       }
//   }
//   }
// ));
// Tasklist.attachSchema(new Schema({
//   name:{
//     type: String,
//     label: "Name",
//     optional: false
//   },
//   description:{
//     type: String,
//     label: "Description",
//     optional: false
//   },
//   deadline:{
//     type: String,
//     label: "deadline",
//     optional: false
//   },
//   completed:Boolean,
//   assignedUser:{
//     type: String,
//     label: "UserId",
//     optional: true
//   },
//   assignedUserName:{
//     type: String,
//     label: "UserName",
//     optional: false
//   },
//   dateCreated: {
//     type: Date,
//       autoValue: function() {
//         if (this.isInsert) {
//           return new Date();
//         } else if (this.isUpsert) {
//           return {$setOnInsert: new Date()};
//         } else {
//           this.unset();
//         }
//       }
//   }
// }));

})();
