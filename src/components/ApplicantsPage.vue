<template>
    <NavBar/>
    <div class="profile-container">
    <div @click="viewProfile(applicant.id)" v-for="applicant in applicants" :key="applicant.id" class="job-card">
      <div class="left-side">
        <img class="company-image" :src="getImgSource(applicant.image)">
      </div>
      <div class="right-side">
        <div style="height:40px" class="line">
          <div class="title">{{ applicant.firstName }} {{ applicant.lastName }}</div>
        </div>
        <div class="line">
          <div style="font-style: italic;" class="name">@ {{ applicant.email }}</div>
        </div>
        <div class="line">
          <div class="location">{{ applicant.location }}</div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import NavBar from './NavBar.vue';
  import { mapGetters, mapActions } from 'vuex';
  import router from '@/router';
  
  export default {
    computed: {
    ...mapGetters(['isLoggedIn', 'token', 'role']),
    getImgSource() {
        return (photo) => {
          return photo ? 'data:image/png;base64,' + photo : require('@/assets/profile-default.png');
        };
      },
    },
    components: {
      NavBar,
    },
    data() {
      return {
        id: '',
        applicants: [],
      };
    },
    methods: {
      ...mapActions(['logout']),
      async loadJobInformation() {
        try {
            const response = await fetch('http://localhost:8080/api/jobs/getApplicants?jobId=' + this.id, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
              },
            });
            this.applicants = await response.json();
            console.log(response.status);
            if (response.status !== 200) {
                router.push("/");
            }
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      },
      viewProfile(id) {
        router.push("/profile/" + id);
      }
    },
    
    
    async mounted() {
    this.id = this.$route.params.id;
    console.log(this.id);
    if (!this.isLoggedIn) {
        router.push('/login');
    } else if (this.role === 'STANDARD') {
        router.push('/')
    }
    this.loadJobInformation();
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
}
.job-card {
  display: flex;
  justify-content: left;
  max-height: 150px;
  border: 1px solid blueviolet;
  background-color: rgba(220, 220, 220, 0.356);
  margin: 2% auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
  margin-right: 100px;
  margin-left: 100px;
  cursor:pointer;
}

.left-side {
  margin-right: 10px;
  overflow: hidden;
}

.right-side div {
  margin-left:20px;
}

.line {
  display: flex;
  align-items: center;
  height:30px;
  margin-bottom: 5px;
  overflow-y: hidden;
}

.posted-date {
  flex: 1;
}

.favourite-icon {
  max-height:40px;
  margin-top:5px;
  margin-right:20px;
  overflow-y:hidden;
}

.title {
  font-weight: bold;
  font-size: 24px;
}

.type,
.experience {
  flex: 1;
}

.see-more-btn {
  margin-left: 10px;
  margin-right: 25px;
  width:300px;
}

.company-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  object-position: center;
}

.delimiter {
  display: flex;
  align-items: center;
  height: 10px;
  overflow-y: hidden;
}

.smooth-line-right {
  flex:1;
  margin-right: 25px;
  background-image: url('@/assets/chesser-right.jpg');
  height:2px;
}

.smooth-line-left {
  flex:1;
  margin-left: 20px;
  background-image: url('@/assets/chesser-left.jpg');
  height:2px;
}
</style>