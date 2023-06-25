<template>
  <div class="nav-wrapper">
    <nav>
      <div class="left-section">
        <div class="sidebar-button" @click="toggleSidebar" ref="sidebarButton">
          <img class="icon" src="@/assets/sidebar-icon.png" alt="Sidebar Icon" />
        </div>
        <img class="logo" src="@/assets/logo-nav.png" />
        <p class="logo-text">Baby Dev</p>
      </div>
      <div class="right-section">
        <div class="menu-items">
          <ul>
            <li><a href="http://localhost:8081/">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="search-bar">
          <input @keydown.enter="searchJobs" v-model="searchedText" class="search-input" type="text" placeholder="Search" />
          <img style="cursor:pointer" @click="searchJobs" class="search-button" src="@/assets/search.png"/>
        </div>
        <div v-if="role !== 'STANDARD'" class="user-profile" style="cursor:default">
          <img class="profile-img" :src="profileImageSource" />
          <span>{{ firstName }} {{ lastName }}</span>
        </div>
        <div v-else-if="isLoggedIn" class="user-profile" @click="goToProfile">
          <img class="profile-img" :src="profileImageSource" />
          <span>{{ firstName }} {{ lastName }}</span>
        </div>
        <simple-button style="width:120px; margin-left:10px" secondary v-if="!isLoggedIn" @click="goToLogin">Login</simple-button>
      </div>
      <div class="overlay" v-if="isSidebarOpen"></div>
    </nav>
    <aside :class="{ 'sidebar-open': isSidebarOpen }" ref="sidebar" style="position: absolute; z-index: 9999; overflow-y:hidden">
      <h2 style="margin-bottom:0px; font-size:56px; font-style:italic;">Sidebar</h2>
      <p style="font-style:italic;">@babydev</p>
      <div v-if="isLoggedIn">
        <img class="profile-img-sidebar" v-if="photo" :src="profileImageSource" />
        <img class="profile-img-sidebar" v-else src="@/assets/profile-default.png" />
        <p style="font-size: 24px; margin-bottom:0px;">Welcome, </p>
        <p style="font-size: 18px;">{{ firstName }} {{ lastName }}</p>
        <a v-if="role==='ADMIN'" style="text-decoration: none" href="http://localhost:8081/register-requests">Recruiter requests</a> <br>
        <a v-if="role==='RECRUITER'" style="text-decoration: none" href="http://localhost:8081/jobs/manage">Add new job</a> <br>
        <a v-if="role==='RECRUITER'" style="text-decoration: none" href="http://localhost:8081/jobs?posted=true">Jobs posted</a> <br>
        <a v-if="role==='STANDARD'" style="text-decoration: none" href="http://localhost:8081/jobs?saved=true">Saved jobs</a> <br>
        <a v-if="role==='STANDARD'" style="text-decoration: none" href="http://localhost:8081/jobs?applied=true">Applied jobs</a> <br>
        <a style="text-decoration: none;" href="#" @click.prevent="logout">Log out</a>
      </div>
    </aside>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import router from '@/router';
import store from '@/store';
import SimpleButton from "@/components/SimpleButton.vue";

export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'firstName', 'lastName', 'photo', 'role']),
    profileImageSource() {
      return this.photo ? 'data:image/jpg;base64,' + this.photo : require('@/assets/profile-default.png');
    },
  },
  components: {
    SimpleButton,
  },
  methods: {
    ...mapActions(['login', 'logout']),
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    logout() {
      store.commit('logout');
      router.push("/login");
    },
    goToProfile() {
      router.push('/myprofile');
    },
    goToLogin() {
      router.push('/login');
    },
    closeSidebarOnClickOutside(event) {
      if (
        this.isSidebarOpen &&
        this.$refs.sidebar &&
        this.$refs.sidebarButton &&
        !this.$refs.sidebar.contains(event.target) &&
        !this.$refs.sidebarButton.contains(event.target)
      ) {
        this.isSidebarOpen = false;
      }
    },
    searchJobs() {
      router.push({path: "/jobs", query: { search: this.searchedText} })
      .then(() => {
        window.location.reload();
      });
    },
  },
  data() {
    return {
      isSidebarOpen: false,
      searchedText: '',
    };
  },
  mounted() {
    document.addEventListener('click', this.closeSidebarOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeSidebarOnClickOutside);
  }
};
</script>

<style scoped>
.nav-wrapper {
  max-height: 80px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6e2ab3;
  padding: 10px;
  color: white;
  height: 80px;
}

.logo {
  margin-top: 5px;
  margin-left: 80px;
  height: 70px;
  filter: invert(1);
}

.logo-text {
  font-size:42px;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-style: bold;
  margin-top: 14px;
  margin-left:20px;
}

.search-input {
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  padding: 10px;
  width: 300px; 
  height:60%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.7);
  outline: none;
  border-color: #4C17C8;
  box-shadow: 0 0 2px #4C17C8;
}

.search-button {
  width: 30px;
  height: 30px;
  filter: invert(1);
  margin-right: 40px;
  margin-left: 10px;
}

.menu-items ul {
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}

.menu-items ul li {
  margin-top: 12px;
  margin-right: 20px;
}

.menu-items ul li a {
  color: white;
  font-size: 24px;
  text-decoration: none;
}

.right-section {
  display: flex;
  align-items: center;
}

.left-section {
  overflow-y:hidden;
  display: flex;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.search-bar input {
  margin-right: 5px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow-y: hidden;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-img-sidebar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}

.sidebar-button {
  margin-right: 10px;
}

.sidebar-button .icon {
  filter: invert(1);
  margin-top: 5px;
  margin-left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
}

aside {
  width: 300px;
  height: 100vh;
  background-color: #f1f1f1;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s;
  padding: 20px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  pointer-events: auto;
}

.sidebar-open {
  transform: translateX(0);
  z-index: 9999;
}


</style>
