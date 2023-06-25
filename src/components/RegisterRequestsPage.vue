<template>
  <NavBar />
  <div class="profile-container">
    <div v-if="viewMode">
      <div class="personal-info-container">
          <div class="left-side">
            <div class="info-details">
              <div class="info-row">
                <span class="info-label">First Name:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Last Name:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone Number:</span>
              </div>
            <div class="smooth-line-left"> </div>
            <div class="image-container">
              <img class="profile-img" :src="imageSource" />
            </div>            
          </div>
        </div>
          <div class="right-side">
            <div class="info-details">
              <div class="info-row">
                <span class="info-value">{{ firstName }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ lastName }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ email }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ phoneNumber }}</span>
              </div>
              <div class="smooth-line-right"></div>
              <div class="info-header">
              <span class="info-fullname">{{ companyName }}</span>
              <br>
              <a :href="webPage" target="_blank" class="info-email">{{ webPage }}</a>             
            </div>            
            </div>
          </div>
        </div>
        <div class="button-container">
          <simple-button primary class="accept-button" type="button" @click="acceptRequest">Register recruiter</simple-button>
          <simple-button secondary class="reject-button" type="button" @click="rejectRequest">Reject request</simple-button>
        </div>
    </div>
    <div style="overflow-y:hidden" v-else>
      <div class="card-header">
        <div class="header-content">
          <h2 class="tab-title">Requests for recruiter</h2>
        </div>
      </div>
      <div class="card-container">
        <div class="card" v-for="item in requests" :key="item.id" @click="handleCardClick(item)">
          <span class="card-info">
            <span class="name">{{ item.firstName }} {{ item.lastName }}</span>
            <span class="company">@ {{ item.companyName }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import SimpleButton from './SimpleButton.vue';
import { mapGetters, mapActions } from 'vuex';
import router from '@/router';

export default {
  computed: {
    ...mapGetters(['token', 'role']),
    imageSource() {
      return this.imageData ? 'data:image/png;base64,' + this.imageData : require('@/assets/profile-default.png');
    },
  },
  components: {
    SimpleButton,
    NavBar,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      webPage: '',
      companyName: '',
      imageData: '',
      requests: [],
      viewMode: false,
      isSubmitting: false,
    };
  },
  methods: {
    ...mapActions(['logout']),
    acceptRequest() {
      if (!this.isSubmitting)
        this.resolveRequest(true);
    },
    rejectRequest() {
      if (!this.isSubmitting)
        this.resolveRequest(false);
    },
    // true = accepted, false = rejected
    async resolveRequest(value) {
      if (this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;
  if (value === true) {
    try {
      const response = await fetch('http://localhost:8080/api/users/recruiters/requests/resolve?email=' + this.email, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        this.fetchData();
      } else {
        console.error('Request resolution failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error resolving request:', error);
    }
  } else if (value === false) {
    try {
      const response = await fetch('http://localhost:8080/api/users/recruiters/requests/resolve?email=' + this.email, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        this.fetchData();
      } else {
        console.error('Request deletion failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  }
},
    async fetchData() {
      console.log(this.token);
      this.viewMode = false;
      this.isSubmitting = false;
      try {
        const response = await fetch('http://localhost:8080/api/users/recruiters/requests', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.requests = await response.json();
        console.log(this.requests);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async handleCardClick(item) {
      try {
        console.log(item.email);
        const response = await fetch('http://localhost:8080/api/users/recruiters/requests/view?email=' + item.email, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        const request = await response.json();
        this.firstName = request.firstName;
        this.lastName = request.lastName;
        this.email = request.email;
        this.phoneNumber = request.phoneNumber;
        this.companyName = request.company.name;
        this.webPage = request.company.webPage;
        this.imageData = request.company.imageData;

        this.viewMode = true;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
  },

  async mounted() {
    console.log(this.role);
    if (this.role !== 'ADMIN') {
      router.push('/login');
    } else {
      this.fetchData();
    }
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 90%;
  max-height: 80%;
  background-color: white;
  margin: 2% auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
  padding-bottom: 50px;
}

.card-container {
  overflow-y: auto;
  max-height: calc(100vh - 230px);
}

.card {
  border: 1px solid purple;
  background-color: rgba(128, 0, 128, 0.07);
  border-radius: 5px;
  margin: 10px;
  overflow-y: auto;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.card-info {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-info .name {
  font-weight: bold;
}

.card-info .company {
  font-style: italic;
  margin-left: 10px;
}

.card-header {
  display: flex;
  margin-bottom: 10px;
  max-height: 100px;
}

.tab-title {
  padding: 20px;
}

.info-row {
  display: flex;
  max-height: 50px;
  align-items: center;
  margin-bottom: 3px;
  overflow-y:hidden;
}

.personal-info-container {
  display: flex;
  overflow-y: hidden;
  max-height: 540px;
}

.left-side {
  flex: 5;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y:hidden;
}

.info-details {
  margin-top: 20px;
  overflow-y: hidden;
}

.smooth-line-right {
  margin-top:30px;
  background-image: url('@/assets/chesser-right.jpg');
  height:2px;
}

.smooth-line-left {
  margin-top:30px;
  background-image: url('@/assets/chesser-left.jpg');
  height:2px;
}

.right-side {
  flex: 5;
  padding-right: 20px;
  padding-bottom: 20px;
  padding-top:20px;
  overflow-y: hidden;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
}

.image-container {
  padding-left: 250px;
  margin-top: 10px;
  max-height: 200px;
  position: relative;
  overflow-y: hidden;
  display: inline-block;
}

.profile-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #000; 
}

.info-fullname {
  font-size: 46px;
}

.info-email {
  font-size: 28px;
  font-style: italic;
}

.info-header {
  max-height: 200px;
  position: relative;
  overflow-y: hidden;
  display: inline-block;
}

.accept-button {
  max-height:50px;
  margin-left: 50px;
  margin-right:50px;
}
.reject-button {
  max-height:50px;
  margin-right:50px;
}

.button-container {
  display: flex;
  max-height: 50px;
}
</style>
