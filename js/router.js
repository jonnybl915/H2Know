// modules

let PlantModel = require('./model/plant');
let LayoutView = require('./view/layout');
let LoginView = require('./view/login');
let PlantView = require('./view/plant');
let ManagerView = require('./view/manager');
let PlantCollection = require('./model/plant.collection');
let UserModel = require('./model/user');

/*******************************
* ROUTER
*
********************************/

module.exports = Backbone.Router.extend({


  initialize() {
      let userM = new UserModel();
      let plantM = new PlantModel();

      this.login = new LoginView({
        model: userM,
        el: document.getElementById('main'),
      });

      this.manager = new ManagerView({
        model: plantM,
        el: document.getElementById('main'),
      });

      this.layout = new LayoutView();


  },


  routes: {
    ''        : 'login',
    'manager' : 'manager',
    'plant'   : 'plant',
  },


  /*******************************
    * ROUTE events show/hide VIEWS
    ********************************/

    login() {
      this.layout.header.el.innerHTML = '';
      this.layout.footer.el.innerHTML = '';
      this.manager.el.innerHTML = '';
      this.login.render();
    },

    manager() {
      this.login.el.innerHTML = '';
      this.layout.header.render();
      this.layout.footer.render();

      let plantList = new PlantCollection();

      let self = this.manager;

      plantList.fetch({
        url: 'http://localhost:8080/manager',
        success() {
          console.log('grabbing plants', plantList);
          self.render(plantList.models);
        },
        error(err) {
          console.error('aint no plants to grab', err)
        }

      });

    },

    plant() {

    }
})
