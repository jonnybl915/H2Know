// modules

let PlantModel = require('../model/plant');
let PlantCollection = require('../model/plant.collection');
let UserCollection = require('../model/user.collection');
let layoutView = require('./layout');
let tmpl = require('../templates');

/*******************************
* USER-PLANTS VIEW
* (plantModel)::
********************************/

module.exports = Backbone.View.extend({

    url: 'http://localhost:8080/manager/userPlantList',

    initialize() {
        this.userList = new UserCollection();
    },

    events: {
      'click #del-plant': 'deleteFromUserList',
      'click #wat-plant': 'waterPlant',

    },

    waterPlant() {
      let plantId = event.target.parentElement.parentElement.previousSibling.getAttribute('data-id');
      let plantObj = this.userList.get(plantId);
      let self = this;

      $.ajax({
            url:`http://localhost:8080/water/${plantId}`,
            method:'PUT',
            success:function(){
              console.log('watering plant');
              self.getUserPlantList();
            },
            error(err) {
                console.error("sumthin's wrong: this is what I tried to sent", err);
                alert("i wrote this alert to be annoying because the watering doesn't work.")
              }
          });

    },

    getUserPlantList() {
      // fetching user plant list from database
      let self = this;

      console.log("usr collection", this.userList)
      let userList = self.userList;

      userList.fetch({
        url: 'http://localhost:8080/manager/userPlantList',
        success() {
          console.log('grabbing plants', userList);
          self.render(userList.models);
        },
        error(err) {
          console.error('aint no plants to grab', err);
          alert("couldn't find any plants.");
        }

      });
    },

      deleteFromUserList() {
        //remove user plant join
        let plantId = event.target.parentElement.parentElement.previousSibling.getAttribute('data-id');
        let plantObj = this.userList.get(plantId);
        let self = this;

        $.ajax({
              url:`http://localhost:8080/manager/userPlantList/${plantId}`,
              method:'DELETE',
              success:function(){
                console.log('deleting plant');
                self.getUserPlantList();
              },
              error(err) {
                  console.error("sumthin's wrong: this is what I tried to sent", err);
                  alert("i wrote this alert to be annoying because the delete doesn't work.")
                }
            });

        // plantObj.destroy({
        //   url: 'http://localhost:8080/manager/userPlantList',
        //   success() {
        //     console.log('deleting plant');
        //     this.getUserPlantList();
        //   },
        //   error(err) {
        //     console.error("sumthin's wrong: this is what I tried to sent", err);
        //     alert("i wrote this alert to be annoying because the delete doesn't work.")
        //   }
        // });

    },

    render(data) {
        // clear and render login to #main
        this.el.innerHTML = '';
        let mgr = document.createElement('DIV');
        mgr.innerHTML = tmpl.manager;
        this.el.appendChild(mgr);
        let ul = document.getElementById('plant-list');

        // insert each plant into add list for user to click
        data.forEach(function(e,i) {

          if (i < 20) {
              let id = `${e.attributes.id}`;
              let name = `${e.attributes.plantName}`
              let node = document.createElement('LI');
              let twinNode = document.createElement('DIV');
              twinNode.classList.add('li-drop-down');

              node.setAttribute('data-id', id);
              node.innerHTML = `${name} <span>+</span>`;
              twinNode.innerHTML = `
                <div class="li-detail-wrap">
                  <span>${e.attributes.species}</span>
                  <span>every: ${e.attributes.wateringInterval} days</span>
                  <img src="./assets/plant${id}.jpg" alt="${name}" />
                  <span>${e.attributes.nextWateringDate}</span>
                  <button id='wat-plant' type="button" name="water">Water Me</button>
                  <button id='del-plant' type="button" name="delete">delete</button>

                </div>
              `;

              ul.appendChild(node);
              ul.appendChild(twinNode);
          } else {return;}
      })
    }
 })
