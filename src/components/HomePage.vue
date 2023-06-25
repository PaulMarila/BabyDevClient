<script>
  import NavBar from './NavBar.vue';
  import SimpleButton from './SimpleButton.vue';
  import { mapGetters } from 'vuex';
  import router from '@/router';
  
  export default {
    computed: {
      ...mapGetters(['isLoggedIn', 'token', 'role']),
      getImageSource() {
        return (photo) => {
          return photo ? 'data:image/png;base64,' + photo : require('@/assets/profile-default.png');
        };
      },
    },
    components: {
      NavBar,
      SimpleButton,
    },
    data() {
      return {
        jobs: [],
        hideSave: false,
      };
    },
    methods: {
      async fetchJobs(path) {
        try {
          const response = await fetch(path, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.jobs = await response.json();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
      getJobType(jobType) {
        switch(jobType) {
          case "Part_time":
            return "Part time";
          case "Full_time":
            return "Full time";
          default:
            return "Internship";
        }
      },
      async handleFavorite(job) {
        try {
          const response = await fetch('http://localhost:8080/api/jobs/favorite?jobId=' + job.id + '&isFavorite=true', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          if (response.status === 200) {
            job.favorite = !job.favorite;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },
      getDetailsPage(id) {
        router.push({ path: `/jobs/${id}` });
      },
      executeMountedLogic() {
        const searchTerm = this.$route.query.search;
        const postedByRecruiter = this.$route.query.posted;
        const displaySavedJobs = this.$route.query.saved;
        const displayAppliedJobs = this.$route.query.applied;
        if (searchTerm) {
          this.fetchJobs('http://localhost:8080/api/jobs/search?keyword=' + searchTerm);
        } else if (this.role === 'RECRUITER' && postedByRecruiter) {
          this.fetchJobs('http://localhost:8080/api/jobs/rall');
        } else if (this.role === 'STANDARD' && displaySavedJobs) {
          this.fetchJobs('http://localhost:8080/api/jobs/favorites');
        } else if (this.role === 'STANDARD' && displayAppliedJobs) {
          this.hideSave = true;
          this.fetchJobs('http://localhost:8080/api/jobs/applied');
        } else {
          this.fetchJobs('http://localhost:8080/api/jobs/all');
        }
      },
    },
    async mounted() {
      this.executeMountedLogic();
    },
  };
</script>

<template>
    <div>
      <NavBar />
    <div v-for="job in jobs" :key="job.id" class="job-card">
      <div class="left-side">
        <img class="company-image" :src="getImageSource(job.image)">
      </div>
      <div class="right-side">
        <div style="margin-top:30px; height:40px;" class="line">
          <div style="margin-top:10px;" class="posted-date">{{ job.postedDate }}</div>
          <div class="favourite-icon">
            <img v-if="job.favorite && role==='STANDARD' && !hideSave" style="height:30px; cursor:pointer" @click.prevent="handleFavorite(job)" src="@/assets/heart-filled.png" /> 
            <img v-else-if="role==='STANDARD' && !hideSave" style="height:30px; cursor:pointer" @click.prevent="handleFavorite(job)" src="@/assets/heart-empty.png" /> 
          </div>
        </div>
        <div style="height:40px" class="line">
          <div class="title">{{ job.title }}</div>
        </div>
        <div class="line">
          <div style="font-style: italic;" class="name">@ {{ job.name }}</div>
        </div>
        <div class="line">
          <div class="location">{{ job.location }}</div>
        </div>
        <div class="delimiter">
          <hr class="smooth-line-left">
          <hr class="smooth-line-right">
        </div>
        <div style="height:50px; margin-top:12px; justify-content: center;" class="line">
          <div style="margin-top:14px" class="type">{{ getJobType(job.type) }}</div>
          <div style="margin-top:14px" class="experience">{{ job.experienceRequired }}</div>
          <simple-button primary class="see-more-btn" @click="getDetailsPage(job.id)">See more</simple-button>
      </div>
    </div>
    </div>
  </div>
</template>
  
<style scoped>

.job-card {
  display: flex;
  max-height: 300px;
  background-color: white;
  margin: 2% auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
  margin-right:100px;
  margin-left: 100px;
}

.left-side {
  flex: 2;
  margin-right: 10px;
  overflow: hidden;
}

.right-side {
  flex: 8;
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
  width: 100%;
  overflow: hidden;
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