<template>
    <NavBar />
    <div class="profile-container">
      <div class="left-side">
        <div class="job-details">
          <p style="font-size:24px; font-weight:bold;">{{ title }}</p>
          <p style="font-style:italic;">{{ location }}</p>
          <p>{{ experienceRequired }}</p>
          <p class="job-type">{{ type }}</p>
        </div>
        <div class="delimiter">
          <hr class="smooth-line-left">
          <hr class="smooth-line-right">
        </div>
        <div class="job-info-container">
          <div class="job-image">
            <img :src="getImgSource"/>
          </div>
          <div class="company-info">
            <div class="company-name">{{ companyName }}</div>
            <div class="company-website"><a :href="webPage" target="_blank">{{ webPage }}</a></div>
          </div>
        </div>
      </div>
      <div class="right-side">
        <div style="height:40px; display:flex; justify-content: right;">
          <img v-if="role==='RECRUITER'" style="height:30px; width:30px; margin-top:2px ;margin-right:10px; cursor:pointer" @click.prevent="displayApplicants" src="@/assets/applicants.png" />
          <img v-if="role==='RECRUITER'" style="height:30px; width:30px; cursor:pointer" @click.prevent="handleEditJob(job)" src="@/assets/edit-button.png" /> 
        </div>
        <div class="job-description" v-html="description"></div>
        <simple-button v-if="role!=='STANDARD'" style="cursor:default" :disabled="true">Not eligible</simple-button>
        <simple-button v-else-if="!hasApplied" primary class="apply-button" @click="applyToJob">Apply now</simple-button>
        <simple-button v-else :disabled="hasApplied" class="apply-button">Already applied</simple-button>
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
    ...mapGetters(['isLoggedIn', 'token', 'role']),
    getImgSource() {
        return this.imageData ? 'data:image/png;base64,' + this.imageData : require('@/assets/profile-default.png');
    },
    },
    components: {
      NavBar,
      SimpleButton,
    },
    data() {
      return {
        id: '',
        title: '',
        description: '',
        location: '',
        type: '',
        postedDate: '',
        experienceRequired: '',
        webPage: '',
        companyName: '',
        imageData: '',
        submitting: false,
        hasApplied: false,
      };
    },
    methods: {
      ...mapActions(['logout']),
      async loadJobInformation(id) {
        console.log(id);
        try {
            const response = await fetch('http://localhost:8080/api/jobs/jobDetails?id=' + id, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
              },
            });
            const jobInfo = await response.json();
            console.log(response.status);
            if (response.status === 200) {
                this.id = jobInfo.id;
                this.title = jobInfo.title;
                this.description = jobInfo.description;
                this.location = jobInfo.location;
                this.type = jobInfo.type;
                this.postedDate = jobInfo.postedDate;
                this.experienceRequired = jobInfo.experienceRequired;
                this.companyName = jobInfo.name;
                this.webPage = jobInfo.link;
                this.imageData = jobInfo.image;
                this.hasApplied = jobInfo.hasApplied;
            }
            console.log(jobInfo);
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      },
      async applyToJob(){
        if (this.submitting) { 
          return;
        }
        this.submitting = true;
        try {
            const response = await fetch('http://localhost:8080/api/jobs/apply?jobId=' + this.id, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
            });
            if (response.status === 200) {
                router.back();
            }
            this.submitting = false;
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      },
      goToPage(webPage) {
        window.open(webPage, "_blank");
      }, 
      handleEditJob() {
        const jobJsonData = JSON.stringify({
          id: this.id,
          title: this.title,
          description: this.description,
          type: this.type,
          experienceRequired: this.experienceRequired,
          location: this.location
        });
        const encodedSerializedJobData = encodeURIComponent(jobJsonData);
        router.push({
          path: '/jobs/manage',
          query: { edit: encodedSerializedJobData }
        });
      },
      displayApplicants() {
        router.push("/jobs/" + this.id + "/applicants");
      }
    },
    
    
    async mounted() {
        const id = this.$route.params.id;
        this.loadJobInformation(id);
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
    display: flex;
  }

  .left-side {
    flex: 4;
    background-color: #f2f2f2;
  }

  .job-info-container {
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 20px;
    overflow:hidden;
    height:30%;
  }

  .job-image {
    width: 200px;
    height: 200px;
  }

  .job-image img {
    width: 100%;
    height: 100%;
  }

  .company-info {
    display: flex;
    flex-direction: column;
  }

  .company-name {
    font-weight: bold;
    margin-bottom: 5px;
    font-size:18px;
    margin-left: 20px;
  }

  .company-website {
    margin-left: 20px;
  }

  .job-details {
    padding: 20px;
    height:40%;
  }

  .job-title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 10px;
  }

  .job-location,
  .job-experience,
  .job-type {
    margin-bottom: 5px;
  }

  .right-side {
    flex: 6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }

  .job-description {
    margin-bottom: 20px;
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