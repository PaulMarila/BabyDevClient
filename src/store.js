import { createStore } from 'vuex';
import jwtDecode from 'jwt-decode';

const store = createStore({
  state: {
    isLoggedIn: false,
    token: null,
    photo: null,
    user: {
      id: '',
      firstName: '',
      lastName: '',
      role: '',
    }
  },
  mutations: {
    login(state, { token, photo }) { 
      state.isLoggedIn = true;
      state.token = token;

      const decodedToken = jwtDecode(token);
      state.user.id = decodedToken.id;
      state.user.firstName = decodedToken.firstName;
      state.user.lastName = decodedToken.lastName;
      state.user.role = decodedToken.role;
      state.photo = photo; 
      
    },
    logout(state) {
      console.log("logging out");
      state.isLoggedIn = false;
      state.token = null;
      state.photo = null;
      state.user.id = '';
      state.user.role = '';
      state.user.firstName = '';
      state.user.lastName = '';
    },
    setPhoto(state, photo) {
      console.log("photo changed");
      console.log(photo);
      state.photo = photo;
    }
  },
  actions: {
    login({ commit }, { token, photo }) { 
      commit('login', { token, photo }); 
    },
    logout({ commit }) {
      commit('logout');
    },
    setPhoto({ commit }, photo) {
      commit('setPhoto', photo);
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    token: state => state.token,
    user: state => state.user,
    userId: state => state.user.id,
    firstName: state => state.user.firstName,
    lastName: state => state.user.lastName,
    role: state => state.user.role,
    photo: state => state.photo
  }
});

const savedState = localStorage.getItem('store');
if (savedState) {
  store.replaceState(JSON.parse(savedState));
}

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

export default store;
